const express = require("express");
const router = express.Router();
const { getCafes, getCafeById } = require("../controllers/cafeController");


router.get("/", getCafes);
router.get("/:id", getCafeById);

module.exports = router;