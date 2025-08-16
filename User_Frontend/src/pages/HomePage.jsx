import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HomePage = () => {
  // Initialize the navigation function
  const navigate = useNavigate();

  // Example data, replace with your actual data/props if needed
  const points = 1800;
  const nearbyCafes = 5;

  // Example activity and cafes data
  const activities = [
    { name: "Cafe Soul", desc: "Visit reward", points: "+50" },
    { name: "Brew & Bean", desc: "Referral bonus", points: "+75" },
  ];
  const cafes = [
    {
      id: 1, // Add a unique ID for each cafe
      name: "The Cafe de meet",
      desc: "Downtown, City Center",
      distance: "0.5km",
      img: "/assets/Images/Photo1.jpg",
    },
    {
      id: 2,
      name: "Cafe Soul",
      desc: "Arts District",
      distance: "1.2km",
      img: "/assets/Images/Photo2.jpg",
    },
    {
      id: 3,
      name: "Brew & Bean",
      desc: "University Area",
      distance: "0.8km",
      img: "/assets/Images/Photo3.jpg",
    },
  ];

  // Workflow steps for desktop
  const workflowSteps = [
    {
      title: "1. Join & Check-In",
      desc: "Sign up and check in at partner cafes to start collecting CashPoints for every visit.",
      icon: (
        <svg width="28" height="28" fill="none" stroke="#7c5a36" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      ),
    },
    {
      title: "2. Refer & Earn",
      desc: "Share your unique referral code. You and your friends earn bonus points when they make their first visit.",
      icon: (
        <svg width="28" height="28" fill="none" stroke="#7c5a36" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "3. Redeem Rewards",
      desc: "Use your CashPoints to pay for coffee, food, and more at any participating cafe.",
      icon: (
        <svg width="28" height="28" fill="none" stroke="#7c5a36" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M16 3v4M8 3v4" />
        </svg>
      ),
    },
  ];

  // Function to handle the click on a cafe
  const handleCafeClick = (cafeId) => {
    navigate(`/cafes/${cafeId}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background">
      <div className="w-full px-2 py-6 flex flex-col gap-8 md:max-w-full md:px-12 lg:px-24 xl:px-40 2xl:px-64">
        {/* Points Banner */}
        <div
          className="rounded-3xl px-6 py-7 mb-2 mx-auto w-full md:w-full"
          style={{
            background: "linear-gradient(120deg, #d6ad7b 0%, #7c5a36 100%)",
            color: "#fff",
            maxWidth: "100%",
          }}
        >
          <div className="text-2xl font-semibold mb-2">Hey Deep</div>
          <div className="text-4xl font-bold">1800 Points</div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow p-4 mb-2 w-full mx-auto">
          <div className="text-lg font-semibold text-dark-brown mb-3">Quick Actions</div>
          <div className="flex flex-row gap-4">
            <div className="flex-1 bg-[#f7f6f3] rounded-xl flex flex-col items-center justify-center py-6">
              <div className="text-gray-500 text-sm">Points you earn</div>
              <div className="text-2xl font-bold text-[#d6ad7b]">{points}</div>
              <div className="text-gray-400 text-xs">XP points</div>
            </div>
            <div className="flex-1 bg-[#f7f6f3] rounded-xl flex flex-col items-center justify-center py-6">
              <div className="text-2xl font-bold text-[#d6ad7b]">{nearbyCafes}</div>
              <div className="text-gray-500 text-sm">Nearby Cafes</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div
          className="rounded-3xl px-6 py-7 mb-2 w-full mx-auto"
          style={{
            background: "linear-gradient(120deg, #d6ad7b 0%, #7c5a36 100%)",
            color: "#fff",
            maxWidth: "100%",
          }}
        >
          <div className="flex justify-center mb-4">
            <span
              className="bg-[#d6ad7b] text-white px-4 py-1 rounded-lg font-semibold text-sm"
              style={{ background: "#e2bb88", color: "#7c5a36" }}
            >
              How It Works
            </span>
          </div>
          {/* Desktop: horizontal workflow, Mobile: vertical */}
          <div className="hidden md:flex flex-row justify-between gap-8">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center px-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e2bb88] mb-3">
                  {step.icon}
                </div>
                <div className="text-lg font-bold mb-1">{step.title}</div>
                <div className="text-center text-sm">{step.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center md:hidden">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e2bb88] mb-3">
              {workflowSteps[0].icon}
            </div>
            <div className="text-lg font-bold mb-1">{workflowSteps[0].title}</div>
            <div className="text-center text-sm mb-6">{workflowSteps[0].desc}</div>
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e2bb88] mb-3">
              {workflowSteps[1].icon}
            </div>
            <div className="text-lg font-bold mb-1">{workflowSteps[1].title}</div>
            <div className="text-center text-sm mb-6">{workflowSteps[1].desc}</div>
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e2bb88] mb-3">
              {workflowSteps[2].icon}
            </div>
            <div className="text-lg font-bold mb-1">{workflowSteps[2].title}</div>
            <div className="text-center text-sm">{workflowSteps[2].desc}</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6 mb-2 w-full mx-auto">
          <div className="text-lg font-semibold text-dark-brown mb-3">Recent Activity</div>
          <div className="flex flex-col gap-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center justify-between bg-[#f7f6f3] rounded-xl px-4 py-3">
                <div>
                  <div className="font-medium text-dark-brown">{a.name}</div>
                  <div className="text-gray-400 text-sm">{a.desc}</div>
                </div>
                <div className="font-semibold text-green-600">{a.points}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Cafes */}
        <div className="bg-white rounded-2xl shadow p-6 mb-2 w-full mx-auto">
          <div className="text-lg font-semibold text-dark-brown mb-3 text-center">Featured Cafes</div>
          <div className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center items-center">
            {cafes.map((cafe, i) => (
              <div
                key={i}
                // Make the entire card a clickable item and give it a cursor
                onClick={() => handleCafeClick(cafe.id)}
                className="bg-[#f7f6f3] rounded-xl flex flex-col items-center p-4 w-full md:w-64 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <img
                  src={cafe.img}
                  alt={cafe.name}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                />
                <div className="font-medium text-dark-brown">{cafe.name}</div>
                <div className="text-gray-400 text-sm">{cafe.desc}</div>
                <div className="text-xs text-gray-500 mt-1">{cafe.distance}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;