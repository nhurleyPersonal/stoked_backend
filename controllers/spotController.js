const Spot = require("../models/spotModel");
const User = require("../models/userModel");

const addSpot = async (req, res) => {
  const { name, lat, lon, buoyId, buoy_x, buoy_y, depth, slope, model } =
    req.body;

  if (
    !name ||
    !lat ||
    !lon ||
    !buoyId ||
    !depth ||
    !slope ||
    !buoy_x ||
    !buoy_y ||
    !model
  ) {
    return res
      .status(400)
      .json({
        error:
          "name, lat, lon, buoyId, depth, slope, buoy_x, buoy_y, and model are required",
      });
  }

  try {
    const newSpot = new Spot({
      name,
      lat,
      lon,
      buoyId,
      buoy_x,
      buoy_y,
      depth,
      slope,
      model,
    });

    const savedSpot = await newSpot.save();

    res
      .status(200)
      .json({ message: "Spot added successfully", spot: savedSpot });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const getUserFavoriteSpots = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("favoriteSpots");
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
  try {
    const user = await User.findById(req.userId).populate("recentSpots");
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
  const { searchTerm } = req.body;

  try {
    const spots = await Spot.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    let response = {
      status: "ok",
      message: "Spots loaded successfully",
      spots: spots,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch spots",
      error: err,
    });
  }
};

const getRandomSpot = async (req, res) => {
  try {
    const count = await Spot.countDocuments();
    const random = Math.floor(Math.random() * count);
    const spot = await Spot.findOne().skip(random);

    res.status(200).json(spot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSpots = async (req, res) => {
  try {
    const spots = await Spot.find();

    let response = {
      status: "ok",
      message: "Spots loaded successfully",
      spots: spots,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch spots",
      error: err,
    });
  }
};

module.exports = {
  addSpot,
  getUserFavoriteSpots,
  getUserRecentSpots,
  searchSpots,
  getRandomSpot,
  getAllSpots,
};
