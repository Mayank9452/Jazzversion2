import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";


// ✅ Check user Jackpot spins
export const checkUserJackpotSpins = async (_: any, { getState }: any) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;

  const res = await fetch(`${frontendAPI.userSpins}/checkUserJackpotSpins`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) throw { code: 401, message: "Unauthorized" };
  if (!res.ok) {
    const error = await res.json();
    throw { code: res.status, message: error?.message ?? "Failed to check spins" };
  }

  return await res.json();
};
