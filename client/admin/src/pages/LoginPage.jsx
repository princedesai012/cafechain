import React, { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

const LoginPage = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🚨 Hardcoded for demo, you can replace with real API call
    if (email === "admin@cafe.com" && password === "admin123") {
      localStorage.setItem("adminToken", "dummy-admin-token");
      login("dummy-admin-token"); 
      window.location.href = "/claim-approvals";
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center mt-24">
      <form
        onSubmit={handleSubmit}
        className="w-80 p-6 bg-white border rounded-xl shadow"
      >
        <h2 className="text-xl font-bold text-center mb-4">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
