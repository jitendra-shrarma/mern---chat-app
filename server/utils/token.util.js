const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token with the provided user ID and email.
 *
 * @param {string} id - User ID
 * @param {string} email - User email
 * @returns {string} - Generated JWT token
 */
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = { generateToken };
