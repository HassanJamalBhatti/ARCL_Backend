const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  userSnapshot: {
    name: String,
    email: String,
    role: String,
    status: String
  },

  ipAddress: String,
  userAgent: String,

  loginAt: {
    type: Date,
    default: Date.now
  },

  logoutAt: {
    type: Date
  }
});

module.exports = mongoose.model("UserSession", UserSessionSchema);
