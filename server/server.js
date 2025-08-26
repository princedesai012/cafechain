require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); 
const userRoutes = require("./routes/users");
const emailOtpRoutes = require("./routes/emailOtp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

// Increase payload size limits for image uploads
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'CafeChain');
  next();
});

connectDB();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()); 
// Serve uploaded avatars statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", userRoutes);
app.use("/api/email-otp", emailOtpRoutes);

app.use("/api/forgot-password", forgotPasswordRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});