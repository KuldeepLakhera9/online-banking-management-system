const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* ================= REGISTER ================= */

// Register page
router.get("/register", (req, res) => {
  res.render("register", { error: req.query.error });
});

// Register logic
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.redirect("/register?error=All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.redirect("/register?error=Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.redirect("/login?success=Account created successfully");
});

/* ================= LOGIN ================= */

// Login page
router.get("/login", (req, res) => {
  res.render("login", {
    error: req.query.error || null,
    success: req.query.success || null,
  });
});

// Login logic
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/login?error=All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.redirect("/login?error=User not found");
  }

  if (user.isBlocked) {
    return res.redirect("/login?error=Your account is blocked");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.redirect("/login?error=Invalid credentials");
  }

  req.session.userId = user._id;
  res.redirect("/dashboard");
});

/* ================= LOGOUT ================= */

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login?success=Logged out successfully");
  });
});

module.exports = router;
