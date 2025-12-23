const Donation = require("../models/donationModel");

exports.createDonation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const donation = await Donation.create({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Donation request submitted successfully",
      donation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// (Optional) Admin: get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
