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
// This route handler for GET /claims/pending must be a valid function.
router.get("/claims/pending", getPendingClaims);
router.put("/claims/:id/approve", approveClaim);
router.put("/claims/:id/reject", rejectClaim);

router.get("/users/all", getAllUsers);
router.get("/users/:id", getUserProfile);

router.get("/cafes/all", getAllCafes);
router.get("/cafes/:id", getCafeDetails);

// --- Cafe Approval Routes ---
router.get("/cafes/pending", getPendingCafes);
router.put("/cafes/:id/approve", approveCafe);
router.delete("/cafes/:id/reject", rejectCafe); 

module.exports = router;