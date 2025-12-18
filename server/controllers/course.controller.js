const pool = require("../config/db");








async function getAllCourses(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, title, description FROM courses ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function getCourseById(req, res) {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      "SELECT id, title, description FROM courses WHERE id = $1",
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function getCourseVideos(req, res) {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      `SELECT id, title, youtube_video_id, position
       FROM videos
       WHERE course_id = $1
       ORDER BY position ASC`,
      [courseId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  getAllCourses,
  getCourseById,
  getCourseVideos,
};
