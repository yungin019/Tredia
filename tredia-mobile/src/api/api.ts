// tredia-api/src/api/api.ts
// Generic Axios client for backend-to-backend calls (if needed)

import axios from "axios";

const BASE_URL =
  process.env.TREDIA_API_BASE_URL && process.env.TREDIA_API_BASE_URL.trim().length > 0
    ? process.env.TREDIA_API_BASE_URL
    : "https://api.tredia.app";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

export default api;
