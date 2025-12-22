const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ===== CREATE USER ===== */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===== GET ALL USERS ===== */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===== GET USER BY ID ===== */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===== UPDATE USER ===== */
exports.updateUser = async (req, res) => {
  try {
    const { name, role, status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, status },
      { new: true }
    ).select("-password");

    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===== DELETE USER ===== */
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
