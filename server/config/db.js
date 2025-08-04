const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // You might need these options for older versions of Mongoose
            // useCreateIndex: true,
            // useFindAndModify: false,
        });
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;