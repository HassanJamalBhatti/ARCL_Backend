// controllers/ContactController.js
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone = "Not Provided", subject = "", message } = req.body;

    // 1️⃣ Save to MongoDB
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });
    await newContact.save();

    // 2️⃣ Read HTML email template
    const templatePath = path.join(
      __dirname,
      '../templates/contact-notification.html'
    );
    let htmlContent = await fs.readFile(templatePath, 'utf8');

    const now = new Date();
    htmlContent = htmlContent
      .replace(/{{name}}/g, name || '')
      .replace(/{{email}}/g, email || '')
      .replace(/{{phone}}/g, phone || '')
      .replace(/{{message}}/g, (message || '').replace(/\n/g, '<br>'))
      .replace(/{{date}}/g, now.toLocaleDateString())
      .replace(/{{time}}/g, now.toLocaleTimeString());

    // 3️⃣ SMTP Transporter - Try 465 SSL first, fallback to 587 TLS
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const secure = smtpPort === 465; // SSL if port 465, TLS otherwise

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000, // 15s
    });


    // 🔍 4️⃣ Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // 5️⃣ Mail options
    const mailOptions = {
      from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      html: htmlContent,
    };

    // 6️⃣ Send email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will contact you soon.',
    });

  } catch (error) {
    console.error("❌ EMAIL ERROR FULL:", error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Email sending failed',
    });
  }
};
