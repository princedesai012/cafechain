import React, { useState, useEffect } from 'react';
// Added Coffee icon for the running animation
import { Phone, Lock, Eye, EyeOff, Users, Zap, Shield, Star, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct for your project
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Images/logo.jpg'; // Ensure this path is correct for your project

// LoginForm component with the duplicate eye icon finally removed.
const LoginForm = ({
  formData,
  showPassword,
  loading,
  error,
  onInputChange,
  onTogglePassword,
  onSubmit,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  isMobile = false
}) => {
  // This logic determines which single icon component to render.
  const PasswordIcon = showPassword ? EyeOff : Eye;

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3">
        {!isMobile && (
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#4a3a2f' }}>Sign In</h2>
            <p className="text-gray-600">Enter your credentials</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Mobile Number</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="Enter your mobile number"
              className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
              maxLength="10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
            />
            {/* CORRECTED: This now renders the single, correct icon */}
            <button type="button" onClick={onTogglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <PasswordIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="text-right">
          <button type="button" className="text-gray-600 hover:underline text-sm font-medium" onClick={onNavigateToForgotPassword}>
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02]"
          style={{ backgroundColor: loading ? '#6b5b4d' : '#4a3a2f', boxShadow: '0 4px 20px rgba(74, 58, 47, 0.3)' }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <span className="text-gray-600">Don't have an account? </span>
        <button onClick={onNavigateToSignUp} className="font-semibold hover:underline" style={{ color: '#4a3a2f' }}>
          Sign Up
        </button>
      </div>
    </div>
  );
};


const LoginPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.phone || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.phone, formData.password);
      if (result.success) {
        navigate('/user/home');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const features = [
    { icon: Star, text: "Premium Experience" },
    { icon: Users, text: "Connect with Coffee Lovers" },
    { icon: Zap, text: "Fast & Rewarding Points" },
    { icon: Shield, text: "Secure & Trusted Platform" }
  ];

  const formProps = {
    formData,
    showPassword,
    loading,
    error,
    onInputChange: handleInputChange,
    onTogglePassword: () => setShowPassword(!showPassword),
    onSubmit: handleSubmit,
    onNavigateToSignUp: () => onNavigate && onNavigate('signup'),
    onNavigateToForgotPassword: () => navigate('/user/forgot-password'),
  };

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

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== Desktop Layout ==================== */}
      <div className="hidden lg:flex min-h-screen">
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
          <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white">
            <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <img src={logo} alt="CafeChain Logo" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-6 shadow-2xl" />
              <h1 className="text-3xl font-bold mb-3 text-center">CafeChain</h1>
              <p className="text-lg opacity-90 text-center mb-8 leading-relaxed">
                Where every cup tells a story and every connection matters
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
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
            <LoginForm {...formProps} />
          </div>
        </div>
      </div>
      {/* ==================== Mobile Layout ==================== */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="p-6 bg-white rounded-b-3xl relative z-10">
          <div className={`text-center transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-3xl font-bold mb-3" style={{ color: '#4a3a2f' }}>Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue your coffee journey</p>
          </div>
        </div>
        <div className="flex-1 p-6 bg-gray-50">
          <div className={`transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
            <LoginForm {...formProps} isMobile={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
