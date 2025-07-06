// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Podcast" }],
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
