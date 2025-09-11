import React, { useState, useEffect } from 'react';
import { Mail, User, Lock, Phone, KeyRound, ArrowLeft, Eye, EyeOff, Coffee, Star, Users, Zap, Shield } from 'lucide-react';

// --- MOCK IMPLEMENTATIONS (If you're using these in a real project, ensure correct paths) ---
const useAuth = () => ({
  register: async (data) => {
    console.log("Register attempt with:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate successful registration and requiring email verification
    if (data.email && data.phone && data.password) {
      return { success: true, requiresEmailVerification: true };
    }
    return { success: false, error: 'Registration failed: Invalid input.' };
  },
  verifyEmail: async (data) => {
    console.log("Verify email attempt with:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate successful OTP verification for a specific OTP
    if (data.otp === '123456') {
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP. Hint: try "123456"' };
  }
});

const useNavigate = () => {
  return (path, options) => {
    console.log(`Navigating to: ${path}`, options);
    // In a real app, this would change the URL.
  };
};

const requestEmailOtp = async ({ email, phone }) => {
  console.log(`Requesting OTP for email: ${email}, phone: ${phone}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('OTP request simulated. Check console for "email" and "phone" in useAuth mock.');
  return { success: true };
};

const logo = 'https://placehold.co/80x80/5D4037/F5E6D3?text=CC&font=albertus';
// --- END MOCK IMPLEMENTATIONS ---


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
  const [mounted, setMounted] = useState(false); // For entrance animations

  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []); // Trigger entrance animation on mount

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
        // NOTE: In a real app, you would navigate to a dedicated OTP verification route.
        // For this single component, we're just toggling the view.
        setIsVerifying(true);
      } else {
        setError(result.error || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.'); // Ensure error is a string
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
        navigate('/home'); // Navigate to home on successful verification
      } else {
        setError(result.error || 'Email verification failed.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.'); // Ensure error is a string
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Star, text: "Unlock Exclusive Rewards" },
    { icon: Users, text: "Join Our Vibrant Community" },
    { icon: Zap, text: "Seamless & Quick Sign-up" },
    { icon: Shield, text: "Your Data is Secure" }
  ];

  const RunningIcons = () => (
    <div className="flex w-1/2 items-center justify-around flex-shrink-0">
      <Coffee className="w-10 h-10 text-white opacity-20" />
      <Star className="w-8 h-8 text-white opacity-10" />
      <Coffee className="w-14 h-14 text-white opacity-25" />
      <Users className="w-8 h-8 text-white opacity-10" />
      <Coffee className="w-10 h-10 text-white opacity-20" />
      <Zap className="w-8 h-8 text-white opacity-10" />
    </div>
  );

  const renderForm = () => {
    if (isVerifying) {
      return (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <p className="text-center text-gray-600">
            A 6-digit OTP has been sent to your email ({formData.email}).
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
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
          <label className="block text-sm font-medium" style={{ color: '#4a3a2f' }}>
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
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium" style={{ color: '#4a3a2f' }}>
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
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              maxLength="10"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium" style={{ color: '#4a3a2f' }}>
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
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium" style={{ color: '#4a3a2f' }}>
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
              className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
          <label className="block text-sm font-medium" style={{ color: '#4a3a2f' }}>
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
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
          className="w-full text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: loading ? '#6b5b4d' : '#4a3a2f' }}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== Desktop Layout ==================== */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#4a3a2f' }}>
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
                className="font-semibold transition-colors"
                style={{ color: '#4a3a2f' }}
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Branding with running animation */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
          <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white">
            <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <img src={logo} alt="CafeChain Logo" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-6 shadow-2xl" />
              <h1 className="text-3xl font-bold mb-3 text-center">CafeChain</h1>
              <p className="text-lg opacity-90 text-center mb-8 leading-relaxed">
                Join our community and discover a world of coffee delights.
              </p>
            </div>
            <div className="space-y-4 max-w-md">
              {features.map((feature, index) => (
                <div key={index} className={`flex items-center space-x-4 transform transition-all duration-700 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${0.3 + index * 0.15}s` }}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 w-full overflow-hidden">
            <div className="absolute top-0 left-0 flex w-[200%] h-full animate-marquee">
              <RunningIcons />
              <RunningIcons />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== Mobile Layout ==================== */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white rounded-b-3xl relative z-10">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-dark-brown" />
          </button>
          <div className="flex items-center">
            <img src={logo} alt="CafeChain" className="w-8 h-8 rounded-lg" />
            <span className="ml-2 text-lg font-semibold text-dark-brown">CafeChain</span>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-8 bg-gray-50">
          <div className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
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
    </div>
  );
};

export default SignupPage;