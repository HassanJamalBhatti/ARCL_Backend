const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["Event", "Workshop"], required: true },
  image: { type: String, default: "/uploads/default.png" }
}, { timestamps: true });

module.exports = mongoose.model("NewsItem", newsSchema);
