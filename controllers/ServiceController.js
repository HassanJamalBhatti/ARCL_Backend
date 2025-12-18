const Service = require("../models/Services");

// GET all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE service
exports.createService = async (req, res) => {
  try {
    // Ensure required fields
    if (!req.body.mainTitle) {
      return res.status(400).json({ message: "mainTitle is required" });
    }
    
    const service = new Service({
      mainTitle: req.body.mainTitle,
      url: req.body.url || "",
      sections: req.body.sections || [],
      status: req.body.status || "Active",
      role: req.body.role || "Admin"
    });
    
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE service
exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id, 
      {
        $set: {
          mainTitle: req.body.mainTitle,
          url: req.body.url,
          sections: req.body.sections,
          status: req.body.status,
          role: req.body.role
        }
      }, 
      { new: true, runValidators: true }
    );
    
    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE service
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};