const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { markVideoCompleted } = require("../controllers/video.controller");

// Mounted at /videos in server/index.js, so route path should be "/:videoId/complete"
router.post(
  "/:videoId/complete",
  authMiddleware,
  markVideoCompleted
);

module.exports = router;
