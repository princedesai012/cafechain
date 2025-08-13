import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, ArrowLeft, User, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Images/logo.jpg';

const SignupPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Please enter your full name';
    }
    if (!formData.mobile || formData.mobile.length !== 10) {
      return 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.password || formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Check if referral code is valid (mock validation)
      let referralBonus = 0;
      if (formData.referralCode) {
        // Mock referral codes - in real app, this would be validated against database
        const validReferralCodes = ['CAFE100', 'FRIEND50', 'WELCOME25'];
        if (validReferralCodes.includes(formData.referralCode.toUpperCase())) {
          referralBonus = formData.referralCode.toUpperCase() === 'CAFE100' ? 100 : 
                         formData.referralCode.toUpperCase() === 'FRIEND50' ? 50 : 25;
          setSuccess(`Great! You'll receive ${referralBonus} bonus points with referral code: ${formData.referralCode.toUpperCase()}`);
        } else {
          setError('Invalid referral code');
          setLoading(false);
          return;
        }
      }

      // Simulate API call
      const result = await signup({
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password,
        referralCode: formData.referralCode,
        referralBonus
      });

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          onNavigate && onNavigate('login');
        }, 2000);
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gray flex flex-col">
      {/* Header */}
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
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-sm">
          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-dark-brown mb-2">Join CafeChain</h1>
            <p className="text-gray-600">Create your account and start earning rewards</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
                />
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
                  maxLength="10"
                />
              </div>
            </div>

            {/* Password Input */}
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-11 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Referral Code Input */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-2">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  placeholder="Enter referral code"
                  className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Get bonus points with a valid referral code!
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="text-accent hover:text-dark-brown transition-colors font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Referral Code Examples */}
          <div className="mt-6 p-4 bg-light-gray rounded-xl">
            <h3 className="text-sm font-medium text-dark-brown mb-2">Try these referral codes:</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div>• <span className="font-mono bg-white px-2 py-1 rounded">CAFE100</span> - Get 100 bonus points</div>
              <div>• <span className="font-mono bg-white px-2 py-1 rounded">FRIEND50</span> - Get 50 bonus points</div>
              <div>• <span className="font-mono bg-white px-2 py-1 rounded">WELCOME25</span> - Get 25 bonus points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
