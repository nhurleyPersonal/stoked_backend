const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentText: { type: String, required: true },
  commentDatetime: { type: Date, default: Date.now, required: true }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;