#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 CafeChain Setup Script');
console.log('========================\n');

// Check if .env file exists in server directory
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file for server...');
    
    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    
    const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/cafechain

# JWT Secret (auto-generated)
JWT_SECRET=${jwtSecret}

# Email Configuration (for OTP verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Please update EMAIL_USER and EMAIL_PASSWORD in server/.env for email OTP functionality\n');
} else {
    console.log('✅ .env file already exists\n');
}

console.log('📋 Setup Instructions:');
console.log('=====================');
console.log('');
console.log('1. 📦 Install Dependencies:');
console.log('   npm run install-all');
console.log('');
console.log('2. 🗄️  Start MongoDB:');
console.log('   # If using local MongoDB:');
console.log('   mongod');
console.log('   # Or use MongoDB Atlas (cloud)');
console.log('');
console.log('3. ⚙️  Configure Email (Optional):');
console.log('   Edit server/.env and update:');
console.log('   - EMAIL_USER: your Gmail address');
console.log('   - EMAIL_PASSWORD: your Gmail app password');
console.log('');
console.log('4. 🚀 Start the Application:');
console.log('   npm run dev');
console.log('');
console.log('5. 🌐 Access the Application:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend: http://localhost:5000');
console.log('');
console.log('📖 For detailed instructions, see SETUP.md');
console.log('');
console.log('🎉 Setup complete! Happy coding! 🎉');
