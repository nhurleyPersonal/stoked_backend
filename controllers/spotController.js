const Spot = require("../models/spotModel");
const User = require("../models/userModel");
const { faker } = require("@faker-js/faker");

const addSpot = async (req, res) => {
  const { name, location, userSubmitted } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  try {
    // Check if a spot with the same name (case-insensitive) and userSubmitted already exists
    const existingSpot = await Spot.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      userSubmitted: userSubmitted,
    });
    if (existingSpot) {
      return res.status(400).json({
        error: "User has already saved this spot",
      });
    }

    const newSpot = new Spot({
      name,
      location,
      userSubmitted,
      defaultSpot: false,
    });

    const savedSpot = await newSpot.save();

    // Add the new spot to the favoriteSpots field of the User document
    const user = await User.findById(userSubmitted);
    user.recentSpots.push(savedSpot._id);
    await user.save();

    res
      .status(200)
      .json({ message: "Spot added successfully", spot: savedSpot });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const getUserFavoriteSpots = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId).populate("favoriteSpots");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ favoriteSpots: user.favoriteSpots });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const getUserRecentSpots = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId).populate("recentSpots");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ recentSpots: user.recentSpots });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const searchSpots = async (req, res) => {
  const { searchTerm, userID } = req.body;

  try {
    const spots = await Spot.find({
      $and: [
        { $or: [{ defaultSpot: true }, { userSubmitted: userID }] },
        { name: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.status(200).json({ spots });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const generateTestSpots = async () => {
  const spots = Array.from({ length: 10 }, () => ({
    name: faker.address.streetName(),
    location: `${faker.address.latitude()}, ${faker.address.longitude()}`,
    userSubmitted: null,
    defaultSpot: true,
  }));

  try {
    await Spot.insertMany(spots);
    console.log("Test spots generated successfully");
  } catch (err) {
    console.error("Error generating test spots:", err);
  }
};

module.exports = {
  addSpot,
  getUserFavoriteSpots,
  getUserRecentSpots,
  searchSpots,
  generateTestSpots,
};
