import React, { useState } from "react";
import CafeTable from "../components/CafeTable";
import CafeDetailModal from "../components/CafeDetailModal";

const dummyCafes = [
  { id: 1, name: "Brew Bros", location: "Delhi", status: "Active" },
  { id: 2, name: "Bean Scene", location: "Mumbai", status: "Pending" },
];

export default function CafeListPage() {
  const [selectedCafe, setSelectedCafe] = useState(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Cafes</h1>
      <div className="mb-4 flex gap-2">
        <input className="border px-2 py-1 rounded" placeholder="Search by name/location" />
        <select className="border px-2 py-1 rounded">
          <option>Status: All</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      </div>
      <CafeTable cafes={dummyCafes} onRowClick={setSelectedCafe} />
      {selectedCafe && (
        <CafeDetailModal
          cafe={selectedCafe}
          onClose={() => setSelectedCafe(null)}
        />
      )}
    </div>
  );
}