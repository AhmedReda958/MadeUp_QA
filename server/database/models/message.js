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

let stages = {};

stages.hideSenderIfAnonymous = {
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
function parseProjection({ include, allowOnly, allow = [] }) {
  let allowedFields = allowOnly ? allowOnly : [ ...defaultAllow, ...allow ];
  return Object.fromEntries(
    [ '_id',
      ...arrayOfStrings(include)
        .filter((field) => allowedFields.includes(field))
    ].map((field) => [field, 1])
  );
}

let inMessageUsers = Object.keys(messageSchema.paths).filter(path => messageSchema.paths[path].options.ref == "User");
function addDetailUsersStage(pipeline, users) {
  users = arrayOfStrings(users).filter((user) => inMessageUsers.includes(user));
  if (detailUsers.length == 0) return users;

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
    let inMessageUser = users.at(0);
    lookup.localField = inMessageUser;
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

  pipeline.push([{ $lookup: lookup }, { $set: set }]);
  return users;
}


messageSchema.statics.userInbox = (userId, projectOptions) => {
  let pipeline = [
    {
      $match: {
        receiver: new ObjectId(userId),
        "reply.content": null
      }
    },
    stages.hideSenderIfAnonymous
  ];

  let project = parseProjection(projectOptions);
  addDetailUsersStage(pipeline, projectOptions.detailUser).forEach(user => project[user] = 1);
  pipeline.push({ $project: project });
  
  return this.aggregate(pipeline);
}

messageSchema.statics.sentByUser = (userId, projectOptions) => {
  let pipeline = [
    { $match: { sender: new ObjectId(userId) } }
  ];

  let project = parseProjection(projectOptions);
  addDetailUsersStage(pipeline, projectOptions.detailUser).forEach(user => project[user] = 1);
  pipeline.push({ $project: project });

  if ("reply.content" in project)
    pipeline.push({ $fill: { output: { "reply.content": { value: null } } } });

  return this.aggregate(pipeline);
}

messageSchema.statics.answeredByUser = (userId, publicOnly, projectOptions) => {
  let pipeline = [
    {
      $match: Object.assign(
        { receiver: new ObjectId(userId), "reply.content": { $ne: null } },
        publicOnly ? { "reply.private": false } : {}
      )
    }
  ];

  let project = parseProjection(projectOptions);
  addDetailUsersStage(pipeline, projectOptions.detailUser).forEach(user => project[user] = 1);
  pipeline.push({ $project: project });

  return this.aggregate(pipeline);
}

messageSchema.statics.fetch = async (messageId, requester, projectOptions) => {
  requester = isValidObjectId(requester)
  ? new ObjectId(requester) : `${requester}`;
  
  let pipeline = [
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
    stages.hideSenderIfAnonymous
  ];

  let project = parseProjection(projectOptions);
  addDetailUsersStage(pipeline, projectOptions.detailUser).forEach(user => project[user] = 1);
  pipeline.push({ $project: project });

  let message = (await this.aggregate(pipeline)).at(0);
  if (!message) throw new CommonError("FETCH_MESSAGE", { code: "MESSAGE_NOT_FOUND" }, 404);
  return message;
}

export default models.Message || model("Message", messageSchema);
