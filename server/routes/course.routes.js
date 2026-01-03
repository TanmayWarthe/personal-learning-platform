const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protected: Import playlist requires authentication
router.post("/import-playlist", authMiddleware, courseController.importPlaylist);

// Public course listing/details (with optional auth for progress)
router.get("/", authMiddleware.optional, courseController.getAllCourses);
router.get("/:courseId", courseController.getCourseById);
router.get("/:courseId/videos", courseController.getCourseVideos);

// Authenticated, user-specific data
router.get("/:courseId/content", authMiddleware, courseController.getCourseContent);
router.get("/:courseId/progress", authMiddleware, courseController.getCourseProgress);

// Delete course
router.delete("/:courseId", authMiddleware, courseController.deleteCourse);

module.exports = router;
