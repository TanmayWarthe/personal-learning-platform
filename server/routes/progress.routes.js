const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getStreak } = require("../controllers/dashboard.controller");

router.get("/streak", authMiddleware, getStreak);

module.exports = router;
