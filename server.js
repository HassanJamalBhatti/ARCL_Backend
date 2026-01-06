require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const multer = require("multer");

const app = express();
connectDB();

// ================= MIDDLEWARES =================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // "https://arcl-frontend.vercel.app",
      // "https://arcl-frontend-lake.vercel.app",
      // "https://arcl.netlify.app/",
      // "arcl.org.pk",
      // "www.arcl.org.pk",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ================= STATIC FILES =================
// Serve uploaded files from "public/uploads" folder

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ================= MULTER SETUP =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ================= ROUTES =================

//service routes
const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);

// Therapy routes
const therapyRoutes = require("./routes/therapyRoutes");
app.use("/api/therapies", therapyRoutes);

// Gallery routes
const galleryRoutes = require("./routes/galleryRoutes");
app.use("/api/gallery", galleryRoutes);

// Governing Members routes
const governingRoutes = require("./routes/governingRoutes");
app.use("/api/governing", governingRoutes);

// Executive Team routes
const executiveRoutes = require("./routes/executiveRoutes");
app.use("/api/executive", executiveRoutes);

// Certifications routes
const certificationRoutes = require("./routes/certificationRoutes");
app.use("/api/certifications", certificationRoutes);

// Financial Audit Reports routes
const financialRoutes = require("./routes/financialRoutes");
app.use("/api/financial", financialRoutes);

// Newsletter routes
const newsletterRoutes = require("./routes/newsletterRoutes");
app.use("/api/newsletters", newsletterRoutes);

// User routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Add this at the top with your other requires
const newsupdateRoutes = require("./routes/newsupdateRoutes");
app.use("/api/newsupdate", newsupdateRoutes);

// Donation routes
const donationRoutes = require("./routes/donationRoutes");
app.use("/api/donations", donationRoutes);

// Contact Routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);


// ================= EXAMPLE UPLOAD ENDPOINT =================
app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= ERROR HANDLING =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server Error", error: err.message });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
