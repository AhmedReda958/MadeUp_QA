import mongoose from "mongoose";
const { Schema, model, models, Types } = mongoose;
import paginationStages from "#database/stages/pagination.mjs";

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: { name: "userNotifications" },
  },
  title: {
    type: String,
    required: [true, "MISSING_TITLE"],
  },
  content: {
    type: String,
    required: [true, "MISSING_CONTENT"],
  },
  url: {
    type: String,
    required: [true, "MISSING_URL"],
  },
  seen: {
    type: Boolean,
    default: true,
  },
});

notificationSchema.statics.forUser = function (userId, pagination) {
  return this.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },
    ...paginationStages(pagination),
    { $project: { user: 0 } },
  ]);
};

export default models.Notification || model("Notification", notificationSchema);
