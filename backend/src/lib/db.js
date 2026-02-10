import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export const connectDB = async (retries = MAX_RETRIES) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    if (retries <= 1) {
      console.error("MongoDB connection failed after retries. Server will keep running; API may fail until DB is available.");
      return;
    }
    console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries - 1} left)`);
    setTimeout(() => connectDB(retries - 1), RETRY_DELAY_MS);
  }
};