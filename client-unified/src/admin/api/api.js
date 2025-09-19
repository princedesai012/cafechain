// src/admin/api/api.js

import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance for the admin panel
const adminApiClient = axios.create({
  // ✅ CRITICAL: Change this baseURL to the full Render URL
  baseURL: 'https://api.cafechain.in/api/admin', 
});

// Interceptor to add the auth token (assuming you store it in localStorage)
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token'); // Or however you store your admin token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fetches a simple list of all cafes for dropdowns.
 * We use a direct axios call here if the endpoint is not under /api/admin
 */
export const adminGetCafesList = async () => {
    try {
        // This is already correct
        const response = await axios.get('https://api.cafechain.in/api/admin/cafes/all');
        return response.data
    } catch (error) {
        toast.error("Could not fetch cafe list.");
        throw error;
    }
};


/**
 * Creates a new event.
 * @param {FormData} formData - The event data, including the image file.
 */
export const adminCreateEvent = async (formData) => {
  try {
    const response = await adminApiClient.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Event created successfully!');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to create event.');
    throw error;
  }
};

// ---- CLAIM APIs ----
export const adminGetPendingClaims = async () => {
  try {
    const res = await adminApiClient.get("https://api.cafechain.in/api/admin/claims/pending");
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch claims");
    throw err;
  }
};

export const adminApproveClaim = async (id) => {
  try {
    const res = await adminApiClient.put(`/claims/${id}/approve`);
    toast.success("Claim approved ✅");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to approve claim");
    throw err;
  }
};

export const adminRejectClaim = async (id) => {
  try {
    const res = await adminApiClient.put(`/claims/${id}/reject`);
    toast.success("Claim rejected ❌");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to reject claim");
    throw err;
  }
};