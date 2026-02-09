// src/services/alertsApi.ts
import { API_BASE_URL } from "../config/api";

class AlertsApi {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/api/alerts/all`);
    return await res.json();
  }
}

export const alertsApi = new AlertsApi();
