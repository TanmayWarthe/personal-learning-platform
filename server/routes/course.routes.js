const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  getCourseById,
  getCourseVideos,
} = require("../controllers/course.controller");

router.get("/", getAllCourses);
router.get("/:courseId", getCourseById);
router.get("/:courseId/videos", getCourseVideos);

module.exports = router;
