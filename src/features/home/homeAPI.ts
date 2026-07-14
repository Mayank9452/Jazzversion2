import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const getHomeData = async (id: number = 1, { getState }) => {
  // const state = getState() as RootState;
  // const token = state.auth.data.token || null;

  // console.log("API FUNCTION CALLED with id:", id);

  const res = await fetch(frontendAPI.home(id), { // ✅ FIXED
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // "Authorization": token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    const error = await res.json();
    throw { code: 401, message: error?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Home data not found!");
  }

  return await res.json();
};