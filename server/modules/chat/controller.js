const { Chat, User } = require("../../models");
const logger = require("../../utils/logger.util")("chatController");

/**
 * Create or fetch a one-to-one chat.
 * If the chat with the provided user ID exists, fetches the existing chat.
 * Otherwise, creates a new chat with the user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchUserChat = async (req, res) => {
  const { userId } = req.body;

  // If 'userId' is not present in the request
  if (!userId) {
    const errorMessage = "UserId param not sent with request";
    logger.error(errorMessage);

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errorMessage,
    });
  }

  try {
    let chatExists = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    chatExists = await User.populate(chatExists, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (chatExists.length > 0) {
      logger.info("Existing chat found");
      return res.status(200).send(chatExists[0]);
    } else {
      const newChatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(newChatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      logger.info("New chat created");
      return res.status(200).json(FullChat);
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: error.message,
    });
  }
};

/**
 * Fetch all chats for a user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchUserChats = async (req, res) => {
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .exec();

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    return res.status(200).send(results);
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: error.message,
    });
  }
};

/**
 * Create a new group chat.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    const errorMessage = "Please fill all the fields";
    logger.error(errorMessage);

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errorMessage,
    });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    const errorMessage = "More than 2 users are required to form a group chat";
    logger.error(errorMessage);

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errorMessage,
    });
  }

  if (!users.includes(req.user._id.toString())) {
    users.push(req.user);
  }

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    logger.info("New group chat created");
    return res.status(200).json(fullGroupChat);
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: error.message,
    });
  }
};

/**
 * Rename a group chat.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;

  const isAdmin = await Chat.findOne({ groupAdmin: req.user._id }).exec();
  if (!isAdmin) {
    const errorMessage = "You are not authorized";
    logger.error(errorMessage);

    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: errorMessage,
    });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      const errorMessage = "Chat not found";
      logger.error(errorMessage);

      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: errorMessage,
      });
    } else {
      logger.info("Group chat renamed");
      return res.status(200).json(updatedChat);
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: error.message,
    });
  }
};

/**
 * Add a user to a group chat or leave a group chat.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addToGroupChat = async (req, res) => {
  const { chatId, userId } = req.body;

  const isAdmin = await Chat.findOne({ groupAdmin: req.user._id }).exec();
  if (!isAdmin) {
    const errorMessage = "You are not authorized";
    logger.error(errorMessage);

    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: errorMessage,
    });
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    const errorMessage = "Chat not found";
    logger.error(errorMessage);

    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: errorMessage,
    });
  } else {
    logger.info("User added to group chat");
    return res.status(200).json(added);
  }
};

/**
 * Remove a user from a group chat.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeFromGroupChat = async (req, res) => {
  const { chatId, userId } = req.body;

  const isAdmin = await Chat.findOne({ groupAdmin: req.user._id }).exec();
  if (!isAdmin) {
    const errorMessage = "You are not authorized";
    logger.error(errorMessage);

    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: errorMessage,
    });
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    const errorMessage = "Chat not found";
    logger.error(errorMessage);

    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: errorMessage,
    });
  } else {
    logger.info("User removed from group chat");
    return res.status(200).json(removed);
  }
};

module.exports = {
  fetchUserChat,
  fetchUserChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
};
