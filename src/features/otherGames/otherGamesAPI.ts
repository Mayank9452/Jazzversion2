import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

// src/features/otherGames/otherGamesAPI.js
export const startOtherGames = async (body: any,{ getState }) => {
    const state = getState() as RootState;
    const token = state.auth.data.token || null;
    const res = await fetch(`${frontendAPI?.startGames}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', 
      },
      body: JSON.stringify(body)
    });
    
    if (res.status === 401) {
      const error = await res.json(); // optional: detailed error
      throw { code: 401, message: error?.message ?? "Unauthorized" };
    }
  
    if (!res.ok) {
      const error = await res.json(); // optional: detailed error
      throw { code: res.status, message: error?.message ?? "Data not found" };
    }
  
    const data = await res.json();
  
    return data;
};

export const stopOtherGames = async (body: any,{ getState }) => {
    const state = getState() as RootState;
    const token = state.auth.data.token || null;
    const res = await fetch(`${frontendAPI?.stopGames}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', 
      },
      body: JSON.stringify(body)
    });
    
    if (res.status === 401) {
      const error = await res.json(); // optional: detailed error
      throw { code: 401, message: error?.message ?? "Unauthorized" };
    }
  
    if (!res.ok) {
      const error = await res.json(); // optional: detailed error
      throw { code: res.status, message: error?.message ?? "Data not found" };
    }
  
    const data = await res.json();
  
    return data;
};