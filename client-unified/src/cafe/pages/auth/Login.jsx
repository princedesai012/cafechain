// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { Mail, Lock, Eye, EyeOff, Users, Zap, Shield, Star, Coffee } from 'lucide-react';
// import Loader from '../../components/Loader';

// const useAppContext = () => ({ dispatch: (action) => console.log('Dispatching action:', action) });

// const LoginForm = ({
//   email,
//   password,
//   showPassword,
//   isLoading,
//   onEmailChange,
//   onPasswordChange,
//   onTogglePassword,
//   onSubmit,
//   isMobile = false
// }) => {
//   const PasswordIcon = showPassword ? EyeOff : Eye;

//   return (
//     <div>
//       <form onSubmit={onSubmit} className="space-y-5">
//         {!isMobile && (
//           <div className="text-center mb-4">
//             <h2 className="text-2xl font-bold mb-2" style={{ color: '#4a3a2f' }}>Sign In</h2>
//             <p className="text-gray-600">Enter your credentials</p>
//           </div>
//         )}

//         <div className="space-y-2">
//           <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Email Address</label>
//           <div className="relative group">
//             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="email"
//               value={email}
//               onChange={onEmailChange}
//               placeholder="Enter your email address"
//               className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Password</label>
//           <div className="relative group">
//             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={onPasswordChange}
//               placeholder="Enter your password"
//               className="w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
//               required
//             />
//             <button type="button" onClick={onTogglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//               <PasswordIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         <div className="text-right">
//           <Link to="/cafe/forgot-password" className="text-gray-600 hover:underline text-sm font-medium">
//             Forgot Password?
//           </Link>
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02]"
//           style={{ backgroundColor: isLoading ? '#6b5b4d' : '#4a3a2f', boxShadow: '0 4px 20px rgba(74, 58, 47, 0.3)' }}
//         >
//           {isLoading ? 'Signing In...' : 'Sign In'}
//         </button>
//       </form>

//       <div className="text-center mt-6 pt-4 border-t border-gray-100">
//         <span className="text-gray-600">Don't have an account? </span>
//         <Link to="/cafe/auth/register" className="font-semibold hover:underline" style={{ color: '#4a3a2f' }}>
//           Sign Up
//         </Link>
//       </div>
//     </div>
//   );
// };

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   const { dispatch } = useAppContext();
//   const navigate = useNavigate();

//   useEffect(() => {
//     setMounted(true);
//     const fetchInitialData = async () => {
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         setIsLoading(false);
//       } catch {
//         toast.error('Failed to load page');
//         setIsLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     setTimeout(() => {
//       if (!email || !password) {
//         toast.error('Please fill in all fields');
//         setIsLoading(false);
//         return;
//       }

//       const user = { id: 'user-123', email, name: email.split('@')[0] };
//       dispatch({ type: 'LOGIN', payload: user });
//       toast.success('Login successful!');
//       setIsLoading(false);
//       navigate('/');
//     }, 1000);
//   };

//   const features = [
//     { icon: Star, text: "Premium Experience" },
//     { icon: Users, text: "Connect with Coffee Lovers" },
//     { icon: Zap, text: "Fast & Rewarding Points" },
//     { icon: Shield, text: "Secure & Trusted Platform" }
//   ];

//   const RunningIcons = () => (
//     <div className="flex w-1/2 items-center justify-around flex-shrink-0">
//       <Coffee className="w-10 h-10 text-white opacity-20" />
//       <Star className="w-8 h-8 text-white opacity-10" />
//       <Coffee className="w-14 h-14 text-white opacity-25" />
//       <Users className="w-8 h-8 text-white opacity-10" />
//       <Coffee className="w-10 h-10 text-white opacity-20" />
//       <Zap className="w-8 h-8 text-white opacity-10" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white relative">
//       <style>
//         {`
//           @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
//           .animate-marquee { animation: marquee 20s linear infinite; }
//           @keyframes shine { 0%, 100% { box-shadow: 0 0 6px rgba(255,255,255,0.7), 0 0 10px rgba(229,231,235,0.5); } 50% { box-shadow: 0 0 12px rgba(255,255,255,1), 0 0 20px rgba(229,231,235,1); } }
//           @keyframes sparkle-animation { 0% { transform: scale(0) rotate(0deg); opacity: 0.5; } 50% { transform: scale(1.2) rotate(180deg); opacity: 1; } 100% { transform: scale(0) rotate(360deg); opacity: 0.5; } }
//           .logo-container { position: relative; display: inline-block; }
//           .logo-container > img { animation: shine 3s infinite ease-in-out; }
//           .logo-container::before, .logo-container::after { content: ''; position: absolute; background: white; border-radius: 50%; box-shadow: 0 0 4px #e5e7eb, 0 0 8px #f9fafb; animation: sparkle-animation 2.5s infinite ease-in-out; z-index: 1; }
//           .logo-container::before { width: 8px; height: 8px; top: -3px; right: -3px; animation-delay: 0s; }
//           .logo-container::after { width: 6px; height: 6px; bottom: -2px; left: -2px; animation-delay: 1.25s; }
//         `}
//       </style>

//       <div className="hidden lg:flex min-h-screen">
//         <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
//           <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white">
//             <div className={`text-center transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
//               <div className="logo-container mb-6">
//                 <img src="/src/cafe/assets/cc.png" alt="CafeChain Logo" className="w-20 h-20 rounded-full object-cover shadow-2xl" />
//               </div>
//               <h1 className="text-3xl font-bold mb-3">CafeChain</h1>
//               <p className="text-lg opacity-90 mb-8 leading-relaxed">
//                 Where every cup tells a story and every connection matters
//               </p>
//             </div>
//             <div className="space-y-4 max-w-md mb-12">
//               {features.map((feature, index) => (
//                 <div key={index} className={`flex items-center space-x-4 transform transition-all duration-700 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${0.3 + index * 0.15}s` }}>
//                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"> <feature.icon className="w-6 h-6" /> </div>
//                   <span className="text-lg">{feature.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="absolute bottom-0 left-0 right-0 h-32 w-full overflow-hidden">
//             <div className="absolute top-0 left-0 flex w-[200%] h-full animate-marquee"> <RunningIcons /> <RunningIcons /> </div>
//           </div>
//         </div>
//         <div className="flex-1 flex items-center justify-center p-8 bg-white">
//           <div className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
//             <LoginForm
//               email={email}
//               password={password}
//               showPassword={showPassword}
//               isLoading={isLoading}
//               onEmailChange={(e) => setEmail(e.target.value)}
//               onPasswordChange={(e) => setPassword(e.target.value)}
//               onTogglePassword={() => setShowPassword(!showPassword)}
//               onSubmit={handleSubmit}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="lg:hidden min-h-screen flex flex-col">
//         <div className="p-6 bg-white rounded-b-3xl relative z-10">
//           <div className={`text-center transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
//             <h1 className="text-3xl font-bold mb-3" style={{ color: '#4a3a2f' }}>Welcome Back!</h1>
//             <p className="text-gray-600">Sign in to continue your coffee journey</p>
//           </div>
//         </div>
//         <div className="flex-1 p-6 bg-gray-50">
//           <div className={`transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
//             <LoginForm
//               isMobile={true}
//               email={email}
//               password={password}
//               showPassword={showPassword}
//               isLoading={isLoading}
//               onEmailChange={(e) => setEmail(e.target.value)}
//               onPasswordChange={(e) => setPassword(e.target.value)}
//               onTogglePassword={() => setShowPassword(!showPassword)}
//               onSubmit={handleSubmit}
//             />
//           </div>
//         </div>
//       </div>

//       {isLoading && <Loader />}
//     </div>
//   );
// }

// export default Login;


import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Users, Zap, Shield, Star, Coffee } from 'lucide-react';
import Loader from '../../components/Loader';
import { useAppContext } from '../../store/AppContext';

const LoginForm = ({
  email,
  password,
  showPassword,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  isMobile = false
}) => {
  const PasswordIcon = showPassword ? EyeOff : Eye;
  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5">
        {!isMobile && (
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#4a3a2f' }}>Sign In</h2>
            <p className="text-gray-600">Enter your credentials</p>
          </div>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={onPasswordChange}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
              required
            />
            <button type="button" onClick={onTogglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <PasswordIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <Link to="/cafe/forgot-password" className="text-gray-600 hover:underline text-sm font-medium">
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02]"
          style={{ backgroundColor: isLoading ? '#6b5b4d' : '#4a3a2f', boxShadow: '0 4px 20px rgba(74, 58, 47, 0.3)' }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/cafe/auth/register" className="font-semibold hover:underline" style={{ color: '#4a3a2f' }}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('https://cafechain.onrender.com/api/cafe-owner/login', { email, password });
      localStorage.setItem('cafe_token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      dispatch({ 
        type: 'LOGIN', 
        payload: { ...response.data.cafe, token: response.data.token, status: response.data.cafe.status }
      });
      toast.success(response.data.message);
      if (response.data.cafe.status === 'active') {
        navigate('/cafe');
      } else if (response.data.cafe.status === 'pendingApproval') {
        navigate('/cafe/pending-approval');
      } else {
        navigate('/cafe/setup');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Star, text: "Premium Experience" },
    { icon: Users, text: "Connect with Coffee Lovers" },
    { icon: Zap, text: "Fast & Rewarding Points" },
    { icon: Shield, text: "Secure & Trusted Platform" }
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

  return (
    <div className="min-h-screen bg-white relative">
      <div className="hidden lg:flex min-h-screen">
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
          <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white">
            <div className={`text-center transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* <div className="logo-container mb-6">
                <img src="/src/assets/logo.jpg" alt="CafeChain Logo" className="w-20 h-20 rounded-full object-cover shadow-2xl" />
              </div> */}
              <h1 className="text-3xl font-bold mb-3">CafeChain</h1>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Where every cup tells a story and every connection matters
              </p>
            </div>
            <div className="space-y-4 max-w-md mb-12">
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
              <RunningIcons /> <RunningIcons />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
            <LoginForm
              email={email}
              password={password}
              showPassword={showPassword}
              isLoading={isLoading}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="p-6 bg-white rounded-b-3xl relative z-10">
          <div className={`text-center transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-3xl font-bold mb-3" style={{ color: '#4a3a2f' }}>Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue your coffee journey</p>
          </div>
        </div>
        <div className="flex-1 p-6 bg-gray-50">
          <div className={`transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
            <LoginForm
              isMobile={true}
              email={email}
              password={password}
              showPassword={showPassword}
              isLoading={isLoading}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  );
}
export default Login;