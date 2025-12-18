const mongoose = require("mongoose");

const GoverningMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.GoverningMember ||
  mongoose.model("GoverningMember", GoverningMemberSchema);
