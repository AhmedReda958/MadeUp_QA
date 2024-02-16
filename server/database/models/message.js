import { CommonError } from "#middlewares/errors-handler.js";
import mongoose, { isValidObjectId } from "mongoose";
const { Schema, model, models, Types: { ObjectId } } = mongoose;

const messageSchema = new Schema({
  content: {
    type: String,
    required: [true, "MISSING_CONTENT"],
  },
  anonymous: {
    type: Boolean,
    default: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: { name: "sent" }
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: { name: "inbox" }
  },
  reply: {
    private: {
      type: Boolean,
      default: false
    },
    content: {
      type: String
    },
    timestamp: {
      type: Date
    },
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

let messageStages = {};

messageStages.hideSenderIfAnonymous = {
  $set: {
    sender: {
      $cond: {
        if: { $eq: ["$anonymous", false] },
        then: "$sender",
        else: null
      },
    },
  }
}

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
function parseIncludesIntoProject(includes, allow, only, force) {
  let allowedFields = only ? allow : [ ...defaultAllow, ...allow ];
  let project = Object.fromEntries(
    [ '_id',
      ...arrayOfStrings(includes)
        .filter((field) => allowedFields.includes(field))
    ].map((field) => [field, 1])
  );
  force.forEach(field => project[field] = 1);
  return project;
}

let internalUsers = Object.keys(messageSchema.paths).filter(path => messageSchema.paths[path].options.ref == "User");
function parseInternalUsers(users) {
  return arrayOfStrings(users).filter((user) => internalUsers.includes(user));
}

messageStages.internalUsers = users => {
  let lookup = { from: "users", as: "_users", pipeline: [] };
  if (users.length > 1) {
    lookup.let = { users: users.map(user => `$${user}`) };
    lookup.pipeline.push({
      $match: {
        $expr: {
          $in: ["$_id", "$$users"]
        }
      }
    });
  } else {
    lookup.localField = users.at(0);
    lookup.foreignField = "_id";
  }
  lookup.pipeline.push({ $project: {
    _id: 1, username: 1, fullName: 1
    // TODO: add those later on
    // "hasStory", "verified", "online"
  }});

  let set = {}
  users.forEach(user => {
    set[user] = {
      $ifNull: [
        {
          $first: {
            $filter: {
              input: "$_users",
              as: "user",
              cond: {
                $eq: ["$$user._id", `$${user}`]
              },
              limit: 1
            }
          }
        },
        `$${user}`
      ]
    }
  });
  set._users = "$$REMOVE";

  return [{ $lookup: lookup }, { $set: set }];
}

messageSchema.statics.userInbox = (userId, { users, includes, allow, only }) => {
  users = parseInternalUsers(users);
  return this.aggregate([
    {
      $match: {
        receiver: new ObjectId(userId),
        "reply.content": null
      }
    },
    messageStages.hideSenderIfAnonymous,
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) }
  ]);
}

messageSchema.statics.sentByUser = (userId, { users, includes, allow, only }) => {
  users = parseInternalUsers(users);
  let project = parseIncludesIntoProject(includes, allow, only, users);

  let pipeline = [
    { $match: { sender: new ObjectId(userId) } },
    ...messageStages.internalUsers(users),
    { $project: project }
  ];

  if ("reply.content" in project)
    pipeline.push({ $fill: { output: { "reply.content": { value: null } } } });

  return this.aggregate(pipeline);
}

messageSchema.statics.answeredByUser = (userId, publicOnly, { users, includes, allow, only }) => {
  users = parseInternalUsers(users);
  return this.aggregate([
    {
      $match: Object.assign(
        { receiver: new ObjectId(userId), "reply.content": { $ne: null } },
        publicOnly ? { "reply.private": false } : {}
      )
    },
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) }
  ]);
}

messageSchema.statics.fetch = async (messageId, requester, { users, includes, allow, only }) => {
  requester = isValidObjectId(requester)
  ? new ObjectId(requester) : `${requester}`;
  
  let message = (await this.aggregate([
    {
      $match: {
        _id: new ObjectId(messageId),
        $or: [
          { sender: { $eq: requester } },
          { receiver: { $eq: requester } },
          { "reply.private": { $eq: false }, "reply.content": { $ne: null } }
        ]
      }
    },
    messageStages.hideSenderIfAnonymous,
    ...messageStages.internalUsers(users),
    { $project: parseIncludesIntoProject(includes, allow, only, users) }
  ])).at(0);

  if (!message) throw new CommonError("FETCH_MESSAGE", { code: "MESSAGE_NOT_FOUND" }, 404);
  return message;
}

export default models.Message || model("Message", messageSchema);
