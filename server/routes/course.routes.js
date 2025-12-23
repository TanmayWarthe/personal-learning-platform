const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  getAllCourses,
  getCourseById,
  getCourseVideos,
  importPlaylist,
  getCourseContent,
  getCourseProgress,
} = require("../controllers/course.controller");

router.post("/import-playlist", importPlaylist);

// Public course listing/details (with optional auth for progress)
router.get("/", authMiddleware.optional, getAllCourses);
router.get("/:courseId", getCourseById);
router.get("/:courseId/videos", getCourseVideos);

// Authenticated, user-specific data
router.get("/:courseId/content", authMiddleware, getCourseContent);
router.get("/:courseId/progress", authMiddleware, getCourseProgress);

module.exports = router;
  