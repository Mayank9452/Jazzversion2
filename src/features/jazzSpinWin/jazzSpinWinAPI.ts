import { jazzFrontendAPI } from "@/config/config";

// Fetch Spin-Win info
export const getJazzSpinWinInfo = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.spinWin(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch Spin Win info");
  }
  return await res.json();
};

// Fetch Spin JSON
export const getJazzSpinJSON = async () => {
  const res = await fetch(jazzFrontendAPI.getSpinJSON);
  if (!res.ok) {
    throw new Error("Failed to fetch Spin JSON");
  }
  return await res.json();
};

// Process Spin Win
export const postJazzProcessSpinWin = async (wheelId: string | number) => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.processSpinWin(wheelId, authToken));
  if (!res.ok) {
    throw new Error("Failed to process Spin Win");
  }
  return await res.json();
};
