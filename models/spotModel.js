const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userModel");

const spotSchema = new Schema({
  name: { type: String, required: true, unique: false },
  location: { type: String, required: false, unique: false },
  sID: { type: String, required: false, unique: false },
  userSubmitted: { type: Schema.Types.ObjectId, ref: User, required: false },
  defaultSpot: { type: Boolean, required: true },
});

const Spot = mongoose.model("Spot", spotSchema);

module.exports = Spot;
