// =====================
// BID TYPES
// =====================

export type BidStatus = "LIVE" | "ENDED" | "UPCOMING";

export interface Bid {
  id: number;
  title: string;
  description: string;
  currentBid: number;
  // startPrice: number;
  status: BidStatus;
  // endTime: string; // ISO date
  // image?: string;
}

// =====================
// ACTIVITY TYPES
// =====================

export interface Activity {
  id: number;
  user: string;
  message: string;
  time: string; // "2m ago", "Just now"
}

// =====================
// LEADERBOARD TYPES
// =====================

export interface LeaderboardUser {
  id: number;
  name: string;
  avatar?: string;
  bids: number;
  score: number;
}
