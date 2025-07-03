const { getSession } = require("../utils/sessionStore");
const { findNearbyPlaces } = require("../utils/places.utils");

exports.findFacilities = async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  // Get session data
  const session = getSession(sessionId);
  if (!session.service || !session.county) {
    return res.status(400).json({ error: "Incomplete session data. Please complete all steps." });
  }

  // Use locationGeo or landmarkGeo
  let geo = session.locationGeo || session.landmarkGeo;
  if (!geo) {
    return res.status(400).json({ error: "No valid geolocation found in session." });
  }

  try {
    const places = await findNearbyPlaces(geo, session.service);

    if (places.length === 0) {
      return res.json({
        found: false,
        message: `No ${session.service}s found near your location.`,
      });
    }

    return res.json({
      found: true,
      geo,
      facilities: places,
    });
  } catch (error) {
    console.error("Places API error:", error.message);
    return res.status(500).json({ error: "Failed to fetch facilities." });
  }
};