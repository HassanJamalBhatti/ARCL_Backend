const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createNewsletter,
  getAllNewsletters,
  getNewsletterById,
  updateNewsletter,
  deleteNewsletter,
} = require("../controllers/newsletterController");

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "pdf", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

router.post("/", uploadFields, createNewsletter);
router.get("/", getAllNewsletters);
router.get("/:id", getNewsletterById);
router.put("/:id", uploadFields, updateNewsletter);
router.delete("/:id", deleteNewsletter);

module.exports = router;
