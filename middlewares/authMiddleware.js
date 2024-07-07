const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const secret = "supersecretkey"; // Replace with your own secret key

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("decoded", decoded);

    // Check if the user exists in the database
    const user = await User.findById(decoded.id);
    if (!user || user.email !== decoded.email) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
