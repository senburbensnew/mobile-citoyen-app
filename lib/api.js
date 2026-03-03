import axios from "axios";
import { getToken } from "../lib/storage";

// export const API_BASE = "http://192.168.1.159:5030/api";
// export const API_BASE = "http://ec2-18-223-112-175.us-east-2.compute.amazonaws.com:8080/api";
export const API_BASE = "http://budget.gouv.ht:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
