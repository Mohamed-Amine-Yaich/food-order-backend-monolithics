import mongoose from "mongoose";
import { MONGO_LOCAL_URL, MONGO_REMOTE_URL } from "../config";

export const DBConnnection = async () => {
  try {
    mongoose.connect(MONGO_LOCAL_URL);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
