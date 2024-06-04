const Spot = require("../models/spotModel");
const User = require("../models/userModel");
// const { faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
const secretKey = "supersecretkey"; // Replace with your actual secret key

const addSpot = async (req, res) => {
  const { name, lat, lon, buoyId, buoy_x, buoy_y, depth, slope } = req.body;

  if ((!name, !lat, !lon, !buoyId, !depth, !slope, !buoy_x, !buoy_y)) {
    return res
      .status(400)
      .json({ error: "name lat lon buoyId dept slope are required" });
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
  console.log(req.body);
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

    console.log(response);

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

// const generateTestSpots = async () => {
//   const spots = Array.from({ length: 10 }, () => ({
//     name: faker.address.streetName(),
//     location: `${faker.address.latitude()}, ${faker.address.longitude()}`,
//     userSubmitted: null,
//     defaultSpot: true,
//   }));

//   try {
//     await Spot.insertMany(spots);
//     console.log("Test spots generated successfully");
//   } catch (err) {
//     console.error("Error generating test spots:", err);
//   }
// };

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
  console.log("HEREEEE");
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract the token from the Authorization header
    const decoded = jwt.verify(token, secretKey); // Verify the token

    const spots = await Spot.find();

    let response = {
      status: "ok",
      message: "Spots loaded successfully",
      spots: spots,
    };
    console.log(response);

    // Respond with a success message
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
