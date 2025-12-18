const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const FinancialController = require("../controllers/financialController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD routes
router.get("/", FinancialController.getAll);
router.get("/:id", FinancialController.getById);
router.post("/", upload.single("pdf"), FinancialController.create);
router.put("/:id", upload.single("pdf"), FinancialController.update);
router.delete("/:id", FinancialController.delete);

module.exports = router;
