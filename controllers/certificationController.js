const Certification = require("../models/Certification");
const path = require("path");
const fs = require("fs");

// GET all certifications
exports.getAll = async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET certification by ID
exports.getById = async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certification not found" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE certification
exports.create = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.files?.image ? `/uploads/${req.files.image[0].filename}` : "";
    const pdf = req.files?.pdf ? `/uploads/${req.files.pdf[0].filename}` : "";

    if (!title || !image || !pdf) return res.status(400).json({ error: "All fields required" });

    const newCert = new Certification({ title, image, pdf });
    await newCert.save();

    res.status(201).json(newCert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE certification
exports.update = async (req, res) => {
  try {
    const { title } = req.body;
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certification not found" });

    // Replace image if new uploaded
    if (req.files?.image) {
      if (cert.image) {
        fs.unlink(path.join(process.cwd(), "public/uploads", path.basename(cert.image)), () => {});
      }
      cert.image = `/uploads/${req.files.image[0].filename}`;
    }

    // Replace PDF if new uploaded
    if (req.files?.pdf) {
      if (cert.pdf) {
        fs.unlink(path.join(process.cwd(), "public/uploads", path.basename(cert.pdf)), () => {});
      }
      cert.pdf = `/uploads/${req.files.pdf[0].filename}`;
    }

    cert.title = title || cert.title;
    await cert.save();

    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE certification
exports.delete = async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certification not found" });

    if (cert.image) fs.unlink(path.join(process.cwd(), "public/uploads", path.basename(cert.image)), () => {});
    if (cert.pdf) fs.unlink(path.join(process.cwd(), "public/uploads", path.basename(cert.pdf)), () => {});

    await cert.deleteOne();
    res.json({ message: "Certification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
