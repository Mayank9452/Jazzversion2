import type { Bid, Activity, LeaderboardUser } from "@/types";

// =====================
// BIDS DATA
// =====================

export const BIDS_DATA: Bid[] = [
  {
    id: 1,
    title: "Bid 1",
    description: "Active Cycle 4",
    // startPrice: 65000,
    currentBid: 452,
    status: "LIVE",
    // endTime: "2025-01-01T18:30:00Z",
    // image: "/images/iphone.jpg",
  },
  {
    id: 2,
    title: "Bid 2",
    description: "Active Cycle : 3",
    currentBid: 250,
    // startPrice: 65000,
    status: "LIVE",
    // endTime: "2025-01-02T18:30:00Z",
    // image: "/images/macbook.jpg",
  },
  {
    id: 3,
    title: "Bid 3",
    description: "Active Cycle : 2",
    currentBid: 100,
    // startPrice: 32000,
    status: "LIVE",
    // endTime: "2025-01-03T18:30:00Z",
    // image: "/images/ps5.jpg",
  },
  {
    id: 4,
    title: "Bid 4",
    description: "Active Cycle : 1",
    currentBid: 50,
    // startPrice: 72000,
    status: "LIVE",
    // endTime: "2024-12-15T18:30:00Z",
    // image: "/images/samsung.jpg",
  },
];

// =====================
// ACTIVITY FEED
// =====================

export const ACTIVITY_FEED: Activity[] = [
  {
    id: 1,
    user: "Rahul",
    message: "Rahul Joined the Bid 1",
    time: "Just now",
  },
  {
    id: 2,
    user: "Ananya",
    message: "Ananya Joined the Bid 3",
    time: "5m ago",
  },
  {
    id: 3,
    user: "Vikram",
    message: "Vikram Joined the Bid 2",
    time: "12m ago",
  },
  {
    id: 4,
    user: "Sneha",
    message: "Sneha joined The Bid 4",
    time: "20m ago",
  },
];

// =====================
// LEADERBOARD DATA
// =====================

export const LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    bids: 42,
    score: 9800,
    avatar: "/avatars/rahul.png",
  },
  {
    id: 2,
    name: "Ananya Verma",
    bids: 38,
    score: 9100,
    avatar: "/avatars/ananya.png",
  },
  {
    id: 3,
    name: "Vikram Singh",
    bids: 31,
    score: 8600,
    avatar: "/avatars/vikram.png",
  },
  {
    id: 4,
    name: "Sneha Patel",
    bids: 27,
    score: 8000,
    avatar: "/avatars/sneha.png",
  },
  {
    id: 5,
    name: "Arjun Mehta",
    bids: 21,
    score: 7200,
    avatar: "/avatars/arjun.png",
  },
];
