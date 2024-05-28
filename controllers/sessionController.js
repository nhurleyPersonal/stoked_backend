const jwt = require("jsonwebtoken");
const Session = require("../models/sessionModel");
const secret = "supersecretkey"; // Replace with your own secret key

const addSessionToDB = async (req, res) => {
  console.log(req.body);
  let {
    spot,
    sessionDatetime,
    sessionLength,
    board,
    surfData,
    wordOne,
    wordTwo,
    wordThree,
    overallScore,
    waveCount,
    goodWaveCount,
    crowd,
    extraNotes,
    user,
  } = req.body;

  try {
    // Verify the JWT
    const token = req.headers.authorization.split(" ")[1]; // Assumes 'Bearer <token>' format
    const decodedToken = jwt.verify(token, secret);

    console.log("decodedToken:", decodedToken);
    console.log(user);

    // Check if the user in the JWT is the same as the user in the session
    if (decodedToken.id !== user._id) {
      console.log("Unauthorized");
      return res
        .status(500)
        .json({ status: "error", code: 403, message: "Unauthorized" });
    }

    // Create a new session
    const session = new Session({
      spot,
      sessionDatetime,
      sessionLength,
      board,
      surfData,
      wordOne,
      wordTwo,
      wordThree,
      overallScore,
      waveCount,
      goodWaveCount,
      crowd,
      extraNotes,
      user,
    });

    // Save the session to the database
    const savedSession = await session.save();

    let response = {
      status: "ok",
      message: "Session added successfully",
      session: savedSession,
    };
    console.log(response);

    // Respond with a success message
    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: err });
  }
};

const getSessionsByUser = async (req, res) => {
  const { _id } = req.body;
  console.log(req.body);

  console.log(_id);

  try {
    // Find all sessions associated with the user
    const sessions = await Session.find({ user: _id })
      .populate("spot")
      .populate("board")
      .populate("user")
      .populate("surfData");

    console.log(sessions);

    // Respond with the sessions
    res.status(200).json({ status: "ok", message: "ok", sessions: sessions });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: err });
  }
};

module.exports = { addSessionToDB, getSessionsByUser };
