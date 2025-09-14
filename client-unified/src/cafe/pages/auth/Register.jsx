import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Phone, Eye, EyeOff, Coffee, Star, Users, Zap, Shield } from 'lucide-react';
import Loader from '../../components/Loader'; // Make sure you have this Loader component

const useAppContext = () => ({ dispatch: (action) => console.log('Dispatching action:', action) });

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true); // loader initially true
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 1500); // initial 1.5s loader
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 digits.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    if (!formData.email || !formData.password || !formData.phone) {
      toast.error('Please fill in all required fields');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true); // loader during API call

    setTimeout(() => {
      const user = {
        id: `user-${Date.now()}`,
        email: formData.email,
        phone: formData.phone,
        name: formData.email.split('@')[0]
      };

      dispatch({ type: 'REGISTER', payload: user });
      toast.success('Registration successful!');
      setIsLoading(false);
      navigate('/');
    }, 1000);
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

  // Show loader over full screen if loading
  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          @keyframes shine {
            0%, 100% {
              box-shadow: 0 0 6px rgba(255, 255, 255, 0.7), 0 0 10px rgba(229, 231, 235, 0.5);
            }
            50% {
              box-shadow: 0 0 12px rgba(255, 255, 255, 1), 0 0 20px rgba(229, 231, 235, 1);
            }
          }
          @keyframes sparkle-animation {
            0% { transform: scale(0) rotate(0deg); opacity: 0.5; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
            100% { transform: scale(0) rotate(360deg); opacity: 0.5; }
          }
          .logo-container {
            position: relative;
            display: inline-block;
          }
          .logo-container > img {
            animation: shine 3s infinite ease-in-out;
          }
          .logo-container::before,
          .logo-container::after {
            content: '';
            position: absolute;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 4px #e5e7eb, 0 0 8px #f9fafb;
            animation: sparkle-animation 2.5s infinite ease-in-out;
            z-index: 1;
          }
          .logo-container.desktop::before {
            width: 8px;
            height: 8px;
            top: -3px;
            right: -3px;
            animation-delay: 0s;
          }
           .logo-container.desktop::after {
            width: 6px;
            height: 6px;
            bottom: -2px;
            left: -2px;
            animation-delay: 1.25s;
          }
        `}
      </style>

      {/* ==================== Desktop Layout ==================== */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Register Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#4a3a2f' }}>
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Sign up to start your journey with CafeChain
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={handleChange}
                    placeholder="Enter your email"
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
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
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
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    autoComplete="new-password"
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
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: isLoading ? '#6b5b4d' : '#4a3a2f', ...(!isLoading && {':hover': {backgroundColor: '#6b5b4d'}}) }}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/cafe/auth/login"
                className="font-semibold transition-colors"
                style={{ color: '#4a3a2f' }}
              >
                Sign in
              </Link>
            </div>

            <div className="text-sm text-center mt-6">
              <p className="text-gray-600">
                By registering, you agree to our{' '}
                <a href="#" className="font-medium transition-colors" style={{ color: '#4a3a2f' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium transition-colors" style={{ color: '#4a3a2f' }}>
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Branding with running animation */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
          <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white">
            <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex justify-center mb-6">
                <div className="logo-container desktop">
                  <img
                    className="w-20 h-20 rounded-full object-cover shadow-2xl border-4 border-gray-300"
                    src="/src/cafe/assets/cc.png" /* Or use a placeholder: "https://placehold.co/80x80/4a3a2f/ffffff?text=C&font=inter" */
                    alt="CafeChain Logo"
                  />
                </div>
              </div>
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
        <div className="flex-1 flex items-center justify-center px-6 py-8 bg-white">
          <div className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#4a3a2f' }}>
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Sign up to start your journey with CafeChain
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={handleChange}
                    placeholder="Enter your email"
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
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
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
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    autoComplete="new-password"
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
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: isLoading ? '#6b5b4d' : '#4a3a2f' }}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/cafe/auth/login"
                className="font-semibold transition-colors"
                style={{ color: '#4a3a2f' }}
              >
                Sign in
              </Link>
            </div>

            <div className="text-sm text-center mt-6">
              <p className="text-gray-600">
                By registering, you agree to our{' '}
                <a href="#" className="font-medium transition-colors" style={{ color: '#4a3a2f' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium transition-colors" style={{ color: '#4a3a2f' }}>
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

