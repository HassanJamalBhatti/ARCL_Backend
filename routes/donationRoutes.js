const express = require("express");
const router = express.Router();

const {
  createDonation,
  getAllDonations,
} = require("../controllers/donationController");

router.post("/", createDonation);        
router.get("/", getAllDonations);         

module.exports = router;
