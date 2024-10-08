const mongoose = require("mongoose");
const { Schema } = mongoose;
const Spot = require("./spotModel");

const surfDataSchema = new Schema({
  spotId: { type: Schema.Types.ObjectId, ref: Spot, required: true },
  date: { type: Number, required: true },
  swellHeight: { type: Number, required: true },
  swellPeriod: { type: Number, required: true },
  swellDirection: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  windDirection: { type: Number, required: true },
  tide: { type: String, required: true },
});

const SurfData = mongoose.model("SurfData", surfDataSchema, "surfDatas");
module.exports = SurfData;
