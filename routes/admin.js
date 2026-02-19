const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isAdmin = require("../middleware/admin");

// View all users
router.get("/admin/users", isAdmin, async (req, res) => {
  const users = await User.find();
  res.render("admin-users", { users });
});

// Block / Unblock user
router.post("/admin/toggle-block/:id", isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.redirect("/admin/users");
});

module.exports = router;
