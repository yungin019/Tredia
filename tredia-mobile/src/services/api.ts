// src/services/api.ts
import axios from "axios";

const RAW_ENV = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

// 1) remove trailing slashes
const baseWithoutSlash = RAW_ENV.replace(/\/+$/, "");

// 2) ensure there is EXACTLY ONE "/api" at the end
export const API_BASE_URL = baseWithoutSlash.endsWith("/api")
  ? baseWithoutSlash // env already has /api -> keep as is
  : `${baseWithoutSlash}/api`; // env has no /api -> add it

console.log("[API] baseURL =", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const method = (config.method || "GET").toUpperCase();
  const url = `${API_BASE_URL}${config.url || ""}`;
  console.log("[API REQUEST]", method, url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      console.log(
        "[API ERROR]",
        error.response.status,
        typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data)
      );
    } else {
      console.log("[API ERROR]", error?.message || error);
    }
    return Promise.reject(error);
  }
);
