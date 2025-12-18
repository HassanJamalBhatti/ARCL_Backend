const FinancialReport = require("../models/FinancialReport");
const path = require("path");
const fs = require("fs");

// GET all reports
exports.getAll = async (req, res) => {
  try {
    const reports = await FinancialReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET report by ID
exports.getById = async (req, res) => {
  try {
    const report = await FinancialReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE report
exports.create = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ error: "PDF is required" });

    const pdf = `/uploads/${req.file.filename}`;
    const newReport = new FinancialReport({ title, pdf });
    await newReport.save();

    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE report
exports.update = async (req, res) => {
  try {
    const { title } = req.body;
    const report = await FinancialReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    // Replace PDF if new file uploaded
    if (req.file) {
      if (report.pdf) {
        const oldPath = path.join(process.cwd(), "public/uploads", path.basename(report.pdf));
        fs.unlink(oldPath, () => {});
      }
      report.pdf = `/uploads/${req.file.filename}`;
    }

    report.title = title || report.title;
    await report.save();

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE report
exports.delete = async (req, res) => {
  try {
    const report = await FinancialReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (report.pdf) {
      const pdfPath = path.join(process.cwd(), "public/uploads", path.basename(report.pdf));
      fs.unlink(pdfPath, () => {});
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
