import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const placeBidAPI = async (payload: any, { getState }) => {
  const state = getState() as RootState;
  // const token = state.auth.data.token || null;
  const token = sessionStorage.getItem("auth"); // ✅ FIXED

  const res = await fetch(frontendAPI.placeBid, {
    method: "POST",
    headers: {
      "Authorization": token ? `${token}` : "",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload),
  });

  if (res.status === 401) {
    const error = await res.json();
    throw { code: 401, message: error?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Failed to place bid");
  }

  return await res.json();
};