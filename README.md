# 🩺 Health Service Locator via USSD and SMS

A lightweight, offline-accessible system that helps Kenyan citizens locate nearby health facilities using any mobile phone—**no internet or smartphone required**.

---

## 📱 How It Works

Users interact with the system via **USSD menus** and receive health facility details via **SMS**. The system processes input intelligently, uses **Google Maps APIs** to find relevant hospitals and clinics, and communicates via the **Africa’s Talking API**.

---

## 👥 Target Audience

- Citizens across **Kenya**
- Users with **feature phones** or no internet
- Especially useful in **rural or underserved areas**

---

## 🧩 System Architecture

### Frontend: USSD & SMS (No App Needed)
- USSD: Step-by-step menu interactions
- SMS: Final results and service details

### Backend: Node.js (Express)
- Validates and processes user input
- Integrates with:
  - **Google Maps APIs** for geolocation and facility lookup
  - **Africa’s Talking API** for mobile communication

### External Services
- **Google Maps APIs**
  - Geocoding API
  - Places Text Search API
  - Places Nearby Search API
- **Africa’s Talking API**
  - USSD handling
  - SMS delivery

---

## 🔁 User Journey

1. User dials a USSD short code (e.g., `*123#`)
2. Prompted to enter their **county**
   - Fuzzy matching corrects misspellings (e.g., "Nairopi" → "Nairobi")
3. Prompted to enter:
   - A **specific location**, or
   - A **landmark** (e.g., school or market)
4. If multiple landmark results:
   - User selects from a list
5. The system returns top **nearby hospitals** via SMS

---

## 🚫 Error Handling

- Intelligent fuzzy matching of counties
- Retry prompts for ambiguous or invalid input
- Bypasses steps if results are obvious or minimal
- Graceful fallback if no hospitals found

---

## 🧰 Tech Stack

| Component            | Tool / Service                       |
|----------------------|--------------------------------------|
| Backend              | Node.js, Express                     |
| Communication        | Africa’s Talking API (USSD, SMS)     |
| Mapping & Search     | Google Maps APIs                     |
| Input Validation     | `string-similarity` NPM package      |
| Hosting              | Railway, Render, DigitalOcean, etc. |
| Caching (optional)   | Redis                                |

---

## 📂 Project Setup

### Prerequisites

- Node.js ≥ 18
- Africa’s Talking account (sandbox or live)
- Google Cloud API keys with Maps access

### Installation

```bash
git clone https://github.com/H4CKIT-NewGen/health-service-locator.git
cd health-service-locator
npm install
```

### Environment Variables

Create a `.env` file with the following:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
AFRICASTALKING_API_KEY=your_africas_talking_api_key
AFRICASTALKING_USERNAME=sandbox_or_live_username
SESSION_SECRET=your_session_secret
```

### Run Locally

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Please submit a pull request or open an issue.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

Have questions or want to collaborate? Reach out at [your-email@example.com](mailto:your-email@example.com).
