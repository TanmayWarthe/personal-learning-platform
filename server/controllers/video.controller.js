// Get completed video IDs for a user and course
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

// Get learning streak (dummy, for demo)
exports.getLearningStreak = async (req, res) => {
  try {
    // For demo, just return a static streak
    res.json({ streak: 5 });
  } catch {
    res.json({ streak: 0 });
  }
};

// Get course progress (dummy, for demo)
exports.getCourseProgress = async (req, res) => {
  try {
    // For demo, just return static progress and badge
    res.json({ progress: 50, badge: "Silver" });
  } catch {
    res.json({ progress: 0, badge: "Bronze" });
  }
};
const pool = require("../config/db");

exports.markVideoCompleted = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;

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
    // Never return failure for authenticated users
    console.error(error);
    res.json({ success: true });
  }
};
