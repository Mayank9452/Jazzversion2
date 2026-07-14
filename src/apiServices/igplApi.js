// IGPL API setup
const username = "igpl_games";
const password = "eMAT9XOdMPGMoEj$fuMPE2Q6VR6G0Q&4";
const authHeader = "Basic " + btoa(`${username}:${password}`);
const igplBaseUrl = "https://games.igpl.pro/xml-api/gpl/apis";

const igplHeaders = {
  Authorization: authHeader,
};

// ========== IGPL APIs ==========

// Fetch game categories
export const fetchCategories = async () => {
  try {
    const res = await fetch(`${igplBaseUrl}/categories`, {
      headers: igplHeaders,
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return null;
  }
};

// ========== Jazz APIs ==========
const jazzBaseUrl = "https://jazzgplapi.gamenow.com.pk";

// Fetch suggested games
export const fetchSuggestedGames = async () => {
  const user_id = localStorage.getItem("userId") || 1;
  const url = `${jazzBaseUrl}/site/getGamesData`;
  const body = new URLSearchParams({
    user_id,
    game_type: "suggested",
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) throw new Error("Failed to fetch suggested games");
    return await res.json();
  } catch (error) {
    console.error("Error fetching suggested games:", error.message);
    return null;
  }
};

// Fetch instant (genre) games
export const fetchInstantGames = async () => {
  const user_id = localStorage.getItem("userId") || 1;
  const url = `${jazzBaseUrl}/site/getGamesData`;
  const body = new URLSearchParams({
    user_id,
    game_type: "genre",
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) throw new Error("Failed to fetch instant games");
    return await res.json();
  } catch (error) {
    console.error("Error fetching instant games:", error.message);
    return null;
  }
};


export const fetchGamesPageCategories = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/GamesCategoryList?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch games page categories");
    return await res.json();
  } catch (error) {
    console.error("Error fetching games page categories:", error.message);
    return null;
  }
};


// Fetch homepage data
export const fetchHomepageData = async () => {
  const id = localStorage.getItem("userId");
  const url = id ? `${jazzBaseUrl}/site/testUser/?id=${id}` : `${jazzBaseUrl}/site/testUser/?id=${1}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch homepage data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching homepage data:", error.message);
    return null;
  }
};


export const fetchLiveTournament = async (tournamentId) => {
  const encodedId = btoa(tournamentId); // Base64 encode the tournamentId
  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/LiveTournament/${encodedId}/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Live Tournament Page data");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching Live Tournament Data:", error.message);
    return null;
  }
};


export const fetchManageProfile = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/ManageProfile/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch Manage Profile");
    return await res.json();
  } catch (error) {
    console.error("Error fetching Manage Profile:", error.message);
    return null;
  }
};

export const playLiveTournament = async (tournamentId) => {
  const encodedId = btoa(tournamentId); // Base64 encode the tournamentId
  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/PlayLiveTournament/${encodedId}/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch PlayLiveTournament");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching PlayLiveTournament API:", error.message);
    return null;
  }
};

export const updateLiveTournamentScore = async (tournamentId, game_id, player_profile_id) => {
  const encodedId = btoa(tournamentId); // Base64 encode the tournamentId
  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/site/updateLiveTournamentPlayerScore/${encodedId}/${game_id}/${player_profile_id}/redirect_tournament?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch updateLiveTournamentScore");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching updateLiveTournamentScore API:", error.message);
    return null;
  }
};

export const playGameApi = async (game_id) => {
  const encodedId = btoa(game_id); // Base64 encode the tournamentId
  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/playGame/${encodedId}/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch playGameApi");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching playGameApi API:", error.message);
    return null;
  }
};

export const viewAllGames = async (category_name) => {
  const encodedCategory = encodeURIComponent(category_name);
  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/GamesList/${encodedCategory}/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch viewAllGames");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching viewAllGames API:", error.message);
    return null;
  }
};

export const tournamentLeaderBoard = async (tournamentId) => {
  const encodedId = btoa(tournamentId); // Base64 encode the tournamentId
  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/LiveTournamentLeaderboard/${encodedId}/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tournamentLeaderBoard");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching tournamentLeaderBoard API:", error.message);
    return null;
  }
};

export const historyPageApi = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/tournamentHistory/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to historyPageApi");
    return await res.json();
  } catch (error) {
    console.error("Error fetching historyPageApi:", error.message);
    return null;
  }
};

export const notificationPageApi = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/Notifications/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch notificationPageApi");
    return await res.json();
  } catch (error) {
    console.error("Error fetching notificationPageApi:", error.message);
    return null;
  }
};


export const deleteNotificationApi = async (notify_id) => {
  const encodedId = btoa(notify_id); // Base64 encode the tournamentId
  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/site/deleteNotification/${encodedId}/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch deleteNotificationApi");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching deleteNotificationApi API:", error.message);
    return null;
  }
};

export const clearAllNotificationApi = async () => {

  const authToken = localStorage.getItem("authToken");

  const url = `${jazzBaseUrl}/site/clearNotifications/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET", // default, but explicit for clarity
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch clearAllNotificationApi");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching clearAllNotificationApi API:", error.message);
    return null;
  }
};

export const updateProfileImage = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/updateProfileImage/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch updateProfileImage");
    return await res.json();
  } catch (error) {
    console.error("Error fetching updateProfileImage:", error.message);
    return null;
  }
};

export const changeProfileImage = async (image_id) => {
  const encodedId = btoa(image_id); // Base64 encode the tournamentId
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/site/setProfileImage/${encodedId}/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch changeProfileImage");
    return await res.json();
  } catch (error) {
    console.error("Error fetching changeProfileImage:", error.message);
    return null;
  }
};

export const spinWinAPi = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/Spin-Win/?authToken=${encodeURIComponent(authToken)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch SpinWinApi");
    return await res.json();
  } catch (error) {
    console.error("Error fetching SpinWinApi:", error.message);
    return null;
  }
};

export const getSpinJSON = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/site/getSpinJSON`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch getSpinJSON");
    return await res.json();
  } catch (error) {
    console.error("Error fetching getSpinJSON:", error.message);
    return null;
  }
};

export const processSpinWin = async (wheel_id) => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/site/processSpinWin/${wheel_id}/?authToken=${authToken}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch processSpinWin");
    return await res.json();
  } catch (error) {
    console.error("Error fetching processSpinWin:", error.message);
    return null;
  }
};

export const rewardCoins = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/RedeemCoins/?authToken=${authToken}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch rewardCoinsApi");
    return await res.json();
  } catch (error) {
    console.error("Error fetching rewardCoinsApi:", error.message);
    return null;
  }
};

export const convertRewardCoins = async (input_redeem_coins) => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/site/convertRewardCoins/?authToken=${authToken}`;

  const body = new URLSearchParams({
    redeem_coins_value: input_redeem_coins,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!res.ok) throw new Error("Failed to fetch convertRewardCoins");
    return await res.json();
  } catch (error) {
    console.error("Error fetching convertRewardCoins:", error.message);
    return null;
  }
};

export const randomGames = async () => {
  const authToken = localStorage.getItem("authToken");
  const url = `${jazzBaseUrl}/TrendingGamesList/?authToken=${authToken}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch randomGames");
    return await res.json();
  } catch (error) {
    console.error("Error fetching randomGames:", error.message);
    return null;
  }
};



