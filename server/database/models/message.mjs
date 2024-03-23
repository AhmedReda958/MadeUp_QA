import mongoose, { isValidObjectId } from "mongoose";
const {
  Schema,
  model,
  models,
  Types: { ObjectId },
} = mongoose;
import globalStages from "#database/stages.mjs";
import events from "#tools/events.mjs";

const messageSchema = new Schema({
  content: {
    type: String,
    required: [true, "MISSING_CONTENT"],
  },
  anonymous: {
    type: Boolean,
    default: true,
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
  seen: {
    type: Boolean,
    default: false,
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
  pinned: {
    type: Boolean,
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

let messageProject = {
  _id: 1,
  content: 1,
  sender: 1,
  receiver: 1,
  pinned: 1,
  reply: 1,
  timestamp: 1,
};

let userBriefProject = {
  _id: 1,
  username: 1,
  fullName: 1,
  profilePicture: 1,
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

let internalUsers = Object.keys(messageSchema.paths).filter(
  (path) => messageSchema.paths[path].options.ref == "User"
);

messageStages.briefUsers = [
  {
    $lookup: {
      from: "users",
      as: "_users",
      let: { users: internalUsers.map((user) => `$${user}`) },
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
    $set: Object.fromEntries([
      ...internalUsers.map((user) => [
        user,
        {
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
        },
      ]),
      ["_users", "$$REMOVE"],
    ]),
  },
];

messageSchema.index({ timestamp: -1 }, { name: "questions" });
messageSchema.statics.userInbox = function (userId, pagination, briefUsers) {
  return this.aggregate([
    {
      $match: {
        receiver: new ObjectId(userId),
        "reply.content": null,
      },
    },
    { $sort: { timestamp: -1 } },
    ...globalStages.pagination(pagination),
    messageStages.hideSenderIfAnonymous,
    ...(briefUsers ? messageStages.briefUsers : []),
    { $project: messageProject },
  ]);
};

messageSchema.statics.sentByUser = function (userId, pagination, briefUsers) {
  let pipeline = [
    { $match: { sender: new ObjectId(userId) } },
    { $sort: { timestamp: -1 } },
    ...globalStages.pagination(pagination),
    ...(briefUsers ? messageStages.briefUsers : []),
    { $project: messageProject },
  ];

  if ("reply.content" in project)
    pipeline.push({ $fill: { output: { "reply.content": { value: null } } } });

  return this.aggregate(pipeline);
};

messageSchema.index({ "reply.timestamp": -1 }, { name: "answers" });
messageSchema.statics.answeredByUser = function (
  userId,
  pagination,
  briefUsers,
  publicly,
  pinned
) {
  let match = {
    receiver: new ObjectId(userId),
    "reply.content": { $ne: null },
  };
  if (typeof publicly == "boolean") match["reply.private"] = !publicly;
  if (typeof pinned == "boolean") match.pinned = pinned ? true : { $ne: true };
  return this.aggregate([
    {
      $match: match,
    },
    { $sort: { "reply.timestamp": -1 } },
    ...globalStages.pagination(pagination),
    messageStages.hideSenderIfAnonymous,
    ...(briefUsers ? messageStages.briefUsers : []),
    { $project: messageProject },
  ]);
};

messageSchema.statics.fetch = function (messageId, requester, briefUsers) {
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
    ...(briefUsers ? messageStages.briefUsers : []),
    { $project: messageProject },
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

messageSchema.statics.likedBy = function (userId, pagination, briefUsers) {
  return this.aggregate([
    { $match: { likes: new ObjectId(userId) } },
    ...globalStages.pagination(pagination),
    ...(briefUsers ? messageStages.briefUsers : []),
    { $project: messageProject },
  ]).exec();
};

// basic feed
messageSchema.statics.userFeed = function (userId, pagination, briefUsers) {
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
    { $sort: { timestamp: -1 } },
    ...globalStages.pagination(pagination),
    messageStages.hideSenderIfAnonymous,
    ...(briefUsers ? messageStages.briefUsers : []),
    { $project: messageProject },
  ]);
};

messageSchema.pre("save", function (next) {
  events.emit("MessageSent", {
    content: this.content,
    anonymous: this.anonymous,
    sender: this.sender,
    receiver: this.receiver,
  });

  next();
});

export default models.Message || model("Message", messageSchema);
