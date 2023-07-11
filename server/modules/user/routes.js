const express = require("express");
const { searchUsers } = require("./controller");
const { protect } = require("../../middleware");

const router = express.Router();

// Route for searching users (protected route)
router.get("/search", protect, searchUsers);

module.exports = router;
