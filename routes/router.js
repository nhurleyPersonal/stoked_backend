// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import the userController
const spotController = require("../controllers/spotController");
const boardController = require("../controllers/boardController");
const sessionController = require("../controllers/sessionController");
const surfDataController = require("../controllers/surfDataController");
const userFavoriteSpotsController = require("../controllers/userFavoriteSpotsController");

// User routes
router.post("/register", userController.register); // Register a new user
router.post("/login", userController.login); // Log in an existing user
router.get("/me", userController.getUser); // Get the current user's details
router.post("/searchUsers", userController.searchUsers); // Search for users

// Spot routes
router.post("/addSpot", spotController.addSpot); // Add a new spot
router.post("/getFavoriteSpots", spotController.getUserFavoriteSpots); // Get a user's favorite spots
router.post("/getRecentSpots", spotController.getUserRecentSpots); // Get a user's recent spots
router.post("/searchSpots", spotController.searchSpots); // Search for spots
router.get("/getRandomSpot", spotController.getRandomSpot); // Get a random spot
router.post("/getAllSpots", spotController.getAllSpots); // Get all spots

// Board routes
router.post("/addBoard", boardController.addBoard); // Add a new board
router.post("/getBoards", boardController.getBoardsByUser); // Get a user's boards
router.get("/getRandomBoard", boardController.getRandomBoard); // Get a random board

// Session routes
router.post("/addSession", sessionController.addSessionToDB); // Add a new session
router.post("/getSessionsbyUser", sessionController.getSessionsByUser); // Get a user's sessions
router.post("/getSessionsBySpot", sessionController.getSessionsBySpot); // Get a spot's sessions

// Surf Data routes
router.post("/getForecastRange", surfDataController.searchForecastsRange); // Get surf data for a session
router.post("/searchTidesByDay", surfDataController.searchTidesByDay); // Get tide data for a day

// Favorite Spots routes
router.post("/addFavoriteSpot", userFavoriteSpotsController.addFavoriteSpot); // Add a favorite spot
router.post("/getFavoriteSpots", userFavoriteSpotsController.getFavoriteSpots); // Retrieve favorite spots using POST
router.post(
  "/removeFavoriteSpot",
  userFavoriteSpotsController.removeFavoriteSpot
); // Remove a favorite spot

module.exports = router;
