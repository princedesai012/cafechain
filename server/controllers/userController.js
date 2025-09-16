const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const Cafe = require("../models/Cafe");
const VisitLog = require("../models/VisitLog");
const RewardTransaction = require("../models/RewardTransaction");

const generateReferralCode = () => crypto.randomBytes(3).toString("hex");

// XP System Constants
const XP_FOR_VISIT = 100;
const XP_FOR_FIRST_VISIT = 250;
const XP_FOR_REGISTRATION = 100;
const XP_FOR_REFERRAL_BONUS = 200;
// New constant for the bonus XP given to the new user
const XP_FOR_NEW_USER_REFERRAL = 150; 


exports.register = async (req, res) => {
    const { name, phone, password, referralCode } = req.body;

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ getCafePointserror: "Phone already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const securePhoneId = `${phone}-607`; 
        
        // Step 1: Initialize new user's XP to the default value
        let newuserXP = XP_FOR_REGISTRATION;

        // Step 2: Check for and process the referral code
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                // If a referrer is found, update the new user's XP
                newuserXP = XP_FOR_NEW_USER_REFERRAL;
                
                // Update the referrer's XP
                referrer.referredBy = referralCode;
                referrer.referralChildren.push(phone);
                referrer.xp += XP_FOR_REFERRAL_BONUS;
                await referrer.save();
            }
        }       

        // Step 3: Create the new user with the determined XP value
        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            securePhoneId,
            referralCode: generateReferralCode(),
            xp: newuserXP, // Use the dynamically set XP value
            referredBy: referralCode,
            isEmailVerified: false, 
        });

        await newUser.save();
        
        res.status(201).json({ 
            message: "User registered successfully. Please verify your email to continue.",
            user: {
                name: newUser.name,
                phone: newUser.phone,
                isEmailVerified: newUser.isEmailVerified
            },
            requiresEmailVerification: true
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id, phone: user.phone }, // now includes _id
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
            
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        res.json({ token, user: { name: user.name, phone: user.phone, profilePic: user.profilePic } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


const getCafePoints = (user, cafeId) => {
    let cafePoints = user.points.find(p => p.cafeId.equals(cafeId));
    if (!cafePoints) {
        cafePoints = { cafeId, totalPoints: 0 };
        user.points.push(cafePoints);
    }
    return cafePoints;
};

exports.logVisit = async (req, res, fromAdmin = false, claimData = null) => {
  try {
    let userPhone, cafeId, amountSpent;

    if (fromAdmin && claimData) {
      // Called by admin (approveClaim)
      userPhone = claimData.userPhone;
      cafeId = claimData.cafeId;
      amountSpent = claimData.amountSpent;
    } else {
      // Called by user request
      ({ userPhone, cafeId, amountSpent } = req.body);

      if (!req.user || req.user.phone !== userPhone) {
        return res.status(403).json({ error: "Unauthorized access" });
      }
    }

    const user = await User.findOne({ phone: userPhone });
    if (!user) throw new Error("User not found");

    const cafe = await Cafe.findById(cafeId);
    if (!cafe) throw new Error("Cafe not found");

    // Calculate points
    let pointsEarned = Math.floor(amountSpent / 10);
    if (fromAdmin && user.hasMultiplier) {
      pointsEarned = Math.floor(pointsEarned * 1.5);
    }

    // XP
    let xpEarned = pointsEarned * 2;
    user.xp += xpEarned;

    // Add/update cafe points
    const cafeIndex = user.points.findIndex(
      (p) => p.cafeId.toString() === cafeId.toString()
    );
    if (cafeIndex >= 0) {
      user.points[cafeIndex].totalPoints += pointsEarned;
    } else {
      user.points.push({ cafeId, totalPoints: pointsEarned });
    }

    // Save visit log
    const newVisitLog = new VisitLog({
      userId: user._id,
      cafeId,
      amountSpent,
      pointsEarned,
      xpEarned
    });
    await newVisitLog.save();
    user.visitLogs.push(newVisitLog._id);

    // Save reward transaction
    const newRewardTransaction = new RewardTransaction({
      userId: user._id,
      cafeId,
      type: "earn",
      points: pointsEarned,
      description: fromAdmin
        ? "Points from admin-approved claim"
        : "Points earned from a visit."
    });
    await newRewardTransaction.save();
    user.rewardLogs.push(newRewardTransaction._id);

    await user.save();

    if (fromAdmin) {
      return { pointsEarned, xpEarned, currentPoints: user.points, currentXP: user.xp };
    }

    // Normal user flow → send API response
    res.status(200).json({
      message: "Visit logged, points and XP awarded.",
      pointsEarned,
      xpEarned,
      currentPoints: user.points,
      currentXP: user.xp
    });

  } catch (error) {
    console.error("Log visit error:", error);
    if (!fromAdmin) {
      res.status(500).json({ error: "Server error" });
    } else {
      throw error; // Let adminController handle it
    }
  }
};


// exports.logVisit = async (req, res) => {
//     const { userPhone, cafeId, amountSpent } = req.body;

//     try {
//         // Ensure user can only log their own visits
//         if (!req.user || req.user.phone !== userPhone) {
//             return res.status(403).json({ error: "Unauthorized access" });
//         }

//         const user = await User.findOne({ phone: userPhone });
//         if (!user) return res.status(404).json({ error: "User not found" });

//         const cafe = await Cafe.findById(cafeId);
//         if (!cafe) return res.status(404).json({ error: "Cafe not found" });

//         const hasVisitedCafe = await VisitLog.exists({ userId: user._id, cafeId });

//         // calculate base points
//         let pointsEarned = Math.floor(amountSpent / 10);

//         // apply multiplier if user is in top 3
//         if (user.hasMultiplier) {
//         pointsEarned = Math.floor(pointsEarned * 1.5);
//         }

//         // --- XP logic ---
//         let xpEarned = pointsEarned * 2;
//         user.xp += xpEarned;

//         // check if user already has this cafe in points[]
//         const cafeIndex = user.points.findIndex(
//         (p) => p.cafeId.toString() === cafeId.toString()
//         );

//         if (cafeIndex >= 0) {
//         // update existing entry
//         user.points[cafeIndex].totalPoints += pointsEarned;
//         } else {
//         // add new cafe entry
//         user.points.push({ cafeId, totalPoints: pointsEarned });
//         }


//         // --- Save visit log ---
//         const newVisitLog = new VisitLog({
//             userId: user._id,
//             cafeId: cafe._id,
//             amountSpent,
//             pointsEarned,
//             xpEarned
//         });
//         await newVisitLog.save();
//         user.visitLogs.push(newVisitLog._id);

//         // --- Save reward transaction ---
//         const newRewardTransaction = new RewardTransaction({
//             userId: user._id,
//             cafeId: cafe._id,
//             type: "earn",
//             points: pointsEarned,
//             description: "Points earned from a visit."
//         });
//         await newRewardTransaction.save();
//         user.rewardLogs.push(newRewardTransaction._id);

//         // --- Referral bonus (only first visit of referred user) ---
//         if (user.referredBy && !hasVisitedCafe) {
//             const referrer = await User.findOne({ referralCode: user.referredBy });
//             if (referrer) {
//                 const referrerCafePoints = getCafePoints(referrer, cafeId);
//                 referrerCafePoints.totalPoints += 150;
//                 referrer.xp += XP_FOR_REFERRAL_BONUS; // also boost referrer XP

//                 // Create a reward transaction for the referrer
//                 const referralBonusTransaction = new RewardTransaction({
//                     userId: referrer._id,
//                     cafeId: cafe._id,
//                     type: "referral_bonus",
//                     points: 150,
//                     description: `Referral bonus from new user ${user.name || user.phone}.`
//                 });
//                 await referralBonusTransaction.save();
//                 referrer.rewardLogs.push(referralBonusTransaction._id);

//                 await referrer.save();
//             }
//         }

//         await user.save();

//         res.status(200).json({
//             message: "Visit logged, points and XP awarded.",
//             pointsEarned,
//             currentPoints: user.points,
//             xpEarned,
//             currentXP: user.xp,
//         });

//     } catch (error) {
//         console.error("Log visit error:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };


// exports.logVisit = async (req, res) => {
//     const { userPhone, cafeId, amountSpent } = req.body;

//     try {
//         // Enforce that users can only log their own visits
//         if (!req.user || req.user.phone !== userPhone) {
//             return res.status(403).json({ error: "Unauthorized access" });
//         }
//         const user = await User.findOne({ phone: userPhone });
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const cafe = await Cafe.findById(cafeId);
//         if (!cafe) {
//             return res.status(404).json({ error: "Cafe not found" });
//         }

//         const hasVisitedCafe = user.visitLogs.some(log => log.cafeId.equals(cafeId));

//         let pointsEarned = Math.floor(amountSpent / 10);

//         if (user.hasMultiplier && user.multiplierExpiry && user.multiplierExpiry > new Date()) {
//             pointsEarned = Math.floor(pointsEarned * 1.5);
//         } else {
//             user.hasMultiplier = false; // clean up expired
//             user.multiplierExpiry = null;
//         }

//         const cafePoints = getCafePoints(user, cafeId);
//         cafePoints.totalPoints += pointsEarned;

//         let xpEarned = hasVisitedCafe ? XP_FOR_VISIT : XP_FOR_FIRST_VISIT;
//         user.xp += xpEarned;

//         const newVisitLog = new VisitLog({
//             userId: user._id,
//             cafeId: cafe._id,
//             amountSpent,
//             pointsEarned,
//             xpEarned
//         });
//         await newVisitLog.save();
//         user.visitLogs.push(newVisitLog._id);

//         // --- CREATE REWARD TRANSACTION ENTRY for points earned ---
//         const newRewardTransaction = new RewardTransaction({
//             userId: user._id,
//             cafeId: cafe._id,
//             type: "earn",
//             points: pointsEarned,
//             description: "Points earned from a visit."
//         });
//         await newRewardTransaction.save();
//         user.rewardLogs.push(newRewardTransaction._id);

//         // --- REFERRAL BONUS LOGIC ---
//         if (user.referredBy && !hasVisitedCafe) {
//             const referrer = await User.findOne({ referralCode: user.referredBy });
//             if (referrer) {
//                 const referrerCafePoints = getCafePoints(referrer, cafeId);
//                 referrerCafePoints.totalPoints += 150;
//                 await referrer.save();

//                 // Create a reward transaction for the referrer's bonus
//                 const referralBonusTransaction = new RewardTransaction({
//                     userId: referrer._id,
//                     cafeId: cafe._id,
//                     type: "referral_bonus",
//                     points: 100,
//                     description: `Referral bonus from new user ${user.name || user.phone}.`
//                 });
//                 await referralBonusTransaction.save();
//                 referrer.rewardLogs.push(referralBonusTransaction._id);
//                 await referrer.save();
//             }
//         }
        
//         await user.save();

//         res.status(200).json({
//             message: "Visit logged, points and XP awarded.",
//             pointsEarned: pointsEarned,
//             currentPoints: cafePoints.totalPoints,
//             xpEarned: xpEarned,
//             currentXP: user.xp,
//         });

//     } catch (error) {
//         console.error("Log visit error:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };


// The getUserProfile function


exports.getUserProfile = async (req, res) => {
    const { phone } = req.params;
    try {
        // Enforce that a user can only view their own profile
        if (!req.user || req.user.phone !== phone) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        const user = await User.findOne({ phone }).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
      const { phone } = req.params;
      const updates = { ...req.body };
  
      if (!req.user || req.user.phone !== phone) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      console.log("🔄 Updating profile for phone:", phone);
  
      const user = await User.findOneAndUpdate(
        { phone },
        updates,
        { new: true }
      );
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({
        message: "Profile updated successfully",
        user
      });
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile", error });
    }
}; 
  
  
exports.changePassword = async (req, res) => {
    const { phone } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
    }

    // Password validation
    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(200).json({ message: "Logged out" });
    }
};

exports.getReferralChain = async (req, res) => {
    const { phone } = req.params;

    // Authorization check: User can only see their own referral chain
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Helper function to build the referral tree
        const buildReferralTree = async (phoneNumber) => {
            const currentUser = await User.findOne({ phone: phoneNumber });
            if (!currentUser || currentUser.referralChildren.length === 0) {
                return { phone: phoneNumber, children: [] };
            }

            const children = await Promise.all(
                currentUser.referralChildren.map(childPhone => buildReferralTree(childPhone))
            );

            return {
                phone: phoneNumber,
                children: children
            };
        };

        const referralChain = await buildReferralTree(phone);
        res.status(200).json(referralChain);

    } catch (error) {
        console.error("Get referral chain error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getVisitHistory = async (req, res) => {
    const { phone } = req.params;

    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find all visit logs for the user, and populate the cafe details
        const visitHistory = await VisitLog.find({ userId: user._id })
            .populate("cafeId", "name address") // 'name' and 'address' from the Cafe model
            .sort({ timestamp: -1 }); // Sort by most recent visit first

        res.status(200).json(visitHistory);

    } catch (error) {
        console.error("Get visit history error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//user's reward transaction history
exports.getRewardHistory = async (req, res) => {
    const { phone } = req.params;

    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find all reward transactions for the user, and populate the cafe details
        const rewardHistory = await RewardTransaction.find({ userId: user._id })
            .populate("cafeId", "name") // 'name' from the Cafe model
            .sort({ timestamp: -1 }); // Sort by most recent transaction first

        res.status(200).json(rewardHistory);

    } catch (error) {
        console.error("Get reward history error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.addFavoriteCafe = async (req, res) => {
    const { phone } = req.params;
    const { cafeId } = req.body;

    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const cafe = await Cafe.findById(cafeId);
        if (!cafe) {
            return res.status(404).json({ error: "Cafe not found" });
        }

        // Check if the cafe is already in the favorites list
        const isAlreadyFavorite = user.favoriteCafes.some(favId => favId.equals(cafeId));
        
        if (isAlreadyFavorite) {
            // If already a favorite, remove it
            user.favoriteCafes.pull(cafeId);
            await user.save();
            return res.status(200).json({ message: "Cafe removed from favorites.", favoriteCafes: user.favoriteCafes });
        } else {
            // If not a favorite, add it
            user.favoriteCafes.push(cafeId);
            await user.save();
            return res.status(200).json({ message: "Cafe added to favorites.", favoriteCafes: user.favoriteCafes });
        }

    } catch (error) {
        console.error("Add/remove favorite cafe error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// New endpoint: Get a user's favorite cafes
exports.getFavoriteCafes = async (req, res) => {
    const { phone } = req.params;
    
    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone }).populate('favoriteCafes');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ favoriteCafes: user.favoriteCafes });

    } catch (error) {
        console.error("Get favorite cafes error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
      const leaderboard = await User.find({})
        .select('name xp profilePic')
        .sort({ xp: -1 })
        .limit(15);
  
      let currentUser = null;
      if (req.user) {
        const user = await User.findById(req.user.id).select('name xp profilePic');
        if (user) {
          // find user’s rank among all users
          const rank = await User.countDocuments({ xp: { $gt: user.xp } }) + 1;
          currentUser = { ...user.toObject(), rank };
        }
      }
  
      res.status(200).json({ leaderboard, currentUser });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: "Server error" });
    }
};  
