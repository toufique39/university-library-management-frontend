import { apiUrl } from "@/lib/api";

async function dashboardRequest(endpoint) {
  const response = await fetch(
    apiUrl(`/api/dashboard/${endpoint}`),
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to load dashboard."
    );
  }

  return result;
}

export const dashboardService = {
  getAdminDashboard: () =>
    dashboardRequest("admin"),

  getMemberDashboard: () =>
    dashboardRequest("member"),
};