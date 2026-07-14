import { jazzFrontendAPI } from "@/config/config";

// Fetch Live Tournament
export const getJazzLiveTournament = async (tournamentId: string | number) => {
  const encodedId = btoa(String(tournamentId));
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.liveTournament(encodedId, authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch live tournament details");
  }
  return await res.json();
};

// Play Live Tournament
export const postJazzPlayLiveTournament = async (tournamentId: string | number) => {
  const encodedId = btoa(String(tournamentId));
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.playLiveTournament(encodedId, authToken));
  if (!res.ok) {
    throw new Error("Failed to play live tournament");
  }
  return await res.json();
};

// Update Live Tournament Score
export const postJazzLiveTournamentScore = async (
  tournamentId: string | number,
  gameId: string | number,
  playerProfileId: string | number
) => {
  const encodedId = btoa(String(tournamentId));
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(
    jazzFrontendAPI.updateLiveTournamentScore(encodedId, gameId, playerProfileId, authToken)
  );
  if (!res.ok) {
    throw new Error("Failed to update live tournament score");
  }
  return await res.json();
};

// Tournament Leaderboard
export const getJazzTournamentLeaderboard = async (tournamentId: string | number) => {
  const encodedId = btoa(String(tournamentId));
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.tournamentLeaderBoard(encodedId, authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch tournament leaderboard");
  }
  return await res.json();
};
