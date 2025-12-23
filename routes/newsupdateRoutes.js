const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createNewsUpdate,
  getAllNewsUpdates,
  getNewsUpdateById,
  updateNewsUpdate,
  deleteNewsUpdate,
} = require("../controllers/newsupdateController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// CRUD routes
router.post("/", upload.single("image"), createNewsUpdate);
router.get("/", getAllNewsUpdates);
router.get("/:id", getNewsUpdateById);
router.put("/:id", upload.single("image"), updateNewsUpdate);
router.delete("/:id", deleteNewsUpdate);

module.exports = router;
