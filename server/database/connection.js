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
      await mongoose.connect(process.env.MONGODB_URI, { dbName: "anon_app" });
    } catch (error) {
      // TODO: log errors
      console.error("Failed to connected to the database.");
      console.error(error);
    }
  }
}
