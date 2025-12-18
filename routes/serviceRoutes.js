const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/ServiceController");

// GET all services
router.get("/", serviceController.getServices);

// GET single service
router.get("/:id", serviceController.getServiceById);

// CREATE service
router.post("/", serviceController.createService);

// UPDATE service
router.put("/:id", serviceController.updateService);

// DELETE service
router.delete("/:id", serviceController.deleteService);

module.exports = router;