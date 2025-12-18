const Governing = require("../models/GoverningMember");
const path = require("path");
const fs = require("fs");

// GET all members
exports.getAll = async (req, res) => {
  try {
    const members = await Governing.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET member by ID
exports.getById = async (req, res) => {
  try {
    const member = await Governing.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE member
exports.create = async (req, res) => {
  try {
    const { name, position } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newMember = new Governing({ name, position, image });
    await newMember.save();

    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE member
exports.update = async (req, res) => {
  try {
    const { name, position } = req.body;
    const member = await Governing.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    if (req.file) {
      if (member.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public/uploads",
          path.basename(member.image)
        );
        fs.unlink(oldImagePath, () => {});
      }
      member.image = `/uploads/${req.file.filename}`;
    }

    member.name = name || member.name;
    member.position = position || member.position;

    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE member
exports.delete = async (req, res) => {
  try {
    const member = await Governing.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    if (member.image) {
      const imagePath = path.join(
        process.cwd(),
        "public/uploads",
        path.basename(member.image)
      );
      fs.unlink(imagePath, () => {});
    }

    await member.deleteOne();
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
