const express = require("express");
const router = express.Router();
const therapyController = require("../controllers/therapyController");

router.get("/", therapyController.getTherapies);
router.get("/:id", therapyController.getTherapyById);
router.post("/", therapyController.createTherapy);
router.put("/:id", therapyController.updateTherapy);
router.delete("/:id", therapyController.deleteTherapy);

module.exports = router;
