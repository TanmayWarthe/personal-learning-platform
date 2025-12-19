const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");


router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/dashboard" , dashboard);
// router.post("/profile" , profile);

module.exports = router;
