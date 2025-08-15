import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import Popup from '../components/Popup';
import logo from '../assets/Images/logo.jpg';

const EmailVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ type: 'error', title: '', message: '' });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get phone from location state (passed from signup)
  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      navigate('/signup');
    }
  }, [phone, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !email.includes('@')) {
      setPopupData({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address.'
      });
      setShowPopup(true);
      setLoading(false);
      return;
    }

    try {
      await authAPI.requestEmailOTP(email, phone);
      setStep('otp');
      setCountdown(60); // 60 seconds countdown
      setSuccess('Verification code sent to your email!');
    } catch (error) {
      setPopupData({
        type: 'error',
        title: 'Send Failed',
        message: error.response?.data?.error || 'Failed to send verification code. Please try again.'
      });
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!otp || otp.length !== 6) {
      setPopupData({
        type: 'error',
        title: 'Invalid Code',
        message: 'Please enter a valid 6-digit verification code.'
      });
      setShowPopup(true);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.verifyEmailOTP(email, otp, phone);
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Update user state in AuthContext
      if (response.user) {
        // Force a page reload to update authentication state
        window.location.href = '/';
      } else {
        setSuccess('Email verified successfully! Redirecting to home...');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      }
    } catch (error) {
      setPopupData({
        type: 'error',
        title: 'Verification Failed',
        message: error.response?.data?.error || 'Invalid verification code. Please try again.'
      });
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      await authAPI.resendEmailOTP(email, phone);
      setCountdown(60);
      setSuccess('New verification code sent!');
    } catch (error) {
      setPopupData({
        type: 'error',
        title: 'Resend Failed',
        message: error.response?.data?.error || 'Failed to resend verification code. Please try again.'
      });
      setShowPopup(true);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-warm-gray flex flex-col">
      {/* Popup for error messages */}
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        type={popupData.type}
        title={popupData.title}
        message={popupData.message}
      />
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-light-gray transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-dark-brown" />
        </button>
        <div className="flex items-center">
          <img src={logo} alt="CafeChain" className="w-8 h-8 rounded-lg" />
          <span className="ml-2 text-lg font-semibold text-dark-brown">CafeChain</span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark-brown mb-2">
              {step === 'email' ? 'Verify Your Email' : 'Enter Verification Code'}
            </h1>
            <p className="text-gray-600">
              {step === 'email' 
                ? 'Enter your email to receive a verification code'
                : `We've sent a code to ${email}`
              }
            </p>
          </div>

          {/* Email Input Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-brown mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* OTP Input Step */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-brown mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white text-center text-2xl font-mono tracking-widest"
                  maxLength="6"
                />
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading || countdown > 0}
                  className="text-accent hover:text-dark-brown transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${formatTime(countdown)}`
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>

              {/* Back to email step */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-gray-500 hover:text-dark-brown transition-colors text-sm"
                >
                  Use different email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
