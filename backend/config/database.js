import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
