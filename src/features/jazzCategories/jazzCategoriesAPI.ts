import { jazzFrontendAPI, IGPL_AUTH_HEADER } from "@/config/config";

// Fetch IGPL categories
export const getIgplCategories = async () => {
  const res = await fetch(jazzFrontendAPI.categories, {
    headers: {
      Authorization: IGPL_AUTH_HEADER,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch IGPL categories");
  }
  return await res.json();
};

// Fetch Jazz games page categories
export const getJazzGamesPageCategories = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.gamesPageCategories(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch games page categories");
  }
  return await res.json();
};

// View all games by category
export const getJazzCategoryGames = async (categoryName: string) => {
  const authToken = localStorage.getItem("authToken") || "";
  const encodedCategory = encodeURIComponent(categoryName);
  const res = await fetch(jazzFrontendAPI.viewAllGames(encodedCategory, authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch category games");
  }
  return await res.json();
};
