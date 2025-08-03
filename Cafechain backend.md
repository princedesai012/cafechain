# ☕ CafeNet Backend Documentation

## 📊 System Architecture: Phone Number-Based Check-in + Referral + Cafe Validation

---

### 📌 Overview

CafeNet is a local cafe discovery and loyalty platform. The backend uses **phone number-based identity** to drive:

| Feature               | Description                                       |
| --------------------- | ------------------------------------------------- |
| ✅ Phone Number Login  | Secure login via phone (password & OTP supported) |
| 🤝 Referral System    | Track referrers & allocate reward points          |
| 👨‍🍳 Cafe Accounts   | Staff can log visits & allocate rewards           |
| 🎁 Points System      | Track earned and redeemed points                  |
| 🔒 Obfuscated Numbers | Secure storage for admin-only views               |

---

## 👤 User Module

### 🔍 Core Features

| Feature                 | Details                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| 📱 Registration/Login   | Phone-based with password or OTP                                   |
| 🛡️ Secure Phone Suffix | Only visible to admin (`securePhoneId`)                            |
| 👤 Editable Profile     | Includes name & profile image                                      |
| 🤝 Referral Chain       | Auto point allocation (150 points on first visit by referred user) |
| 💰 Points System        | ₹500 spent = 50 points (default logic)                             |
| 📜 Transaction History  | Track visits, earned and redeemed points                           |

### 🧾 User API Endpoints

| Method | Endpoint                          | Description                                              |
| ------ | --------------------------------- | -------------------------------------------------------- |
| POST   | /api/users/register               | Register user with phone number, password, referral code |
| POST   | /api/users/login                  | Login using phone + password or OTP                      |
| GET    | /api/users/profile/\:phone        | Retrieve profile info                                    |
| PUT    | /api/users/profile/\:phone        | Edit name/profile image                                  |
| GET    | /api/users/referral-chain/\:phone | View full referral tree                                  |
| GET    | /api/users/history/\:phone        | View visit history                                       |
| GET    | /api/users/rewards/\:phone        | View reward transaction history                          |

### 📂 User Model (Schema)

```json
{
  name: String,
  phone: { type: String, unique: true },
  securePhoneId: { type: String, unique: true },
  password: String,
  profilePic: String,
  points: { type: Number, default: 0 },
  referredBy: String,
  referralCode: String,
  referralChildren: [String],
  createdAt: Date,
  visitLogs: [ObjectId],
  rewardLogs: [ObjectId]
}
```

### 🔁 Referral Flow

1. User provides valid `referralCode` during registration.
2. Referrer gets stored in `referredBy`.
3. On first visit of referred user:

   * Referrer receives **150 points**.
   * Logged in `RewardTransaction`.

### 📖 Visit History Example

**Endpoint:** `/api/users/history/:phone`

Includes:

* Cafe name
* Amount spent
* Points earned
* Timestamp

### 💰 Reward History Example

**Endpoint:** `/api/users/rewards/:phone`

```json
{
  userPhone: String,
  type: "earn" | "redeem",
  points: Number,
  description: String,
  source: String,
  timestamp: Date
}
```

### 🔐 Admin-only Secure Phone Handling

* `securePhoneId`: Appends 3-digit suffix to phone
* Example: `9876543210` → `9876543210-491`
* Only visible in admin logs and audit endpoints

### 🧰 Middleware

| Middleware               | Purpose                             |
| ------------------------ | ----------------------------------- |
| validatePhoneNumber      | Ensures valid phone format          |
| authenticateUserJWT      | Protects user endpoints             |
| checkReferralEligibility | Prevents duplicate referral bonuses |

### 🗂 Folder Structure

```
/routes
  users.js
/controllers
  userController.js
/models
  User.js
  RewardTransaction.js
  VisitLog.js
/middleware
  auth.js
  validate.js
```

---

## 🏆 Leaderboard & Ranking System

### 📈 Weekly User Leaderboard (per Cafe)

| Feature        | Description                         |
| -------------- | ----------------------------------- |
| 🏁 Reset Cycle | Every Sunday Midnight               |
| 🥇 Top 3 Users | Get 1.5x point multiplier next week |
| 📉 Others      | Standard 1x rate                    |

#### 🛠 Leaderboard Schema

```json
{
  cafeId: "String",
  week: "ISODate",
  leaders: [
    { userPhone: "String", points: Number }
  ]
}
```

#### ⏱ Weekly Cron Job Tasks:

* Calculate top 3 users per cafe
* Store in Leaderboard collection
* Flag top 3 with `multiplier = 1.5x`
* Reset previous week multipliers

### 📊 Cafe Performance Leaderboard

Ranks cafes weekly based on user activity:

| Metric                | Weight |
| --------------------- | ------ |
| ⭐ Total Points Earned | High   |
| 👥 Unique Visitors    | Medium |
| 💸 Average Order Size | Bonus  |

#### 🗂 CafeStats Schema

```json
{
  cafeId: "String",
  week: "ISODate",
  totalPoints: Number,
  uniqueUsers: Number,
  avgOrder: Number
}
```

### 🎖 Optional: Sponsored Visibility

* Top cafes can display **badges** in app
* Featured in **public leaderboard view**

---

Let me know if you want this exported as a PDF or Word document.
