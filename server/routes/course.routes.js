const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/import-playlist", authMiddleware, courseController.importPlaylist);
router.get("/", authMiddleware, courseController.getAllCourses);
router.get("/:courseId", authMiddleware, courseController.getCourseById);
router.get("/:courseId/videos", courseController.getCourseVideos);
router.get("/:courseId/content", authMiddleware, courseController.getCourseContent);
router.get("/:courseId/progress", authMiddleware, courseController.getCourseProgress);
router.delete("/:courseId", authMiddleware, courseController.deleteCourse);

module.exports = router;
