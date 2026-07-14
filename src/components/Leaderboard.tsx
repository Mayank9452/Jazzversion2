import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LeaderboardUser } from "@/types";
import { Button } from "@/components/ui/button"
import { useState } from "react";



export default function Leaderboard({
  weeklyUsers,
  monthlyUsers,
}: {
  weeklyUsers: LeaderboardUser[]
  monthlyUsers: LeaderboardUser[]
}) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly")

  const users = activeTab === "weekly" ? weeklyUsers : monthlyUsers
  return (
    <div className="glass-card rounded-2xl p-5 card-shadow ">

      {/* Weekly / Monthly Switch */}
      <div className="relative flex w-fit rounded-xl bg-black/20 p-1 mb-4 m-auto">

        {/* Animated Indicator */}
        <span
          className={`absolute top-1 bottom-1 w-1/2 rounded-lg transition-all duration-300
      bg-[var(--gradient-pink-orange)]
      ${activeTab === "weekly" ? "left-1" : "left-1/2"}
    `}
        />

        <button
          onClick={() => setActiveTab("weekly")}
          className={`relative z-10 px-5 py-1.5 text-sm font-bold rounded-lg
      transition-colors
      ${activeTab === "weekly" ? "text-pink-700 bg-white" : "text-white"}
    `}
        >
          Weekly
        </button>

        <button
          onClick={() => setActiveTab("monthly")}
          className={`relative z-10 px-5 py-1.5 text-sm font-bold rounded-lg
      transition-colors
      ${activeTab === "monthly" ? "text-pink-700 bg-white" : "text-white"}
    `}
        >
          Monthly
        </button>
      </div>

      {/* <h2 className="text-lg font-extrabold text-gradient-purple mb-4">
        🏆 Top Bidders
      </h2> */}
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold leading-tight text-yellow-400">
          🏆 Top Bidders
        </h2>

        {/* <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 transition-smooth"
          onClick={() => {
            // TODO: replace with router push
            window.location.href = "/leaderboard"
          }}
        >
          View All →
        </Button> */}
        {/* <button className="pushable w-1/3">
          <span className="cs-shadow" />
          <span className="edge gradient-casino" />
          <span className="front bg-white text-pink-600 py-2 rounded-lg text-sm">
            View All
          </span>
        </button> */}
        <button
          onClick={() => setActiveTab("monthly")}
          className={`relative z-10 px-5 py-1.5 text-sm font-bold rounded-lg text-pink-700 bg-white
      transition-colors`}
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {users.map((user, i) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-muted/40 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-gradient-gold">
                #{i + 1}
              </span>
              <span className="text-sm font-semibold">
                {user.name}
              </span>
            </div>

            <span className="font-bold text-gradient-green">
              {user.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

