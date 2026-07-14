const logoHigh = "/assets/images/logo-high.png";
const logoLow = "/assets/images/logo.png";
const logo = "/assets/images/logo.png";
// const BACKEND_URL = "https://api.atomspinzone.com";
const BACKEND_URL = "https://bidblast.club";
// const BACKEND_URL = "http://192.168.1.36:5555";
// const BACKEND_URL = "https://jackpot-api.planmysocial.ai"
const API_URL = `${BACKEND_URL}/`;
// const OTHER_API_URL = `https://igpl.pro/`;
// const OTHER_API_URL = `https://api.atomspinzone.com/`;
const OTHER_API_URL = `https://bidblast.club/`;

const frontendAPI = {
  login: `${API_URL}/login`,
  signup: `${API_URL}auth/register`,
  signupAtom: `${API_URL}auth/atomregister`,
  checkAuthByIP: `${API_URL}auth/check-ip`,
  unsubscribeUser: `${API_URL}auth/unsubscribe`,
  updateUser: `${API_URL}user/update`,
  profile: `${API_URL}profile`,
  dashboard: `${API_URL}user/dashboard`,
  spinner: `${API_URL}user/spinners`,
  rewards: `${API_URL}user/rewards`,
  claimReward: `${API_URL}user/rewards/claim`,
  startGames: `${API_URL}user/other-games/start`,
  stopGames: `${API_URL}user/other-games/stop`,
  userSpins: `${API_URL}user`,
  // ================= HOME =================
  //   home: `${API_URL}HomeAPI`, // ✅ FIXED (removed extra slash)
  home: (id: number) => `${API_URL}APIData/homeTest?id=${id}`, // ✅ dynamic

  // ================= BIDBLAST APIs (NEW) =================
  bidInfo: (id: string) => `${API_URL}PlayBidAPI/${id}`, // ✅ dynamic
  placeBid: `${API_URL}PlaceBidAPI`,
  checkUniqueNumbers: `${API_URL}CheckUniqueNumbersAPI`,
  leaderboard: `${API_URL}LeaderBoardAPI`,
  notification: `${API_URL}NotificationsAPI`,
  getProfileInfo: `${API_URL}ManageProfileAPI`,
  games: `${API_URL}FreeGamesAPI`,
  playGames: `${API_URL}PlayGame`,
  setProfileImage: `${API_URL}SetProfileImage`,
  unsubAPI: `${API_URL}UnsubAPI`,
};

const gamesFrontendAPI = {
  games: `${OTHER_API_URL}user/freeGames`,
  gamesByCategory: `${OTHER_API_URL}user/freeCategoryGames`,
  gameByID: `${OTHER_API_URL}user/playFreeGame`,
};

const store = {
  name: "Spin Zone",
  logo: "/assets/images/logo.png",
  logoHigh: "/assets/images/logo-high.png",
};

const storage = {
  auth: "auth",
};

// #171835     238 39% 15%    rgb(23, 24, 53)
// #054D8C     208 93% 28%    rgb(5, 76, 138)
// #4EBFE2     194 72% 60%    rgb(80, 192, 226)
// #FFFFFF     194 0% 100%    rgb(255, 255, 255)

// ================= JAZZ PORTAL (NEW) =================
const JAZZ_BASE_URL = "https://jazzgplapi.gamenow.com.pk";
const IGPL_BASE_URL = "https://games.igpl.pro/xml-api/gpl/apis";
const IGPL_USERNAME = "igpl_games";
const IGPL_PASSWORD = "eMAT9XOdMPGMoEj$fuMPE2Q6VR6G0Q&4";
const IGPL_AUTH_HEADER = "Basic " + btoa(`${IGPL_USERNAME}:${IGPL_PASSWORD}`);

const jazzFrontendAPI = {
  categories: `${IGPL_BASE_URL}/categories`,
  suggestedGames: `${JAZZ_BASE_URL}/site/getGamesData`,
  instantGames: `${JAZZ_BASE_URL}/site/getGamesData`,
  gamesPageCategories: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/GamesCategoryList?authToken=${encodeURIComponent(authToken || "")}`,
  homepageData: (id: string | number) =>
    `${JAZZ_BASE_URL}/site/testUser/?id=${id}`,
  liveTournament: (encodedId: string, authToken: string | null) =>
    `${JAZZ_BASE_URL}/LiveTournament/${encodedId}/?authToken=${encodeURIComponent(authToken || "")}`,
  manageProfile: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/ManageProfile/?authToken=${encodeURIComponent(authToken || "")}`,
  playLiveTournament: (encodedId: string, authToken: string | null) =>
    `${JAZZ_BASE_URL}/PlayLiveTournament/${encodedId}/?authToken=${encodeURIComponent(authToken || "")}`,
  updateLiveTournamentScore: (encodedId: string, game_id: string | number, player_profile_id: string | number, authToken: string | null) =>
    `${JAZZ_BASE_URL}/site/updateLiveTournamentPlayerScore/${encodedId}/${game_id}/${player_profile_id}/redirect_tournament?authToken=${encodeURIComponent(authToken || "")}`,
  playGame: (encodedId: string, authToken: string | null) =>
    `${JAZZ_BASE_URL}/playGame/${encodedId}/?authToken=${encodeURIComponent(authToken || "")}`,
  viewAllGames: (encodedCategory: string, authToken: string | null) =>
    `${JAZZ_BASE_URL}/GamesList/${encodedCategory}/?authToken=${encodeURIComponent(authToken || "")}`,
  tournamentLeaderBoard: (encodedId: string, authToken: string | null) =>
    `${JAZZ_BASE_URL}/LiveTournamentLeaderboard/${encodedId}/?authToken=${encodeURIComponent(authToken || "")}`,
  historyPage: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/tournamentHistory/?authToken=${encodeURIComponent(authToken || "")}`,
  notificationPage: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/Notifications/?authToken=${encodeURIComponent(authToken || "")}`,
  deleteNotification: (encodedId: string, authToken: string | null) =>
    `${JAZZ_BASE_URL}/site/deleteNotification/${encodedId}/?authToken=${encodeURIComponent(authToken || "")}`,
  clearAllNotifications: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/site/clearNotifications/?authToken=${encodeURIComponent(authToken || "")}`,
  updateProfileImage: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/updateProfileImage/?authToken=${encodeURIComponent(authToken || "")}`,
  changeProfileImage: (encodedId: string, authToken: string | null) =>
    `${JAZZ_BASE_URL}/site/setProfileImage/${encodedId}/?authToken=${encodeURIComponent(authToken || "")}`,
  spinWin: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/Spin-Win/?authToken=${encodeURIComponent(authToken || "")}`,
  getSpinJSON: `${JAZZ_BASE_URL}/site/getSpinJSON`,
  processSpinWin: (wheel_id: string | number, authToken: string | null) =>
    `${JAZZ_BASE_URL}/site/processSpinWin/${wheel_id}/?authToken=${authToken || ""}`,
  rewardCoins: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/RedeemCoins/?authToken=${authToken || ""}`,
  convertRewardCoins: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/site/convertRewardCoins/?authToken=${authToken || ""}`,
  randomGames: (authToken: string | null) =>
    `${JAZZ_BASE_URL}/TrendingGamesList/?authToken=${authToken || ""}`,
};

export {
  BACKEND_URL,
  logoHigh,
  logoLow,
  logo,
  store,
  frontendAPI,
  storage,
  gamesFrontendAPI,
  OTHER_API_URL,
  JAZZ_BASE_URL,
  IGPL_AUTH_HEADER,
  jazzFrontendAPI,
};
