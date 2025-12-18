const Gallery = require("../models/Gallery");
const Therapy = require("../models/Therapy");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// GET /api/gallery
exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 }); // latest first
    res.json(gallery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch gallery", error: err.message });
  }
};

// POST /api/gallery
exports.addGallery = async (req, res) => {
  try {
    const files = req.files; // multer handles multiple files
    const { therapyId } = req.body;

    if (!therapyId || !files || files.length === 0) {
      return res.status(400).json({ message: "Therapy ID and at least one file are required" });
    }

    const therapy = await Therapy.findById(therapyId);
    if (!therapy) {
      return res.status(404).json({ message: "Therapy not found" });
    }

    const savedImages = await Promise.all(
      files.map(async (file) => {
        const galleryItem = new Gallery({
          imageUrl: `/uploads/${file.filename}`,
          therapyId: therapy._id,
          therapyTitle: therapy.mainTitle,
        });
        return galleryItem.save();
      })
    );

    res.status(201).json({ message: "Images uploaded successfully", images: savedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload images", error: err.message });
  }
};

// DELETE /api/gallery/:id
exports.deleteGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    const filePath = path.join(__dirname, "../public", galleryItem.imageUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await galleryItem.deleteOne();

    res.json({ message: "Gallery item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete gallery item", error: err.message });
  }
};
