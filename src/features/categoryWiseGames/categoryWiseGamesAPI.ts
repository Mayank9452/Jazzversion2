import { RootState } from "@/app/store";
import { gamesFrontendAPI } from "@/config/config";

// src/features/games/categoryWiseGames.js
export const getCategoryWiseGames = async (handle: any,{ getState }) => {
  const state = getState() as RootState;
  const token = state.auth.data.token||null;
  const res = await fetch(`${gamesFrontendAPI?.gamesByCategory}/${handle}`, {
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
    throw new Error(`${error?.message ?? "Games data not found!"}`);
  }

  const data = await res.json();
  return data;
};