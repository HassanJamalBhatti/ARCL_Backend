const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ================= USER ROUTES ================= */

// Create new user → Admin only
router.post("/", protect, adminOnly, createUser);

// Get all users → Admin sees all, user sees self
router.get("/", protect, getUsers);

// Get single user → Admin any, user only self
router.get("/:id", protect, getUserById);

// Update user → Admin any, user only self
router.put("/:id", protect, updateUser);

// Delete user → Admin only
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
