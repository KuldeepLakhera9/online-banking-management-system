const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// AUTH MIDDLEWARE (route-level protection)
function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

// ------------------ DEPOSIT ------------------

// Deposit page
router.get("/deposit", isLoggedIn, (req, res) => {
  res.render("deposit");
});

// Deposit logic
router.post("/deposit", isLoggedIn, async (req, res) => {
  const { amount } = req.body;

  if (amount <= 0) {
    return res.send("Invalid deposit amount");
  }

  const user = await User.findById(req.session.userId);
  user.balance += Number(amount);
  await user.save();

  await Transaction.create({
    userId: user._id,
    type: "DEPOSIT",
    amount: Number(amount),
  });

  res.redirect("/dashboard");
});

// ------------------ WITHDRAW ------------------

// Withdraw page
router.get("/withdraw", isLoggedIn, (req, res) => {
  res.render("withdraw");
});

// Withdraw logic
router.post("/withdraw", isLoggedIn, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.session.userId);

  if (amount <= 0) {
    return res.send("Invalid withdrawal amount");
  }

  if (amount > user.balance) {
    return res.send("Insufficient balance");
  }

  user.balance -= Number(amount);
  await user.save();

  await Transaction.create({
    userId: user._id,
    type: "WITHDRAW",
    amount: Number(amount),
  });

  res.redirect("/dashboard");
});

router.get("/transactions", isLoggedIn, async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.session.userId,
  }).sort({ date: -1 });

  res.render("transactions", { transactions });
});

module.exports = router;
