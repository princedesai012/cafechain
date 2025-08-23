const express = require("express");
const router = express.Router();
const { register, login, logVisit, getUserProfile, updateUserProfile, changePassword, logout, getReferralChain, getRewardHistory, getVisitHistory, addFavoriteCafe, getFavoriteCafes, getLeaderboard  } = require("../controllers/userController");
const { validatePhoneNumber } = require("../middlewares/validate");
const { authenticateUserJWT } = require("../middlewares/auth");
const { uploadToCloudinary } = require("../middlewares/cloudinaryUpload");

// router.get("/", "Welcome");
router.post("/register", validatePhoneNumber, register);
router.post("/login", validatePhoneNumber, login);

router.post("/log-visit", authenticateUserJWT, logVisit);
router.get("/profile/:phone", authenticateUserJWT, getUserProfile);
router.put("/profile/:phone", authenticateUserJWT, uploadToCloudinary, updateUserProfile);
router.put("/profile/:phone/change-password", authenticateUserJWT, changePassword);
router.post("/logout", authenticateUserJWT, logout);

router.get("/referral-chain/:phone", authenticateUserJWT, getReferralChain);
router.get("/history/:phone", authenticateUserJWT, getVisitHistory); 
router.get("/rewards/:phone", authenticateUserJWT, getRewardHistory); 
router.post("/favorites/:phone", authenticateUserJWT, addFavoriteCafe);
router.get("/favorites/:phone", authenticateUserJWT, getFavoriteCafes);
router.get("/leaderboard", getLeaderboard); 

module.exports = router;