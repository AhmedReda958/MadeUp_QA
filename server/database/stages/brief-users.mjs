import userBriefProject from "#database/models/user/brief-project.mjs";
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
