import React from "react";

export default function CafeTable({ cafes, onRowClick, approvalMode }) {
  return (
    <table className="w-full bg-white rounded shadow mb-6">
      <thead>
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Location</th>
          <th className="p-2 text-left">{approvalMode ? "Submission Date" : "Status"}</th>
        </tr>
      </thead>
      <tbody>
        {cafes.map((cafe) => (
          <tr
            key={cafe.id}
            className="hover:bg-blue-50 cursor-pointer"
            onClick={() => onRowClick(cafe)}
          >
            <td className="p-2">{cafe.name}</td>
            <td className="p-2">{cafe.location}</td>
            <td className="p-2">{approvalMode ? cafe.date : cafe.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}