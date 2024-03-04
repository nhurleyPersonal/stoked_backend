const jwt = require("jsonwebtoken");
const secret = "your-secret-key"; // Replace with your own secret key

const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
