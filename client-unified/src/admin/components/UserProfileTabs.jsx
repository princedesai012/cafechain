import React from "react";

export default function UserProfileTabs({ tab, setTab }) {
  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === "profile" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "history" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>
      {tab === "profile" ? (
        <div>
          <p><b>Name:</b> Amit Sharma</p>
          <p><b>Phone:</b> 9876543210</p>
          <p><b>Points:</b> 1200</p>
          <p><b>Referral Code:</b> AMIT123</p>
          <div className="mt-4">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Suspend User</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Ban User</button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-500">[User visit and transaction history here]</p>
        </div>
      )}
    </div>
  );
}