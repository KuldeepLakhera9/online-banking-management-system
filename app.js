const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const bankRoutes = require("./routes/bank");

// ================= MIDDLEWARE FIRST =================

// Set EJS as view engine
app.set("view engine", "ejs");

// Parse form data (THIS FIXES req.body)
app.use(express.urlencoded({ extended: true }));

// Session middleware (THIS FIXES req.session)
app.use(
  session({
    secret: "banking-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

// Static files
app.use(express.static("public"));

// ================= ROUTES AFTER MIDDLEWARE =================

// Auth routes
app.use(authRoutes);
app.use(bankRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ================= PROTECTED ROUTES =================

function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

app.get("/dashboard", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("dashboard", { user });
});

// ================= SERVER =================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
