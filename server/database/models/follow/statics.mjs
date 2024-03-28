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

schema.statics.following = function ({ userId, pagination, briefUsers }) {
  return this.aggregate([
    { $match: { follower: new Types.ObjectId(userId) } },
    ...paginationStages(pagination),
    ...(briefUsers ? briefFollowUsers : []),
    { $project: { follower: 0 } },
  ]);
};

schema.statics.followers = function ({ userId, pagination, briefUsers }) {
  return this.aggregate([
    { $match: { following: new Types.ObjectId(userId) } },
    ...paginationStages(pagination),
    ...(briefUsers ? briefFollowUsers : []),
    { $project: { following: 0 } },
  ]);
};
