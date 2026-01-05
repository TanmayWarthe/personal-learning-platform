const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protected: Import playlist requires authentication
router.post("/import-playlist", authMiddleware, courseController.importPlaylist);

// Protected: Course listing requires authentication (now user-specific)
router.get("/", authMiddleware, courseController.getAllCourses);
router.get("/:courseId", authMiddleware, courseController.getCourseById);
router.get("/:courseId/videos", courseController.getCourseVideos);

// Authenticated, user-specific data
router.get("/:courseId/content", authMiddleware, courseController.getCourseContent);
router.get("/:courseId/progress", authMiddleware, courseController.getCourseProgress);

// Delete course
router.delete("/:courseId", authMiddleware, courseController.deleteCourse);

module.exports = router;
