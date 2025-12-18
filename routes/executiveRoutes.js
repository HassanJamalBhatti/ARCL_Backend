const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ExecutiveController = require("../controllers/executiveController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", ExecutiveController.getAll);
router.get("/:id", ExecutiveController.getById);
router.post("/", upload.single("image"), ExecutiveController.create);
router.put("/:id", upload.single("image"), ExecutiveController.update);
router.delete("/:id", ExecutiveController.delete);

module.exports = router;
