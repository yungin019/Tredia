// src/config/api.ts

function normalize(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

const env = process.env.EXPO_PUBLIC_API_URL;

export const API_ROOT = normalize(
  env || "http://localhost:4000"
);

export default API_ROOT;
