const africastalking = require("africastalking");
const express = require('express');
const router = express.Router();
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();


// Set your app credentials
const credentials = {
    apiKey: process.env.live_api_key,
    username: process.env.live_app_username,
};

// Initialize the SDK
const AfricasTalking = africastalking(credentials);

// Get the SMS service
const sms = AfricasTalking.SMS;

function sendMessage(phoneNumber, message) {
    const options = {
        to: [phoneNumber],
        message: message,
        from: process.env.live_sms_sender_id
    }

    sms.send(options)
        .then(console.log)
        .catch(console.log);
}

router.post('/', (req, res) => {
    // Read the variables sent via POST from our API
    console.log(req.body)
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    const inputs = text.split("*");
    let response = '';

    switch (inputs.length) {
        case 1:
            if (text == "") {
                response = `CON Welcome to Health Facility Finder
                1. Hospitals and Clinics
                2. Pharmacies
                3. Laboratories`;
            } else {
                response = `CON Enter your county (e.g Nairobi, Mombasa):`;
            }
            break;

        case 2: {
            const countyInput = inputs[1];

            response = `CON Enter your location (e.g. Zimmerman) or a nearby landmark (e.g. Moi Girls):`;

            // const countyInput = inputs[1];
            // const { corrected, confidence } = fuzzyMatchCounty(countyInput);
            // if (confidence < 0.75) {
            //     response = `CON County not recognized. Please re-enter your county:`;
            // } else {
            //     response = `CON Enter your location (e.g. Zimmerman) or a nearby landmark (e.g. Moi Girls):`;
            // }
            break;
        }

        case 3: {
            const locationOrLandmark = inputs[2];
            // Call Google Places Text Search API with locationOrLandmark in corrected county
            // For now, simulate multiple landmark matches
            const matches = ['Moi Girls, Kibera', 'Moi Girls, Nairobi West', 'Moi Girls, Kamukunji'];
            if (matches.length > 1) {
                const options = matches.map((place, index) => `${index + 1}. ${place}`).join('\n');
                response = `CON Please select your landmark:\n${options}`;
            } else {
                // Only one match, proceed to fetch facilities
                response = `END Facilities near ${locationOrLandmark} will be sent via SMS shortly.`;
                // Trigger backend SMS with facility details
            }
            break;
        }

        case 4: {
            const selectedIndex = parseInt(inputs[3], 10) - 1;
            if (isNaN(selectedIndex)) {
                response = `CON Invalid selection. Please enter a valid number.`;
            } else {
                // Use selectedIndex to identify the correct landmark
                response = `END Facilities near your selected landmark will be sent via SMS.`;
                // Trigger SMS logic
                sendMessage(phoneNumber, "AAR Health care");

            }
            break;
        }

        default:
            response = `END Invalid input. Please try again.`;
    }

    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);
});

module.exports = router;