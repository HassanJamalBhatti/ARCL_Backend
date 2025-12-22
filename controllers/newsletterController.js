const Newsletter = require("../models/Newsletter");
const fs = require("fs");
const path = require("path");

// CREATE
exports.createNewsletter = async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ success: false, message: "PDF is required" });
    }

    const pdfUrl = `/uploads/${req.files.pdf[0].filename}`;
    const imageUrl = req.files.image
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    const newsletter = await Newsletter.create({
      title,
      date,
      pdfUrl,
      imageUrl,
    });

    res.status(201).json({ success: true, data: newsletter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ALL
exports.getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, data: newsletters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ONE
exports.getNewsletterById = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: newsletter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    newsletter.title = req.body.title || newsletter.title;
    newsletter.date = req.body.date || newsletter.date;

    if (req.files?.pdf) {
      newsletter.pdfUrl = `/uploads/${req.files.pdf[0].filename}`;
    }

    if (req.files?.image) {
      newsletter.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }

    await newsletter.save();

    res.json({ success: true, data: newsletter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    await newsletter.deleteOne();
    res.json({ success: true, message: "Newsletter deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
