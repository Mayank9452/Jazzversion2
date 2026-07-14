import { jazzFrontendAPI } from "@/config/config";

// Play game
export const postJazzPlayGame = async (gameId: string | number) => {
  const encodedId = btoa(String(gameId));
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.playGame(encodedId, authToken));
  if (!res.ok) {
    throw new Error("Failed to play game");
  }
  return await res.json();
};
