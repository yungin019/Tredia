import { api } from "./apiClient";

export async function trackEvent(
  name: string,
  props: Record<string, any> = {}
) {
  console.log("[Analytics]", name, props);

  try {
    await api.post("/events", {
      name,
      props,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // silent fail
  }
}
