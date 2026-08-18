import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Gift, Wifi, Smartphone, Trophy, Check, Lock, X, Flame } from "lucide-react";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";

// Day Rewards definition
const REWARDS = [
  { day: 1, type: "coins", value: "250", label: "Coins", icon: Coins, color: "text-amber-400" },
  { day: 2, type: "data", value: "100 MB", label: "Data Pack", icon: Wifi, color: "text-blue-400" },
  { day: 3, type: "voucher", value: "Rs 20", label: "Voucher", icon: Gift, color: "text-purple-400" },
  { day: 4, type: "topup", value: "Rs 10", label: "Topup", icon: Smartphone, color: "text-emerald-400" },
  { day: 5, type: "coins", value: "500", label: "Coins", icon: Coins, color: "text-amber-400" },
  { day: 6, type: "data", value: "250 MB", label: "Data Pack", icon: Wifi, color: "text-blue-400" },
  { day: 7, type: "voucher", value: "Rs 50", label: "Voucher", icon: Gift, color: "text-purple-400" },
  { day: 8, type: "topup", value: "Rs 20", label: "Topup", icon: Smartphone, color: "text-emerald-400" },
  { day: 9, type: "coins", value: "1,000", label: "Coins", icon: Coins, color: "text-amber-400" },
  { day: 10, type: "jackpot", value: "Rs 100", label: "Mega Topup", icon: Trophy, color: "text-brand-yellow-100" },
];

export function DailyLoginBannerCard({ onClick }: { onClick: () => void }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem("gamenow_daily_streak");
    if (savedStreak) setStreak(Number(savedStreak));
  }, []);

  return (
    <div
      onClick={onClick}
      className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-amber-500/10 via-[#dfa208]/15 to-transparent border border-[#dfa208]/30 p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-[#ffca20]/50 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm select-none"
    >
      <div className="absolute inset-0 bg-[#ffca20]/2 blur-xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        {/* Glowing Gift Package */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ffca20] to-[#dfa208] flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0 animate-pulse">
          <Gift className="w-6 h-6 text-black fill-black/10 stroke-[2.2]" />
        </div>
        <div className="flex flex-col text-start">
          <h4 className="text-slate-800 dark:text-white text-sm font-black uppercase tracking-wider leading-none mb-1.5">
            Daily Reward
          </h4>
          <p className="text-slate-500 dark:text-white/60 text-[11px] font-bold leading-none flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/15" />
            Claim rewards & build your {streak}-day streak!
          </p>
        </div>
      </div>

      <button className="bg-gradient-to-r from-[#ffca20] to-[#dfa208] text-black font-black text-[11px] tracking-wider uppercase px-4 py-2 rounded-xl border border-white/20 active:scale-95 transition-all shadow-md">
        Open
      </button>
    </div>
  );
}

interface DailyLoginBonusPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: () => void;
}

export function DailyLoginBonusPopup({ isOpen, onClose, onRewardClaimed }: DailyLoginBonusPopupProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [claimedDays, setClaimedDays] = useState<number[]>([]);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [claimedToday, setClaimedToday] = useState<boolean>(false);

  useEffect(() => {
    // Load state from LocalStorage
    const savedClaimed = localStorage.getItem("gamenow_daily_claimed_days");
    const savedLastClaim = localStorage.getItem("gamenow_daily_last_claim_date");
    const savedStreak = localStorage.getItem("gamenow_daily_streak");

    let claimedList: number[] = [];
    if (savedClaimed) {
      claimedList = JSON.parse(savedClaimed);
      setClaimedDays(claimedList);
    }

    if (savedStreak) {
      setStreak(Number(savedStreak));
    }

    const todayStr = new Date().toDateString();
    if (savedLastClaim === todayStr) {
      setClaimedToday(true);
    }

    // Determine active day
    if (claimedList.length === 0) {
      setActiveDay(1);
    } else {
      const maxClaimed = Math.max(...claimedList);
      if (savedLastClaim === todayStr) {
        setActiveDay(maxClaimed);
      } else {
        const nextDay = maxClaimed + 1 > 10 ? 1 : maxClaimed + 1;
        setActiveDay(nextDay);
      }
    }
  }, [isOpen]);

  const handleClaim = () => {
    if (claimedToday) {
      Swal.fire({
        title: "Already Claimed!",
        text: "You have already claimed today's reward. Come back tomorrow!",
        icon: "info",
        confirmButtonColor: "#dfa208",
      });
      return;
    }

    const nextClaimed = [...claimedDays, activeDay];
    const todayStr = new Date().toDateString();
    const nextStreak = streak + 1 > 10 ? 1 : streak + 1;

    setClaimedDays(nextClaimed);
    setClaimedToday(true);
    setStreak(nextStreak);

    localStorage.setItem("gamenow_daily_claimed_days", JSON.stringify(nextClaimed));
    localStorage.setItem("gamenow_daily_last_claim_date", todayStr);
    localStorage.setItem("gamenow_daily_streak", String(nextStreak));

    const currentReward = REWARDS[activeDay - 1];

    Swal.fire({
      title: "Claimed Successfully!",
      html: `You won <b style="color: #ffca20">${currentReward.value} ${currentReward.label}</b>!<br/>Streak updated to <b>${nextStreak} Days</b>.`,
      icon: "success",
      confirmButtonColor: "#dfa208",
      background: isDark ? "#191919" : "#fff",
      color: isDark ? "#ffffff" : "#1e293b"
    });

    if (onRewardClaimed) onRewardClaimed();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 select-none">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-[6px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`relative w-full max-w-[420px] rounded-3xl border-2 p-5 flex flex-col items-center gap-4 overflow-hidden shadow-2xl transition-all duration-300 ${isDark
              ? "bg-gradient-to-br from-[#1c1a17] via-[#121212] to-[#0e0e0e] border-[#ffca20]/25 text-white"
              : "bg-gradient-to-br from-[#FFFDF0] via-[#FFFCE0] to-[#FFF3CD] border-[#ffca20]/50 text-slate-800"
              }`}
          >
            {/* Top Title Banner */}
            <div className="flex flex-col items-center gap-1 mt-1.5 relative z-10 text-center">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffca20]/15 border border-[#dfa208]/30 shadow-inner">
                <Gift className="w-4 h-4 animate-bounce text-[#dfa208] dark:text-[#ffca20] fill-[#dfa208]/10" />
                <span className="text-[#dfa208] dark:text-[#ffca20] font-black text-xs uppercase tracking-widest">
                  Daily Bonus
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] font-bold max-w-[280px] mt-1 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Consecutive daily logins reward you with premium prizes!
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 rounded-full p-1.5 transition-all z-10 ${isDark ? "text-white/55 bg-white/5 hover:bg-white/10" : "text-slate-500 bg-slate-200/50 hover:bg-slate-200/80"
                }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Horizontal Scrollable Streak Track (10 rewards & progress bar) */}
            <div className="w-full overflow-x-auto py-6 px-4 relative z-10 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
              {/* Relative container with minimum width to scroll on mobile */}
              <div className="relative min-w-[850px] flex flex-col items-stretch">

                {/* Horizontal Progress Line behind the dots */}
                <div className="absolute top-[18px] left-[42px] right-[42px] h-1.5 rounded-full bg-slate-350 dark:bg-slate-800 pointer-events-none z-0">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#dfa208] transition-all duration-500"
                    style={{ width: `${Math.min(((streak - 1) / 9) * 100, 100)}%` }}
                  />
                </div>

                {/* Horizontal list of dot+card items */}
                <div className="flex justify-between items-center gap-3 w-full">
                  {REWARDS.map((reward) => {
                    const Icon = reward.icon;
                    const isClaimed = claimedDays.includes(reward.day);
                    const isActive = reward.day === activeDay && !claimedToday;
                    const isLocked = reward.day > activeDay || (reward.day === activeDay && claimedToday);
                    const isPassed = streak >= reward.day;

                    return (
                      <div key={reward.day} className="flex flex-col items-center gap-4 w-[74px]">

                        {/* Dot Indicator (Top) */}
                        <div
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-md relative z-10 transition-all duration-300 ${isPassed
                            ? "bg-[#ffca20] border-[#dfa208] text-black font-black"
                            : "bg-slate-200 dark:bg-slate-900 border-slate-400 dark:border-slate-800 text-slate-500"
                            }`}
                        >
                          {isPassed ? (
                            <Check className="w-4 h-4 text-black stroke-[3.5]" />
                          ) : (
                            <span className="text-[11px] font-black">{reward.day}</span>
                          )}
                        </div>

                        {/* Reward Card (Bottom) */}
                        <div
                          className={`relative w-full rounded-2xl flex flex-col items-center justify-between pb-3 border overflow-hidden transition-all duration-300 ${isClaimed
                            ? isDark
                              ? "bg-[#252119]/80 border-[#3d3323] text-slate-500"
                              : "bg-[#f5ebd6] border-[#dfd0b2] text-slate-400"
                            : isActive
                              ? isDark
                                ? "bg-gradient-to-b from-[#ffca20]/15 to-transparent border-[#ffca20] shadow-[0_0_12px_rgba(255,202,32,0.25)] animate-pulse"
                                : "bg-gradient-to-b from-[#ffca20]/25 to-transparent border-[#ffca20] shadow-[0_0_12px_rgba(255,202,32,0.2)]"
                              : isDark
                                ? "bg-[#201d18]/45 border-[#383327]"
                                : "bg-[#FFFDE8] border-[#EAD093] shadow-sm"
                            }`}
                          style={{ height: "105px" }}
                        >
                          {/* Day Header Banner tab (no red/green backgrounds) */}
                          <div className={`w-full text-center py-1 font-black text-[9px] uppercase tracking-widest ${isClaimed
                            ? "bg-slate-500/25 text-slate-500 dark:text-slate-400"
                            : isActive
                              ? "bg-[#ffca20] text-black font-extrabold"
                              : "bg-[#dfa208]/20 text-[#dfa208] border-b border-[#dfa208]/10"
                            }`}>
                            Day {reward.day}
                          </div>

                          {/* Radial glow background for active */}
                          {isActive && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,202,32,0.25)_0%,transparent_70%)] pointer-events-none" />
                          )}

                          {/* Reward Icon (highlighted in text-brand-yellow) */}
                          <div className="my-1.5 shrink-0 relative z-10">
                            {reward.day === 10 ? (
                              <Trophy className={`w-7 h-7 filter drop-shadow ${isClaimed
                                ? "text-[#ffca20]/45"
                                : isLocked
                                  ? "text-slate-400 dark:text-slate-650"
                                  : "text-[#ffca20]"
                                }`} />
                            ) : (
                              <Icon className={`w-7 h-7 ${isClaimed
                                ? "text-[#ffca20]/45"
                                : isLocked
                                  ? "text-slate-400 dark:text-slate-650"
                                  : "text-[#ffca20]"
                                }`} />
                            )}
                          </div>

                          {/* Value label */}
                          <span className={`text-[10px] font-black leading-none truncate max-w-full text-center relative z-10 ${isClaimed ? "text-slate-500/80" : isDark ? "text-white" : "text-slate-700"
                            }`}>
                            {reward.value}
                          </span>

                          {/* Claimed check mark in top right of card (red color) */}
                          {isClaimed && (
                            <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-red-500 border border-white flex items-center justify-center shadow-sm z-30">
                              <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* 3D Claim Collect Button */}
            <div className="w-full flex flex-col gap-2 items-center relative z-10 mt-1">
              <button
                onClick={handleClaim}
                disabled={claimedToday}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-200 border-b-4 ${claimedToday
                  ? "bg-gradient-to-r from-[#ffca20]/50 to-[#dfa208]/50 text-black/50 border-[#dfa208]/30 border-b-0 cursor-not-allowed pointer-events-none"
                  : "bg-gradient-to-r from-[#ffca20] to-[#dfa208] text-black border-amber-600 hover:brightness-110 active:border-b-0 active:translate-y-[4px] cursor-pointer shadow-md shadow-amber-500/10"
                  }`}
              >
                {claimedToday ? "Claimed Today" : "Tap to collect"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
