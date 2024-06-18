const Comment = require("../models/commentModel");

exports.getComments = async (req, res) => {
  try {
    const session = req.body.session;
    const comments = await Comment.find({ sessionId: session._id }).populate(
      "userId"
    );
    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve comments",
      error: error.message,
    });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { text, sessionId, userId } = req.body;
    const newComment = await Comment.create({
      text: text,
      sessionId: sessionId,
      userId: userId,
      commentDatetime: new Date(),
    });

    res.status(201).json({
      status: "success",
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to post comment",
      error: error.message,
    });
  }
};
