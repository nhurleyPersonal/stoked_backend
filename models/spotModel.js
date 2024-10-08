const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userModel");

const spotSchema = new Schema({
  name: { type: String, required: true, unique: false },
  buoyId: { type: String, required: false },
  buoy_x: { type: String, required: false },
  buoy_y: { type: String, required: false },
  lat: { type: String, required: false },
  lon: { type: String, required: false },
  depth: { type: String, required: false },
  slope: { type: String, required: false },
  model: { type: String, required: false },
});

const Spot = mongoose.model("Spot", spotSchema);

module.exports = Spot;
