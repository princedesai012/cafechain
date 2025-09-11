// server/controllers/cafeOwnerController.js
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const VisitLog = require("../models/VisitLog"); // new import
const RewardClaim = require("../models/RewardClaim");
const RewardTransaction = require("../models/RewardTransaction"); // new import
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const { uploadToCloudinary } = require("../middlewares/cloudinaryUpload"); // Make sure this is imported

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const generateReferralCode = () => crypto.randomBytes(3).toString("hex");

exports.requestCafeEmailOTP = async (req, res) => {
    const { name, phone, password, email, cafeName, cafeAddress } = req.body;

    if (!name || !phone || !password || !email || !cafeName) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: "A user with this phone number already exists." });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "This email is already in use." });
        }

        // Generate a 6-digit OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Save the OTP temporarily
        await OTP.findOneAndUpdate(
            { email },
            { email, otp, type: 'email', phone, metadata: { name, password, cafeName, cafeAddress } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        // Send the email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'CafeChain Cafe Account Verification',
            html: `<p>Your OTP for CafeChain cafe account verification is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to your email.", email });

    } catch (error) {
        console.error("Request OTP error:", error);
        res.status(500).json({ error: "Server error during OTP request." });
    }
};

exports.verifyCafeEmailOTP = async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).json({ error: "OTP and email are required." });
    }

    try {
        const otpDocument = await OTP.findOne({ email, otp, type: 'email' });
        if (!otpDocument) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        // Retrieve the temporary registration data from the OTP document
        const { name, phone, password, cafeName, cafeAddress } = otpDocument.metadata;

        const hashedPassword = await bcrypt.hash(password, 10);
        const securePhoneId = `${phone}-${Math.floor(100 + Math.random() * 900)}`;

        // Create the new cafe owner user
        const newCafeOwner = new User({
            name,
            phone,
            password: hashedPassword,
            email,
            isEmailVerified: true,
            securePhoneId,
            referralCode: generateReferralCode()
        });
        await newCafeOwner.save();

        // Create the cafe entry with a 'pending' status
        const newCafe = new Cafe({
            name: cafeName,
            address: cafeAddress,
            phone,
            ownerId: newCafeOwner._id,
            cafeCode: newCafeOwner.referralCode,
            status: 'pending'
        });
        await newCafe.save();

        // Clean up the OTP document
        await OTP.deleteOne({ email, otp, type: 'email' });

        // Generate JWT token for the new cafe owner
        const token = jwt.sign(
            { id: newCafeOwner._id, phone: newCafeOwner.phone, role: 'cafeOwner' },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        res.status(201).json({
            message: "Cafe registered and verified successfully! Awaiting admin approval.",
            cafe: {
                name: newCafe.name,
                status: newCafe.status
            },
            token
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ error: "Server error during verification." });
    }
};

exports.loginCafe = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ error: "Phone and password are required." });
    }

    try {
        // Find the user with the provided phone number
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the user is a cafe owner and if the cafe is active
        const cafe = await Cafe.findOne({ ownerId: user._id });
        if (!cafe) {
            return res.status(403).json({ error: "This account is not a registered cafe owner." });
        }

        if (cafe.status !== 'active') {
            return res.status(403).json({ error: `Cafe status is "${cafe.status}". Awaiting admin approval.` });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password." });
        }

        // Generate JWT token with user ID, phone, and role
        const token = jwt.sign(
            { id: user._id, phone: user.phone, role: 'cafeOwner' },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                name: user.name,
                phone: user.phone,
                cafeId: cafe._id,
                cafeName: cafe.name
            }
        });

    } catch (error) {
        console.error("Cafe login error:", error);
        res.status(500).json({ error: "Server error." });
    }
};


exports.setupProfile = async (req, res) => {
  const { name, address, phone, galleryImages, features, rewardPolicies } = req.body;
  const ownerId = req.user._id; // Extracted from JWT token

  try {
    const cafe = await Cafe.findOneAndUpdate(
      { ownerId, status: 'pending' },
      { 
        name, 
        address, 
        phone, 
        gallery: galleryImages, // Save the array of image URLs to the gallery field
        features, 
        rewardPolicies, 
        status: 'active' 
      },
      { new: true, runValidators: true }
    );

    if (!cafe) {
      return res.status(404).json({ error: "Cafe not found or already active." });
    }

    res.status(200).json({
      message: "Cafe profile setup and approved successfully.",
      cafe
    });
    
  } catch (error) {
    console.error("Cafe profile setup error:", error);
    res.status(500).json({ error: "Server error during profile setup." });
  }
};



exports.getCafeDashboardAnalytics = async (req, res) => {
    try {
      const ownerId = req.user._id; // from auth middleware
  
      const cafe = await Cafe.findOne({ ownerId });
      if (!cafe) {
        return res.status(404).json({ error: "Cafe not found." });
      }
  
      // Calculate start of today for filtering purposes
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
  
      // Get total visits
      const totalVisits = await VisitLog.countDocuments({ cafeId: cafe._id });
  
      // Get total points redeemed today
      const redeemedClaimsToday = await RewardClaim.find({
        cafe: cafe._id,
        status: "approved",
        createdAt: { $gte: startOfToday },
      });
      
      // Sum the amount from today's approved claims to get total points redeemed
      const pointsRedeemedToday = redeemedClaimsToday.reduce((sum, claim) => sum + claim.amount, 0);
      
  
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
    const cafeOwnerId = req.user._id;

    if (!customerPhone || !pointsToRedeem) {
        return res.status(400).json({ error: "Customer phone and points are required." });
    }

    try {
        const cafe = await Cafe.findOne({ ownerId: cafeOwnerId });
        if (!cafe) {
            return res.status(404).json({ error: "Cafe not found." });
        }

        const customer = await User.findOne({ phone: customerPhone });
        if (!customer) {
            return res.status(404).json({ error: "Customer not found." });
        }

        // Check if the customer has enough points at this cafe
        const cafePoints = customer.points.find(p => p.cafeId.equals(cafe._id));
        if (!cafePoints || cafePoints.totalPoints < pointsToRedeem) {
            return res.status(400).json({ error: "Customer does not have enough points." });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Store OTP with redemption details
        await OTP.findOneAndUpdate(
            { email: customer.email },
            { 
                email: customer.email, 
                otp, 
                type: 'redemption', 
                metadata: { cafeId: cafe._id, userId: customer._id, points: pointsToRedeem }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: 'CafeChain Points Redemption OTP',
            html: `<p>Your OTP to redeem points at ${cafe.name} is: <strong>${otp}</strong>. It expires in 10 minutes. Do not share this code.</p>`
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
        return res.status(400).json({ error: "OTP and customer email are required." });
    }

    try {
        const otpDocument = await OTP.findOne({ email: customerEmail, otp, type: 'redemption' });
        if (!otpDocument) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        const { cafeId, userId, points } = otpDocument.metadata;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Customer user not found." });
        }

        const cafePoints = user.points.find(p => p.cafeId.equals(cafeId));
        if (!cafePoints || cafePoints.totalPoints < points) {
            return res.status(400).json({ error: "Not enough points to redeem." });
        }

        // Deduct points from the user's account
        cafePoints.totalPoints -= points;
        user.markModified('points'); // Notify Mongoose of the change
        await user.save();

        // Create a reward transaction log
        const newRewardTransaction = new RewardTransaction({
            userId: user._id,
            cafeId,
            type: "redeem",
            points: -points, // Store as a negative value for redemption
            description: `Redeemed ${points} points at the cafe.`
        });
        await newRewardTransaction.save();

        // Clean up the OTP document
        await OTP.deleteOne({ _id: otpDocument._id });

        res.status(200).json({ message: "Points redeemed successfully!" });

    } catch (error) {
        console.error("Redemption verification error:", error);
        res.status(500).json({ error: "Server error during redemption verification." });
    }
};