import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getLoyaltyMetrics } from "../../api/api"; // ✅ Import the new API function
import Loader from "../../components/Loader";

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

// Assuming the component name is MetricsPage based on file path
function MetricsPage() { 
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await getLoyaltyMetrics();
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to fetch loyalty metrics", error);
        // Set default values on error to avoid UI crash
        setMetrics({
          pointsRedeemedToday: 0,
          redemptionRate: 0,
          avgPointsPerTransaction: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading) return <Loader />;

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
          <p className="text-base sm:text-lg font-medium opacity-90">Amount Redeemed (Today)</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4">
            {metrics?.pointsRedeemedToday ?? 0}
          </h2>
        </motion.div>

        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={luxuryBoxVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#fdfdfc] to-[#dcd5c3] text-[#4a3a2f] rounded-2xl md:rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 h-56 sm:h-64 md:h-72 border-[2px] md:border-[3px] border-[#4a3a2f]/30"
        >
          <p className="text-base sm:text-lg font-medium opacity-90">Redemption Rate (Monthly)</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4">
            {metrics?.redemptionRate ?? 0}%
          </h2>
        </motion.div>

        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={luxuryBoxVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#fefdf9] to-[#e9e3d0] text-[#4a3a2f] rounded-2xl md:rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 h-56 sm:h-64 md:h-72 border-[2px] md:border-[3px] border-[#4a3a2f]/30"
        >
          <p className="text-base sm:text-lg font-medium opacity-90">Avg. Amount / Transaction</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4">
            {metrics?.avgPointsPerTransaction ?? 0}
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

export default MetricsPage;