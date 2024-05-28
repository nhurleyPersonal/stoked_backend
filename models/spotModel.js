const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userModel");

const spotSchema = new Schema({
  name: { type: String, required: true, unique: false },
});

const Spot = mongoose.model("Spot", spotSchema);

module.exports = Spot;
