import { jazzFrontendAPI } from "@/config/config";

// Fetch History
export const getJazzHistory = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.historyPage(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch tournament history");
  }
  return await res.json();
};
