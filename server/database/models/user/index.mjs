import mongoose from "mongoose";
import schema from "./schema.mjs";
import "./middlewares.mjs";
/**
 * @type {mongoose.Model}
 */
export default mongoose.models.User || mongoose.model("User", schema);
