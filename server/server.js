const express = require("express");
const connectDB = require("./config/db"); 
const userRoutes = require("./routes/users");
const emailOtpRoutes = require("./routes/emailOtp");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cookieParser()); 

app.use("/api/users", userRoutes);
app.use("/api/email-otp", emailOtpRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});