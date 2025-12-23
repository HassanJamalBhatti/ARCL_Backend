const NewsItem = require("../models/newsModel");

// GET all news/events
exports.getAllNews = async (req, res) => {
  try {
    const news = await NewsItem.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single news by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await NewsItem.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: "Not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE news
exports.createNews = async (req, res) => {
  try {
    const news = new NewsItem(req.body);
    await news.save();
    res.status(201).json({ success: true, data: news });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE news
exports.updateNews = async (req, res) => {
  try {
    const news = await NewsItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: news });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE news
exports.deleteNews = async (req, res) => {
  try {
    const news = await NewsItem.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
