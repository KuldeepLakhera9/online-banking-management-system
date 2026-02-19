const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER LOGIC
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();
  res.redirect("/login");
});

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login");
});

// LOGIN LOGIC
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.send("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.send("Invalid credentials");
  }

  req.session.userId = user._id;
  res.redirect("/dashboard");
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
