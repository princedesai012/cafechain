const express = require("express");
const router = express.Router();
const { register, login, logVisit, getUserProfile, updateUserProfile, getReferralChain, getRewardHistory, getVisitHistory } = require("../controllers/userController");
const { validatePhoneNumber } = require("../middlewares/validate");
const { authenticateUserJWT } = require("../middlewares/auth");

// router.get("/", "Welcome");
router.post("/register", validatePhoneNumber, register);
router.post("/login", validatePhoneNumber, login);

router.post("/log-visit", authenticateUserJWT, logVisit);
router.get("/profile/:phone", authenticateUserJWT, getUserProfile);
router.put("/profile/:phone", authenticateUserJWT, updateUserProfile);

router.get("/referral-chain/:phone", authenticateUserJWT, getReferralChain);
router.get("/history/:phone", authenticateUserJWT, getVisitHistory); 
router.get("/rewards/:phone", authenticateUserJWT, getRewardHistory); 

module.exports = router;