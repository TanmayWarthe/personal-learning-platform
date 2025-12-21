const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { markVideoCompleted } = require("../controllers/video.controller");

router.post(
  "/videos/:videoId/complete",
  authMiddleware,
  markVideoCompleted
);

module.exports = router;
