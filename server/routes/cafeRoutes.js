const express = require("express");
const router = express.Router();
const { getCafes } = require("../controllers/cafeController");

// Public route to fetch cafes
router.get("/", getCafes);

module.exports = router;