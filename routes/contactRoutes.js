// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactController');

router.post('/contact', contactController.submitContactForm);

module.exports = router;