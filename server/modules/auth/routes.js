const express = require("express");
const controller = require("./controller");

const router = express.Router();

// Route for user registration & login
router.post("/signup", controller.signUpUser);
router.post("/signin", controller.signInUser);

module.exports = router;
