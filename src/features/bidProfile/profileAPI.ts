import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const getProfileInfoAPI = async (_: any, { getState }) => {
  const state = getState() as RootState;
  // const token = state.auth.data.token || null;
  const token = sessionStorage.getItem("auth"); // ✅ FIXED

  const res = await fetch(frontendAPI.getProfileInfo, {
    method: "GET",
    headers: {
      "Authorization": token ? `${token}` : "",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (res.status === 401) {
    const error = await res.json();
    throw { code: 401, message: error?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Failed to get profile info");
  }

  return await res.json();
};

export const unsubscribeUserAPI = async ({ getState }: { getState: any }): Promise<any> => {
  const state = getState() as RootState;
  const token = state.auth.data?.token || sessionStorage.getItem("auth");

  const res = await fetch(frontendAPI.unsubAPI, {
    method: "POST",
    headers: {
      "Authorization": token ? `${token}` : "",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Failed to unsubscribe. Please try again.");
  }

  return await res.json();
};