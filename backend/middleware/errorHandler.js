import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express error handling middleware
 * Must have exactly 4 parameters to be recognized as an error handler by Express.
 * 
 * @param {Object} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Server error';
  let errors = null;

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = {};
    // Extract field-by-field error messages
    Object.values(err.errors).forEach((item) => {
      errors[item.path] = item.message;
    });
  } 
  // Handle Mongoose CastError (e.g., invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  } 
  // Handle MongoDB duplicate key error (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    if (field === 'email') {
      message = 'Email already exists';
    } else {
      message = `Duplicate field value entered: ${field}`;
    }
  } 
  // Handle JWT token errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token failed or expired';
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    errors = errors || {};
    errors.stack = err.stack;
    // Provide actual error message for generic 500s during dev
    if (statusCode === 500) {
      message = err.message || 'Server error';
    }
  }

  // Send the standardized error response
  return errorResponse(res, message, statusCode, errors);
};
