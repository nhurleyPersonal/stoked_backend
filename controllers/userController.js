// controllers/userController.js
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const AuthTable = require("../models/authTableModel");
const secret = "supersecretkey"; // Replace with your own secret key

const register = async (req, res) => {
  let { user, password } = req.body;
  let { email, username, firstName, lastName, tagline, skillLevel, homeSpot } =
    user;
  email = email.toLowerCase();

  if (!email || !password || !username) {
    return res.status(500).json({
      status: "error",
      code: 410,
      message: "Need Email, Username, Password",
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
      tagline,
      skillLevel,
      homeSpot,
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
    console.log("decoded", decoded);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    console.log("user", user);

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

const searchUsers = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "error", message: "Invalid token" });
      }

      // Get the search query from the request
      const { searchTerm } = req.body;

      // Create a regex pattern for case-insensitive partial matching
      const pattern = new RegExp(searchTerm, "i");

      const users = await User.find({
        $or: [
          { username: pattern },
          { firstName: pattern },
          { lastName: pattern },
        ],
      }).sort({ username: 1, lastName: 1, firstName: 1 });

      if (!users) {
        return res.status(404).json({ message: "No users found" });
      }

      const response = {
        status: "ok",
        message: "Users found",
        token,
        users: users,
      };

      // Send the user data
      res.status(200).json(response);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const updateUserEmail = async (req, res) => {
  const { newEmail } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update email in the User collection
    user.email = newEmail.toLowerCase();
    await user.save();

    // Update email in the AuthTable collection
    const authData = await AuthTable.findOne({ userId: req.userId });
    if (!authData) {
      return res.status(404).json({ message: "Authentication data not found" });
    }
    authData.email = newEmail.toLowerCase();
    await authData.save();

    // Generate a new JWT for the user after email update
    const newToken = jwt.sign({ userId: user._id }, secret);

    res
      .status(200)
      .json({ message: "Email updated successfully", token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hash = await bcrypt.hash(newPassword, saltRounds);
    const authData = await AuthTable.findOne({ email: user.email });
    authData.password = hash;
    await authData.save();

    // Generate a new JWT for the user after password update
    const newToken = jwt.sign({ userId: user._id }, secret);

    res
      .status(200)
      .json({ message: "Password updated successfully", token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserBio = async (req, res) => {
  const { newBio } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("new bio", newBio);

    user.tagline = newBio;
    await user.save();
    console.log("Got em changed", newBio);

    res.status(200).json({ message: "Bio updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserHomeBreak = async (req, res) => {
  const { newHomeBreakId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.homeSpot = newHomeBreakId;
    await user.save();

    res.status(200).json({ message: "Home break updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUsername = async (req, res) => {
  const { newUsername } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new username already exists
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }
    console.log("new username", newUsername);

    user.username = newUsername;
    await user.save();
    console.log("Got em changed", newUsername);

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getUser,
  searchUsers,
  updateUserEmail,
  updateUserPassword,
  updateUserBio,
  updateUserHomeBreak,
  updateUsername,
};
