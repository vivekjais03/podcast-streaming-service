// server/models/Podcast.js
const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    media: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ✅ Only define model if not already defined
module.exports = mongoose.models.Podcast || mongoose.model("Podcast", podcastSchema);
