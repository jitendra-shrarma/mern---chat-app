require("dotenv").config();
const express = require("express");

const {
  authRoutes,
  userRoutes,
  chatRoutes,
  messageRoutes,
} = require("./modules/routes");
const { notFound, errorHandler } = require("./middleware");
const { connectToMongoDB, setupSocketIO } = require("./utils");
const logger = require("./utils/logger.util")("app");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectToMongoDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.get("/", (req, res) => {
  res.send("API is running");
});

// Middleware for handling invalid routes and error
app.use(notFound);
app.use(errorHandler);

// Start the server
const server = app.listen(process.env.PORT, () =>
  logger.info(`Server started on PORT ${process.env.PORT}`)
);

// Set up Socket.io
setupSocketIO(server);
