// src/apiServices/igplApi.d.ts

export function fetchCategories(): Promise<any>;



// JAZZ API Below
export function fetchHomepageData(): Promise<any>;
export function fetchSuggestedGames(): Promise<any>;
export function fetchInstantGames(): Promise<any>;
export function fetchGamesPageCategories(): Promise<any>;
export function fetchLiveTournament(tournamentId?: any): Promise<any>;
export function fetchManageProfile(): Promise<any>;
export function playLiveTournament(tournamentId?: any): Promise<any>;
export function playGameApi(game_id?: any): Promise<any>;
export function viewAllGames(category_name?: any): Promise<any>;
export function tournamentLeaderBoard(tournamentId?: any): Promise<any>;
export function historyPageApi(): Promise<any>;
export function notificationPageApi(): Promise<any>;
export function updateProfileImage(): Promise<any>;
export function spinWinAPi(): Promise<any>;
export function deleteNotificationApi(notify_id?: any): Promise<any>;
export function clearAllNotificationApi(): Promise<any>;
export function changeProfileImage(image_id?: any): Promise<any>;
export function spinWinAPi(): Promise<any>;
export function getSpinJSON(): Promise<any>;
export function processSpinWin(wheel_id?: any): Promise<any>;
export function updateLiveTournamentScore(tournamentId?: any, game_id: any, player_profile_id: any): Promise<any>;
export function rewardCoins(): Promise<any>;
export function convertRewardCoins(input_redeem_coins?: any): Promise<any>;
export function randomGames(): Promise<any>;