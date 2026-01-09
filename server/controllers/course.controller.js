const pool = require("../config/db");
const fetchPlaylistVideos = require("../utils/youtube");
async function getAllCourses(req, res) {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const coursesResult = await pool.query(
      `SELECT 
        c.id, 
        c.title, 
        c.description,
        c.created_at,
        COUNT(DISTINCT v.id) as video_count
       FROM courses c
       LEFT JOIN videos v ON v.course_id = c.id
       WHERE c.user_id = $1
       GROUP BY c.id, c.title, c.description, c.created_at
       ORDER BY c.created_at DESC`,
      [userId]
    );

    const courses = coursesResult.rows;

    if (userId) {
      const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
          const totalVideos = parseInt(course.video_count) || 0;

          const completedRes = await pool.query(
            `SELECT COUNT(*) as completed_count
             FROM user_video_progress
             WHERE user_id = $1 
             AND completed = true
             AND video_id IN (SELECT id FROM videos WHERE course_id = $2)`,
            [userId, course.id]
          );

          const completedCount = parseInt(completedRes.rows[0]?.completed_count || 0);
          const percentage = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

          return {
            ...course,
            video_count: totalVideos,
            completed_videos: completedCount,
            progress_percentage: percentage,
          };
        })
      );

      return res.json(coursesWithProgress);
    }

    res.json([]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function getCourseById(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT id, title, description FROM courses WHERE id = $1 AND user_id = $2",
      [courseId, userId]
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

    res.json(result.rows || []);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
}



async function importPlaylist(req, res) {
  try {
    const { title, description, playlistId, playlistUrl } = req.body;

    console.log("Import playlist request:", { title, playlistId, playlistUrl });

    let finalPlaylistId = playlistId;
    if (!finalPlaylistId && playlistUrl) {
      finalPlaylistId = extractPlaylistId(playlistUrl);
    }

    console.log("Extracted playlistId:", finalPlaylistId);

    if (!title || !finalPlaylistId) {
      return res.status(400).json({
        message: "Title and a valid playlist URL/ID are required",
      });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      console.error("YOUTUBE_API_KEY is not configured");
      return res.status(500).json({
        message: "YouTube API key is not configured on the server",
      });
    }

    console.log("Inserting course into database...");

    const userId = req.user && req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const courseResult = await pool.query(
      "INSERT INTO courses (user_id, title, description, playlist_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [userId, title, description || "", finalPlaylistId]
    );

    const courseId = courseResult.rows[0].id;
    console.log("Course created with ID:", courseId);

    const moduleResult = await pool.query(
      `INSERT INTO modules (course_id, title, position) 
       VALUES ($1, $2, $3) RETURNING id`,
      [courseId, "Course Content", 1]
    );
    const moduleId = moduleResult.rows[0].id;
    console.log("Module created with ID:", moduleId);

    console.log("Fetching videos from YouTube API...");
    const videos = await fetchPlaylistVideos(finalPlaylistId);
    console.log(`Fetched ${videos.length} videos from YouTube`);

    for (const video of videos) {
      await pool.query(
        `INSERT INTO videos (course_id, youtube_video_id, title, position, module_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [courseId, video.youtube_video_id, video.title, video.position, moduleId]
      );
    }

    console.log("All videos inserted successfully");

    res.status(201).json({
      message: "Course imported successfully",
      courseId,
      totalVideos: videos.length,
    });
  } catch (error) {
    console.error("Import playlist error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: error.message || "Failed to import playlist",
    });
  }
}

function extractPlaylistId(url) {
  if (typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    const pid = u.searchParams.get('list');
    if (pid && /^[A-Za-z0-9_-]+$/.test(pid)) return pid;
    return null;
  } catch (e) {
    const match = url.match(/[?&]list=([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }
}


async function getCourseContent(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user && req.user.userId;

    const modulesResult = await pool.query(
      `SELECT id, title, position FROM modules WHERE course_id = $1 ORDER BY position ASC`,
      [courseId]
    );
    const modules = modulesResult.rows;

    const videosResult = await pool.query(
      `SELECT id, title, youtube_video_id, position, module_id FROM videos WHERE course_id = $1 ORDER BY position ASC`,
      [courseId]
    );
    const videos = videosResult.rows;

    let completedVideoIds = [];
    if (userId) {
      const completedRes = await pool.query(
        `SELECT video_id FROM user_video_progress WHERE user_id = $1 AND completed = true`,
        [userId]
      );
      completedVideoIds = completedRes.rows.map(r => r.video_id);
    }

    if (modules.length === 0 && videos.length > 0) {
      const allVideos = videos.sort((a, b) => a.position - b.position);
      const structuredContent = [{
        moduleId: 0, // Virtual module ID
        title: "Course Content",
        order: 1,
        videos: allVideos.map((video, idx) => {
          const completed = completedVideoIds.includes(video.id);
          const isUnlocked = idx === 0 || completedVideoIds.includes(allVideos[idx - 1]?.id);
          return {
            ...video,
            completed,
            unlocked: isUnlocked
          };
        })
      }];
      return res.json(structuredContent);
    }

    const structuredContent = modules.map((module) => {
      const moduleVideos = videos
        .filter((video) => video.module_id === module.id)
        .sort((a, b) => a.position - b.position);

      return {
        moduleId: module.id,
        title: module.title,
        order: module.position,
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

    const orphanedVideos = videos.filter(v => !v.module_id);
    if (orphanedVideos.length > 0) {
      const orphanedModule = {
        moduleId: 0,
        title: "Course Content",
        order: modules.length + 1,
        videos: orphanedVideos.sort((a, b) => a.position - b.position).map((video, idx) => {
          const completed = completedVideoIds.includes(video.id);
          const isUnlocked = idx === 0 || completedVideoIds.includes(orphanedVideos[idx - 1]?.id);
          return {
            ...video,
            completed,
            unlocked: isUnlocked
          };
        })
      };
      structuredContent.push(orphanedModule);
    }

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

    const totalRes = await pool.query(
      `SELECT COUNT(*) FROM videos WHERE course_id = $1`,
      [courseId]
    );
    const totalVideos = parseInt(totalRes.rows[0].count, 10);

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


async function deleteCourse(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(`User ${userId} attempting to delete course ${courseId}`);

    const courseCheck = await pool.query(
      "SELECT id FROM courses WHERE id = $1 AND user_id = $2",
      [courseId, userId]
    );

    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    await pool.query("DELETE FROM courses WHERE id = $1 AND user_id = $2", [courseId, userId]);

    console.log(`Course ${courseId} deleted successfully`);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseVideos,
  importPlaylist,
  getCourseContent,
  getCourseProgress,
  deleteCourse,
};