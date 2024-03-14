import mongoose from "mongoose";
const { Schema, model, models, Types } = mongoose;
import globalStages from "#database/stages.mjs";
import { notifyUser } from "#utils/webpush.mjs";

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
    ...globalStages.pagination(pagination),
    { $project: { user: 0 } },
  ]);
};

notificationSchema.pre("save", async function (next) {
  notifyUser(this.user._id.toString(), {
    title: this.title,
    content: this.content,
    url: this.url || "/",
  });

  next();
});

export default models.Notification || model("Notification", notificationSchema);
