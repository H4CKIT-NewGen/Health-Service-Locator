const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//File router paths
const testerRoute = require("./routes/testerRoute");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Routes
app.use("/api/test", testerRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
