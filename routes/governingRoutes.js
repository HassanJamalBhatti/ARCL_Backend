const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const GoverningController = require("../controllers/governingController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", GoverningController.getAll);
router.get("/:id", GoverningController.getById);
router.post("/add", upload.single("image"), GoverningController.create);
router.put("/:id", upload.single("image"), GoverningController.update);
router.delete("/:id", GoverningController.delete);

module.exports = router;
