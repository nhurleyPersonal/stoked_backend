const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userModel");
const Spot = require("./spotModel");

const userFavoriteSpotsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User, required: true },
  spotIds: [{ type: Schema.Types.ObjectId, ref: Spot, required: true }],
});

const UserFavoriteSpots = mongoose.model(
  "UserFavoriteSpots",
  userFavoriteSpotsSchema
);

module.exports = UserFavoriteSpots;
