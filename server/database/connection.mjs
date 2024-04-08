import DatabaseError from "##/errors/database.mjs";
const { MONGODB_URI, MONGODB_DBNAME } = process.env;
import mongoose from "mongoose";

export function isDBConnected() {
  return mongoose.connection.readyState == 1;
}

export function attemptDBConnection() {
  mongoose.set("strictQuery");
  if (isDBConnected()) return console.log("Already connected to the database.");
  mongoose
    .connect(MONGODB_URI, { dbName: MONGODB_DBNAME })
    .then(() => {
      console.error("Connected to the database!");
    })
    .catch((error) => {
      // TODO: log errors
      console.error(new DatabaseError("CONNECT", error));
    });
}
