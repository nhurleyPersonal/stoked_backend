const SurfData = require("../models/surfDataModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const searchForecasts = async (req, res) => {
  const { _id, date } = req.body;
  const targetDate = Math.floor(date / 10800) * 10800; // round down to the nearest multiple of 10800

  try {
    const forecasts = await SurfData.find({
      spot: _id,
      date: targetDate,
    });

    if (!forecasts) {
      return res.status(404).json({
        message: "No forecasts found for this spot for the specified time.",
      });
    }

    return res.status(200).json(forecasts);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while searching for forecasts.",
      error: error.message,
    });
  }
};

const searchForecastsRange = async (req, res) => {
  const { _id, startDate, endDate } = req.body;
  const targetStartDate = Math.floor(startDate / 10800) * 10800; // round down to the nearest multiple of 10800
  const targetEndDate = Math.floor(endDate / 10800) * 10800; // round down to the nearest multiple of 10800

  try {
    const forecasts = await SurfData.find({
      spot: _id,
      date: { $gte: targetStartDate, $lte: targetEndDate },
    });

    if (!forecasts) {
      return res.status(404).json({
        message:
          "No forecasts found for this spot for the specified time range.",
      });
    }

    return res.status(200).json(forecasts);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while searching for forecasts.",
      error: error.message,
    });
  }
};

const searchForecastsRangeInternal = async (spotId, startDate, endDate) => {
  const targetStartDate = (Math.floor(startDate / 10800) * 10800) / 1000; // round down to the nearest multiple of 10800
  const targetEndDate = (Math.floor(endDate / 10800) * 10800) / 1000; // round down to the nearest multiple of 10800
  console.log(
    "ABCDEF",
    spotId,
    startDate,
    endDate,
    targetStartDate,
    targetEndDate
  );
  try {
    const forecasts = await SurfData.find({
      spotId: new ObjectId(spotId),
      date: {
        $gte: targetStartDate,
        $lte: targetEndDate,
      },
    });
    console.log("ABCDE", forecasts);
    return forecasts;
  } catch (error) {
    console.log("error!", error);
    return null;
  }
};

const searchForecastsInternal = async (spotId, date) => {
  const targetDate = Math.floor(date / 10800) * 10800; // round down to the nearest multiple of 10800

  try {
    const forecasts = await SurfData.find({
      spot: spotId,
      date: targetDate,
    });

    return forecasts;
  } catch (error) {
    return null;
  }
};

module.exports = {
  searchForecasts,
  searchForecastsInternal,
  searchForecastsRange,
  searchForecastsRangeInternal,
};
