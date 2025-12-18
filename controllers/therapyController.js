const Therapy = require("../models/Therapy");

// GET all therapies
exports.getTherapies = async (req, res) => {
  try {
    const therapies = await Therapy.find();
    res.json(therapies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single therapy
exports.getTherapyById = async (req, res) => {
  try {
    const therapy = await Therapy.findById(req.params.id);
    if (!therapy) return res.status(404).json({ message: "Therapy not found" });
    res.json(therapy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE therapy
exports.createTherapy = async (req, res) => {
  const therapy = new Therapy(req.body);
  try {
    const savedTherapy = await therapy.save();
    res.status(201).json(savedTherapy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE therapy
exports.updateTherapy = async (req, res) => {
  try {
    const updated = await Therapy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE therapy
exports.deleteTherapy = async (req, res) => {
  try {
    await Therapy.findByIdAndDelete(req.params.id);
    res.json({ message: "Therapy deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
