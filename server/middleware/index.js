const protect = require("./authMiddleware");
const { notFound, errorHandler } = require("./errorMiddleware");

module.exports = { notFound, errorHandler, protect };
