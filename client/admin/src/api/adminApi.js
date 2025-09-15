// src/api/adminApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const apiClient = async (endpoint, data = {}, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      method: options.method || "GET",
      url: `${API_URL}${endpoint}`,
      data: options.method === "POST" || options.method === "PUT" ? data : null,
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Admin API Error on ${endpoint}:`,
      error.response?.data?.error || error.message
    );
    throw error.response?.data?.error || "API request failed";
  }
};

// ✅ Claims
export const getPendingClaims = () =>
  apiClient("/claims/pending", {}, { method: "GET" });

export const approveClaim = (claimId) =>
  apiClient(`/claims/${claimId}/approve`, {}, { method: "PUT" });

export const rejectClaim = (claimId) =>
  apiClient(`/claims/${claimId}/reject`, {}, { method: "PUT" });

export default apiClient;