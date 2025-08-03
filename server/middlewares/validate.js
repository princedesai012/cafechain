exports.validatePhoneNumber = (req, res, next) => {
    const { phone } = req.body;
    const regex = /^[6-9]\d{9}$/;
    if (!regex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number" });
    }
    next();
};