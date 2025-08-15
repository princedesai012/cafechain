# ☕ CafeChain — Smart Cafe Loyalty & Discovery Platform

**CafeChain** is a phone number-based local cafe loyalty platform that helps users discover cafes, earn rewards, and climb weekly leaderboards — all while enabling cafe staff to log visits, manage customers, and drive engagement.

---

## 🌟 What is CafeChain?

CafeChain is a web-based application designed to:

- Help **users** earn points every time they visit a registered cafe
- Enable **referral rewards** for inviting friends
- Let **cafes** track visitors, spending, and reward history
- Run **weekly leaderboards** to reward loyal customers
- Provide **admin oversight** for secure data tracking

---

## 👤 How Users Interact with CafeChain

| Action                          | Result                                                            |
|--------------------------------|-------------------------------------------------------------------|
| Sign up with phone number      | Creates a user account                                            |
| Enter referral code            | Referrer gets **150 points** when user visits a cafe for the first time |
| Visit any registered cafe      | Staff logs visit → user earns points (e.g., ₹500 = 50 points)     |
| Redeem points at cafe          | Points deducted, recorded as redemption                           |
| View profile                   | See points, rewards, visit history                                |
| Check leaderboard              | Compete for top spots each week per cafe                          |

---

## 👨‍🍳 How Cafes Use the System

| Action                            | Purpose                                                           |
|----------------------------------|-------------------------------------------------------------------|
| Register staff account           | Allows logging visits using user phone numbers                    |
| Log customer visit               | Enter amount → platform auto-calculates points                    |
| View user visit history          | Track spending, points earned, and redemptions                    |
| View weekly cafe stats           | Get ranked based on visitor activity and order size               |

---

## 🔐 Admin Controls

| Feature                  | Description                                           |
|--------------------------|-------------------------------------------------------|
| Secure phone storage     | Admin sees only obfuscated phone numbers (`xxxxxx-491`) |
| Leaderboard management   | View and reset weekly data                           |
| Analytics reports        | Cafes ranked by total points, visitors, and more     |

---

## 🏁 Leaderboard Logic

- **Top 3 users** per cafe (every week) get **1.5x reward multiplier** next week
- **Reset weekly** via automatic cron job (every Sunday midnight)
- **Public & cafe rankings** updated dynamically

---

## 💻 How to Use (as a User)

1. Go to the CafeChain website/app
2. Register using your phone number
3. Verify your email with OTP
4. Enter referral code (optional)
5. Visit partner cafes and give your phone number
6. Check your profile to track points & rewards
7. Compete on leaderboards and redeem rewards!

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation & Setup

```bash
# 1. Install all dependencies
npm run install-all

# 2. Set up environment variables
# Copy .env.example to .env in server directory and configure

# 3. Start both servers
npm run dev
```

Visit http://localhost:3000 to access the application.

**🚀 Need help getting started?** See [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide!

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

## 📦 Technologies Used

### Backend
* **Node.js + Express** – Web server
* **MongoDB + Mongoose** – Data storage
* **JWT Auth** – User authentication
* **Nodemailer** – Email OTP verification
* **bcryptjs** – Password hashing
* **CORS** – Cross-origin resource sharing

### Frontend
* **React 18** – UI framework
* **Vite** – Build tool
* **React Router** – Navigation
* **Tailwind CSS** – Styling
* **Axios** – HTTP client
* **React Hook Form** – Form handling
* **Framer Motion** – Animations

### Authentication Flow
* Phone number registration
* Email verification with OTP
* JWT-based session management
* Protected routes

---

## 🔒 Security Highlights

* Phone numbers stored with `securePhoneId` (e.g., `9876543210-491`)
* JWT-protected routes
* Referral fraud prevention logic
* Input validation & audit logging

---

## 📈 Future Scope

* Push notifications for top leaderboard users
* Cafe dashboard with QR-based check-in
* Integration with POS systems for auto-visit logging
* Gamification (badges, streaks, surprise rewards)

---

## 🤝 Contribution

We welcome contributions! Open issues, submit PRs, and help us improve CafeChain.

---
