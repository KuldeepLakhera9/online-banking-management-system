const express = require("express");
const app = express();

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

// Server start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
