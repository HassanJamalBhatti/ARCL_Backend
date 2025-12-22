const express = require("express");
const router = express.Router();
const { login, getCurrentUser, logout } = require("../controllers/authController");

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me
router.get("/me", getCurrentUser);

module.exports = router;
