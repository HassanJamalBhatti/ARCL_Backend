const mongoose = require("mongoose");

const newsUpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["Event", "Workshop", "Internship"],
      required: true 
    },
    date: { type: Date, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsUpdate", newsUpdateSchema);
