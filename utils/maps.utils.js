const axios = require("axios");
require("dotenv").config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Get lat/lng coordinates for a given location using Google Geocoding API
 */
async function geocodeLocation(locationName) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    const response = await axios.get(url, {
      params: {
        address: locationName,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    const result = response.data.results[0];
    if (!result) return null;

    console.log("Geocoding result:", result);

    const { lat, lng } = result.geometry.location;
    return { lat, lng, formattedAddress: result.formatted_address };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
}

module.exports = { geocodeLocation };
