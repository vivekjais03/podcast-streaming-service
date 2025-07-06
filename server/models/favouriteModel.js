const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  podcast: { type: mongoose.Schema.Types.ObjectId, ref: "Podcast", required: true },
});

module.exports = mongoose.model("Favourite", favouriteSchema);
