// deleteController.js
const Podcast = require("../models/podcast");
const fs = require("fs");
const path = require("path");

exports.deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) return res.status(404).json({ message: "Podcast not found" });

    // Remove file from uploads folder if exists
    const filePath = path.join(__dirname, "../uploads", podcast.media);
    fs.unlink(filePath, (err) => {
      if (err) console.warn("⚠️  Could not delete file:", err.message);
    });

    await podcast.deleteOne();
    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Controller Error:", err.message);
    res.status(500).json({ message: "Failed to delete podcast" });
  }
};
