const SurfData = require("../models/surfDataModel");

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
  const targetStartDate = Math.floor(startDate / 10800) * 10800; // round down to the nearest multiple of 10800
  const targetEndDate = Math.floor(endDate / 10800) * 10800; // round down to the nearest multiple of 10800

  try {
    console.log(targetStartDate, targetEndDate);
    const forecasts = await SurfData.find({
      spot: spotId,
      date: { $gte: targetStartDate, $lte: targetEndDate },
    });
    console.log(forecasts);
    return forecasts;
  } catch (error) {
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
