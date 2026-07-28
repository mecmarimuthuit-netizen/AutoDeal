import axios from "axios";

const API = axios.create({
  baseURL: "https://pre-owned-cars-backend-1.onrender.com/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
