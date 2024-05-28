// controllers/userController.js
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const secret = "supersecretkey"; // Replace with your own secret key

const register = async (req, res) => {
  let { email, password, firstName, lastName } = req.body;
  email = email.toLowerCase();

  if (!email || !password) {
    return res.status(500).json({
      status: "error",
      code: 410,
      message: "Need Both Email and Passwrod",
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
      password: hash,
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
    res.status(200).json({
      status: "ok",
      message: "User registered successfully",
      token,
      userID: savedUser._id,
      email: savedUser.email,
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
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({
        status: "error",
        code: 408,
        message: "Email or password is incorrect",
      });
    }

    // Compare the password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(500).json({
        status: "error",
        code: 408,
        message: "Email or password is incorrect",
      });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id, email }, secret, {});

    // Convert the user document to a plain object and exclude the password
    const userNoPass = user.toObject();
    delete userNoPass.password;
    userNoPass.username = userNoPass.email;

    const response = {
      status: "ok",
      message: "User logged in successfully",
      token,
      user: userNoPass,
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
