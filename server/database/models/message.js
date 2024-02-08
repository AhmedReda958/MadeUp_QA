import { Schema, model, models } from "mongoose";

export default models.Message || model("Message", new Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  }
}));
