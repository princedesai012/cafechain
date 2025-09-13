import React, { useState } from "react";

export default function UserSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  return (
    <div className="flex gap-2">
      <input
        className="border px-2 py-1 rounded w-64"
        placeholder="Search by phone or name"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded"
        onClick={() => onSearch([])}
      >
        Search
      </button>
    </div>
  );
}