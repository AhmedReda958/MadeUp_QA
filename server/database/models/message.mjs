import mongoose, { isValidObjectId } from "mongoose";
const {
  Schema,
  model,
  models,
  Types: { ObjectId },
} = mongoose;
import globalStages from "#database/stages.mjs";

const messageSchema = new Schema({
  content: {
    type: String,
    required: [true, "MISSING_CONTENT"],
  },
  anonymous: {
    type: Boolean,
    default: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: { name: "sent" },
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: { name: "inbox" },
  },
  reply: {
    private: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
    timestamp: {
      type: Date,
    },
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

let userBriefProject = {
  _id: 1,
  username: 1,
  fullName: 1,
  // TODO: add those later on
  // "hasStory", "verified", "online"
};

let messageStages = {};

messageStages.hideSenderIfAnonymous = {
  $set: {
    sender: {
      $cond: {
        if: { $eq: ["$anonymous", false] },
        then: "$sender",
        else: null,
      },
    },
  },
};

function arrayOfStrings(input) {
  return Array.isArray(input) ? input : typeof input == "string" ? [input] : [];
}

let defaultAllow = [
  "content",
  "sender",
  "receiver",
  "reply.content",
  "reply.timestamp",
  "timestamp",
];
function parseIncludesIntoProject(includes, allow = [], only, force) {
  let allowedFields = only ? allow : [...defaultAllow, ...allow];
  let project = Object.fromEntries(
    [
      "_id",
      ...arrayOfStrings(includes).filter((field) =>
        allowedFields.includes(field)
      ),
    ].map((field) => [field, 1])
  );
  force.forEach((field) => (project[field] = 1));
  return project;
}

let internalUsers = Object.keys(messageSchema.paths).filter(
  (path) => messageSchema.paths[path].options.ref == "User"
);
function parseInternalUsers(users) {
  return arrayOfStrings(users).filter((user) => internalUsers.includes(user));
}

messageStages.internalUsers = (users) => {
  let lookup = { from: "users", as: "_users", pipeline: [] };
  if (users.length > 1) {
    lookup.let = { users: users.map((user) => `$${user}`) };
    lookup.pipeline.push({
      $match: {
        $expr: {
          $in: ["$_id", "$$users"],
        },
      },
    });
  } else {
    lookup.localField = users.at(0);
    lookup.foreignField = "_id";
  }
  lookup.pipeline.push({ $project: userBriefProject });

  let set = {};
  users.forEach((user) => {
    set[user] = {
      $ifNull: [
        {
          $first: {
            $filter: {
              input: "$_users",
              as: "user",
              cond: {
                $eq: ["$$user._id", `$${user}`],
              },
              limit: 1,
            },
          },
        },
        `$${user}`,
      ],
    };
  });
  set._users = "$$REMOVE";

  return [{ $lookup: lookup }, { $set: set }];
};

messageSchema.statics.userInbox = function (
  userId,
  pagination,
  { users, includes, allow, only }
) {
  users = parseInternalUsers(users);
  return this.aggregate([
    {
      $match: {
        receiver: new ObjectId(userId),
        "reply.content": null,
      },
    },
    ...globalStages.pagination(pagination),
    messageStages.hideSenderIfAnonymous,
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) },
  ]);
};

messageSchema.statics.sentByUser = function (
  userId,
  pagination,
  { users, includes, allow, only }
) {
  users = parseInternalUsers(users);
  let project = parseIncludesIntoProject(includes, allow, only, users);

  let pipeline = [
    { $match: { sender: new ObjectId(userId) } },
    ...globalStages.pagination(pagination),
    ...messageStages.internalUsers(users),
    { $project: project },
  ];

  if ("reply.content" in project)
    pipeline.push({ $fill: { output: { "reply.content": { value: null } } } });

  return this.aggregate(pipeline);
};

messageSchema.statics.answeredByUser = function (
  userId,
  pagination,
  publicOnly,
  { users, includes, allow, only }
) {
  users = parseInternalUsers(users);
  return this.aggregate([
    {
      $match: Object.assign(
        { receiver: new ObjectId(userId), "reply.content": { $ne: null } },
        publicOnly ? { "reply.private": false } : {}
      ),
    },
    ...globalStages.pagination(pagination),
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) },
  ]);
};

messageSchema.statics.fetch = function (
  messageId,
  requester,
  { users, includes, allow, only }
) {
  requester = isValidObjectId(requester)
    ? new ObjectId(requester)
    : `${requester}`;
  return this.aggregate([
    {
      $match: {
        _id: new ObjectId(messageId),
        $or: [
          { sender: { $eq: requester } },
          { receiver: { $eq: requester } },
          { "reply.private": { $eq: false }, "reply.content": { $ne: null } },
        ],
      },
    },
    messageStages.hideSenderIfAnonymous,
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) },
  ])
    .exec()
    .then((docs) => docs.at(0));
};

messageSchema.statics.likes = function (
  messageId,
  { usersId, usersBrief, page, limit }
) {
  let pipeline = [
    { $match: { _id: new ObjectId(messageId) } },
    {
      $project: Object.assign(
        {
          _id: 0,
          total: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
        },
        usersId || usersBrief
          ? {
              likes: {
                $slice: [
                  "$likes",
                  page > 1 ? limit * (page - 1) - 1 : 0,
                  limit,
                ],
              },
            }
          : null
      ),
    },
  ];
  if (usersBrief)
    pipeline.push(
      {
        $lookup: {
          from: "users",
          as: "users",
          let: { users: { $ifNull: ["$likes", []] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$users"],
                },
              },
            },
            { $project: userBriefProject },
          ],
        },
      },
      {
        $set: {
          users: {
            $ifNull: [
              {
                $map: {
                  input: "$likes",
                  as: "userId",
                  in: {
                    $ifNull: [
                      {
                        $first: {
                          $filter: {
                            input: "$users",
                            as: "user",
                            cond: {
                              $eq: ["$$user._id", "$$userId"],
                            },
                            limit: 1,
                          },
                        },
                      },
                      { _id: "$$userId" },
                    ],
                  },
                },
              },
              [],
            ],
          },
          likes: "$$REMOVE",
        },
      }
    );
  return this.aggregate(pipeline)
    .exec()
    .then((docs) => docs.at(0));
};

messageSchema.statics.setLikeBy = function (messageId, userId, status) {
  return this.updateOne(
    { _id: messageId },
    { [status ? "$addToSet" : "$pull"]: { likes: userId } }
  )
    .exec()
    .then((update) => {
      return {
        found: update.matchedCount > 0,
        updated: update.modifiedCount > 0,
      };
    });
};

messageSchema.statics.isLikedBy = function (messageId, userId) {
  return this.aggregate([
    { $match: { _id: new ObjectId(messageId) } },
    {
      $project: {
        _id: 0,
        liked: {
          $in: [new ObjectId(userId), { $ifNull: ["$likes", []] }],
        },
      },
    },
  ])
    .exec()
    .then((docs) => docs.at(0)?.liked);
};

messageSchema.statics.likedBy = function (
  userId,
  pagination,
  { users, includes, allow, only }
) {
  users = parseInternalUsers(users);
  return this.aggregate([
    { $match: { likes: new ObjectId(userId) } },
    ...globalStages.pagination(pagination),
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) },
  ]).exec();
};

// basic feed
messageSchema.statics.userFeed = function (
  userId,
  pagination,
  { users, includes, allow, only }
) {
  users = parseInternalUsers(users);
  return this.aggregate([
    {
      $match: {
        "reply.private": false,
        $and: [
          { "reply.content": { $exists: true } },
          { $expr: { $ne: [{ $type: "$reply.content" }, "object"] } },
        ],
      },
    },
    {
      $sample: { size: 10 },
    },
    ...globalStages.pagination(pagination),
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) },
  ]);
};

export default models.Message || model("Message", messageSchema);
