const express = require("express");
const controller = require("./controller");
const { protect } = require("../../middleware");

const router = express.Router();

// Routes for chat operations
router.route("/").post(protect, controller.sendMessage);
router.route("/:chatId").get(protect, controller.allMessages);

module.exports = router;