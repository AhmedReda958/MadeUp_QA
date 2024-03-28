import { userBriefProject } from "#database/models/user/filters.mjs";
/**
 * @param {any} usersRecord
 * @param {import("mongoose").PipelineStage} setStage
 * @returns {import("mongoose").PipelineStage[]}
 */
export default function briefUsersStages(usersRecord, setStage = {}) {
  return [
    {
      $lookup: {
        from: "users",
        as: "_users",
        let: { users: usersRecord },
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
      $set: Object.assign(setStage, { _users: "$$REMOVE" }),
    },
  ];
}

/**
 * @param {string[]} usersPaths 
 */
export function briefUsersReplacingSetStage(usersPaths) {
  return Object.fromEntries([
    ...usersPaths.map((user) => [
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
  ]);
}
