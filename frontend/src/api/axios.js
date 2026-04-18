// frontend/src/api/axios.js
import axios from 'axios';

const API = axios.create({
  // Replace this with your actual Render URL, keep the /api at the end!
  baseURL: 'https://hilomenchristian-backend.onrender.com', 
});

// This automatically attaches your "VIP Pass" (token) to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;