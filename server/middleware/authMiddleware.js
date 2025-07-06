// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const requireSignIn = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token presence and format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    // Proceed to the next middleware or route
    next();
  } catch (err) {
    console.error("❌ JWT Verification Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = requireSignIn;
