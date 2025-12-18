const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  header: { type: String, required: true },
  description: { type: String,  },
  hasList: { type: Boolean, default: false },
  listItems: { type: [String], default: [] },
});

const TherapySchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  url: { type: String, default: "" },
  sections: [SectionSchema],
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  role: { type: String, enum: ["Admin", "Therapist", "Parent"], default: "Admin" },
});

module.exports = mongoose.model("Therapy", TherapySchema);
