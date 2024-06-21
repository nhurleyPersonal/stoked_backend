const mongoose = require("mongoose");
const { Schema } = mongoose;

const tideEntrySchema = new Schema({
  time: { type: String, required: true },
  value: { type: String, required: true },
});

const tideDataSchema = new Schema({
  date: { type: String, required: true }, // Changed from Date to String
  stationId: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  tideData: { type: [tideEntrySchema], required: true },
});

const TideData = mongoose.model("TideData", tideDataSchema, "tideDatas");
module.exports = TideData;
