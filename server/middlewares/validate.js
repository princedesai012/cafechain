exports.validatePhoneNumber = (req, res, next) => {
    const { phone } = req.body;
    
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }
    
    const regex = /^[6-9]\d{9}$/;
    if (!regex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format. Must be 10 digits starting with 6-9" });
    }
    next();
};

exports.validateEmail = (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    next();
};

exports.validateRegistration = (req, res, next) => {
    const { name, phone, password } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    
    // Continue to phone validation
    next();
};

exports.validateLogin = (req, res, next) => {
    const { phone, password } = req.body;
    
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }
    
    // Continue to phone validation
    next();
};

exports.validateOTP = (req, res, next) => {
    const { otp } = req.body;
    
    if (!otp) {
        return res.status(400).json({ error: "OTP is required" });
    }
    
    if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({ error: "OTP must be 6 digits" });
    }
    
    next();
};