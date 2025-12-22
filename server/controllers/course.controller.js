const pool = require("../config/db");
const { get } = require("../routes/course.routes");
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





// Helper to extract playlistId from a YouTube URL
function extractPlaylistId(url) {
  if (typeof url !== 'string') return null;
  try {
    // Try to parse as URL
    const u = new URL(url);
    // YouTube playlistId is in 'list' param
    const pid = u.searchParams.get('list');
    if (pid && /^[A-Za-z0-9_-]+$/.test(pid)) return pid;
    return null;
  } catch (e) {
    // fallback: try regex
    const match = url.match(/[?&]list=([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }
}


async function getCourseContent(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user && req.user.userId;

    // 1️⃣ Get modules
    const modulesResult = await pool.query(
      `SELECT id, title, order_index FROM modules WHERE course_id = $1 ORDER BY order_index ASC`,
      [courseId]
    );
    const modules = modulesResult.rows;

    // 2️⃣ Get videos
    const videosResult = await pool.query(
      `SELECT id, title, youtube_video_id, position, module_id FROM videos WHERE course_id = $1 ORDER BY position ASC`,
      [courseId]
    );
    const videos = videosResult.rows;

    // 3️⃣ Get completed videos for user
    let completedVideoIds = [];
    if (userId) {
      const completedRes = await pool.query(
        `SELECT video_id FROM user_video_progress WHERE user_id = $1 AND completed = true`,
        [userId]
      );
      completedVideoIds = completedRes.rows.map(r => r.video_id);
    }

    // 4️⃣ Group videos under modules with completed/unlocked logic
    const structuredContent = modules.map((module) => {
      const moduleVideos = videos
        .filter((video) => video.module_id === module.id)
        .sort((a, b) => a.position - b.position);

      let unlocked = true;
      return {
        moduleId: module.id,
        title: module.title,
        order: module.order_index,
        videos: moduleVideos.map((video, idx) => {
          const completed = completedVideoIds.includes(video.id);
          let isUnlocked = false;
          if (idx === 0) isUnlocked = true;
          else if (moduleVideos[idx - 1] && completedVideoIds.includes(moduleVideos[idx - 1].id)) isUnlocked = true;
          return {
            ...video,
            completed,
            unlocked: isUnlocked
          };
        })
      };
    });

    res.json(structuredContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load course content" });
  }
}


async function getCourseProgress(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user && req.user.userId;

    // Total videos in course
    const totalRes = await pool.query(
      `SELECT COUNT(*) FROM videos WHERE course_id = $1`,
      [courseId]
    );
    const totalVideos = parseInt(totalRes.rows[0].count, 10);

    // Completed videos for user
    let completedVideos = 0;
    if (userId) {
      const completedRes = await pool.query(
        `SELECT COUNT(*) FROM user_video_progress WHERE user_id = $1 AND video_id IN (SELECT id FROM videos WHERE course_id = $2) AND completed = true`,
        [userId, courseId]
      );
      completedVideos = parseInt(completedRes.rows[0].count, 10);
    }

    const percentage = totalVideos === 0 ? 0 : Math.round((completedVideos / totalVideos) * 100);

    res.json({ completedVideos, totalVideos, percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ completedVideos: 0, totalVideos: 0, percentage: 0 });
  }
}


module.exports = {
  getAllCourses,
  getCourseById,
  getCourseVideos,
  importPlaylist,
  getCourseContent,
  getCourseProgress, // <-- this must be present and spelled the same!
};