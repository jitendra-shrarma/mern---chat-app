const jwt = require("jsonwebtoken");
const { User } = require("../models");
const logger = require("../utils/logger.util")("authMiddleware");

/**
 * Middleware to protect routes by verifying JWT token in the 'Authorization' header.
 * If the token is valid, it decodes the token, finds the corresponding user, and adds it to the request object.
 * If the token is invalid or missing, it returns a 401 Unauthorized response.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next function to call in the middleware chain
 * @returns {Object} - JSON response indicating success or failure with an appropriate message
 */
const protect = async (req, res, next) => {
  let token;

  // Check if 'authorization' header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token by splitting the header value
      token = req.headers.authorization.split(" ")[1]; // Splits "Bearer <TOKEN>"

      // Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user with the decoded id and exclude the password
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move on to the next middleware or route handler
    } catch (error) {
      // Token verification failed
      logger.error({ error }, "Authorization token verification failed");

      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Not authorized, invalid token",
      });
    }
  }

  // If token is not present
  if (!token) {
    logger.warn("Authorization token missing");

    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Not authorized, invalid token",
    });
  }
};

module.exports = protect;
