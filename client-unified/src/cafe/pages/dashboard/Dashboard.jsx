import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import StatusToggle from "../../components/StatusToggle";
import Loader from "../../components/Loader"; // ✅ Import Loader

function Dashboard() {
  const { state } = useAppContext();
  const { cafeInfo, metrics } = state;

  const [isLoading, setIsLoading] = useState(true); // ✅ Loader state

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader />; // ✅ Show loader while loading

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-3 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <header className="bg-white shadow-lg rounded-2xl mb-6 p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

            {/* Cafe Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={cafeInfo?.logo || "https://placehold.co/80x80?text=Cafe"}
                  alt={`${cafeInfo?.name || "Cafe"} logo`}
                  className="h-20 w-20 rounded-full ring-2 ring-[#4a3a2f]/30 shadow-md"
                />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#4a3a2f] leading-snug">
                  {cafeInfo?.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{cafeInfo?.address}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-start sm:items-center">
              <div className="bg-gray-100 p-2 rounded-lg shadow-inner">
                <StatusToggle />
              </div>
              <Link
                to="/cafe/dashboard/profile"
                className="bg-[#4a3a2f] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#3d312a] transition-colors duration-200 shadow-md hover:shadow-lg text-center transform hover:-translate-y-1"
              >
                Profile & Settings
              </Link>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        <section aria-labelledby="overview-heading" className="mb-8 animate-fade-in-up">
          <h2 id="overview-heading" className="text-2xl font-bold text-[#4a3a2f] mb-4">
            Today's Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sales */}
            <article className="bg-white shadow-lg rounded-xl p-5 border-t-4 border-emerald-500 transform hover:rotate-1 hover:scale-[1.02] transition-all duration-300">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Total Sales
              </p>
              <p className="text-3xl font-bold text-[#4a3a2f]">
                ${metrics?.daily?.sales.toFixed(2)}
              </p>
              <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                +12% today
              </span>
            </article>

            {/* Customers */}
            <article className="bg-white shadow-lg rounded-xl p-5 border-t-4 border-blue-500 transform hover:rotate-1 hover:scale-[1.02] transition-all duration-300">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                New Customers
              </p>
              <p className="text-3xl font-bold text-[#4a3a2f]">
                {metrics?.daily?.newCustomers}
              </p>
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                +5 new
              </span>
            </article>

            {/* Redemptions */}
            <article className="bg-white shadow-lg rounded-xl p-5 border-t-4 border-purple-500 transform hover:rotate-1 hover:scale-[1.02] transition-all duration-300">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Redemptions
              </p>
              <p className="text-3xl font-bold text-[#4a3a2f]">
                {metrics?.daily?.redemptions}
              </p>
              <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                Active
              </span>
            </article>
          </div>
        </section>

        {/* Quick Actions */}
        <section aria-labelledby="actions-heading" className="animate-fade-in-up">
          <h2 id="actions-heading" className="text-2xl font-bold text-[#4a3a2f] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Metrics */}
            <article className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-300">
              <Link to="/cafe/dashboard/metrics" className="block p-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#4a3a2f] to-[#3d312a] mb-3 w-fit group-hover:rotate-6 transition-transform">
                  {/* Chart Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19V10M6 19V4M16 19v-7M21 19V8" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#4a3a2f] mb-1">Metrics</h3>
                <p className="text-sm text-gray-600">View detailed sales and customer metrics</p>
              </Link>
            </article>

            {/* Redemption */}
            <article className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-300">
              <Link to="/cafe/dashboard/redemption" className="block p-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 mb-3 w-fit group-hover:rotate-6 transition-transform">
                  {/* Gift Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0H4m16 0a2 2 0 01-2-2h-3.5a1.5 1.5 0 01-1.5-1.5V7m-8 5a2 2 0 002-2V7m0 0a2 2 0 114 0v3a2 2 0 002 2m-6-5a2 2 0 11-4 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#4a3a2f] mb-1">Redemption</h3>
                <p className="text-sm text-gray-600">Process customer reward redemptions</p>
              </Link>
            </article>

            {/* Ads & Events */}
            <article className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-300">
              <Link to="/cafe/dashboard/ads-events" className="block p-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mb-3 w-fit group-hover:rotate-6 transition-transform">
                  {/* Megaphone Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l6-2v14l-6-2M5 8v8a2 2 0 002 2h2l3 3V5L9 2H7a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#4a3a2f] mb-1">Ads & Events</h3>
                <p className="text-sm text-gray-600">Manage promotions and special events</p>
              </Link>
            </article>

            {/* Activity */}
            <article className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-300">
              <Link to="/cafe/dashboard/activity" className="block p-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mb-3 w-fit group-hover:rotate-6 transition-transform">
                  {/* Clock Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#4a3a2f] mb-1">Activity Log</h3>
                <p className="text-sm text-gray-600">View recent transactions and activities</p>
              </Link>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
