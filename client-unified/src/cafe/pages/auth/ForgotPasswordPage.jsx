import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { sendForgotPasswordOTP } from "../api/api"; // backend untouched

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // simple regex for email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSendOTP = async () => {
    if (!email || !validateEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // const res = await sendForgotPasswordOTP(email); // backend untouched
      // if (res.success) {
        navigate("/user/verify-otp", { state: { email } });
      // }
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">

        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Enter your registered email address to receive an OTP for resetting your password.
        </p>

        {/* Input */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Send OTP Button */}
        <button
          onClick={handleSendOTP}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* Back to Login */}
        <p
          onClick={() => navigate("/user/login")}
          className="mt-6 text-center text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
