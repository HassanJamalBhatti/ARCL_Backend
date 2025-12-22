const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  loginAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserSession", UserSessionSchema);
