const pool = require("../config/db");

// GET /dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    /* ================= TOTAL VIDEOS ================= */
    const totalVideosResult = await pool.query(
      `SELECT COUNT(*) FROM videos v
       JOIN courses c ON v.course_id = c.id
       WHERE c.user_id = $1`,
      [userId]
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

    /* ================= COURSES ENROLLED ================= */
    const enrolledCoursesResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM courses
       WHERE user_id = $1`,
      [userId]
    );
    const coursesEnrolled = Number(enrolledCoursesResult.rows[0]?.count || 0);

    /* ================= CONTINUE LEARNING ================= */
    const continueResult = await pool.query(
      `
      SELECT v.id, v.title, v.course_id
      FROM videos v
      JOIN courses c ON v.course_id = c.id
      LEFT JOIN user_video_progress uvp
        ON v.id = uvp.video_id
        AND uvp.user_id = $1
      WHERE c.user_id = $1
        AND (uvp.completed IS NULL OR uvp.completed = false)
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
      coursesEnrolled,
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
// Returns the user's current learning streak in days based on consecutive days
// where at least one video was completed.
exports.getStreak = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get distinct completion dates for this user, most recent first
    const result = await pool.query(
      `SELECT DISTINCT DATE(completed_at) AS day
       FROM user_video_progress
       WHERE user_id = $1
         AND completed = true
         AND completed_at IS NOT NULL
       ORDER BY day DESC`,
      [userId]
    );

    const days = result.rows.map((r) => r.day);
    if (days.length === 0) {
      return res.json({ streak: 0 });
    }

    // Compute streak as number of consecutive days from the most recent activity
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diffInMs = prev.getTime() - curr.getTime();
      const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 1) {
        streak += 1;
      } else if (diffInDays === 0) {
        // Same calendar day (shouldn't happen with DISTINCT, but just in case)
        continue;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (error) {
    console.error("Streak calculation error:", error);
    res.json({ streak: 0 });
  }
};