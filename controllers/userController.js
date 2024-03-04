// controllers/userController.js
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secret = "your-secret-key"; // Replace with your own secret key

const register = (req, res) => {
  const { email, password } = req.body;
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
      const user = { email, password: hash };
      return collection.insertOne(user);
    })
    .then((result) => {
      // Generate a JWT
      const token = jwt.sign({ id: result.insertedId, email }, secret, {
        expiresIn: "1h",
      });

      // Respond with a success message and the JWT
      res.status(201).json({ message: "User registered successfully", token });
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      res.status(500).json({ error: err });
    });
};

module.exports = {
  register,
};
