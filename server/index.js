const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet"); // ✅ added helmet
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet()); // ✅ added helmet middleware

// CORS for Vercel frontend
app.use(
  cors({
    origin: "https://podcast-streaming-service-rouge.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🎙️ Podcast API is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
