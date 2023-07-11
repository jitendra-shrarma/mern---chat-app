const mongoose = require("mongoose");
const logger = require("./logger.util")("dbUtil");

/**
 * Connects to the MongoDB database.
 * @throws {Error} If failed to connect to the database.
 */
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

module.exports = { connectToMongoDB };
