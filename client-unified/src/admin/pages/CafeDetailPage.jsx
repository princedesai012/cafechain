import React from "react";

export default function CafeDetailPage() {
  // In a real app, fetch cafe details by ID from route params
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cafe Details</h1>
      <div className="bg-white p-6 rounded shadow">
        <p><b>Name:</b> Brew Bros</p>
        <p><b>Location:</b> Delhi</p>
        <p><b>Status:</b> Active</p>
        <p><b>Contact:</b> 9876543210</p>
        <p><b>Gallery:</b> (Images here)</p>
        <div className="mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">Set Active</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Suspend</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
        </div>
      </div>
    </div>
  );
}