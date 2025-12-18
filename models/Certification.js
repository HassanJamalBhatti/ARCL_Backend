const mongoose = require("mongoose");

const CertificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, 
    pdf: { type: String, required: true },   
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Certification ||
  mongoose.model("Certification", CertificationSchema);
