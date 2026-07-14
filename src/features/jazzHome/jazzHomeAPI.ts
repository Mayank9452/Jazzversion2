import { jazzFrontendAPI } from "@/config/config";

// Fetch homepage data
export const getJazzHomepageData = async (id?: number | string) => {
  const userId = id || localStorage.getItem("userId") || "1";
  const res = await fetch(jazzFrontendAPI.homepageData(userId));
  if (!res.ok) {
    throw new Error("Failed to fetch homepage data");
  }
  return await res.json();
};

// Fetch suggested games
export const getJazzSuggestedGames = async () => {
  const userId = localStorage.getItem("userId") || "1";
  const body = new URLSearchParams({
    user_id: String(userId),
    game_type: "suggested",
  });

  const res = await fetch(jazzFrontendAPI.suggestedGames, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch suggested games");
  }
  return await res.json();
};

// Fetch instant games
export const getJazzInstantGames = async () => {
  const userId = localStorage.getItem("userId") || "1";
  const body = new URLSearchParams({
    user_id: String(userId),
    game_type: "genre",
  });

  const res = await fetch(jazzFrontendAPI.instantGames, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch instant games");
  }
  return await res.json();
};

// Fetch trending/random games
export const getJazzRandomGames = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.randomGames(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch trending games");
  }
  return await res.json();
};
