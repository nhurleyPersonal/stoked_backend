const UserFavoriteSpots = require("../models/userFavoriteSpotsModel");
const Session = require("../models/sessionModel");

const getFavoriteSpotsFeedForUser = async (req, res) => {
  const { page } = req.body;
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified
  const skip = (page - 1) * limit;

  try {
    const favoriteSpots = await UserFavoriteSpots.findOne({
      userId: req.userId,
    }).populate("spotIds");
    if (!favoriteSpots) {
      return res
        .status(404)
        .json({ status: "error", message: "No favorite spots found" });
    }

    const sessionsPromises = favoriteSpots.spotIds.map((spot) =>
      Session.find({ spot: spot._id })
        .populate("spot")
        .populate("board")
        .populate("surfData")
        .populate("tideData")
        .populate({ path: "user", select: "-password" }) // Exclude password field
        .sort({ sessionDatetime: -1, overallScore: -1 })
        .skip(skip)
        .limit(limit)
    );

    const sessionsPerSpot = await Promise.all(sessionsPromises);
    const allSessions = [].concat(...sessionsPerSpot);

    allSessions.sort((a, b) => {
      return (
        b.sessionDatetime - a.sessionDatetime || b.overallScore - a.overallScore
      );
    });

    res.status(200).json({ status: "ok", sessions: allSessions, page });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = { getFavoriteSpotsFeedForUser };
