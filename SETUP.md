# 🚀 CafeChain Setup Guide

This guide will help you set up and run the CafeChain application with both frontend and backend integrated.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (running locally or MongoDB Atlas)
- Git

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

Or install manually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/cafechain

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for OTP verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### 3. Database Setup

Make sure MongoDB is running:

```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

## 🚀 Running the Application

### Option 1: Run Both Servers Together

```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000 (or 5173)

### Option 2: Run Servers Separately

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## 🔐 Authentication Flow

The application implements the following authentication flow:

1. **Welcome Page** (`/welcome`) - Landing page with options to sign up or login
2. **Sign Up** (`/signup`) - User registration with phone number
3. **Email Verification** (`/email-verification`) - OTP verification via email
4. **Login** (`/login`) - User login with phone and password
5. **Home Page** (`/`) - Main application (protected route)

### User Journey:

1. User visits `/welcome`
2. Clicks "Get Started" → goes to `/signup`
3. Fills registration form → redirected to `/email-verification`
4. Enters email → receives OTP
5. Verifies OTP → redirected to `/` (home page)
6. Future logins go directly to `/` if email is verified

## 🧪 Testing the Integration

### Test User Registration:

1. Go to http://localhost:3000/welcome
2. Click "Get Started"
3. Fill in the registration form:
   - Name: Test User
   - Mobile: 9876543210
   - Password: password123
   - Referral Code: (optional)
4. Submit → redirected to email verification
5. Enter your email address
6. Check your email for OTP
7. Enter the OTP → redirected to home page

### Test User Login:

1. Go to http://localhost:3000/login
2. Enter credentials:
   - Mobile: 9876543210
   - Password: password123
3. Submit → redirected to home page

## 🔧 Development

### Backend API Endpoints:

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/email-otp/request-email-otp` - Request email OTP
- `POST /api/email-otp/verify-email-otp` - Verify email OTP
- `GET /api/users/profile/:phone` - Get user profile
- `PUT /api/users/profile/:phone` - Update user profile

### Frontend Routes:

- `/welcome` - Landing page
- `/signup` - Registration page
- `/email-verification` - Email verification page
- `/login` - Login page
- `/` - Home page (protected)
- `/cafes` - Cafes listing (protected)
- `/rewards` - Rewards page (protected)
- `/leaderboard` - Leaderboard page (protected)
- `/profile` - User profile (protected)

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure the backend is running on port 5000 and frontend on 3000
2. **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
3. **Email OTP**: Check your email credentials in `.env` file
4. **JWT Errors**: Ensure JWT_SECRET is set in `.env`

### Logs:

- Backend logs: Check terminal running the server
- Frontend logs: Check browser console (F12)

## 📱 Features Implemented

- ✅ User registration with phone number
- ✅ Email verification with OTP
- ✅ User login with JWT authentication
- ✅ Protected routes
- ✅ Responsive UI with Tailwind CSS
- ✅ React Router navigation
- ✅ Context-based state management
- ✅ API integration with axios
- ✅ Error handling and loading states

## 🚀 Next Steps

After successful setup, you can:

1. Add more cafe data to the database
2. Implement the visit logging system
3. Add leaderboard functionality
4. Implement reward redemption
5. Add admin dashboard
6. Deploy to production

## 📞 Support

If you encounter any issues, check:

1. All dependencies are installed
2. Environment variables are set correctly
3. MongoDB is running
4. Both servers are running on correct ports
5. Browser console for frontend errors
6. Server terminal for backend errors
