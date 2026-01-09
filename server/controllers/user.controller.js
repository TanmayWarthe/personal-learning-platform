const pool = require("../config/db");

async function getMe(req, res) {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateMe(req, res) {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id <> $2",
      [email, userId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at",
      [name, email, userId]
    );

    res.json({
      message: "Profile updated",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

module.exports = { getMe, updateMe };
