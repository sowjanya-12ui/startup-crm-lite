import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// -----------------------------
// Middleware Configuration
// -----------------------------

// Security middleware to set various HTTP headers
app.use(helmet());

// Logging middleware for development
app.use(morgan('dev'));

// Enable CORS with specific origin and credentials support
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Body parsing middlewares with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// Routes
// -----------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// TODO: Replace this inline placeholder router with actual import once the lead routes exist
// import leadRoutes from './routes/leadRoutes.js';
const leadRoutes = express.Router();

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// -----------------------------
// Global Error Handler
// -----------------------------

// MUST be registered LAST, after all routes and other middlewares
app.use(errorHandler);

// -----------------------------
// Database & Server Initialization
// -----------------------------

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();
  
  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();
