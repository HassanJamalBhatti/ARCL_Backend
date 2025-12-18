const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  therapyId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapy" },
  therapyTitle: String,
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);
