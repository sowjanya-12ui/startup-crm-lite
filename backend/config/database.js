import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use reliable DNS servers for MongoDB Atlas SRV lookup
dns.setServers(['8.8.8.8', '1.1.1.1']);

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