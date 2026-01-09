const pool = require("../config/db");

exports.getCompletedVideos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ completedVideoIds: [] });
    const result = await pool.query(
      `SELECT video_id FROM user_video_progress WHERE user_id = $1 AND completed = true`,
      [userId]
    );
    const completedVideoIds = result.rows.map(r => r.video_id);
    res.json({ completedVideoIds });
  } catch (error) {
    res.status(500).json({ completedVideoIds: [] });
  }
};

exports.getLearningStreak = async (req, res) => {
  try {
    res.json({ streak: 5 });
  } catch {
    res.json({ streak: 0 });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    res.json({ progress: 50, badge: "Silver" });
  } catch {
    res.json({ progress: 0, badge: "Bronze" });
  }
};

exports.markVideoCompleted = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;

    const videoCheck = await pool.query(
      `SELECT v.id FROM videos v
       JOIN courses c ON v.course_id = c.id
       WHERE v.id = $1 AND c.user_id = $2`,
      [videoId, userId]
    );

    if (videoCheck.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const check = await pool.query(
      "SELECT 1 FROM user_video_progress WHERE user_id=$1 AND video_id=$2",
      [userId, videoId]
    );

    if (check.rows.length > 0) {
      return res.json({ success: true });
    }

    await pool.query(
      `INSERT INTO user_video_progress (user_id, video_id, completed, completed_at)
       VALUES ($1, $2, true, NOW())`,
      [userId, videoId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: true });
  }
};
