
const API_URL = process.env._PUBLIC_API_URL;

async function dashboardRequest(endpoint) {
  const response = await fetch(
    `${API_URL}/api/dashboard/${endpoint}`,
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
