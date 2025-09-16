const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const cafeSchema = new mongoose.Schema({
    // --- Cafe Details (Combined from both models) ---
    name: { type: String, required: true },
    address: { type: String, required: true },
    cafePhone: { type: String, required: true }, // The cafe's public contact number
    description: String,
    openingHours: String,
    image: { type: String, default: "https://via.placeholder.com/400x250" }, // Added from the first model
    gallery: [String], // Added from the first model
    features: [String], // Added from the first model
    cafeCode: { type: String, unique: true },
    status: {
        type: String,
        // Using the more comprehensive list of statuses
        enum: ['pending', 'pendingApproval', 'active', 'rejected'],
        default: 'pending_approval'
    },
    
    // --- Owner Details ---
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true, unique: true }, // The owner's private contact number

    // --- Authentication Details ---
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}, { timestamps: true });

// Pre-save hook to hash the password before saving the document
cafeSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified AND it's not already a bcrypt hash
    if (!this.isModified('password')) return next();
    
    // ✅ ADDED CHECK: Don't re-hash if it's already a hashed password (starts with $2)
    if (this.password.startsWith('$2')) {
        return next();
    }
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare the provided password with the hashed password in the database
cafeSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Cafe", cafeSchema);