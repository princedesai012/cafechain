import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ClaimCard = ({ claim, onApprove, onReject }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition w-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{claim.user?.name}</h2>
          <p className="text-sm text-gray-600">{claim.user?.email}</p>
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-medium">Cafe:</span> {claim.cafe?.name}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Amount:</span> ₹{claim.amount}
          </p>
          <p className="text-sm text-blue-600 underline mt-1">
            {claim.invoiceUrl ? (
              <a href={claim.invoiceUrl} target="_blank" rel="noopener noreferrer">
                View Invoice
              </a>
            ) : (
              "No Invoice"
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onApprove(claim._id)}
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <CheckCircle size={18} /> Approve
          </button>
          <button
            onClick={() => onReject(claim._id)}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <XCircle size={18} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;
