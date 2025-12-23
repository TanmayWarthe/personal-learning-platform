const pool = require("../config/db");

// GET /dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    /* ================= TOTAL VIDEOS ================= */
    const totalVideosResult = await pool.query(
      "SELECT COUNT(*) FROM videos"
    );
    const totalVideos = Number(totalVideosResult.rows[0].count);

    /* ================= COMPLETED VIDEOS ================= */
    const completedResult = await pool.query(
      `
      SELECT COUNT(*) 
      FROM user_video_progress
      WHERE user_id = $1 AND completed = true
      `,
      [userId]
    );
    const completedVideos = Number(completedResult.rows[0].count);

    /* ================= PROGRESS ================= */
    const progressPercent =
      totalVideos === 0
        ? 0
        : Math.round((completedVideos / totalVideos) * 100);

    /* ================= BADGE ================= */
    let badge = "Bronze";
    if (progressPercent > 80) badge = "Diamond";
    else if (progressPercent > 60) badge = "Platinum";
    else if (progressPercent > 40) badge = "Gold";
    else if (progressPercent > 20) badge = "Silver";

    /* ================= CONTINUE LEARNING ================= */
    const continueResult = await pool.query(
      `
      SELECT v.id, v.title, v.course_id
      FROM videos v
      LEFT JOIN user_video_progress uvp
        ON v.id = uvp.video_id
        AND uvp.user_id = $1
      WHERE uvp.completed IS NULL OR uvp.completed = false
      ORDER BY v.id ASC
      LIMIT 1
      `,
      [userId]
    );

    const continueLearning =
      continueResult.rows.length > 0
        ? continueResult.rows[0]
        : null;

    /* ================= RESPONSE ================= */
    res.json({
      success: true,
      progress: {
        completedVideos,
        totalVideos,
        percentage: progressPercent,
      },
      badge,
      continueLearning,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};

// GET /progress/streak
exports.getStreak = async (_req, res) => {
  try {
    // Replace with real streak logic when available
    res.json({ streak: 5 });
  } catch {
    res.json({ streak: 0 });
  }
};