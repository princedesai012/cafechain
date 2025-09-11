// server/routes/cafeOwnerRoutes.js
const express = require("express");
const router = express.Router();
const { 
  requestCafeEmailOTP, 
  verifyCafeEmailOTP, 
  loginCafe, 
  setupProfile,
  getCafeDashboardAnalytics,
  initiateRedemption,
  verifyRedemption
} = require("../controllers/cafeOwnerController");
const { authenticateCafeOwnerJWT } = require("../middlewares/cafeAuth");

// Onboarding and Auth
router.post("/register/request-otp", requestCafeEmailOTP);
router.post("/register/verify-otp", verifyCafeEmailOTP);
router.post("/login", loginCafe);

// Profile Management (Protected)
router.put("/setup-profile", authenticateCafeOwnerJWT, setupProfile);

// Analytics (Protected)
router.get("/analytics/summary", authenticateCafeOwnerJWT, getCafeDashboardAnalytics);

// Rewards & Redemption (Protected)
router.post("/redemption/initiate", authenticateCafeOwnerJWT, initiateRedemption);
router.post("/redemption/verify", authenticateCafeOwnerJWT, verifyRedemption);

module.exports = router;