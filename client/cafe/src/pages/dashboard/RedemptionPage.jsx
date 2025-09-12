import { useState, useEffect } from 'react';
import { useAppContext } from '../../store/AppContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Award, Unlock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader'; // ✅ Import Loader

// --- Color Palette ---
const PRIMARY = '#4a3a2f';
const ACCENT = '#d4af37';
const LIGHT_GOLD = '#f0d98c';

function RedemptionPage() {
  const { state, dispatch } = useAppContext();
  const { pendingOtp } = state;
  const navigate = useNavigate();

  const [step, setStep] = useState('inputPhone');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [isLoading, setIsLoading] = useState(true); // ✅ Loader state

  const customerPoints = 150;

  // --- Loader logic ---
  useEffect(() => {
    // show loader for at least 800ms on mount
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader />; // ✅ Show loader while page is loading

  // --- Core Logic ---
  const handleGenerateOtp = () => {
    if (!customerPhone) return toast.error('Please enter customer mobile number');
    if (pointsToRedeem <= 0 || pointsToRedeem > customerPoints)
      return toast.error('Enter a valid points number to redeem');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    dispatch({
      type: 'GENERATE_OTP',
      payload: { otp, customerPhone, pointsToRedeem, timestamp: new Date().toISOString() },
    });
    toast.success('OTP generated successfully!');
    setStep('verifyOtp');
  };

  const handleVerifyOtp = () => {
    if (!pendingOtp) return toast.error('No OTP generated');
    if (otpInput !== pendingOtp.otp) return toast.error('Invalid OTP');
    setIsVerifying(true);
    setTimeout(() => {
      const transaction = {
        id: `txn-${Date.now()}`,
        customerPhone: pendingOtp.customerPhone,
        pointsRedeemed: pendingOtp.pointsToRedeem,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };
      dispatch({ type: 'VERIFY_OTP', payload: { transaction } });
      toast.success('Points successfully redeemed!');
      setCustomerPhone('');
      setPointsToRedeem(0);
      setOtpInput('');
      setStep('inputPhone');
      setIsVerifying(false);
      dispatch({ type: 'CLEAR_OTP' });
    }, 1200);
  };

  const handleBack = () => navigate(-1);
  const handleFormBack = () => {
    if (step === 'verifyOtp') {
      setStep('inputPhone');
      dispatch({ type: 'CLEAR_OTP' });
      setOtpInput('');
    }
  };

  // --- Framer Motion Variants ---
  const formVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const features = [
    { icon: Gift, text: "Exclusive Rewards" },
    { icon: Award, text: "Premium Catalog" },
    { icon: Sparkles, text: "Instant Redemption" },
  ];

  const buttonHover = { scale: 1.05, boxShadow: `0 0 20px ${ACCENT}` };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#1e1c1b] font-sans">
      {/* Left Panel: Luxury Branding - Desktop View */}
      <div
        className="hidden lg:flex lg:flex-1 relative items-center justify-center p-8 overflow-hidden"
        style={{ backgroundColor: PRIMARY }}
      >
        <motion.div
          className="relative z-10 text-center text-white p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-serif font-extrabold tracking-wide mb-4">
            The Rewards Vault
          </h1>
          <p className="text-lg mb-8 leading-relaxed opacity-80">
            Unlock a world of exclusive experiences and premium rewards.
          </p>
          <div className="space-y-6 max-w-sm mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                  style={{ borderColor: ACCENT }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: ACCENT }} />
                </div>
                <span className="text-lg font-semibold">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Background Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="${ACCENT.replace('#', '%23')}" opacity="0.1"><path d="M0 0h100v100H0z"/><path d="M100 0L50 50L0 0h100zM0 100l50-50L100 100H0z"/></g></svg>')`,
            backgroundSize: '30px 30px',
          }}
        ></div>
      </div>
      
      {/* Right Panel: The Redemption Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-white to-[#fcfaf7]">
        <motion.div
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 lg:p-12 flex flex-col gap-8 border-2"
          style={{ borderColor: LIGHT_GOLD }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back button is now always visible */}
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            className="self-start text-lg font-semibold flex items-center gap-2 mb-4"
            style={{ color: PRIMARY }}
          >
            <ChevronLeft size={20} /> Back
          </motion.button>

          <AnimatePresence mode="wait">
            {step === 'inputPhone' && (
              <motion.form
                key="phoneStep"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGenerateOtp();
                }}
                className="flex flex-col gap-6"
              >
                <h2
                  className="text-3xl lg:text-4xl font-serif font-bold text-center mb-4"
                  style={{ color: PRIMARY }}
                >
                  Redeem Your Points
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  Enter your details to generate a secure OTP.
                </p>

                <label className="block text-gray-700 font-medium text-lg">
                  Customer Mobile Number
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 234 567 8901"
                    className="mt-2 w-full rounded-xl border border-gray-300 p-4 text-lg shadow-md focus:outline-none transition duration-300"
                    style={{
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      borderColor: LIGHT_GOLD,
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = `0 0 0 4px ${ACCENT}30`)}
                    onBlur={(e) => (e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)')}
                    required
                  />
                </label>

                <label className="block text-gray-700 font-medium text-lg">
                  Points to Redeem (Available: {customerPoints})
                  <input
                    type="number"
                    min={1}
                    max={customerPoints}
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                    placeholder="Enter points"
                    className="mt-2 w-full rounded-xl border border-gray-300 p-4 text-lg shadow-md focus:outline-none transition duration-300"
                    style={{
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      borderColor: LIGHT_GOLD,
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = `0 0 0 4px ${ACCENT}30`)}
                    onBlur={(e) => (e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)')}
                    required
                  />
                </label>

                <motion.button
                  type="submit"
                  className="bg-primary text-white font-bold py-4 rounded-2xl shadow-lg transition duration-300"
                  style={{ backgroundColor: PRIMARY, transition: 'all 0.3s ease' }}
                  whileHover={buttonHover}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate OTP
                </motion.button>
              </motion.form>
            )}

            {step === 'verifyOtp' && pendingOtp && (
              <motion.div
                key="verifyStep"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-6"
              >
                {/* Internal form back button */}
                <motion.button
                  onClick={handleFormBack}
                  whileHover={{ scale: 1.05 }}
                  className="self-start text-lg font-semibold flex items-center gap-2"
                  style={{ color: PRIMARY }}
                >
                  <Unlock size={20} /> Back
                </motion.button>

                <h2
                  className="text-3xl lg:text-4xl font-serif font-bold text-center mb-4"
                  style={{ color: PRIMARY }}
                >
                  Verify OTP
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  A verification code has been sent to your mobile.
                </p>

                <motion.div
                  className="bg-white p-6 rounded-2xl border-2 shadow-inner"
                  style={{ borderColor: ACCENT }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { delay: 0.2 } }}
                >
                  <p className="text-lg font-semibold" style={{ color: PRIMARY }}>
                    OTP sent to: <span className="font-mono">{pendingOtp.customerPhone}</span>
                  </p>
                  <p className="text-md mt-2 text-gray-600">
                    Points to redeem: <span className="font-semibold" style={{ color: PRIMARY }}>{pendingOtp.pointsToRedeem}</span>
                  </p>
                </motion.div>

                <motion.form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyOtp();
                  }}
                  className="flex flex-col gap-4"
                >
                  <label className="block text-gray-700 font-medium text-lg">
                    Enter OTP
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="• • • • • •"
                      className="mt-2 w-full rounded-2xl border border-gray-300 p-5 text-3xl text-center font-mono tracking-widest shadow-md focus:outline-none transition duration-300"
                      style={{
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        borderColor: LIGHT_GOLD,
                        transition: 'all 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.boxShadow = `0 0 0 4px ${ACCENT}30`)}
                      onBlur={(e) => (e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)')}
                      required
                      inputMode="numeric"
                      pattern="\d{6}"
                    />
                  </label>

                  <motion.button
                    type="submit"
                    disabled={isVerifying || otpInput.length !== 6}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition duration-300`}
                    style={{ backgroundColor: isVerifying || otpInput.length !== 6 ? 'gray' : PRIMARY }}
                    whileHover={!(isVerifying || otpInput.length !== 6) && buttonHover}
                    whileTap={{ scale: 0.98 }}
                    aria-busy={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify & Redeem'}
                  </motion.button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default RedemptionPage;