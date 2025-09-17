const Cafe = require("../models/Cafe");
const User = require("../models/User");
const OTP = require("../models/OTP");
const PendingCafe = require("../models/PendingCafe");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const VisitLog = require("../models/VisitLog");
const RewardClaim = require("../models/RewardClaim");
const RewardTransaction = require("../models/RewardTransaction");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const cloudinary = require("../config/cloudinary"); 

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateReferralCode = () => crypto.randomBytes(3).toString("hex");

// 1. Request OTP for Registration
exports.requestCafeEmailOTP = async (req, res) => {
  const { email, ownerPhone, cafePhone, password } = req.body;

  if (!email || !ownerPhone || !cafePhone || !password) {
    return res.status(400).json({ error: "All required fields must be provided." });
  }

  try {
    // Duplication checks
    const searchCriteria = {
      $or: [
        { email: email },
        { ownerPhone: { $in: [ownerPhone, cafePhone] } },
        { cafePhone: { $in: [ownerPhone, cafePhone] } }
      ]
    };

    const existingCafe = await Cafe.findOne(searchCriteria);
    if (existingCafe) {
      res.status(409).json({ error: "An account with this email or one of these phone numbers is already registered." });
      return;
    }

    const pendingApplication = await PendingCafe.findOne(searchCriteria);
    if (pendingApplication) {
      res.status(409).json({ error: "An application with this email or one of these phone numbers is already under approval." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and metadata (include password as plain text)
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    const metadata = { ...req.body, hashedPassword }; // Keep plain password

    await OTP.findOneAndUpdate(
      { email },
      { email, otp, type: 'email', metadata },
      { new: true, upsert: true }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CafeChain Account Verification',
      html: `<p>Your OTP for registering your cafe is: <strong>${otp}</strong>. It expires in 10 minutes. Do not share this code.</p>`
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent to your email.",
      email: email
    });
  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ error: "Server error during registration check." });
  }
};

// 2. Verify OTP and Create a Temporary Session (create PendingCafe)
exports.verifyCafeEmailOTP = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const otpDocument = await OTP.findOne({ email, otp, type: 'email' });
    if (!otpDocument) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Now, otpDocument.metadata contains 'hashedPassword', which matches the model.
    const newPendingCafe = new PendingCafe(otpDocument.metadata);
    await newPendingCafe.save(); // This will no longer cause a validation error.

    await OTP.deleteOne({ _id: otpDocument._id });

    res.status(201).json({ message: "Email verified! Your application has been submitted for approval." });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    res.status(500).json({ error: "Server error during verification." });
  }
};

// 3. Login for cafe owner
exports.loginCafe = async (req, res) => {
  // ✅ DEBUG: Add this console log to check your environment variable
  console.log("JWT Secret being used:", process.env.JWT_SECRET);

  const { email, password } = req.body;
  try {
    const cafe = await Cafe.findOne({ email });
    if (!cafe) {
      return res.status(404).json({ error: "No account found with this email." });
    }
    const isMatch = await cafe.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password." });
    }
    if (cafe.status !== 'active') {
      return res.status(403).json({ error: `This cafe's account is not active. Current status: '${cafe.status}'.` });
    }

    // This line will crash if the JWT_SECRET is undefined
    const token = jwt.sign(
      { id: cafe._id, name: cafe.name, role: 'cafe' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      cafe: { id: cafe._id, name: cafe.name, email: cafe.email, status: cafe.status }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
};

// 4. Add a new image to a cafe's gallery
exports.addCafeImage = async (req, res) => {
  const { image } = req.body;
  // The middleware already fetched the full cafe object and attached it to req.user
  const cafe = req.user;

  if (!image) {
      return res.status(400).json({ error: "Image data is required." });
  }

  try {
      // No need to find the cafe again, we already have it.
      
      if (cafe.images.length >= 5) {
          return res.status(400).json({ error: "Cannot add more than 5 images." });
      }

      // Sanitize the cafe name to create a safe folder name.
      const safeCafeName = cafe.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

      // Upload to Cloudinary in a cafe-specific folder
      const result = await cloudinary.uploader.upload(image, {
          folder: `CafeChain/Cafe/${safeCafeName}_${cafe._id}`,
          transformation: [
              { width: 1024, height: 768, crop: 'limit' },
              { quality: 'auto:good' }
          ]
      });

      cafe.images.push({
          url: result.secure_url,
          public_id: result.public_id
      });

      await cafe.save();

      res.status(200).json({
          message: "Image added successfully!",
          images: cafe.images
      });

  } catch (error) {
      console.error("Add Cafe Image Error:", error);
      res.status(500).json({ error: "Server error while adding image." });
  }
};

// 5. Delete an image from a cafe's gallery
exports.deleteCafeImage = async (req, res) => {
  const { public_id } = req.body;
  // --- The middleware has already found the cafe for you! ---
  const cafe = req.user;

  if (!public_id) {
      return res.status(400).json({ error: "Image public_id is required." });
  }

  try {
      // No need to find the cafe again, the middleware already did.

      const imageExists = cafe.images.some(img => img.public_id === public_id);
      if (!imageExists) {
          return res.status(404).json({ error: "Image not found in your gallery." });
      }

      await cloudinary.uploader.destroy(public_id);

      cafe.images = cafe.images.filter(img => img.public_id !== public_id);
      await cafe.save();

      res.status(200).json({
          message: "Image deleted successfully!",
          images: cafe.images
      });

  } catch (error) {
      console.error("Delete Cafe Image Error:", error);
      res.status(500).json({ error: "Server error while deleting image." });
  }
};


exports.getCafeDashboardAnalytics = async (req, res) => {
  try {
    // The middleware `authenticateCafeOwnerJWT` already finds the cafe
    // and attaches it as `req.user`. So, `req.user._id` is the cafe's ID.
    const cafeId = req.user._id;

    // No need to find the cafe again, we already have its ID.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Use the cafeId directly in your queries.
    const totalVisits = await VisitLog.countDocuments({ cafeId: cafeId });

    const redeemedClaimsToday = await RewardClaim.find({
      cafe: cafeId, // In RewardClaim schema, the field is named 'cafe'
      status: "approved",
      createdAt: { $gte: startOfToday },
    });

    const pointsRedeemedToday = redeemedClaimsToday.reduce(
      (sum, claim) => sum + claim.amount,
      0
    );

    res.status(200).json({
      totalCustomerVisits: totalVisits,
      pointsRedeemedToday,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ error: "Server error fetching analytics." });
  }
};

exports.initiateRedemption = async (req, res) => {
  const { customerPhone, pointsToRedeem } = req.body;
  const cafe = req.user;

  // ✅ Convert pointsToRedeem to a number right away.
  const pointsToRedeemNum = parseInt(pointsToRedeem, 10);

  if (!customerPhone || !pointsToRedeemNum || pointsToRedeemNum <= 0) {
    return res.status(400).json({ error: "Valid customer phone and a positive number of points are required." });
  }

  try {
    const customer = await User.findOne({ phone: customerPhone });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const cafePoints = customer.points.find(p => p.cafeId.equals(cafe._id));
    const currentPoints = cafePoints ? cafePoints.totalPoints : 0;

    // ✅ CRITICAL FIX: Compare numbers and provide a detailed error message.
    if (!cafePoints || currentPoints < pointsToRedeemNum) {
      return res.status(400).json({
        error: `Customer has insufficient points. They have ${currentPoints} points but tried to redeem ${pointsToRedeemNum}.`
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    await OTP.findOneAndUpdate(
      { email: customer.email },
      {
        email: customer.email,
        otp,
        type: 'redemption',
        // ✅ Use the numeric value in the metadata
        metadata: { cafeId: cafe._id, userId: customer._id, points: pointsToRedeemNum }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `CafeChain Points Redemption OTP`,
      html: `<p>Your OTP to redeem ${pointsToRedeemNum} points at ${cafe.name} is: <strong>${otp}</strong>. It expires in 10 minutes. Do not share this code.</p>`
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to customer's email.", customerEmail: customer.email });
  } catch (error) {
    console.error("Redemption initiation error:", error);
    res.status(500).json({ error: "Server error during redemption initiation." });
  }
};

exports.verifyRedemption = async (req, res) => {
  const { otp, customerEmail } = req.body;

  if (!otp || !customerEmail) {
    res.status(400).json({ error: "OTP and customer email are required." });
    return;
  }

  try {
    const otpDocument = await OTP.findOne({ email: customerEmail, otp, type: 'redemption' });
    if (!otpDocument) {
      res.status(400).json({ error: "Invalid or expired OTP." });
      return;
    }
    const { cafeId, userId, points } = otpDocument.metadata;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Customer user not found." });
      return;
    }
    const cafePoints = user.points.find(p => p.cafeId.equals(cafeId));
    if (!cafePoints || cafePoints.totalPoints < points) {
      res.status(400).json({ error: "Not enough points to redeem." });
      return;
    }
    cafePoints.totalPoints -= points;
    user.markModified('points');
    await user.save();

    const newRewardTransaction = new RewardTransaction({
      userId: user._id,
      cafeId,
      type: "redeem",
      points: -points,
      description: `Redeemed ${points} points at the cafe.`
    });
    await newRewardTransaction.save();

    await OTP.deleteOne({ _id: otpDocument._id });

    res.status(200).json({ message: "Points redeemed successfully!" });
    return;
  } catch (error) {
    console.error("Redemption verification error:", error);
    res.status(500).json({ error: "Server error during redemption verification." });
    return;
  }
};

exports.getLoyaltyProgramMetrics = async (req, res) => {

  try {
    const cafeId = req.user._id;
    // --- Timeframes ---
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);


// 1. Points Redeemed Today & Number of Transactions Today

    const todaysRedemptions = await RewardClaim.find({
      cafe: cafeId,
      status: "approved",
      createdAt: { $gte: startOfToday },
    });

    const pointsRedeemedToday = todaysRedemptions.reduce(
      (sum, claim) => sum + claim.amount, 0
    );
    const redemptionTransactionsToday = todaysRedemptions.length;
    // 2. Redemption Rate (Monthly)

    const monthlyRedemptions = await RewardClaim.countDocuments({
      cafe: cafeId,
      status: "approved",
      createdAt: { $gte: startOfMonth },
    });
    const monthlyVisits = await VisitLog.countDocuments({
      cafe: cafeId,
      createdAt: { $gte: startOfMonth },
    });

    // Avoid division by zero
    const redemptionRate = monthlyVisits > 0
      ? ((monthlyRedemptions / monthlyVisits) * 100).toFixed(1)
      : 0;
    // 3. Average Points Per Transaction (Today)

    const avgPointsPerTransaction = redemptionTransactionsToday > 0
      ? (pointsRedeemedToday / redemptionTransactionsToday).toFixed(1)
      : 0;
    // --- Send Response ---
    res.status(200).json({
      pointsRedeemedToday,
      redemptionRate,
      avgPointsPerTransaction,
    });
  } catch (error) {
    console.error("Loyalty metrics fetch error:", error);
    res.status(500).json({ error: "Server error fetching loyalty metrics." });
  }
};  