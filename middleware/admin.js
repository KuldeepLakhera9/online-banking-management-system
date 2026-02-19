const User = require("../models/User");

async function isAdmin(req, res, next) {
  const user = await User.findById(req.session.userId);

  if (!user || user.role !== "ADMIN") {
    return res.send("Access Denied: Admins only");
  }

  next();
}

module.exports = isAdmin;
