import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

// src/features/games/gamesAPI.js
export const getGames = async (_: any, { getState }) => {
  const state = getState() as RootState;
  const token = sessionStorage.getItem("auth"); // ✅ FIXED

  const res = await fetch(frontendAPI?.games, {

    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `${token}` : '',
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