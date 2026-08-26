import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Gift, Wifi, Trophy, Check, X, Flame, Zap } from "lucide-react";
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
    { day: 3, type: "data", value: "100,000 MB", label: "Data Pack", icon: Wifi, color: "text-blue-400" },
    { day: 7, type: "voucher", value: "Rs 100,000", label: "Voucher", icon: Gift, color: "text-purple-400" },
    { day: 15, type: "jackpot", value: "Rs 100,000", label: "Mega Topup", icon: TopupIcon, color: "text-brand-yellow-100" },
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
            <div className="absolute inset-0 bg-[#ffca20]/2 blur-md pointer-events-none" />

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

const MysteryBoxRewardAnimation = ({ isClaimed, isLocked, isActive }: { isClaimed: boolean; isLocked: boolean; isActive: boolean }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const rewards = [
        {
            Icon: Wifi,
            className: "text-blue-400",
            title: "Data Reward",
            desc: "You win Data Reward"
        },
        {
            Icon: TopupIcon,
            className: "text-[#FFD05C]",
            title: "TopUp Reward",
            desc: "May be exclusive TopUp reward"
        },
        {
            Icon: Gift,
            className: "text-purple-400",
            title: "Voucher Reward",
            desc: "or an amazing Voucher"
        },
        {
            Icon: Coins,
            className: "text-amber-400",
            title: "Coins Reward",
            desc: "or coins for future redemption"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % rewards.length);
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    const currentReward = rewards[currentIndex];
    const CurrentIcon = currentReward.Icon;
    const currentClass = currentReward.className;

    return (
        <div className="flex items-center gap-5 my-1.5 relative z-10 px-4 w-full">
            {/* Left side: Mystery box image and animated overlay */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <img
                    src="/assets/images/mystery_box.png"
                    alt="Mystery Box"
                    className={`w-14 h-14 object-contain filter drop-shadow-[0_4px_10px_rgba(255,202,32,0.25)] ${isClaimed ? "opacity-50 grayscale" : ""}`}
                    onError={(e) => {
                        e.currentTarget.src = "/assets/images/myster_box.png";
                    }}
                />

                {/* Floating active reward icon cycling on top of the box with fade/scale animations */}
                {!isClaimed && (
                    <div className="absolute -top-1.5 -right-1.5 bg-[#100923]/95 border border-[#D8A14E]/40 rounded-full p-1.5 shadow-lg flex items-center justify-center animate-bounce z-20" style={{ animationDuration: "2.5s" }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.7, rotate: 20 }}
                                transition={{ duration: 0.35 }}
                            >
                                <CurrentIcon className={`w-4 h-4 ${currentClass}`} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Right side: Mystery reward text info with synchronized fade transitions */}
            <div className="flex flex-col text-start justify-center flex-1 h-[42px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col text-start leading-none"
                    >
                        <span className={`text-[12.5px] font-black uppercase tracking-wider ${isActive ? "text-[#FFD05C]" : "text-white"} truncate`}>
                            {currentReward.title}
                        </span>
                        <span className="text-white/60 text-[9.5px] font-bold mt-1.5 uppercase tracking-wide truncate">
                            {currentReward.desc}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

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

    const getProgressBarWidth = (streakVal: number) => {
        if (streakVal <= 1) return 0;
        if (streakVal <= 3) {
            return 0 + ((streakVal - 1) / 2) * 33.3;
        }
        if (streakVal <= 7) {
            return 33.3 + ((streakVal - 3) / 4) * 33.3;
        }
        const clamped = Math.min(streakVal, 15);
        return 66.6 + ((clamped - 7) / 8) * 33.4;
    };

    useEffect(() => {
        const savedClaimed = localStorage.getItem("gamenow_daily_claimed_days");
        const savedLastClaim = localStorage.getItem("gamenow_daily_last_claim_date");
        const savedStreak = localStorage.getItem("gamenow_daily_streak");

        let claimedList: number[] = [];
        if (savedClaimed) {
            claimedList = JSON.parse(savedClaimed);
            setClaimedDays(claimedList);
        }

        let currentStreak = 1;
        if (savedStreak) {
            currentStreak = Number(savedStreak);
        }
        setStreak(currentStreak);

        const todayStr = new Date().toDateString();
        let isClaimedToday = false;
        if (savedLastClaim === todayStr) {
            isClaimedToday = true;
            setClaimedToday(true);
        } else {
            setClaimedToday(false);
        }

        const oneDayMs = 24 * 60 * 60 * 1000;
        if (savedLastClaim && savedLastClaim !== todayStr) {
            const lastClaimDate = new Date(savedLastClaim);
            const diffTime = new Date().setHours(0, 0, 0, 0) - lastClaimDate.setHours(0, 0, 0, 0);
            if (diffTime > oneDayMs) {
                currentStreak = 1;
                setStreak(1);
                setClaimedDays([]);
                localStorage.setItem("gamenow_daily_streak", "1");
                localStorage.removeItem("gamenow_daily_claimed_days");
                claimedList = [];
            } else if (!isClaimedToday) {
                const nextStreak = currentStreak + 1 > 15 ? 1 : currentStreak + 1;
                currentStreak = nextStreak;
                setStreak(nextStreak);
                localStorage.setItem("gamenow_daily_streak", String(nextStreak));
            }
        }

        const milestones = [1, 3, 7, 15];
        const nextUnclaimed = milestones.find(m => !claimedList.includes(m)) || 15;
        setActiveDay(nextUnclaimed);

        if (claimedList.length === 4) {
            setClaimedDays([]);
            setStreak(1);
            setActiveDay(1);
            setClaimedToday(false);
            localStorage.removeItem("gamenow_daily_claimed_days");
            localStorage.setItem("gamenow_daily_streak", "1");
            localStorage.removeItem("gamenow_daily_last_claim_date");
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

        if (streak < activeDay) {
            Swal.fire({
                title: "Streak Incomplete!",
                text: `You need a ${activeDay}-day streak to claim this reward. Current streak: ${streak} Days.`,
                icon: "warning",
                confirmButtonColor: "#dfa208",
            });
            return;
        }

        const nextClaimed = [...claimedDays, activeDay];
        const todayStr = new Date().toDateString();

        setClaimedDays(nextClaimed);
        setClaimedToday(true);

        localStorage.setItem("gamenow_daily_claimed_days", JSON.stringify(nextClaimed));
        localStorage.setItem("gamenow_daily_last_claim_date", todayStr);

        const currentReward = REWARDS.find(r => r.day === activeDay);
        if (!currentReward) return;

        Swal.fire({
            title: "Claimed Successfully!",
            html: `You won <b style="color: #ffca20">${currentReward.value} ${currentReward.label}</b>!<br/>Streak is at <b>${streak} Days</b>.`,
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
                        className="absolute inset-0 backdrop-blur-[10px]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="relative w-full max-w-[390px] rounded-[32px] border-2 border-[#D8A14E]/60 p-5 pt-8 flex flex-col items-center gap-4 shadow-[0_20px_50px_rgba(216,161,78,0.15)] bg-gradient-to-b from-[#180F31] via-[#0E0720] to-[#04010E] text-white"
                    >
                        {/* <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-28 h-28 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                                <Gift className="w-18 h-18 text-amber-300 fill-amber-500/10 drop-shadow-[0_4px_16px_rgba(245,158,11,0.6)]" />
                            </div>
                        </div> */}

                        {/* <button
                            onClick={onClose}
                            className="absolute top-4 right-4 rounded-full border border-[#D8A14E]/40 bg-[#1A0F35] p-1.5 text-[#FFD05C] hover:bg-[#25174c] hover:border-[#FFD05C] transition-all z-30 shadow-md"
                        >
                            <X className="w-4 h-4" />
                        </button> */}

                        <div className="relative -mt-14 mb-1.5 z-20 mx-auto select-none w-fit">
                            <div className="bg-gradient-to-b from-[#2e1966] to-[#170c38] text-[#FFD05C] text-[15px] font-black px-12 py-3 rounded-lg uppercase tracking-wider shadow-2xl border-2 border-[#D8A14E]/60 flex items-center justify-center gap-1.5 relative z-10">
                                Daily Login Bonus
                            </div>

                            <div className="absolute -left-3 top-[6px] w-6 h-8 bg-white border-l border-b border-[#D8A14E]/40 -z-10" style={{ clipPath: "polygon(100% 0, 0 0, 30% 50%, 0 100%, 100% 100%)" }}></div>
                            <div className="absolute -left-[1px] top-[36px] w-[4px] h-[4px] bg-[#0c061d] -z-10" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}></div>

                            <div className="absolute -right-3 top-[6px] w-6 h-8 bg-white border-r border-b border-[#D8A14E]/40 -z-10" style={{ clipPath: "polygon(0 0, 100% 0, 70% 50%, 100% 100%, 0 100%)" }}></div>
                            <div className="absolute -right-[1px] top-[36px] w-[4px] h-[4px] bg-[#0c061d] -z-10" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}></div>
                        </div>

                        <div className="text-center z-10 flex items-center justify-center gap-1.5 mb-0.5">
                            <span className="text-[#D8A14E] text-[10px] sm:text-xs">✦</span>
                            <p className="text-white/70 text-[10px] sm:text-[11px] font-medium tracking-wide">
                                Log in daily & claim amazing rewards!
                            </p>
                            <span className="text-[#D8A14E] text-[10px] sm:text-xs">✦</span>
                        </div>

                        <div className="w-full px-2 py-2 relative z-10">
                            <div className="relative w-full h-8 flex items-center">
                                <div className="absolute left-[16px] right-[16px] h-1.5 rounded-full bg-[#1b1236]/85 border border-white/[0.03] shadow-inner pointer-events-none z-0">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#DF9F28] via-[#FFD05C] to-[#DF9F28] transition-all duration-500"
                                        style={{ width: `${getProgressBarWidth(streak)}%` }}
                                    />
                                </div>

                                <div className="absolute inset-x-0 top-0 bottom-0 flex justify-between items-center z-10 pointer-events-none">
                                    {REWARDS.map((reward, idx) => {
                                        const isPassed = streak >= reward.day;
                                        const isDotActive = reward.day === activeDay && !claimedToday;
                                        return (
                                            <div key={idx} className="flex flex-col items-center pointer-events-auto relative">
                                                <div
                                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-all duration-300 ${isDotActive
                                                        ? "bg-gradient-to-b from-[#FFD05C] to-[#DF9F28] border-[#FFD05C] text-[#180F31] font-black animate-pulse shadow-[0_0_12px_#FFD05C]"
                                                        : isPassed
                                                            ? "bg-gradient-to-b from-[#FFD05C] to-[#DF9F28] border-[#FFD05C] text-[#180F31] font-black"
                                                            : "bg-[#180F31] border-2 border-[#D8A14E]/60 text-white/95"
                                                        }`}
                                                    style={isDotActive ? { animationDuration: "3.5s" } : undefined}
                                                >
                                                    {isPassed ? (
                                                        <Check className="w-4 h-4 text-[#180F31] stroke-[4.5]" />
                                                    ) : (
                                                        <span className="text-[11px] font-black leading-none">{reward.day}</span>
                                                    )}
                                                </div>
                                                <span className="text-[#D8A14E] text-[9px] font-black tracking-wider uppercase mt-1 relative top-[3px]">
                                                    Day {reward.day}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="w-full relative z-10 mt-2">
                            <div className="grid grid-cols-3 gap-3 w-full">
                                {REWARDS.slice(0, 3).map((reward) => {
                                    const Icon = reward.icon;
                                    const isClaimed = claimedDays.includes(reward.day);
                                    const isActive = reward.day === activeDay && !claimedToday;
                                    const isLocked = reward.day > activeDay || (reward.day === activeDay && claimedToday);

                                    return (
                                        <div
                                            key={reward.day}
                                            className={`relative rounded-2xl flex flex-col items-center justify-between pb-2 border overflow-hidden transition-all duration-300 ${isActive
                                                ? "bg-[#1c1236]/60 border-2 border-[#FFD05C] shadow-[0_0_15px_rgba(255,208,92,0.45)]"
                                                : isClaimed
                                                    ? "bg-[#100923]/60 border border-[#7c3aed]/10 opacity-60 text-slate-500"
                                                    : "bg-[#1c1236]/40 border border-[#D8A14E]/25 hover:border-[#D8A14E]/50"
                                                }`}
                                            style={{ height: "105px" }}
                                        >
                                            <div className={`mt-1.5 px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${isActive
                                                ? "bg-gradient-to-r from-[#DF9F28] to-[#FFD05C] text-black font-extrabold"
                                                : isClaimed
                                                    ? "bg-neutral-800 text-neutral-500"
                                                    : "bg-[#25174c]/80 text-[#a78bfa] border border-[#a78bfa]/10"
                                                }`}>
                                                Day {reward.day}
                                            </div>

                                            <div className="my-1.5 shrink-0 relative z-10">
                                                <Icon className={`w-7 h-7 ${isClaimed ? "text-[#FFD05C]/45" : isLocked ? "text-white/30" : "text-[#FFD05C]"}`} />
                                            </div>

                                            <span className={`text-[10px] font-black leading-none truncate max-w-full text-center relative z-10 ${isActive ? "text-[#FFD05C]" : "text-white"}`}>
                                                {reward.day === 3 ? "100,000 MB" : `Rs ${reward.value}`}
                                            </span>

                                            {isClaimed && (
                                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-[#DF9F28] to-[#FFD05C] border border-amber-600 flex items-center justify-center shadow-sm z-30">
                                                    <Check className="w-3 h-3 text-black stroke-[4.5]" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {(() => {
                            const reward = REWARDS[3];
                            const isClaimed = claimedDays.includes(reward.day);
                            const isActive = reward.day === activeDay && !claimedToday;
                            const isLocked = reward.day > activeDay || (reward.day === activeDay && claimedToday);

                            return (
                                <div
                                    className={`relative w-full rounded-2xl flex flex-col items-center justify-between pb-3 border overflow-hidden transition-all duration-300 relative z-10 ${isActive
                                        ? "bg-[#1c1236]/60 border-2 border-[#FFD05C] shadow-[0_0_20px_rgba(255,208,92,0.55)] animate-pulse"
                                        : isClaimed
                                            ? "bg-[#100923]/60 border border-[#7c3aed]/10 opacity-60 text-slate-500"
                                            : "bg-[#1c1236]/40 border border-[#D8A14E]/25"
                                        }`}
                                    style={{ height: "110px" }}
                                >
                                    <div className={`w-full text-center py-1 font-black text-[9px] uppercase tracking-widest ${isActive
                                        ? "bg-gradient-to-r from-[#DF9F28] to-[#FFD05C] text-black font-extrabold"
                                        : isClaimed
                                            ? "bg-neutral-800 text-neutral-500"
                                            : "bg-[#25174c]/85 text-[#a78bfa]"
                                        }`}>
                                        Day 15 — Grand Reward
                                    </div>

                                    <MysteryBoxRewardAnimation isClaimed={isClaimed} isLocked={isLocked} isActive={isActive} />

                                    {isClaimed && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-r from-[#DF9F28] to-[#FFD05C] border border-amber-600 flex items-center justify-center shadow-md z-30">
                                            <Check className="w-3.5 h-3.5 text-black stroke-[4]" />
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        <div className="w-full flex flex-col gap-2 items-center relative z-10 mt-1">
                            <button
                                onClick={handleClaim}
                                disabled={claimedToday || streak < activeDay}
                                className={`w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider transition-all duration-200 border-b-4 ${claimedToday || streak < activeDay
                                    ? "bg-[#1d1633] text-white/20 border-[#150f28] cursor-not-allowed pointer-events-none opacity-50"
                                    : "bg-gradient-to-r from-[#DF9F28] via-[#FFD05C] to-[#DF9F28] text-[#180F31] border-amber-600 hover:brightness-110 active:border-b-0 active:translate-y-[4px] cursor-pointer shadow-lg shadow-amber-500/20"
                                    }`}
                            >
                                {claimedToday ? "Claimed Today" : streak >= activeDay ? "Tap to collect" : `Unlock on Day ${activeDay} (${streak}/${activeDay})`}
                            </button>

                            <button
                                onClick={onClose}
                                className="text-white/50 text-[10px] font-black uppercase tracking-wider hover:text-white transition-colors mt-1 hover:underline cursor-pointer"
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
