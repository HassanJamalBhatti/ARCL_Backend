// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "Not Provided" },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  formType: { type: String, default: "ContactUs" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);