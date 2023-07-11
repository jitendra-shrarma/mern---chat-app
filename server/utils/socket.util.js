const socketIO = require("socket.io");
const logger = require("./logger.util")("socketUtil");

const ORIGIN = "http://localhost:3000";

/**
 * Set up Socket.IO connections and event handlers.
 *
 * @param {Object} server - The server instance
 */
const setupSocketIO = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: ORIGIN,
    },
    pingTimeout: 60 * 1000,
  });

  io.on("connection", (socket) => {
    logger.info("Socket.io connected");

    // Handle the "setup" event.
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    // Handle the "join chat" event.
    socket.on("join chat", (room) => {
      socket.join(room);
      logger.info(`User joined room ${room}`);
    });

    // Handle the "typing" event.
    socket.on("typing", (room) => socket.in(room).emit("typing"));

    // Handle the "stop typing" event.
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // Handle the "new message" event.
    socket.on("new message", (newMessageReceived) => {
      const chat = newMessageReceived.chat[0];

      if (!chat.users) {
        logger.error("chat.users not defined");
        return;
      }

      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received", newMessageReceived);
      });
    });

    // Handle the "disconnect" event.
    socket.on("disconnect", () => {
      logger.info("Socket.io disconnected");
    });
  });
};

module.exports = { setupSocketIO };
