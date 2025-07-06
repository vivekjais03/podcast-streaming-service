// server/routes/podcastRoutes.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const { createPodcast, getAllPodcasts } = require("../controllers/podcastController");
const requireSignIn = require("../middleware/authMiddleware");
const { deletePodcast } = require('../controllers/deleteController');


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.post("/upload", requireSignIn, upload.single("media"), createPodcast);
router.delete('/:id', requireSignIn, deletePodcast)
router.get("/", getAllPodcasts);

module.exports = router;
