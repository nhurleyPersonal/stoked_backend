const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  tagline: { type: String, required: false },
  skillLevel: { type: String, required: false },
  homeSpot: { type: String, required: false },
  recentSpots: [{ type: Schema.Types.ObjectId, ref: "Spot" }],
  favoriteSpots: [{ type: Schema.Types.ObjectId, ref: "Spot" }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ username: "text", firstName: "text", lastName: "text" });

const User = mongoose.model("User", userSchema);

module.exports = User;
