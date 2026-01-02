// src/services/feedApi.ts

import { api } from "./apiClient";

export async function getFeed() {
  const res = await api.get("/feed");
  return res.data;
}
