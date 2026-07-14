import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

// src/features/playGames/playGamesAPI.js
export const getPlayGames = async (handle: any,{ getState }) => {
  const state = getState() as RootState;
  const token = sessionStorage.getItem("auth"); // ✅ FIXED
  const res = await fetch(`${frontendAPI.playGames}/${handle}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      "Authorization": token ? `${token}` : "",
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

  // const data = await res.json();
  // return data;
  const text = await res.text();
  if (!text) {
    throw new Error(`Game not found!`);
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid JSON response");
  }
};