// 📁 server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const podcastRoutes = require("./routes/podcastRoutes");
const favouriteRoutes = require("./routes/favourites");

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Security Headers
app.use(helmet());

// ✅ CORS Setup: Allow frontend on Vercel
app.use(cors({
  origin: "https://podcast-streaming-service-rouge.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// 📦 Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔗 Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/favourites", favouriteRoutes);

// 🧪 Test Route
app.get("/", (req, res) => {
  res.send("🎙️ Podcast API is running");
});

// 🔌 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1); // Exit on DB failure
});
