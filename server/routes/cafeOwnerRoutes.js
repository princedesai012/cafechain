const express = require("express");
const router = express.Router();
const { 
  requestCafeEmailOTP, 
  verifyCafeEmailOTP,
  loginCafe,
  addCafeImage,
  deleteCafeImage,
  // setupProfile,
  getLoyaltyProgramMetrics,
  getCafeDashboardAnalytics, // Kept from your old file
  initiateRedemption,      // Kept from your old file
  verifyRedemption         // Kept from your old file
} = require("../controllers/cafeOwnerController");

const { authenticateCafeOwnerJWT } = require("../middlewares/cafeAuth");

// --- Onboarding and Authentication Routes ---
router.post("/register/request-otp", requestCafeEmailOTP);
router.post("/register/verify-otp", verifyCafeEmailOTP);
router.post("/login", loginCafe);


// --- Profile & Image Management (Protected) ---
router.post("/images/add", authenticateCafeOwnerJWT, addCafeImage);
router.post("/images/delete", authenticateCafeOwnerJWT, deleteCafeImage);
// CRITICAL CHANGE: This route is now protected by our new, temporary onboarding middleware.
// This ensures only users who have just verified their OTP can access this.
// router.put("/setup-profile", authenticateOnboardingJWT, setupProfile);

// --- Analytics (Protected by permanent login) ---
// This route remains unchanged and requires a fully logged-in and approved cafe owner.
router.get("/analytics/summary", authenticateCafeOwnerJWT, getCafeDashboardAnalytics);

// --- Rewards & Redemption (Protected by permanent login) ---
// These routes also remain unchanged.
router.post("/redemption/initiate", authenticateCafeOwnerJWT, initiateRedemption);
router.post("/redemption/verify", authenticateCafeOwnerJWT, verifyRedemption);
router.get("/analytics/loyalty", authenticateCafeOwnerJWT, getLoyaltyProgramMetrics);

module.exports = router;