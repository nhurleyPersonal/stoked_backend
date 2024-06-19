const jwt = require("jsonwebtoken");
const Session = require("../models/sessionModel");
const secret = "supersecretkey"; // Replace with your own secret key
const {
  searchForecastsRangeInternal,
  searchTidesRangeInternal,
  searchTidesByDayInternal,
} = require("./surfDataController"); // import the function
const SurfData = require("../models/surfDataModel");
const Spot = require("../models/spotModel");

const addSessionToDB = async (req, res) => {
  let {
    spot,
    sessionDatetime,
    sessionLength,
    board,
    wordOne,
    wordTwo,
    wordThree,
    overallScore,
    waveCount,
    goodWaveCount,
    crowd,
    lineup,
    waveHeight,
    timeBetweenWaves,
    extraNotes,
    user,
  } = req.body;

  try {
    // Verify the JWT
    const token = req.headers.authorization.split(" ")[1]; // Assumes 'Bearer <token>' format
    const decodedToken = jwt.verify(token, secret);

    // Check if the user in the JWT is the same as the user in the session
    if (decodedToken.id !== user._id) {
      console.log("Unauthorized");
      return res
        .status(500)
        .json({ status: "error", code: 403, message: "Unauthorized" });
    }

    const startDate = new Date(sessionDatetime);
    const endDate = new Date(
      startDate.getTime() + sessionLength * 60 * 60 * 1000
    );
    const surfData = await searchForecastsRangeInternal(
      spot,
      startDate,
      endDate
    );

    // Fetch the spot document using the spot ObjectId
    const spotDocument = await Spot.findById(spot);

    // Check if the spot document exists
    if (!spotDocument) {
      console.log("Spot not found");
      return res
        .status(500)
        .json({ status: "error", code: 404, message: "Spot not found" });
    }

    const tideStation = spotDocument.toObject()["tide_station"];

    // Pass the tideStation value to the searchTidesByDayInternal function
    const tideDataDocument =
      (await searchTidesByDayInternal(tideStation, startDate)) || [];

    const tideDataID = tideDataDocument[0]._id;

    // Create a new session
    const session = new Session({
      spot,
      sessionDatetime,
      sessionLength,
      board,
      surfData,
      tideData: tideDataID,
      wordOne,
      wordTwo,
      wordThree,
      overallScore,
      waveCount,
      goodWaveCount,
      crowd,
      lineup,
      waveHeight,
      timeBetweenWaves,
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

    // Respond with a success message
    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: err });
  }
};

const getSessionsByUser = async (req, res) => {
  const { _id } = req.body;
  try {
    // Find all sessions associated with the user
    const sessions = await Session.find({ user: _id })
      .populate("spot")
      .populate("board")
      .populate("surfData")
      .populate("tideData")
      .populate({ path: "user", select: "-password" }); // Exclude password field

    const sessionsWithUsername = sessions.map((session) => {
      const sessionObject = session.toObject();
      sessionObject.user.username = sessionObject.user.email;
      return sessionObject;
    });

    // Respond with the sessions
    res
      .status(200)
      .json({ status: "ok", message: "ok", sessions: sessionsWithUsername });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: err });
  }
};

const getSessionsBySpot = async (req, res) => {
  console.log("getSessionsBySpot", req.body);
  const { _id } = req.body;
  try {
    // Find all sessions associated with the spot
    const sessions = await Session.find({ spot: _id })
      .populate("spot")
      .populate("board")
      .populate("surfData")
      .populate("tideData")
      .populate({ path: "user", select: "-password" }); // Exclude password field

    if (!sessions) {
      return res
        .status(404)
        .json({ status: "error", message: "No sessions found for this spot" });
    }

    const sessionsWithSpotDetails = sessions.map((session) => {
      const sessionObject = session.toObject();
      sessionObject.spot.name = sessionObject.spot.name; // Assuming spot has a 'name' property
      return sessionObject;
    });

    // Respond with the sessions
    res.status(200).json({
      status: "ok",
      message: "Sessions retrieved successfully",
      sessions: sessionsWithSpotDetails,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = { addSessionToDB, getSessionsByUser, getSessionsBySpot };
