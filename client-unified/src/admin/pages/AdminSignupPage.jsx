import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Dummy signup logic
    if (email && password && name) {
      // In real app, create admin account here
      navigate("/admin/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow w-full max-w-sm" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Sign Up</h2>
        <input
          className="border px-3 py-2 rounded w-full mb-4"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded w-full mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full mb-2" type="submit">
          Sign Up
        </button>
        <div className="text-center mt-2">
          <span>Already have an account? </span>
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => navigate("/admin/login")}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}