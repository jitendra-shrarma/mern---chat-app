const { User } = require("../../models");
const {
  generateToken,
  generatePassword,
  comparePassword,
} = require("../../utils");
const logger = require("../../utils/logger.util")("authController");

/**
 * Register a new user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signUpUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Check if any of the required fields is undefined
  if (!name || !email || !password) {
    const errorMessage = "Please enter all the required fields";
    logger.error(errorMessage);

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errorMessage,
    });
  }

  try {
    // Check if user already exists in the database
    const userExists = await User.findOne({ email }).exec();

    if (userExists) {
      const errorMessage = "User already exists";
      logger.error(errorMessage);

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: errorMessage,
      });
    }

    // Register and store the new user
    const userCreated = await User.create(
      pic === undefined || pic.length === 0
        ? {
            name,
            email,
            password: await generatePassword(password),
          }
        : {
            name,
            email,
            password: await generatePassword(password),
            pic,
          }
    );

    if (userCreated) {
      logger.info("User created successfully");

      return res.status(201).json({
        success: true,
        statusCode: 201,
        _id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
        pic: userCreated.pic,
        token: generateToken(userCreated._id, userCreated.email),
        message: "User created successfully",
      });
    } else {
      const errorMessage = "Failed to create the user";
      logger.error(errorMessage);

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: errorMessage,
      });
    }
  } catch (error) {
    logger.error("Error creating user:", error.message);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server Error",
    });
  }
};

/**
 * Authenticate the user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signInUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if any of the required fields is undefined
  if (!email || !password) {
    const errorMessage = "Please enter all the required fields";
    logger.error(errorMessage);

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errorMessage,
    });
  }

  try {
    // Check if user exists in the database
    const userExists = await User.findOne({ email }).exec();

    // If user exists and password is verified
    if (userExists && (await comparePassword(password, userExists.password))) {
      logger.info("User authenticated successfully");

      return res.status(200).json({
        success: true,
        statusCode: 200,
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        pic: userExists.pic,
        token: generateToken(userExists._id, userExists.email),
        message: "Authenticated successfully",
      });
    } else {
      const errorMessage = "Invalid email or password";
      logger.error(errorMessage);

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: errorMessage,
      });
    }
  } catch (error) {
    logger.error("Error authenticating user:", error.message);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server Error",
    });
  }
};

module.exports = { signUpUser, signInUser };
