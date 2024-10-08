const rateLimit = require("express-rate-limit");

// Define rate limit rule
const checkEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

module.exports = checkEmailLimiter;
