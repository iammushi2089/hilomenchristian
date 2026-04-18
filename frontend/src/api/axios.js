import axios from 'axios';

const API = axios.create({
  // Notice the /api at the end!
  baseURL: 'https://hilomenchristian-backend.onrender.com/api', 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;