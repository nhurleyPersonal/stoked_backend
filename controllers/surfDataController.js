const SurfData = require("../models/surfDataModel");
const TideData = require("../models/tideDataModel");
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
  console.log("Search Forecasts Range", req.body);
  const { _id, startDate, endDate } = req.body;
  const targetStartDate = Math.floor(startDate / 10800) * 10800; // round down to the nearest multiple of 10800
  const targetEndDate = Math.floor(endDate / 10800) * 10800; // round down to the nearest multiple of 10800

  try {
    const forecasts = await SurfData.find({
      spotId: _id,
      date: { $gte: targetStartDate, $lte: targetEndDate },
    });

    if (!forecasts) {
      return res.status(404).json({
        message:
          "No forecasts found for this spot for the specified time range.",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "Forecasts retrieved successfully",
      surfData: forecasts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while searching for forecasts.",
      error: error.message,
    });
  }
};

const searchTidesRangeInternal = async (tideStationId, startDate, endDate) => {
  try {
    const tides = await TideData.find({
      stationId: tideStationId,
      date: {
        $gte: startDate.toISOString().slice(0, 10),
        $lte: endDate.toISOString().slice(0, 10),
      },
    });

    return tides;
  } catch (error) {
    return null;
  }
};

const searchTidesByDayInternal = async (tideStationId, date) => {
  console.log("searchTidesByDayInternal called", tideStationId, date);

  // Convert date from seconds to milliseconds and ensure it is a Date object
  date = new Date(date * 1000);

  // Format the date to match the 'YYYY-MM-DD' format used in your MongoDB documents
  const formattedDate = date.toISOString().slice(0, 10); // This will give you 'YYYY-MM-DD'

  console.log("Formatted date for query:", formattedDate);

  try {
    const tides = await TideData.find({
      stationId: String(tideStationId),
      date: formattedDate, // Use the formatted date string for querying
    });

    if (!tides.length) {
      console.log("No tide data found for the given date and tide station ID.");
      return null;
    }

    console.log("Tides found:", tides);
    return tides;
  } catch (error) {
    console.log("Error in searchTidesByDayInternal:", error);
    return null;
  }
};

const searchTidesByDay = async (req, res) => {
  console.log("Search Tides Day", req.body);

  const { tideStation, date } = req.body;
  if (!tideStation || !date) {
    return res.status(400).json({
      message: "Missing required parameters: tideStationId or date.",
    });
  }

  try {
    const tides = await searchTidesByDayInternal(tideStation, date);

    if (!tides) {
      return res.status(404).json({
        message: "No tide data found for the given date and tide station ID.",
      });
    }

    console.log("tides", tides);

    res.status(200).json({
      status: "ok",
      message: "Sessions retrieved successfully",
      tideData: tides,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving tide data.",
      error: error.message,
    });
  }
};

const searchForecastsRangeInternal = async (spotId, startDate, endDate) => {
  const targetStartDate = Math.floor(startDate / 1000 / 10800) * 10800; // round down to the nearest multiple of 10800
  const targetEndDate = Math.floor(endDate / 1000 / 10800) * 10800; // round down to the nearest multiple of 10800
  console.log(spotId, startDate, endDate, targetStartDate, targetEndDate);
  try {
    const forecasts = await SurfData.find({
      spotId: new ObjectId(spotId),
      date: {
        $gte: targetStartDate,
        $lte: targetEndDate,
      },
    });
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
  searchTidesRangeInternal,
  searchTidesByDayInternal,
  searchTidesByDay,
};
