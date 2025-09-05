// 📁 server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");
const podcastRoutes = require("./routes/podcastRoutes");
const favouriteRoutes = require("./routes/favourites");

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Middleware
app.use(
  cors({
    origin: ["https://podcast-streaming-service-rouge.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      mediaSrc: ["'self'", "data:", "blob:"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Serve static files (audio/video) with proper headers
app.use("/uploads", (req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header("Access-Control-Allow-Origin", "*");
  next();
}, express.static(path.join(__dirname, "uploads")));

// 🚦 Routes
app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/favourites", favouriteRoutes);

// 🔔 Default Route
app.get("/", (req, res) => {
  res.send("🎧 Podcast API Server is Running...");
});

// 🌐 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit process on DB failure
  });
