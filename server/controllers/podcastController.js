// server/controllers/podcastController.js

const Podcast = require("../models/podcast");

const createPodcast = async (req, res) => {
  try {
    const { title, description } = req.body;
    const media = req.file.filename;

    const newPodcast = new Podcast({
      title,
      description,
      media,
      creator: req.user.id,
    });

    await newPodcast.save();
    res.status(201).json({ message: "Podcast uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload podcast" });
  }
};

const getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find().sort({ createdAt: -1 });
    res.json(podcasts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching podcasts" });
  }
};

module.exports = { createPodcast, getAllPodcasts };
