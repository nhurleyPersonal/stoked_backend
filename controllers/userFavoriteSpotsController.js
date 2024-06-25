const UserFavoriteSpots = require("../models/userFavoriteSpotsModel");

const addFavoriteSpot = async (req, res) => {
  const { userId, spotId } = req.body;

  try {
    let favorite = await UserFavoriteSpots.findOne({ userId });
    if (!favorite) {
      favorite = new UserFavoriteSpots({ userId, spotIds: [] });
    }
    if (!favorite.spotIds.includes(spotId)) {
      favorite.spotIds.push(spotId);
      await favorite.save();
    }
    res
      .status(200)
      .json({ message: "Favorite spot added successfully", favorite });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const getFavoriteSpots = async (req, res) => {
  const { userId } = req.body;

  try {
    const favorite = await UserFavoriteSpots.findOne({ userId }).populate(
      "spotIds"
    ); // Changed from "spot" to "spotIds" to match the field name in the schema
    if (!favorite) {
      return res.status(404).json({ error: "No favorite spots found" });
    }
    console.log("Favorite spots:", favorite);
    res.status(200).json({ favoriteSpots: favorite.spotIds });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const removeFavoriteSpot = async (req, res) => {
  console.log("Request:", req.body);
  const { userId, spotId } = req.body;

  try {
    const favorite = await UserFavoriteSpots.findOne({ userId });
    if (!favorite) {
      return res
        .status(404)
        .json({ error: "No favorite spots found for this user." });
    }

    const index = favorite.spotIds.indexOf(spotId);
    if (index > -1) {
      favorite.spotIds.splice(index, 1);
      await favorite.save();
      console.log("Favorite spots:", favorite);
      res
        .status(200)
        .json({ message: "Favorite spot removed successfully", favorite });
    } else {
      res.status(404).json({ error: "Spot not found in favorites." });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  addFavoriteSpot,
  getFavoriteSpots,
  removeFavoriteSpot,
};
