const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// Optional: add multer upload for news image
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.post("/", upload.single("image"), (req, res, next) => {
  if (req.file) req.body.image = `/uploads/${req.file.filename}`;
  next();
}, newsController.createNews);
router.put("/:id", upload.single("image"), (req, res, next) => {
  if (req.file) req.body.image = `/uploads/${req.file.filename}`;
  next();
}, newsController.updateNews);
router.delete("/:id", newsController.deleteNews);

module.exports = router;
