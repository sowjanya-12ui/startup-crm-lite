/**
 * server.js — Startup CRM Lite Express Entry Point
 *
 * Security measures applied (in middleware order):
 *  1. Environment validation  — fail fast on missing config
 *  2. Helmet                  — secure HTTP headers
 *  3. Morgan                  — request logging (format depends on NODE_ENV)
 *  4. Rate limiting           — general + auth-specific throttles
 *  5. CORS                    — allowlist-based origin checking
 *  6. MongoDB sanitization    — strips $ / . from user input
 *  7. Body parsing            — size-limited JSON + URL-encoded
 *  8. Routes                  — auth, leads, health
 *  9. Global error handler    — always last
 * 10. Graceful shutdown       — SIGTERM + SIGINT handlers
 */

import express    from 'express';
import dotenv     from 'dotenv';
import cors       from 'cors';
import helmet     from 'helmet';
import morgan     from 'morgan';
import rateLimit  from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import { connectDB }    from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes       from './routes/authRoutes.js';
import leadRoutes       from './routes/leadRoutes.js';

// ─────────────────────────────────────────────────────────────────────────────
// 0. Load environment variables FIRST — everything below depends on them
// ─────────────────────────────────────────────────────────────────────────────
dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// 1. Environment validation — fail fast before touching the network
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates that all required environment variables are set.
 * Logs the missing variables and terminates the process with exit code 1
 * if any are absent, preventing the server from starting with broken config.
 *
 * @param {string[]} required - Array of env-var names that must be present
 */
const checkRequiredEnvVars = (required) => {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌  FATAL: Missing required environment variables:');
    missing.forEach((key) => console.error(`     • ${key}`));
    console.error('   Add them to your .env file and restart the server.');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }
};

checkRequiredEnvVars(['MONGODB_URI', 'JWT_SECRET', 'PORT']);

// ─────────────────────────────────────────────────────────────────────────────
// App & constants
// ─────────────────────────────────────────────────────────────────────────────

const app      = express();
const PORT     = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─────────────────────────────────────────────────────────────────────────────
// 2. Helmet — sets secure HTTP response headers (XSS, clickjacking, MIME, etc.)
// ─────────────────────────────────────────────────────────────────────────────
app.use(helmet());

// ─────────────────────────────────────────────────────────────────────────────
// 3. Morgan — HTTP request logging
//    • Production : 'combined' format — Apache-style, ideal for log aggregators
//    • Development: 'dev' format      — concise, colorised, human-friendly
// ─────────────────────────────────────────────────────────────────────────────
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORS — allowlist-based origin policy for production safety
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Origins that are permitted to make cross-origin requests.
 * In production, FRONTEND_URL must be set in the environment.
 * Undefined / empty values are filtered out to avoid accidental open access.
 */
const allowedOrigins = [
  ...new Set([
    process.env.FRONTEND_URL,         // Configured per deployment (Vercel, Render, etc.)
    'https://your-app.vercel.app',    // Hardcoded production fallback — update before go-live
    ...(NODE_ENV === 'development'
      ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'] // Vite / CRA dev servers
      : []
    ),
  ]),
].filter(Boolean); // Strip undefined / empty strings

app.use(
  cors({
    /**
     * Dynamic origin checker.
     * - Allows requests with no Origin header (curl, Postman, server-to-server).
     * - Allows origins that appear in the allowlist.
     * - Rejects everything else with an explicit CORS error.
     *
     * @param {string|undefined} origin   - Request Origin header value
     * @param {Function}         callback - (err, allow) — pass null to allow
     */
    origin: (origin, callback) => {
      // In development, allow any localhost port
      if (NODE_ENV === 'development' && origin && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true, // Required for cookies / Authorization headers
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. Rate Limiting — protects against brute-force and DoS attacks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * General limiter — applied to all /api/* routes.
 * Allows a reasonable burst of legitimate traffic while blocking abusers.
 *
 * Window : 15 minutes
 * Max    : 100 requests per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return RateLimit-* headers (RFC 6585)
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * Auth limiter — stricter, applied only to /api/auth/* routes.
 * Slows down credential-stuffing and brute-force login attacks significantly.
 *
 * Window : 15 minutes
 * Max    : 10 requests per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts from this IP, please try again after 15 minutes.',
  },
});

// Apply general limiter to all API routes first …
app.use('/api/', generalLimiter);

// … then apply the stricter auth limiter on top for /api/auth
// (both limiters run for auth routes; the auth limiter's lower ceiling wins)
app.use('/api/auth/', authLimiter);

// ─────────────────────────────────────────────────────────────────────────────
// 6. MongoDB Injection Sanitization
//    express-mongo-sanitize strips keys that start with '$' or contain '.'
//    from req.body, req.query, and req.params — preventing NoSQL injection.
// ─────────────────────────────────────────────────────────────────────────────
app.use(
  mongoSanitize({
    replaceWith: '_', // Replace prohibited characters with '_' instead of deleting
    onSanitizeError: (req, res) => {
      // Log sanitization events in production for audit trails
      if (NODE_ENV === 'production') {
        console.warn(`[SECURITY] MongoSanitize triggered — IP: ${req.ip} URL: ${req.originalUrl}`);
      }
    },
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// 7. Body parsing — size-limited to reduce payload-based attack surface
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─────────────────────────────────────────────────────────────────────────────
// 8. Routes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Health check — used by load balancers and uptime monitors.
 * Not rate-limited so monitors never get blocked.
 * Returns basic runtime info (safe to expose publicly).
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status:      'OK',
    environment: NODE_ENV,
    timestamp:   new Date().toISOString(),
  });
});

app.use('/api/auth',  authRoutes);
app.use('/api/leads', leadRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// 9. Global error handler — MUST be registered after all routes
// ─────────────────────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// 10. Graceful shutdown helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cleanly tears down the HTTP server and the MongoDB connection, then exits.
 *
 * @param {http.Server} server - The active HTTP server instance
 * @param {string}      signal - OS signal that triggered the shutdown
 */
const gracefulShutdown = (server, signal) => {
  console.log(`\n[${signal}] Server shutting down gracefully…`);

  // Stop accepting new connections; finish in-flight requests first
  server.close(async () => {
    try {
      // Import mongoose lazily to avoid circular-dep issues at module level
      const { default: mongoose } = await import('mongoose');
      await mongoose.connection.close(false);
      console.log('✔  MongoDB connection closed.');
    } catch (err) {
      console.error('✘  Error closing MongoDB connection:', err.message);
    } finally {
      console.log('✔  Shutdown complete. Goodbye.');
      process.exit(0);
    }
  });

  // Hard-kill safety net: if shutdown takes > 10 s something is stuck
  setTimeout(() => {
    console.error('✘  Graceful shutdown timed out — forcing exit.');
    process.exit(1);
  }, 10_000);
};

// ─────────────────────────────────────────────────────────────────────────────
// Startup
// ─────────────────────────────────────────────────────────────────────────────

const startServer = async () => {
  // Connect to MongoDB before binding the port
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀  Server running on port ${PORT}`);
    console.log(`🌍  Environment  : ${NODE_ENV}`);
    console.log(`🔒  CORS origins : ${allowedOrigins.join(', ') || '(none)'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

  // ── Graceful shutdown signal handlers ─────────────────────────────────────
  // SIGTERM — sent by container orchestrators (Docker, Kubernetes, Heroku, Render)
  process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));

  // SIGINT  — sent when the developer presses Ctrl+C in the terminal
  process.on('SIGINT',  () => gracefulShutdown(server, 'SIGINT'));

  // Catch uncaught exceptions so the process doesn't vanish silently
  process.on('uncaughtException', (err) => {
    console.error('❌  Uncaught Exception:', err);
    gracefulShutdown(server, 'uncaughtException');
  });

  // Catch unhandled promise rejections (e.g. a missing await)
  process.on('unhandledRejection', (reason) => {
    console.error('❌  Unhandled Rejection:', reason);
    gracefulShutdown(server, 'unhandledRejection');
  });
};

startServer();
