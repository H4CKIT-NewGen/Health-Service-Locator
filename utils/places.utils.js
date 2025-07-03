const axios = require("axios");

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Map your USSD service names to Google Places types
const SERVICE_TYPE_MAP = {
  hospital: "hospital",
  clinic: "doctor", // or "clinic" if available in your region
  pharmacy: "pharmacy",
  laboratory: "laboratory", // may need to use "doctor" or "health" for labs
  // Add more mappings as needed
};

function getPlaceType(service) {
  return SERVICE_TYPE_MAP[service.toLowerCase()];
}

// Haversine formula to calculate distance between two lat/lng points (in meters)
function getDistance(lat1, lng1, lat2, lng2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function findNearbyPlaces({ lat, lng }, service) {
  const placeType = getPlaceType(service);
  if (!placeType) throw new Error("Unsupported service type.");

  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  const response = await axios.get(url, {
    params: {
      location: `${lat},${lng}`,
      radius: 10000, // 10km radius
      type: placeType,
      key: GOOGLE_MAPS_API_KEY,
    },
  });

  // return response.data.results.map(place => ({
  //   name: place.name,
  //   address: place.vicinity,
  //   lat: place.geometry.location.lat,
  //   lng: place.geometry.location.lng,
  //   place_id: place.place_id,
  // }));

  // Add distance to each place, sort, and return top 5
  const places = response.data.results
    .map((place) => ({
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      place_id: place.place_id,
      distance: getDistance(
        lat,
        lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  return places;
}

module.exports = { findNearbyPlaces };