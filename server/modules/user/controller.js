const { User } = require("../../models");
const logger = require("../../utils/logger.util")("userController");

/**
 * Get or search all users.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const searchUsers = async (req, res) => {
  try {
    // Keyword contains search results
    const keyword = req.query.key
      ? {
          $or: [
            { name: { $regex: req.query.key, $options: "i" } },
            { email: { $regex: req.query.key, $options: "i" } },
          ],
        }
      : {};

    // Find and return users except the current user
    const userExists = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .exec();

    return res.status(200).json(userExists);
  } catch (error) {
    logger.error(error.message);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server Error",
    });
  }
};

module.exports = { searchUsers };
