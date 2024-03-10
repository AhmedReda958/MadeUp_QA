import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import { notifyUser } from "#utils/webpush.mjs";

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: { name: "userNotifications" }
    },
    title: {
      type: String,
      required: [true, "MISSING_TITLE"],
    },
    content: {
      type: String,
      required: [true, "MISSING_CONTENT"],
    },
  },
);

notificationSchema.statics.forUser = function(userId, pagination) {
  return this.aggregate([
    { $match: { user: new ObjectId(userId) } },
    ...globalStages.pagination(pagination),
    { $project: { user: 0 } }
  ]);
}

notificationSchema.pre("save", async function (next) {
  notifyUser(this.user, {
    title: this.title,
    content: this.content
  });

  next();
});

export default models.Notification || model("Notification", notificationSchema);
