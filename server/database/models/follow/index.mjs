import mongoose from "mongoose";
import schema from "./schema.mjs";
import "./statics.mjs";
export default mongoose.models.Follow || mongoose.model("Follow", schema);
