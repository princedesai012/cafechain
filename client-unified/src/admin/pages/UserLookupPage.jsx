import React, { useState } from "react";
import UserSearch from "../components/UserSearch";

const dummyUsers = [
  { id: 1, name: "Amit Sharma", phone: "9876543210" },
  { id: 2, name: "Priya Singh", phone: "9123456789" },
];

export default function UserLookupPage() {
  const [results, setResults] = useState(dummyUsers);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Lookup</h1>
      <UserSearch onSearch={setResults} />
      <ul className="mt-6">
        {results.map((user) => (
          <li key={user.id} className="py-2 border-b">
            <b>{user.name}</b> — {user.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}