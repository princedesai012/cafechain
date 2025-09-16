const express = require("express");
const router = express.Router();
// Ensure all these functions are correctly exported from the controller
const { 
    getPendingClaims, 
    approveClaim, 
    rejectClaim, 
    getPendingCafes,
    getAllUsers,
    getUserProfile,
    getAllCafes,
    getCafeDetails,
    approveCafe,
    rejectCafe
} = require("../controllers/adminController");

// --- Reward Claim Routes ---
router.get("/claims/pending", getPendingClaims);
router.put("/claims/:id/approve", approveClaim);
router.put("/claims/:id/reject", rejectClaim);

router.get("/users/all", getAllUsers);
router.get("/users/:id", getUserProfile);

// ✅ FIXED: Place the specific 'pending' route before the generic ':id' route
router.get("/cafes/pending", getPendingCafes);
router.get("/cafes/all", getAllCafes);
router.get("/cafes/:id", getCafeDetails);

// --- Cafe Approval Routes ---
router.put("/cafes/:id/approve", approveCafe);
router.delete("/cafes/:id/reject", rejectCafe); 

module.exports = router;