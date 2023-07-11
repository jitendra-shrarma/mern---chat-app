const logger = require("../utils/logger.util")("errorMiddleware");

/**
 * Middleware to handle 404 Not Found errors.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next function to call in the middleware chain
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware to handle errors and send an appropriate response.
 *
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next function to call in the middleware chain
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorResponse = { message };

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  logger.error({ error: err }, `Error: ${message}`);

  res.status(statusCode).json(errorResponse);
};

module.exports = { notFound, errorHandler };
