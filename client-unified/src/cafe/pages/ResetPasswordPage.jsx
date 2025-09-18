// src/pages/ResetPasswordPage.jsx

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const mobile = location.state?.mobile;

    if (!mobile) {
        navigate('/user/forgot-password');
        toast.error("Mobile number not found. Please try again.");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/forgot-password/reset-password', {
                mobile,
                password
            });
            toast.success(response.data.message);
            navigate('/user/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">

                {/* Decorative Circle */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>

                {/* Heading */}
                <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
                    Reset Password
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Enter a new password for your account linked with <strong>{mobile}</strong>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F]"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F]"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
                            isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg"
                        }`}
                    >
                        {isLoading ? 'Saving...' : 'Save Password'}
                    </button>
                </form>

                {/* Back to Login */}
                <p
                    onClick={() => navigate('/user/login')}
                    className="mt-6 text-center text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
                >
                    ← Back to Login
                </p>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
