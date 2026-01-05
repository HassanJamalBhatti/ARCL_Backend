// controllers/ContactController.js
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

exports.submitContactForm = async (req, res) => {
  try {
    let { name, email, phone = "Not Provided", subject, message } = req.body;

    if (!subject || subject.trim() === "") {
      subject = "Website Contact Form";
    }

    // 1️⃣ Save to MongoDB
    await Contact.create({ name, email, phone, subject, message });

    // 2️⃣ Load Email Template
    const templatePath = path.join(__dirname, '../templates/contact-notification.html');
    let htmlContent = await fs.readFile(templatePath, 'utf8');

    const now = new Date();
    htmlContent = htmlContent
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{phone}}/g, phone)
      .replace(/{{subject}}/g, subject)
      .replace(/{{message}}/g, message.replace(/\n/g, '<br>'))
      .replace(/{{date}}/g, now.toLocaleDateString())
      .replace(/{{time}}/g, now.toLocaleTimeString());

    // 3️⃣ SMTP Transporter (TLS for cloud)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // box2135.bluehost.com
      port: 587,                   // Changed from 465 to 587
      secure: false,               // false for TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // allow self-signed certs
      },
    });

    // 4️⃣ Send Email
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Message: ${subject}`,
      html: htmlContent,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message, 
    });
  }
};
