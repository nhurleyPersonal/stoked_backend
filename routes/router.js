// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import the userController
const spotController = require("../controllers/spotController");

router.post("/register", userController.register); // Use the register function from the userController
router.post("/login", userController.login); // Use the login function from the userController
router.post("/createUserSpot", spotController.addSpot); // Use the createSpot function from the userController
router.post("/getFavoriteSpots", spotController.getUserFavoriteSpots);
router.post("/getRecentSpots", spotController.getUserRecentSpots);

module.exports = router;
