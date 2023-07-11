const { Message, Chat } = require("../../models");
const logger = require("../../utils/logger.util")("messageController");

/**
 * Create a new message.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    logger.error("Invalid data passed into request");

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Invalid data passed into request",
    });
  }

  try {
    // Create a new message
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    // Populate the sender and chat details for the message
    message = await Message.findById(message._id)
      .populate("sender", "name pic")
      .populate({
        path: "chat",
        select: "chatName isGroupChat users",
        model: "Chat",
        populate: {
          path: "users",
          select: "name email pic",
          model: "User",
        },
      })
      .exec();

    // Update the latest message for the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    logger.info("New message created");
    return res.status(201).json(message);
  } catch (error) {
    logger.error("Failed to create new message");

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Failed to create new message",
    });
  }
};

/**
 * Fetch all messages for a chat.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    return res.status(200).json(messages);
  } catch (error) {
    logger.error("Failed to fetch all messages");

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Failed to fetch all messages",
    });
  }
};

module.exports = { sendMessage, allMessages };
