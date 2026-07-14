import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";
import { logout } from "../auth/authSlice";

// src/features/auth/profileAPI.js
export const getUserDetails = async (_: any, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;
  const res = await fetch(frontendAPI.profile, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (res.status === 401) {
    const error = await res.json(); // optional: detailed error
    throw { code: 401, message: error?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json(); // optional: detailed error
    throw new Error(`${error?.message ?? "Profile data not found!"}`);
  }

  const data = await res.json();
  return data;
};