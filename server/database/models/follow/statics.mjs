import mongoose from "mongoose";
const {
  Types: { ObjectId },
} = mongoose;
import schema from "./schema.mjs";
import paginationStages from "#database/stages/pagination.mjs";
import briefUsersStages, {
  briefUsersReplacingSetStage,
} from "#database/stages/brief-users.mjs";

const usersPaths = Object.keys(schema.paths).filter(
  (path) => schema.paths[path].options.ref == "User"
);

const briefFollowUsers = briefUsersStages(
  usersPaths.map((user) => `$${user}`),
  briefUsersReplacingSetStage(usersPaths)
);

schema.statics.followSince = function ({ follower, following }) {
  return new Promise((resolve, reject) => {
    this.findOne({ follower, following }, { _id: 0, timestamp: 1 })
      .then((follow) => {
        if (!follow) return resolve(false);
        resolve(follow.timestamp);
      })
      .catch(reject);
  });
};

schema.statics.following = function ({ userId, pagination, briefUsers }) {
  return this.aggregate([
    { $match: { follower: new ObjectId(userId) } },
    ...paginationStages(pagination),
    ...(briefUsers ? briefFollowUsers : []),
    { $project: { _id: 0, following: 1, timestamp: 1 } },
  ]);
};

schema.statics.followers = function ({ userId, pagination, briefUsers }) {
  return this.aggregate([
    { $match: { following: new ObjectId(userId) } },
    ...paginationStages(pagination),
    ...(briefUsers ? briefFollowUsers : []),
    { $project: { _id: 0, follower: 1, timestamp: 1 } },
  ]);
};
