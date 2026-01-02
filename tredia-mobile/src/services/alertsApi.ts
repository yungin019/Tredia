import { api } from "./apiClient";

class AlertsApi {
  async getAll() {
    const res = await api.get("/alerts/all");
    return res.data;
  }
}

export const alertsApi = new AlertsApi();
