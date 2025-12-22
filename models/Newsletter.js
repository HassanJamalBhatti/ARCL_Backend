const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
