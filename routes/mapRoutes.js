// routes/mapsRoutes.js
const express = require("express");
const router = express.Router();
const mapsController = require("../controllers/maps.controller");
const findFacilitiesController = require("../controllers/findFacilities");


router.get("/geocode", mapsController.getCoordinates);

router.post("/set-service", mapsController.setService);

// New step-by-step USSD endpoints
router.post("/check-county", mapsController.checkCounty);
router.post("/check-location", mapsController.checkLocation);
router.post("/check-landmark", mapsController.checkLandmark);

router.post("/find-facilities", findFacilitiesController.findFacilities);


// Optional: Get session data for debugging
router.get("/session", mapsController.getSessionData);

module.exports = router;
