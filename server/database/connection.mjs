import DatabaseError from "#errors/database.mjs";
const { MONGODB_URI, NODE_ENV } = process.env;
import mongoose from "mongoose";

export function isDBConnected() {
  return mongoose.connection.readyState == 1;
}

export function attemptDBConnection() {
  mongoose.set("strictQuery");
  if (isDBConnected()) return console.log("Already connected to the database.");
  mongoose
    .connect(MONGODB_URI, {
      dbName: NODE_ENV === "production" ? "MadeUp" : "anon_app",
    })
    .then(() => {
      console.error("Connected to the database!");
    })
    .catch((error) => {
      // TODO: log errors
      console.error(new DatabaseError("CONNECT", error));
    });
}
