import mongoose from "mongoose";

export const connectTestDB = async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI);
};

export const closeTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (err) {
    console.log("Test DB close error:", err.message);
  }
};