import { jazzFrontendAPI } from "@/config/config";

// Fetch Notifications
export const getJazzNotifications = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.notificationPage(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }
  return await res.json();
};

// Delete Notification
export const postJazzDeleteNotification = async (notifyId: string | number) => {
  const encodedId = btoa(String(notifyId));
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.deleteNotification(encodedId, authToken));
  if (!res.ok) {
    throw new Error("Failed to delete notification");
  }
  return await res.json();
};

// Clear All Notifications
export const postJazzClearNotifications = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.clearAllNotifications(authToken));
  if (!res.ok) {
    throw new Error("Failed to clear notifications");
  }
  return await res.json();
};
