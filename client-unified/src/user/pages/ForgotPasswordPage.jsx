import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendForgotPasswordOTP } from "../api/api";

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const res = await sendForgotPasswordOTP(phone); // api helper
      if (res.success) {
        navigate("/user/verify-otp", { state: { mobile: phone } });
      }
    } catch (err) {
      setError(err?.message || "Failed to send OTP"); // apiClient already normalizes error
      if (err.status === 404) setPhone("");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your registered mobile number"
          className="w-full border rounded-lg p-2 mb-4"
          maxLength={10}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleSendOTP}
          disabled={loading}
          className="w-full bg-accent text-white py-2 rounded-lg"
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;