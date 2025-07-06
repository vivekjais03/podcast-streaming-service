// server/controllers/favouritesController.js
const User = require("../models/User");
const Podcast = require("../models/podcast");

const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites");
    res.json(user.favourites);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Failed to fetch favourites" });
  }
};

const addFavourite = async (req, res) => {
  const { podcastId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user.favourites.includes(podcastId)) {
      user.favourites.push(podcastId);
      await user.save();
    }

    res.json({ message: "Added to favourites" });
  } catch (error) {
    console.error("Error adding favourite:", error);
    res.status(500).json({ message: "Failed to add favourite" });
  }
};

const removeFavourite = async (req, res) => {
  const { podcastId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    user.favourites = user.favourites.filter(
      (id) => id.toString() !== podcastId
    );
    await user.save();

    res.json({ message: "Removed from favourites" });
  } catch (error) {
    console.error("Error removing favourite:", error);
    res.status(500).json({ message: "Failed to remove favourite" });
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
};
