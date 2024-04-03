// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import the userController
const spotController = require("../controllers/spotController");
const boardController = require("../controllers/boardController");

router.post("/register", userController.register); // Use the register function from the userController
router.post("/login", userController.login); // Use the login function from the userController
router.get("/me", userController.getUser);
router.post("/createUserSpot", spotController.addSpot); // Use the createSpot function from the userController
router.post("/getFavoriteSpots", spotController.getUserFavoriteSpots);
router.post("/getRecentSpots", spotController.getUserRecentSpots);
router.post("/searchSpots", spotController.searchSpots);
router.post("/addBoard", boardController.addBoard);
router.post("/getBoards", boardController.getBoardsByUser);

module.exports = router;
