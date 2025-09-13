import React, { useState } from "react";

export default function CafeDetailModal({ cafe, onClose, onApprove, onReject }) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">{cafe.name}</h2>
        <p><b>Location:</b> {cafe.location}</p>
        <p><b>Submission Date:</b> {cafe.date || "N/A"}</p>
        <div className="mt-6 flex gap-2">
          {onApprove && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={onApprove}
            >
              Approve
            </button>
          )}
          {onReject && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowReject(true)}
            >
              Reject
            </button>
          )}
        </div>
        {showReject && (
          <div className="mt-4">
            <input
              className="border px-2 py-1 rounded w-full mb-2"
              placeholder="Reason for rejection"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => {
                onReject(reason);
                setShowReject(false);
              }}
            >
              Confirm Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}