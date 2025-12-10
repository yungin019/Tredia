// src/config/api.ts

// Single source of truth for your backend root URL
// Uses EXPO_PUBLIC_API_URL from .env when available

const ENV_URL = process.env.EXPO_PUBLIC_API_URL;

// Remove trailing slash if there is one (safety)
const NORMALIZED =
  (ENV_URL && ENV_URL.replace(/\/$/, "")) ||
  "http://192.168.1.14:4000"; // fallback for local dev

// This is what SignIn / Register / services will use
export const API_ROOT = NORMALIZED;

export const getApiRoot = () => API_ROOT;

// Optional default export if you ever want `import apiConfig from "../config/api"`
export default {
  API_ROOT,
};
