const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ================= CREATE USER (ADMIN ONLY) ================= */
exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { name, email, password, role, status } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role?.toLowerCase() === "admin" ? "Admin" : "User",
      status: status || "Active",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET USERS ================= */
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const users = await User.find().select("-password");
      return res.json(users);
    }

    const user = await User.findById(req.user._id).select("-password");
    res.json([user]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET USER BY ID ================= */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "Admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE USER ================= */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "Admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = { ...req.body };

    if (req.user.role !== "Admin") {
      delete updates.role;
      delete updates.status;
    } else if (updates.role) {
      updates.role = updates.role.toLowerCase() === "admin" ? "Admin" : "User";
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE USER (ADMIN ONLY) ================= */
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { id } = req.params;
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only admin or the same user can reset password
    if (req.user.role !== "Admin" && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
