// src/lib/api.ts
import { getToken } from "./authToken";

const DEFAULT_BASE = "http://localhost:4000";
const BASE = process.env.NEXT_PUBLIC_API_URL || DEFAULT_BASE;

export async function apiGet(path: string): Promise<any> {
  const url = path.startsWith("http") ? path : `${BASE.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { method: "GET", headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const message = text || res.statusText || `Request failed with status ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  // Try parse JSON, fall back to text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}
