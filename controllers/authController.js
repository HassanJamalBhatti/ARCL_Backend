const User = require("../models/User");
const UserSession = require("../models/UserSession");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Check user status
    if (user.status !== "Active") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6️⃣ Save session (full snapshot)
    const session = await UserSession.create({
      userId: user._id,
      userSnapshot: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    // 7️⃣ Response
    res.status(200).json({
      token,
      sessionId: session._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGOUT
========================= */
exports.logout = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID required" });
    }

    await UserSession.findByIdAndUpdate(sessionId, {
      logoutAt: new Date()
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET CURRENT USER
========================= */
exports.getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("GET CURRENT USER ERROR:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
