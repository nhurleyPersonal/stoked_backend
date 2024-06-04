// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import the userController
const spotController = require("../controllers/spotController");
const boardController = require("../controllers/boardController");
const sessionController = require("../controllers/sessionController");

router.post("/register", userController.register); // Use the register function from the userController
router.post("/login", userController.login); // Use the login function from the userController
router.get("/me", userController.getUser);
router.post("/addSpot", spotController.addSpot); // Use the createSpot function from the userController
router.post("/getFavoriteSpots", spotController.getUserFavoriteSpots);
router.post("/getRecentSpots", spotController.getUserRecentSpots);
router.post("/searchSpots", spotController.searchSpots);
router.post("/addBoard", boardController.addBoard);
router.post("/getBoards", boardController.getBoardsByUser);
router.post("/addSession", sessionController.addSessionToDB);
router.get("/getRandomBoard", boardController.getRandomBoard);
router.get("/getRandomSpot", spotController.getRandomSpot);
router.post("/getSessionsbyUser", sessionController.getSessionsByUser);
router.post("/getAllSpots", spotController.getAllSpots);
router.post("/searchUsers", userController.searchUsers);

module.exports = router;
