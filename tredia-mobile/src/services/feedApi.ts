// src/services/feedApi.ts

import axios from "axios";
import { API_BASE_URL } from "../config";

export async function getFeed() {
  const res = await axios.get(`${API_BASE_URL}/feed`);
  return res.data;
}
