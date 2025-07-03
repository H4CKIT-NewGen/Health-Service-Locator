// // controllers/maps.controller.js
// const { geocodeLocation } = require("../utils/maps.utils");
// const {
//   setSession,
//   getSession,
//   clearSession,
// } = require("../utils/sessionStore");

// exports.getCoordinates = async (req, res) => {
//   const { county, location } = req.query;
//   if (!county) return res.status(400).json({ error: "County is required" });

//   // If location is provided, search for "location,county", else just "county"
//   const searchQuery = location ? `${location},${county}` : county;

//   const geo = await geocodeLocation(searchQuery);
//   if (!geo) return res.status(404).json({ error: "Location not found" });

//   return res.json(geo);
// };


// // Step 2: Check county
// exports.checkCounty = async (req, res) => {
//   const { county } = req.body;
//   if (!county) return res.status(400).json({ error: "County is required" });

//   const geo = await geocodeLocation(county);
//   if (!geo) {
//     // End USSD session with error
//     return res.json({ endSession: true, message: "County doesn't exist" });
//   }

//   // Store county and geo in session/state as needed
//   return res.json({ endSession: false, county, geo });
// };

// // Step 3a: Check location (ward)
// exports.checkLocation = async (req, res) => {
//   const { county, location } = req.body;
//   if (!county || !location) {
//     return res.status(400).json({ error: "County and location are required" });
//   }

//   const geo = await geocodeLocation(`${location},${county}`);
//   if (!geo) {
//     return res.json({ endSession: true, message: "Ward doesn't exist" });
//   }

//   // Store location and geo in session/state as needed
//   return res.json({ endSession: false, location, geo });
// };

// // Step 3b: Check landmark
// exports.checkLandmark = async (req, res) => {
//   const { county, landmark } = req.body;
//   if (!county || !landmark) {
//     return res.status(400).json({ error: "County and landmark are required" });
//   }

//   const geo = await geocodeLocation(`${landmark},${county}`);
//   if (!geo) {
//     return res.json({ endSession: true, message: "Landmark doesn't exist" });
//   }

//   // Store landmark and geo in session/state as needed
//   return res.json({ endSession: false, landmark, geo });
// };

// const { geocodeLocation } = require("../utils/maps.utils");
// // Dummy function for demonstration. Replace with your real implementation.
// const getFacilitiesNearby = async (service, lat, lng, county) => {
//   // TODO: Query your DB for facilities of type `service` near (lat, lng) in `county`
//   return [
//     { name: "Sample Hospital", type: service, lat, lng, county }
//   ];
// };

// exports.findFacilities = async (req, res) => {
//   const { service, county, location, landmark } = req.body;

//   if (!service || !county) {
//     return res.status(400).json({ error: "Service and county are required" });
//   }
//   if (!location && !landmark) {
//     return res.status(400).json({ error: "Either location or landmark is required" });
//   }

//   // Build the search query for geocoding
//   const searchQuery = location
//     ? `${location},${county}`
//     : `${landmark},${county}`;

//   // Get geolocation
//   const geo = await geocodeLocation(searchQuery);
//   if (!geo) return res.status(404).json({ error: "Location not found" });

//   // Fetch facilities of the given type near the geolocation
//   const facilities = await getFacilitiesNearby(service, geo.lat, geo.lng, county);

//   return res.json({ geo, facilities });
// };


const { geocodeLocation } = require("../utils/maps.utils");
const {
  setSession,
  getSession,
  clearSession,
} = require("../utils/sessionStore");

// Step 1: Store service
exports.setService = (req, res) => {
  const { sessionId, service } = req.body;
  if (!sessionId || !service) {
    return res.status(400).json({ error: "Session ID and service are required" });
  }
  setSession(sessionId, { service });
  return res.json({ endSession: false, message: "Service stored", service });
};

// Step 2: Check county and store
exports.checkCounty = async (req, res) => {
  const { sessionId, county } = req.body;
  if (!sessionId || !county) {
    return res.status(400).json({ error: "Session ID and county are required" });
  }

  const geo = await geocodeLocation(county);
  if (!geo) {
    clearSession(sessionId);
    return res.json({ endSession: true, message: "County doesn't exist" });
  }

  setSession(sessionId, { county, countyGeo: geo });
  return res.json({ endSession: false, county, geo });
};

// Step 3a: Check location (ward) and store
exports.checkLocation = async (req, res) => {
  const { sessionId, county, location } = req.body;
  if (!sessionId || !county || !location) {
    return res.status(400).json({ error: "Session ID, county and location are required" });
  }

  const geo = await geocodeLocation(`${location},${county}`);
  if (!geo) {
    clearSession(sessionId);
    return res.json({ endSession: true, message: "Ward doesn't exist" });
  }

  setSession(sessionId, { location, locationGeo: geo });
  return res.json({ endSession: false, location, geo });
};

// Step 3b: Check landmark and store
exports.checkLandmark = async (req, res) => {
  const { sessionId, county, landmark } = req.body;
  if (!sessionId || !county || !landmark) {
    return res.status(400).json({ error: "Session ID, county and landmark are required" });
  }

  const geo = await geocodeLocation(`${landmark},${county}`);
  if (!geo) {
    clearSession(sessionId);
    return res.json({ endSession: true, message: "Landmark doesn't exist" });
  }

  setSession(sessionId, { landmark, landmarkGeo: geo });
  return res.json({ endSession: false, landmark, geo });
};

// Optional: Get session data (for debugging)
exports.getSessionData = (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "Session ID is required" });
  return res.json(getSession(sessionId));
};

exports.getCoordinates = async (req, res) => {
    const { county, location } = req.query;
    if (!county) return res.status(400).json({ error: "County is required" });
  
    // If location is provided, search for "location,county", else just "county"
    const searchQuery = location ? `${location},${county}` : county;
  
    const geo = await geocodeLocation(searchQuery);
    if (!geo) return res.status(404).json({ error: "Location not found" });
  
    return res.json(geo);
  };