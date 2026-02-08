const express = require("express");
const {
  getProfile,
  login,
  logout,
  registerUser
} = require("../controllers/user.controller");
const isLoggedIn = require("../middlewares/isLoggedIn.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/get-profile", isLoggedIn, getProfile);
router.post("/logout", isLoggedIn, logout);

module.exports = router;
