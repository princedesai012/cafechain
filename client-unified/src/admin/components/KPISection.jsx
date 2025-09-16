import React from "react";

export default function KPISection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded shadow text-center">
        <div className="text-3xl font-bold">1,234</div>
        <div className="text-gray-500">Total Users</div>
      </div>
      <div className="bg-white p-6 rounded shadow text-center">
        <div className="text-3xl font-bold">56</div>
        <div className="text-gray-500">Registered Cafes</div>
        <div className="text-xs text-gray-400">Active: 40, Pending: 10, Suspended: 6</div>
      </div>
      <div className="bg-white p-6 rounded shadow text-center">
        <div className="text-3xl font-bold">789</div>
        <div className="text-gray-500">Redemptions (24h)</div>
      </div>
      <div className="bg-white p-6 rounded shadow text-center cursor-pointer hover:bg-blue-50">
        <div className="text-3xl font-bold">5</div>
        <div className="text-gray-500">Pending Approvals</div>
        <div className="text-xs text-blue-600">Click to view</div>
      </div>
    </div>
  );
}