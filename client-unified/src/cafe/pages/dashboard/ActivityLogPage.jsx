import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import Loader from "../../components/Loader"; // ✅ Import loader

// 🎨 Animation variants for cards (luxury floating effect)
const luxuryBoxVariants = {
  rest: { scale: 1, boxShadow: "0 4px 28px rgba(74,58,47,0.15)" },
  hover: { scale: 1.04, boxShadow: "0 8px 48px rgba(74,58,47,0.3)" },
  float: {
    y: [0, -6, 0],
    transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
  },
};

function ActivityLogPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();

  const [isLoading, setIsLoading] = useState(true); // ✅ Loader state
  const [timeFilter, setTimeFilter] = useState("today");

  // ✅ Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // 1s loader
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader />; // ✅ Show loader until ready

  // ✅ Get transactions safely
  const transactions = Array.isArray(state.transactions) ? state.transactions : [];

  // Prepare date boundaries
  const currentDate = new Date();
  const today = new Date(currentDate.setHours(0, 0, 0, 0));
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (timeFilter === "today" && transactionDate < today) return false;
    if (timeFilter === "week" && transactionDate < oneWeekAgo) return false;
    if (timeFilter === "month" && transactionDate < oneMonthAgo) return false;
    return true;
  });

  // Calculate points
  const totalPointsEarned = filteredTransactions
    .filter((t) => t.type === "points" && t.status === "completed")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalPointsRedeemed = filteredTransactions
    .filter((t) => t.type === "redeem" && t.status === "completed")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="relative min-h-screen bg-white px-6 md:px-10 py-12 md:py-14">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4a3a2f] hover:text-black transition text-base md:text-lg font-medium"
      >
        ← Back
      </button>

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-5xl font-extrabold text-center text-[#4a3a2f] mb-12 md:mb-16 tracking-tight"
      >
        Activity Log – Points Summary
      </motion.h1>

      {/* Time Filter */}
      <div className="max-w-md mx-auto mb-8 md:mb-12">
        <label htmlFor="timeFilter" className="block text-sm font-medium text-[#4a3a2f] mb-2">
          Time Period
        </label>
        <select
          id="timeFilter"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="block w-full pl-4 pr-10 py-3 text-base border-[#4a3a2f]/40 focus:outline-none focus:ring-2 focus:ring-[#4a3a2f] focus:border-[#4a3a2f] sm:text-sm rounded-xl bg-white shadow"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Points Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto mt-16">
        {/* Earned Points */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={luxuryBoxVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#fffaf5] to-[#e5d4c3] text-[#4a3a2f] rounded-3xl shadow-2xl p-10 md:p-14 h-60 md:h-60 border-[3px] border-[#4a3a2f]/30"
        >
          <p className="text-base md:text-lg font-medium opacity-90">Total Points Earned</p>
          <h2 className="text-5xl md:text-7xl font-extrabold mt-6">{totalPointsEarned}</h2>
        </motion.div>

        {/* Redeemed Points */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={luxuryBoxVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#fffaf5] to-[#e5d4c3] text-[#4a3a2f] rounded-3xl shadow-2xl p-10 md:p-14 h-60 md:h-60 border-[3px] border-[#4a3a2f]/30"
        >
          <p className="text-base md:text-lg font-medium opacity-90">Total Points Redeemed</p>
          <h2 className="text-5xl md:text-7xl font-extrabold mt-6">{totalPointsRedeemed}</h2>
        </motion.div>
      </div>
    </div>
  );
}

export default ActivityLogPage;
