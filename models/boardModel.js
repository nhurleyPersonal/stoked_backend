const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userModel");

const boardSchema = new Schema({
  name: { type: String, required: true, unique: false },
  length: { type: String, required: false, unique: false },
  make: { type: String, required: false, unique: false },
  model: { type: String, required: false, unique: false },
  volume: { type: String, required: false, unique: false },
  userId: { type: Schema.Types.ObjectId, ref: User, required: true },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
