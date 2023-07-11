const bunyan = require('bunyan');

/**
 * Create and configure a Bunyan logger instance.
 *
 * @param {string} fileName - The name of the logger, typically representing the file/module name.
 * @returns {object} - The configured logger instance.
 */
const logger = (fileName) => {
  const logger = bunyan.createLogger({
    name: fileName,
    env: process.env.NODE_ENV,
    serializers: bunyan.stdSerializers,
    src: true
  });

  return logger;
};

module.exports = logger;
