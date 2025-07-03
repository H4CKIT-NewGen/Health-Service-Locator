const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//File router paths
const testerRoute = require("./routes/testerRoute");
const ussdRoute = require("./routes/ussd");


// Routes
app.use("/api/test", testerRoute);
app.use("/ussd", ussdRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
