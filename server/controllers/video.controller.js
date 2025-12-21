const pool = require("../config/db");

exports.markVideoCompleted = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;

    const check = await pool.query(
      "SELECT * FROM user_video_progress WHERE user_id=$1 AND video_id=$2",
      [userId, videoId]
    );

    if (check.rows.length > 0) {
      return res.json({ success: true });
    }

    await pool.query(
      `
      INSERT INTO user_video_progress
      (user_id, video_id, completed, completed_at)
      VALUES ($1, $2, true, NOW())
      `,
      [userId, videoId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
    });
  }
};
