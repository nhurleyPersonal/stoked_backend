// controllers/userController.js
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const AuthTable = require("../models/authTableModel");
const secret = "supersecretkey"; // Replace with your own secret key

const register = async (req, res) => {
  let { email, username, password, firstName, lastName } = req.body;
  email = email.toLowerCase();

  if (!email || !password || !username) {
    return res.status(500).json({
      status: "error",
      code: 410,
      message: "Need Both Email, Username, Password",
    });
  }

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res
        .status(500)
        .json({ status: "error", code: 409, message: "User already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({
      email,
      username,
      firstName,
      lastName,
    });

    // Save the user to the User database
    const savedUser = await user.save();

    // Create a new auth data with the hashed password
    const authData = new AuthTable({
      email,
      password: hash,
    });

    // Save the auth data to the AuthTable database
    await authData.save();

    // Generate a JWT
    const token = jwt.sign({ id: savedUser._id, email }, secret, {});

    // Respond with a success message and the JWT
    res.status(200).json({
      status: "ok",
      message: "User registered successfully",
      token,
      userID: savedUser._id,
      email: savedUser.email,
      username: savedUser.username,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: err });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;

  email = email.toLowerCase();

  if (!email || !password) {
    return res.status(500).json({
      status: "error",
      code: 410,
      message: "Need both email and password",
    });
  }

  try {
    // Find the auth data by email
    const authData = await AuthTable.findOne({ email });

    if (!authData) {
      return res.status(500).json({
        status: "error",
        code: 408,
        message: "Email or password is incorrect",
      });
    }

    // Compare the password
    const match = await bcrypt.compare(password, authData.password);

    if (!match) {
      return res.status(500).json({
        status: "error",
        code: 408,
        message: "Email or password is incorrect",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({
        status: "error",
        code: 408,
        message: "User not found",
      });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id, email }, secret, {});

    const response = {
      status: "ok",
      message: "User logged in successfully",
      token,
      user: user,
    };

    console.log(response);

    // Respond with a success message and the JWT
    res.status(200).json(response);
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
