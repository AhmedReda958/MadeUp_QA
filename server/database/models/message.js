import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  anonymous: {
    type: Boolean,
    required: true,
    default: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reply: {
    done: {
      type: Boolean,
      required: true,
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

export default models.Message || model("Message", messageSchema);
