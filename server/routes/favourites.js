// server/routes/favourites.js
const express = require("express");
const router = express.Router();
const requireSignIn = require("../middleware/authMiddleware");
const {
  getFavourites,
  addFavourite,
  removeFavourite,
} = require("../controllers/favouritesController");

router.get("/", requireSignIn, getFavourites);
router.post("/:podcastId", requireSignIn, addFavourite);
router.delete("/:podcastId", requireSignIn, removeFavourite);

module.exports = router;
