import axios from "axios";
import { getToken, logout } from "../utils/storage";

export const API_BASE = "http://budget.gouv.ht:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
