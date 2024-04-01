// controllers/userController.js
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const secret = "supersecretkey"; // Replace with your own secret key

const register = async (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "A user with this email or username already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({
      email,
      password: hash,
      username,
      firstName,
      lastName,
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Generate a JWT
    const token = jwt.sign({ id: savedUser._id, email }, secret, {
      expiresIn: "30d",
    });

    // Respond with a success message and the JWT
    res.status(201).json({
      message: "User registered successfully",
      token,
      userID: savedUser._id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      username: savedUser.username,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Email and Password do not match any current users" });
    }

    // Compare the password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .json({ error: "Email and Password do not match any current users" });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id, email }, secret, {
      expiresIn: "30d",
    });

    // Respond with a success message and the JWT
    res.status(200).json({
      message: "User logged in successfully",
      token,
      userID: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err });
  }
};

const getUser = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Find the user by ID
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getUser,
};
