import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const getSpinner = async (handle: any,{ getState }) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;
  const res = await fetch(`${frontendAPI?.spinner}/${handle}`, {
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
    throw { code: res.status, message: error?.message ?? "Data not found" };
  }

  const data = await res.json();

  return data;
};

export const getSpinnerResult = async (handle: any,{ getState }) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;
  const res = await fetch(`${frontendAPI?.spinner}/play/${handle}`, {
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
    throw { code: res.status, message: error?.message ?? "Data not found" };
  }

  const data = await res.json();

  return data;
};