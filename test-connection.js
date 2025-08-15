const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testConnection() {
    console.log('🧪 Testing CafeChain Backend Connection...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Health check passed:', healthResponse.data);
        
        // Test user registration endpoint (without data)
        console.log('\n2. Testing user registration endpoint...');
        try {
            await axios.post(`${API_BASE_URL}/users/register`, {
                name: 'Test User',
                phone: '9876543210',
                password: 'password123'
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Registration endpoint working (expected validation error)');
            } else {
                throw error;
            }
        }

        console.log('\n🎉 All tests passed! Backend is working correctly.');
        console.log('\n📋 Next steps:');
        console.log('1. Start your frontend: npm run client');
        console.log('2. Visit: http://localhost:3000');
        console.log('3. Test the registration flow');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure backend is running: npm run server');
        console.log('2. Check MongoDB connection');
        console.log('3. Verify .env file configuration');
    }
}

testConnection();
