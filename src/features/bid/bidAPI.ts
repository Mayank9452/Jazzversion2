import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const getBidInfo = async (bidId: string, { getState }) => {
  const state = getState() as RootState;
  // const token = state.auth.data.token || null;
  const token = sessionStorage.getItem("auth"); // ✅ FIXED

  // const encodedRewardId = btoa(String(bidId));

  const res = await fetch(frontendAPI.bidInfo(bidId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `${token}` : "",
    },
  });

  if (res.status === 401) {
    const error = await res.json();
    throw { code: 401, message: error?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Bid data not found!");
  }

  return await res.json();
};