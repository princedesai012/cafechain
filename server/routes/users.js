const express = require("express");
const router = express.Router();
const { register, login, logVisit, getUserProfile, updateUserProfile, getReferralChain, getRewardHistory, getVisitHistory, addFavoriteCafe, getFavoriteCafes } = require("../controllers/userController");
const { validatePhoneNumber, validateRegistration, validateLogin } = require("../middlewares/validate");
const { authenticateUserJWT, requireEmailVerified } = require("../middlewares/auth");

// Health check route
router.get("/", (req, res) => {
    res.json({ message: "User API is working" });
});

// Authentication routes
router.post("/signup", validateRegistration, validatePhoneNumber, register);
router.post("/login", validateLogin, validatePhoneNumber, login);

// Protected routes that require authentication and email verification
router.post("/log-visit", authenticateUserJWT, requireEmailVerified, logVisit);
router.get("/profile/:phone", authenticateUserJWT, getUserProfile);
router.put("/profile/:phone", authenticateUserJWT, updateUserProfile);

router.get("/referral-chain/:phone", authenticateUserJWT, requireEmailVerified, getReferralChain);
router.get("/history/:phone", authenticateUserJWT, requireEmailVerified, getVisitHistory); 
router.get("/rewards/:phone", authenticateUserJWT, requireEmailVerified, getRewardHistory); 
router.post("/favorites/:phone", authenticateUserJWT, requireEmailVerified, addFavoriteCafe);
router.get("/favorites/:phone", authenticateUserJWT, getFavoriteCafes);

// Logout route
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;