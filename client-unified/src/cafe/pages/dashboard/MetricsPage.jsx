import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import Loader from "../../components/Loader"; // Loader component

const luxuryBoxVariants = {
  rest: { scale: 1, boxShadow: "0 4px 28px rgba(74,58,47,0.15)" },
  hover: { scale: 1.04, boxShadow: "0 8px 48px rgba(74,58,47,0.3)" },
  float: {
    y: [0, -6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
};

function LoyaltyProgramPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();

  // ✅ Loader state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for at least 800ms even if metrics are ready immediately
    const timer = setTimeout(() => {
      if (state?.metrics) setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [state?.metrics]);

  if (isLoading) return <Loader />; // Show loader while loading

  const daily = state.metrics.daily || { pointsRedeemed: 0, transactions: 0 };
  const monthly = state.metrics.monthly || { redemptionRate: 0 };
  const avgPoints =
    daily.transactions > 0
      ? (daily.pointsRedeemed / daily.transactions).toFixed(1)
      : "N/A";

  return (
    <div className="relative min-h-screen bg-white px-6 sm:px-8 md:px-10 py-10 md:py-14">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4a3a2f] hover:text-black transition text-base md:text-lg font-medium"
      >
        ← Back
      </button>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-[#4a3a2f] mb-10 sm:mb-12 md:mb-16 tracking-tight"
      >
        Loyalty Program Metrics
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={luxuryBoxVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#fffaf5] to-[#e5d4c3] text-[#4a3a2f] rounded-2xl md:rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 h-56 sm:h-64 md:h-72 border-[2px] md:border-[3px] border-[#4a3a2f]/30"
        >
          <p className="text-base sm:text-lg font-medium opacity-90">Points Redeemed (Today)</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4">{daily.pointsRedeemed ?? 0}</h2>
        </motion.div>

        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={luxuryBoxVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#fdfdfc] to-[#dcd5c3] text-[#4a3a2f] rounded-2xl md:rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 h-56 sm:h-64 md:h-72 border-[2px] md:border-[3px] border-[#4a3a2f]/30"
        >
          <p className="text-base sm:text-lg font-medium opacity-90">Redemption Rate</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4">{monthly.redemptionRate ?? 0}%</h2>
        </motion.div>

        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={luxuryBoxVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#fefdf9] to-[#e9e3d0] text-[#4a3a2f] rounded-2xl md:rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 h-56 sm:h-64 md:h-72 border-[2px] md:border-[3px] border-[#4a3a2f]/30"
        >
          <p className="text-base sm:text-lg font-medium opacity-90">Avg. Points / Transaction</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4">{avgPoints}</h2>
        </motion.div>
      </div>
    </div>
  );
}

export default LoyaltyProgramPage;
