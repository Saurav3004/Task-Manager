import mongoose from "mongoose";

export const connectDB = async () => {
  let retries = 5;

  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.log("MongoDB connection failed, retrying...");
      retries--;

      await new Promise(res => setTimeout(res, 5000));
    }
  }

  console.error("Could not connect to MongoDB after retries");
  process.exit(1);
};