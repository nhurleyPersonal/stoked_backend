// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import the userController

router.post("/register", userController.register); // Use the register function from the userController

module.exports = router;
