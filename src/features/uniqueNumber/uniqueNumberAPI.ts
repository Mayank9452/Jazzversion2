import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const checkUniqueNumbersAPI = async (payload: any, { getState }) => {
  const state = getState() as RootState;
  const token = sessionStorage.getItem("auth"); // ✅ FIXED

  const res = await fetch(frontendAPI.checkUniqueNumbers, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token || "", // ✅ FIXED
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    const error = await res.json();
    throw { code: 401, message: error?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Failed to validate numbers");
  }

  return await res.json();
};