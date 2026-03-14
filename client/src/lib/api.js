import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const toAbsoluteUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = apiBaseURL.replace(/\/+$/, "");
  const suffix = String(path).startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
};

