const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController");
const { validatePhoneNumber } = require("../middlewares/validate");

router.post("/register", validatePhoneNumber, register);
router.post("/login", validatePhoneNumber, login);

module.exports = router;