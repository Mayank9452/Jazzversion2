import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import spinnerReducer from '../features/spinner/spinnerSlice';
import spinnerRewardsReducer from '../features/spinnerRewards/spinnerRewardsSlice';
import gamesReducer from '../features/games/gamesSlice';
import categoryWiseGamesReducer from '../features/categoryWiseGames/categoryWiseGamesSlice';
import playGamesReducer from '../features/playGames/playGamesSlice';
import otherGamesReducer from '../features/otherGames/otherGamesSlice';
import configReducer from '../features/config/configSlice';
import userSpinsReducer from '../features/userSpins/userSpinsSlice'; // ✅ new
import userJackpotSpinsReducer from '../features/userJackpotSpins/userJackpotSpinsSlice'; // ✅ new
import userSpinsInfoReducer from '../features/spinsInfo/spinInfoSlice';
import participantRewardReducer from "../features/participantReward/participantRewardSlice";
// ✅ Import your new profile image slice (NOT inside auth)
import profileImageReducer from '../features/bidProfile/updateProfileSlice';
import summerRewardReducer from '../features/summerReward/summerRewardSlice'; // ✅ new

import homeReducer from '../features/home/homeSlice'; // 🔥 HomeAPI
import bidReducer from '../features/bid/bidSlice'; // 🔥 PlayBidAPI
import placeBidReducer from '../features/placebid/placeBidSlice'; // 🔥 PlaceBidAPI
import uniqueNumberReducer from '../features/uniqueNumber/uniqueNumberSlice'; // 🔥 CheckUniqueNumbersAPI
import leaderboardReducer from '../features/leaderboard/leaderboardSlice'; // 🔥 LeaderBoardAPI
import notificationReducer from '../features/notification/notificationSlice'; // 🔥 LeaderBoardAPI
import profileReducer from '../features/bidProfile/profileSlice'; // 🔥 ManageProfileAPI

// ================= JAZZ PORTAL REDUCERS (NEW) =================
import jazzHomeReducer from '../features/jazzHome/jazzHomeSlice';
import jazzCategoriesReducer from '../features/jazzCategories/jazzCategoriesSlice';
import jazzTournamentReducer from '../features/jazzTournament/jazzTournamentSlice';
import jazzProfileReducer from '../features/jazzProfile/jazzProfileSlice';
import jazzGameReducer from '../features/jazzGame/jazzGameSlice';
import jazzHistoryReducer from '../features/jazzHistory/jazzHistorySlice';
import jazzNotificationReducer from '../features/jazzNotification/jazzNotificationSlice';
import jazzSpinWinReducer from '../features/jazzSpinWin/jazzSpinWinSlice';
import jazzCoinsReducer from '../features/jazzCoins/jazzCoinsSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    participantReward: participantRewardReducer,
    summerReward: summerRewardReducer, // ✅ add here
    spinsInfo: userSpinsInfoReducer,
    spinner: spinnerReducer,
    spinnerRewards: spinnerRewardsReducer,
    games: gamesReducer,
    categoryWiseGames: categoryWiseGamesReducer,
    playGames: playGamesReducer,
    otherGames: otherGamesReducer,
    config: configReducer,
    userSpins: userSpinsReducer, // ✅ add here
    userJackpotSpins: userJackpotSpinsReducer, // ✅ add here
    // ✅ Added here
    profileImage: profileImageReducer,

    // ================= BIDBLAST (NEW) =================
    home: homeReducer, // ✅ add here
    bid: bidReducer,
    placeBid: placeBidReducer,
    uniqueNumbers: uniqueNumberReducer,
    leaderboard: leaderboardReducer,
    notification: notificationReducer,
    profile: profileReducer,

    // ================= JAZZ PORTAL (NEW) =================
    jazzHome: jazzHomeReducer,
    jazzCategories: jazzCategoriesReducer,
    jazzTournament: jazzTournamentReducer,
    jazzProfile: jazzProfileReducer,
    jazzGame: jazzGameReducer,
    jazzHistory: jazzHistoryReducer,
    jazzNotification: jazzNotificationReducer,
    jazzSpinWin: jazzSpinWinReducer,
    jazzCoins: jazzCoinsReducer,
  },
});

// ✅ Define RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

