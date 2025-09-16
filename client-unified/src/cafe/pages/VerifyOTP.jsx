// src/pages/VerifyOTP.jsx (Corrected)

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email;

    if (!email) {
        // ✅ CORRECTED PATH: Removed the incorrect '/cafe' prefix
        navigate('/auth/register');
        toast.error("Something went wrong. Please register again.");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits.");
            return;
        }
        setIsLoading(true);

        try {
            // The backend now creates the pending application directly.
            // It no longer sends back a temporary token.
            const response = await axios.post('/api/cafe-owner/register/verify-otp', { email, otp });
            
            toast.success(response.data.message);
            
            // ✅ CORRECTED REDIRECT: Navigate to the pending approval page.
            navigate('/cafe/pending-approval');

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'OTP verification failed.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Verify Your Account</h2>
                <p className="text-center text-gray-600 mb-6">
                    An OTP has been sent to <strong>{email}</strong>. Please enter it below.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 block w-full text-center tracking-[1em] text-2xl font-semibold px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a3a2f] focus:border-[#4a3a2f]"
                            maxLength="6"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#4a3a2f] text-white py-2 px-4 rounded-md hover:bg-[#3a2d24] disabled:opacity-50"
                    >
                        {isLoading ? 'Verifying...' : 'Verify & Complete Submission'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOTP;