// controllers/userController.js
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const secret = "supersecretkey"; // Replace with your own secret key

const register = (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  // Hash the password
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      const db = req.db;
      const collection = db.collection("users");

      // Insert a user with the hashed password
      const user = new User({
        email,
        password: hash,
        username,
        firstName,
        lastName,
      });
      return collection.insertOne(user);
    })
    .then((result) => {
      // Generate a JWT
      const token = jwt.sign({ id: result.insertedId, email }, secret, {
        expiresIn: "30d",
      });

      // Respond with a success message and the JWT
      res.status(201).json({ message: "User registered successfully", token });
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      res.status(500).json({ error: err });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const db = req.db;
  const collection = db.collection("users");

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  // Find the user by email
  collection
    .findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ error: "Email and Password do not match any current users" });
      }

      // Compare the password
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return res
            .status(400)
            .json({
              error: "Email and Password do not match any current users",
            });
        }

        // Generate a JWT
        const token = jwt.sign({ id: user._id, email }, secret, {
          expiresIn: "30d",
        });

        // Respond with a success message and the JWT
        res.status(200).json({ message: "User logged in successfully", token });
      });
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      res.status(500).json({ error: err });
    });
};

module.exports = {
  register,
  login,
};
