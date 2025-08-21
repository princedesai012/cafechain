import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Lock, Phone, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/Images/logo.jpg';
import { requestEmailOtp } from '../api/api';

const SignupPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    email: '',
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('');

  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.phone || !formData.password || !formData.email) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success && result.requiresEmailVerification) {
        await requestEmailOtp({ email: formData.email, phone: formData.phone });
        setError('');
        navigate('/verify-email', { state: { email: formData.email, phone: formData.phone } });
      } else {
        setError(result.error || 'Registration failed.');
      }
    } catch (err) {
      setError(err || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyEmail({ email: formData.email, phone: formData.phone, otp });
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Email verification failed.');
      }
    } catch (err) {
      setError(err || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (isVerifying) {
      return (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <p className="text-center text-gray-600">
            A 6-digit OTP has been sent to your email.
          </p>
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              OTP
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
                maxLength="6"
                required
              />
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleRegisterSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
              maxLength="10"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              className="w-full pl-11 pr-11 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2">
            Referral Code (Optional)
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              placeholder="Enter referral code"
              className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
            />
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-warm-gray flex flex-col">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => window.history.back()}
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
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark-brown mb-2">
              {isVerifying ? 'Verify Your Email' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600">
              {isVerifying ? 'Enter the OTP to complete your registration.' : 'Sign up to start your journey with CafeChain'}
            </p>
          </div>
          {renderForm()}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="text-accent hover:text-dark-brown transition-colors font-medium"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;