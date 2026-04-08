// authRoute.js
const express = require("express");
const router = express.Router();
const { register, login, logout, getMe, updateProfile, updatePassword, forgotPassword, resetPassword } = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMe);
router.put("/me/update", isAuthenticated, updateProfile);
router.put("/password/update", isAuthenticated, updatePassword);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

module.exports = router;
