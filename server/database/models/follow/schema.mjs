import mongoose from "mongoose";

/**
 * @type {mongoose.SchemaDefinition}
 */
const definition = {
  follower: {
    type: mongoose.Types.ObjectId,
    required: [true, "MISSING_FOLLOWER"],
    ref: "User",
  },
  following: {
    type: mongoose.Types.ObjectId,
    required: [true, "MISSING_FOLLOWING"],
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
};

const schema = new mongoose.Schema(definition);

schema.index({ follower: 1, following: 1 }, { name: "follow", unique: true });

export default schema;
