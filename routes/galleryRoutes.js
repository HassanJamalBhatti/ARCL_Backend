const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getGallery, addGallery, deleteGallery } = require("../controllers/galleryController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.get("/", getGallery);
router.post("/", upload.array("images", 20), addGallery); 
router.delete("/:id", deleteGallery);

module.exports = router;
