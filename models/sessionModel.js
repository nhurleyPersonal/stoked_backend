const mongoose = require("mongoose");
const { Schema } = mongoose;
const Spot = require("./spotModel");
const Board = require("./boardModel");
const SurfData = require("./surfDataModel");
const User = require("./userModel");

const sessionSchema = new Schema({
  spot: { type: Schema.Types.ObjectId, ref: Spot },
  sessionDatetime: { type: Date, required: true },
  sessionLength: { type: Number, required: true },
  board: { type: Schema.Types.ObjectId, ref: Board, required: false },
  surfData: [{ type: Schema.Types.ObjectId, ref: SurfData, required: false }],
  wordOne: { type: String, required: true },
  wordTwo: { type: String, required: true },
  wordThree: { type: String, required: true },
  overallScore: { type: Number, required: true },
  waveCount: { type: Number, required: false },
  goodWaveCount: { type: Number, required: false },
  crowd: { type: String, required: false },
  extraNotes: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: User, required: true },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
