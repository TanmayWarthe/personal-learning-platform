const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  getCourseById,
  getCourseVideos,
  importPlaylist,
} = require("../controllers/course.controller");

router.post("/import-playlist", importPlaylist);

router.get("/", getAllCourses);
router.get("/:courseId", getCourseById);
router.get("/:courseId/videos", getCourseVideos);

module.exports = router;
  