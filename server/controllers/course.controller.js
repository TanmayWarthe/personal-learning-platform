const pool = require("../config/db");
const fetchPlaylistVideos = require("../utils/youtube");







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

    // ✅ ALWAYS return an array
    res.json(result.rows || []);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
}



async function importPlaylist(req, res) {
  try {
    const { title, description, playlistId } = req.body;

    //  Validation check 
    if (!title || !playlistId) {
      return res.status(400).json({
        message: "Title and playlistId are required",
      });
    }

    //  Insert course in db
    const courseResult = await pool.query(
      "INSERT INTO courses (title, description, playlist_id) VALUES ($1, $2, $3) RETURNING id",
      [title, description || "", playlistId]
    );

    const courseId = courseResult.rows[0].id;

    // Fetch videos from YouTube API
    const videos = await fetchPlaylistVideos(playlistId);

    //  Insert videos in db
    for (const video of videos) {
      await pool.query(
        `INSERT INTO videos (course_id, youtube_video_id, title, position)
         VALUES ($1, $2, $3, $4)`,
        [courseId, video.youtube_video_id, video.title, video.position]
      );
    }

    // Success
    res.status(201).json({
      message: "Course imported successfully",
      courseId,
      totalVideos: videos.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to import playlist",
    });
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseVideos,
  importPlaylist,
};