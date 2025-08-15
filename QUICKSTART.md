# ⚡ CafeChain Quick Start Guide

Get CafeChain running in 5 minutes! 🚀

## 🎯 Prerequisites

- ✅ Node.js (v16 or higher)
- ✅ npm or yarn
- ✅ MongoDB (local or Atlas)

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Auto-Setup Environment
```bash
npm run setup
```

### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas (cloud)
# Update MONGO_URI in server/.env
```

### 4. Start Application
```bash
npm run dev
```

### 5. Access Application
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:5000

## 🧪 Test the Application

### Test Registration Flow:
1. Go to http://localhost:3000 (will redirect to /welcome)
2. Click "Get Started"
3. Fill registration form:
   - Name: Test User
   - Mobile: 9876543210
   - Password: password123
4. Submit → Email verification page
5. Enter your email → Check email for OTP
6. Enter OTP → Welcome to home page!

### Test Login:
1. Go to http://localhost:3000/login
2. Enter: 9876543210 / password123
3. Login → Home page

## ⚙️ Optional: Email Configuration

For email OTP functionality, update `server/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**How to get Gmail app password:**
1. Enable 2-factor authentication on Gmail
2. Generate app password: Google Account → Security → App passwords
3. Use the generated password (not your regular Gmail password)

## 🐛 Common Issues

### CORS Error?
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ CORS configured correctly

### MongoDB Connection Error?
- ✅ MongoDB running (`mongod`)
- ✅ Connection string correct in `server/.env`

### Email OTP Not Working?
- ✅ Gmail credentials correct
- ✅ App password (not regular password)
- ✅ 2FA enabled on Gmail

## 📱 Features Working

- ✅ User registration with phone
- ✅ Email verification with OTP
- ✅ User login/logout
- ✅ Protected routes
- ✅ Responsive UI
- ✅ JWT authentication

## 🎉 Success!

Your CafeChain application is now running! 

**Next steps:**
- Add cafe data to database
- Implement visit logging
- Add leaderboard functionality
- Deploy to production

---

📖 **Need more details?** See [SETUP.md](./SETUP.md) for comprehensive instructions.
