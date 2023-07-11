const express = require("express");
const controller = require("./controller");
const { protect } = require("../../middleware");

const router = express.Router();
const groupRouter = express.Router();

// Routes for fetching user chat(s)
router.get("/", protect, controller.fetchUserChats); // Fetch all chats for a user
router.post("/", protect, controller.fetchUserChat); // Create or fetch one-to-one chat

// Routes for group chat operations
groupRouter.post("/", protect, controller.createGroupChat); // Create group chat
groupRouter.put("/rename", protect, controller.renameGroupChat); // Rename group chat
groupRouter.put("/add", protect, controller.addToGroupChat); // Add user to group chat
groupRouter.put("/remove", protect, controller.removeFromGroupChat); // Remove user from group chat

router.use("/group", groupRouter);

module.exports = router;
