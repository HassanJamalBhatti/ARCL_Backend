// controllers/ContactController.js
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone = "Not Provided", subject = "", message } = req.body;

    // 1. Save to MongoDB
    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();

    // 2. Read HTML template file
    const templatePath = path.join(__dirname, '../templates/contact-notification.html');
    let htmlContent = await fs.readFile(templatePath, 'utf8');

    const now = new Date();
    htmlContent = htmlContent
      .replace(/{{name}}/g, name || '')
      .replace(/{{email}}/g, email || '')
      .replace(/{{phone}}/g, phone || '')
      .replace(/{{message}}/g, (message || '').replace(/\n/g, '<br>'))
      .replace(/{{date}}/g, now.toLocaleDateString())
      .replace(/{{time}}/g, now.toLocaleTimeString());

    // 4. Send email with HTML template
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Website Contact Form" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Message from ${name}`,
      html: htmlContent  // Use the HTML template content
    };

    await transporter.sendMail(mailOptions);

    // 5. Success response
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};