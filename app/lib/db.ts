import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      dbName: "ecommerce-admin",
      bufferCommands: true,
    });
    console.log("Connected to MongoDB!");
  } catch (err: any) {
    console.log("Error: ", err);
    throw new Error("Error: ", err);
  }
};

export default connectDB;