const NewsUpdate = require("../models/NewsUpdate"); 

/* ================= CREATE ================= */
exports.createNewsUpdate = async (req, res) => {
  try {
    const { title, description, type, date } = req.body;

    // Validate type
    if (!["Event", "Workshop", "Internship"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    const newsupdate = await NewsUpdate.create({
      title,
      description,
      type,
      date,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({ success: true, data: newsupdate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= READ ALL ================= */
exports.getAllNewsUpdates = async (req, res) => {
  try {
    const newsupdates = await NewsUpdate.find().sort({ createdAt: -1 });
    res.json({ success: true, data: newsupdates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= READ ONE ================= */
exports.getNewsUpdateById = async (req, res) => {
  try {
    const newsupdate = await NewsUpdate.findById(req.params.id);
    if (!newsupdate)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: newsupdate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateNewsUpdate = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Validate type
    if (updateData.type && !["Event", "Workshop", "Internship"].includes(updateData.type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const newsupdate = await NewsUpdate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!newsupdate)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: newsupdate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteNewsUpdate = async (req, res) => {
  try {
    const newsupdate = await NewsUpdate.findByIdAndDelete(req.params.id);
    if (!newsupdate)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
