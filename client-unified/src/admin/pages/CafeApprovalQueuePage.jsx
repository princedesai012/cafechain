import React, { useState } from "react";
import CafeTable from "../components/CafeTable";
import CafeDetailModal from "../components/CafeDetailModal";

const dummyCafes = [
  { id: 1, name: "Brew Bros", location: "Delhi", date: "2024-06-01" },
  { id: 2, name: "Bean Scene", location: "Mumbai", date: "2024-06-02" },
];

export default function CafeApprovalQueuePage() {
  const [selectedCafe, setSelectedCafe] = useState(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cafe Approval Queue</h1>
      <CafeTable
        cafes={dummyCafes}
        onRowClick={setSelectedCafe}
        approvalMode
      />
      {selectedCafe && (
        <CafeDetailModal
          cafe={selectedCafe}
          onClose={() => setSelectedCafe(null)}
          onApprove={() => alert("Approved!")}
          onReject={() => alert("Rejected!")}
        />
      )}
    </div>
  );
}