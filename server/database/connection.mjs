import DatabaseError from "#errors/database.mjs";
const { MONGODB_URI } = process.env;
import mongoose from "mongoose";

export function isDBConnected() {
  return mongoose.connection.readyState == 1;
}

export async function attemptDBConnection() {
  mongoose.set("strictQuery");
  if (isDBConnected()) {
    console.log("Already connected to the database.");
  } else {
    try {
      console.error("Connected to the database!");
      await mongoose.connect(MONGODB_URI, { dbName: "anon_app" });
    } catch (error) {
      // TODO: log errors
      console.error(new DatabaseError("CONNECT", error));
    }
  }
}
