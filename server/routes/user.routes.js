const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getMe } = require("../controllers/user.controller");

router.get("/me", authMiddleware, getMe);

module.exports = router;
