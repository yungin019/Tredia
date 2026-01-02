import axios, { InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../config/api";

export const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  timeout: 30000,
});

let inMemoryToken: string | null = null;

export function setAuthToken(token: string | null) {
  inMemoryToken = token;

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function getAuthToken() {
  return inMemoryToken;
}

// Auto attach token if missing
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const hasAuth =
    typeof config.headers?.get === "function"
      ? config.headers.get("Authorization")
      : (config.headers as any)?.Authorization;

  if (!hasAuth) {
    const stored = await AsyncStorage.getItem("token");
    if (stored) {
      if (typeof config.headers?.set === "function") {
        config.headers.set("Authorization", `Bearer ${stored}`);
      } else {
        config.headers = {
          ...(config.headers as any),
          Authorization: `Bearer ${stored}`,
        };
      }
    }
  }

  return config;
});
