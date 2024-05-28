const Board = require("../models/boardModel");

const addBoard = async (req, res) => {
  const { name, length, make, model, volume, userId } = req.body;

  try {
    const newBoard = new Board({
      name,
      length,
      make,
      model,
      volume,
      userId,
    });

    const savedBoard = await newBoard.save();

    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoardsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const boards = await Board.find({ userBelongsTo: userId });

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomBoard = async (req, res) => {
  try {
    const count = await Board.countDocuments();
    const random = Math.floor(Math.random() * count);
    const board = await Board.findOne().skip(random);

    console.log(board);

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addBoard, getBoardsByUser, getRandomBoard };
