import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  //Mongoose will throw an error if you try to query on fields that are not defined in the schema
  mongoose.set("strictQuery");

  if (isConnected) {
    console.log("Database Is already connected!");
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "anon_app",
      });

      isConnected = true;
      console.log("Database is connected!");
    } catch (error) {
      console.log(error);
      throw new Error("Database is not Connected! ");
    }
  }
};

export default connectToDB;
