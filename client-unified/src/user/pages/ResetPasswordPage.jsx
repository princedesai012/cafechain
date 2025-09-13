import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { mobile } = location.state;

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password/reset-password', { mobile, password });
      if (res.data.success) {
        navigate('/login', { state: { message: 'Password updated successfully' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border rounded-lg p-2 mb-4"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          className="w-full border rounded-lg p-2 mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-accent text-white py-2 rounded-lg"
        >
          {loading ? 'Saving...' : 'Save Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
