const express = require("express");
const router = express.Router();
const multer = require("multer");
const CertificationController = require("../controllers/certificationController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.get("/", CertificationController.getAll);
router.get("/:id", CertificationController.getById);
router.post("/", upload.fields([{ name: "image" }, { name: "pdf" }]), CertificationController.create);
router.put("/:id", upload.fields([{ name: "image" }, { name: "pdf" }]), CertificationController.update);
router.delete("/:id", CertificationController.delete);

module.exports = router;
