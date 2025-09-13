import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login logic
    if (email && password) {
      // In real app, set admin context here
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2" type="submit">
          Login
        </button>
        <div className="text-center mt-2">
          <span>Don't have an account? </span>
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => navigate("/admin/signup")}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}