const mongoose = require("mongoose");
const { Schema } = mongoose;

const authTableSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AuthTable = mongoose.model("AuthTable", authTableSchema);

module.exports = AuthTable;
