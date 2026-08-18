import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Gift, Wifi, Trophy, Check, X, Flame } from "lucide-react";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";

// Custom Topup Icon Component using currentColor for theme compliance
const TopupIcon = ({ className = "w-6 h-6" }: { className?: string }) => {
    return (
        <div className={`relative ${className}`}>
            <svg
                viewBox="0 0 80 80"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Mobile Outline */}
                <rect
                    x="12"
                    y="3"
                    width="48"
                    height="74"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="5"
                />

                {/* Top Speaker / Camera */}
                <rect
                    x="31"
                    y="7"
                    width="10"
                    height="2.5"
                    rx="1.25"
                    fill="currentColor"
                />

                {/* Top Bezel Divider */}
                <path
                    d="M12 12H60"
                    stroke="currentColor"
                    strokeWidth="5"
                />

                {/* Bottom Bezel Divider */}
                <path
                    d="M12 68H60"
                    stroke="currentColor"
                    strokeWidth="5"
                />

                {/* Speed / Power Lines */}
                <rect
                    x="30"
                    y="31"
                    width="10"
                    height="2.5"
                    rx="1.25"
                    fill="currentColor"
                />

                <rect
                    x="26"
                    y="39"
                    width="14"
                    height="2.5"
                    rx="1.25"
                    fill="currentColor"
                />

                {/* Floating Circle */}
                <circle
                    cx="61"
                    cy="40"
                    r="14"
                    fill="black"
                    stroke="currentColor"
                    strokeWidth="5"
                />

                {/* Lightning Bolt */}
                <path
                    d="
            M63 31
            L56 40.5
            H61
            L58.5 50
            L66 39
            H62
            L64.5 31
            Z
          "
                    fill="currentColor"
                />
            </svg>
        </div>
    );
};

// Day Rewards definition
const REWARDS = [
    { day: 1, type: "coins", value: "100,000", label: "Coins", icon: Coins, color: "text-amber-400" },
    { day: 2, type: "data", value: "100,000 MB", label: "Data Pack", icon: Wifi, color: "text-blue-400" },
    { day: 3, type: "voucher", value: "Rs 100,000", label: "Voucher", icon: Gift, color: "text-purple-400" },
    { day: 4, type: "topup", value: "Rs 100,000", label: "Topup", icon: TopupIcon, color: "text-emerald-400" },
    { day: 5, type: "coins", value: "100,000", label: "Coins", icon: Coins, color: "text-amber-400" },
    { day: 6, type: "data", value: "100,000 MB", label: "Data Pack", icon: Wifi, color: "text-blue-400" },
    { day: 7, type: "voucher", value: "Rs 100,000", label: "Voucher", icon: Gift, color: "text-purple-400" },
    { day: 8, type: "topup", value: "Rs 100,000", label: "Topup", icon: TopupIcon, color: "text-emerald-400" },
    { day: 9, type: "coins", value: "100,000", label: "Coins", icon: Coins, color: "text-amber-400" },
    { day: 10, type: "jackpot", value: "Rs 100,000", label: "Mega Topup", icon: TopupIcon, color: "text-brand-yellow-100" },
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

export function DailyLoginBonusPopupOld({ isOpen, onClose, onRewardClaimed }: DailyLoginBonusPopupProps) {
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
                        className="absolute inset-0 backdrop-blur-[6px]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`relative w-full max-w-[420px] rounded-3xl border-2 p-5 pt-2 flex flex-col items-center gap-2 shadow-2xl transition-all duration-300 ${isDark
                            ? "bg-gradient-to-br from-[#0e0e0eab] via-[#323232] to-[#0e0e0eab] border-[#ffca20]/25 text-white"
                            : "bg-gradient-to-br from-[#FFFDF0] via-[#FFFCE0] to-[#FFF3CD] border-[#ffca20]/50 text-slate-800"
                            }`}
                    >
                        {/* 3D Ribbon Title Banner (Yellow-Orange Gradient) */}
                        <div className="relative -mt-8 mb-2 z-20 mx-auto select-none w-fit">
                            {/* Central Ribbon Body */}
                            <div className="bg-gradient-to-r from-[#ffca20] via-[#f7bd1e] to-[#dfa208] text-black text-[12px] sm:text-xs font-black px-12 py-3 rounded-md uppercase tracking-widest shadow-xl border-y border-white/25 flex items-center gap-1.5 relative z-10">
                                <Gift className="w-4.5 h-4.5 animate-bounce text-black fill-black/10" />
                                Daily Bonus
                            </div>

                            {/* Left Folded Ribbon Tail Wing */}
                            <div className="absolute -left-4 top-[6px] w-6 h-9 bg-[#b87d00] -z-10" style={{ clipPath: "polygon(100% 0, 0 0, 30% 50%, 0 100%, 100% 100%)" }}></div>
                            {/* Left Connecting Shadow Triangle */}
                            <div className="absolute -left-[1px] top-[42px] w-[5px] h-[5px] bg-[#825500] -z-10" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}></div>

                            {/* Right Folded Ribbon Tail Wing */}
                            <div className="absolute -right-4 top-[6px] w-6 h-9 bg-[#b87d00] -z-10" style={{ clipPath: "polygon(0 0, 100% 0, 70% 50%, 100% 100%, 0 100%)" }}></div>
                            {/* Right Connecting Shadow Triangle */}
                            <div className="absolute -right-[1px] top-[42px] w-[5px] h-[5px] bg-[#825500] -z-10" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}></div>
                        </div>

                        {/* Subtitle Description */}
                        <div className="flex flex-col items-center text-center mt-1 relative z-10">
                            <p className={`text-xs sm:text-[11px] max-w-[280px] mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                                Consecutive daily logins reward you with premium prizes!
                            </p>
                        </div>

                        {/* Daily Streak Track (10 rewards progress bar) */}
                        <div className={`w-full rounded-2xl border flex flex-col gap-2 relative z-10 ${isDark ? "bg-[#181614] border-white/[0.04]" : "bg-[#fdfbf2] border-slate-300/40 shadow-inner"
                            }`}>
                            {/* Scrollable Progress bar track wrapper */}
                            <div className="w-full overflow-x-auto py-3 scrollbar-none">
                                <div className="relative min-w-[620px] h-10 flex items-center px-2">
                                    {/* Progress Line Bar */}
                                    <div className="relative w-full h-3 rounded-full bg-slate-350 dark:bg-slate-800 overflow-visible mt-0">
                                        <div
                                            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-500 to-[#dfa208] transition-all duration-500"
                                            style={{ width: `${Math.min((streak / 10) * 100, 100)}%` }}
                                        />

                                        {/* 10 Dots indicators */}
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1 pointer-events-none">
                                            {Array.from({ length: 10 }).map((_, idx) => {
                                                const dayNum = idx + 1;
                                                const isPassed = streak >= dayNum;
                                                const isDotActive = dayNum === activeDay && !claimedToday;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-all duration-300 ${isDotActive
                                                            ? "bg-[#ffca20] border-[#dfa208] text-black font-black animate-pulse "
                                                            : isPassed
                                                                ? "bg-[#ffca20] border-[#dfa208] border border-white text-black font-black"
                                                                : "bg-slate-200 dark:bg-slate-900 border-slate-400 dark:border-slate-800"
                                                            }`}
                                                        style={isDotActive ? { animationDuration: "3.5s" } : undefined}
                                                    >
                                                        {isPassed ? (
                                                            <Check className="w-4 h-4 text-black stroke-[3.5]" />
                                                        ) : (
                                                            <span className={`text-[11px] font-black leading-none ${isDotActive ? "text-black" : "text-slate-500"}`}>{dayNum}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="flex justify-between items-center text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                                <span>Streak: {streak}/10 Days</span>
                                <span className="flex items-center gap-0.5">
                                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" /> Streak Active
                                </span>
                            </div> */}
                        </div>

                        {/* Scrollable grid area for Days 1 to 9 */}
                        <div className="w-full max-h-[195px] overflow-y-auto pr-1 relative z-10 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                            <div className="grid grid-cols-3 gap-2.5 w-full">
                                {REWARDS.slice(0, 9).map((reward) => {
                                    const Icon = reward.icon;
                                    const isClaimed = claimedDays.includes(reward.day);
                                    const isActive = reward.day === activeDay && !claimedToday;
                                    const isLocked = reward.day > activeDay || (reward.day === activeDay && claimedToday);

                                    return (
                                        <div
                                            key={reward.day}
                                            className={`relative rounded-2xl flex flex-col items-center justify-between pb-2 border overflow-hidden transition-all duration-300 ${isClaimed
                                                ? isDark
                                                    ? "bg-[#181614]/40 border-slate-900 text-slate-600"
                                                    : "bg-slate-200/50 border-slate-300/30 text-slate-400"
                                                : isActive
                                                    ? isDark
                                                        ? "bg-gradient-to-b from-[#ffca20]/15 to-transparent border-[#ffca20] shadow-[0_0_12px_rgba(255,202,32,0.25)]"
                                                        : "bg-gradient-to-b from-[#ffca20]/25 to-transparent border-[#ffca20] shadow-[0_0_12px_rgba(255,202,32,0.2)]"
                                                    : isDark
                                                        ? "bg-[#201d18]/45 border-[#383327]"
                                                        : "bg-[#FFFDE8] border-[#EAD093] shadow-sm"
                                                }`}
                                            style={{ height: "102px" }}
                                        >
                                            {/* Day Header Banner tab */}
                                            <div className={`w-full text-center py-1 font-black text-[9px] uppercase tracking-widest ${isClaimed
                                                ? "bg-slate-500/35 text-white/50"
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

                                            {/* Reward Icon */}
                                            <div className="my-1 shrink-0 relative z-10">
                                                <Icon className={`w-6 h-6 ${isClaimed ? "text-[#ffca20]/45" : isLocked ? "text-slate-400 dark:text-slate-650" : "text-[#ffca20]"}`} />
                                            </div>

                                            {/* Value label */}
                                            <span className={`text-[10px] font-black leading-none truncate max-w-full text-center relative z-10 ${isClaimed ? "text-slate-500/80" : isDark ? "text-white" : "text-slate-700"
                                                }`}>
                                                {reward.value}
                                            </span>

                                            {/* Claimed check mark in top right of card (yellow/gold background) */}
                                            {isClaimed && (
                                                <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-[#ffca20] border border-[#dfa208] flex items-center justify-center shadow-sm z-30">
                                                    <Check className="w-3.5 h-3.5 text-black stroke-[4]" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Day 10 Final Milestone Reward - Full Width Card */}
                        {(() => {
                            const reward = REWARDS[9];
                            const isClaimed = claimedDays.includes(reward.day);
                            const isActive = reward.day === activeDay && !claimedToday;
                            const isLocked = reward.day > activeDay || (reward.day === activeDay && claimedToday);

                            return (
                                <div
                                    className={`relative w-full rounded-2xl flex flex-col items-center justify-between pb-3 border overflow-hidden transition-all duration-300 relative z-10 ${isClaimed
                                        ? isDark
                                            ? "bg-[#181614]/40 border-slate-900 text-slate-600"
                                            : "bg-slate-200/50 border-slate-300/30 text-slate-400"
                                        : isActive
                                            ? isDark
                                                ? "bg-gradient-to-b from-[#ffca20]/15 to-transparent border-[#ffca20] shadow-[0_0_15px_rgba(255,202,32,0.3)] animate-pulse"
                                                : "bg-gradient-to-b from-[#ffca20]/25 to-transparent border-[#ffca20] shadow-[0_0_15px_rgba(255,202,32,0.25)]"
                                            : isDark
                                                ? "bg-[#201d18] border-[#383327]"
                                                : "bg-[#FFFDE8] border-[#EAD093] shadow-sm"
                                        }`}
                                    style={{ height: "105px" }}
                                >
                                    {/* Banner header tab */}
                                    <div className={`w-full text-center py-1 font-black text-[10px] uppercase tracking-widest ${isClaimed
                                        ? "bg-slate-500/35 text-white/50"
                                        : isActive
                                            ? "bg-[#ffca20] text-black font-extrabold animate-pulse"
                                            : " bg-[#dfa208]/20 text-[#dfa208]"
                                        }`}>
                                        Day 10 - Grand Reward
                                    </div>

                                    {/* Active background gold sunburst */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,202,32,0.35)_0%,transparent_75%)] pointer-events-none" />
                                    )}

                                    <div className="flex items-center gap-6 my-1 relative z-10 px-4">
                                        {/* Topup Icon */}
                                        <div className="relative flex items-center justify-center">
                                            <TopupIcon className={`w-10 h-10 filter drop-shadow-[0_2px_8px_rgba(255,202,32,0.4)] ${isClaimed ? "text-[#ffca20]/45" : isLocked ? "text-slate-400 dark:text-slate-650" : "text-[#ffca20]"
                                                }`} />
                                        </div>

                                        <div className="flex flex-col text-start">
                                            <span className={`text-[12px] sm:text-sm font-extrabold uppercase leading-none ${isClaimed ? "text-slate-400" : isDark ? "text-white" : "text-slate-800"}`}>
                                                {reward.value} Topup
                                            </span>
                                            <span className={`text-[9px] font-bold mt-1.5 uppercase tracking-wide ${isClaimed ? "text-slate-400" : "text-[#dfa208] dark:text-brand-yellow-100"}`}>
                                                Grand Jackpot Prize
                                            </span>
                                        </div>
                                    </div>

                                    {/* Claimed check mark in top right of card (yellow/gold background) */}
                                    {isClaimed && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ffca20] border border-[#dfa208] flex items-center justify-center shadow-md z-30">
                                            <Check className="w-3.5 h-3.5 text-black stroke-[4]" />
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* 3D Claim Collect Button */}
                        <div className="w-full flex flex-col gap-2 items-center relative z-10 mt-1">
                            <button
                                onClick={handleClaim}
                                disabled={claimedToday}
                                className={`w-full py-3.5 rounded-2xl font-bold text-lg tracking-widest transition-all duration-200 border-2 border-white ${claimedToday
                                    ? "bg-gradient-to-r from-[#ffca20]/50 to-[#dfa208]/50 text-black/50 border-[#dfa208]/30 border-b-0 cursor-not-allowed pointer-events-none"
                                    : "bg-gradient-to-r from-[#ffca20] to-[#dfa208] text-black border-amber-600 hover:brightness-110 active:border-b-0 active:translate-y-[4px] cursor-pointer shadow-md shadow-amber-500/10"
                                    }`}
                            >
                                {claimedToday ? "Claimed Today" : "Tap to collect"}
                            </button>

                            <button
                                onClick={onClose}
                                className="text-slate-400 text-xs hover:text-slate-600 dark:text-white dark:hover:text-slate-300 text-[10px] font-bold  tracking-widest transition-colors mt-1"
                            >
                                Close & Return
                            </button>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
