const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

// Set EJS as view engine
app.set("view engine", "ejs");

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Static files (CSS)
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// Server start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
