import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Gamepad2, User, ChevronDown } from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";

interface Player {
    rank: number;
    msisdn: string;
    score: number;
    avatarUrl: string;
    isCurrentUser?: boolean;
}

const players: Player[] = [
    { rank: 1, msisdn: "908xxxx890", score: 43, avatarUrl: "/assets/users/1.png" },
    { rank: 2, msisdn: "923xxxx456", score: 40, avatarUrl: "/assets/users/2.png" },
    { rank: 3, msisdn: "912xxxx789", score: 38, avatarUrl: "/assets/users/3.png" },
    { rank: 4, msisdn: "987xxxx321", score: 36, avatarUrl: "/assets/users/4.png" },
    { rank: 5, msisdn: "955xxxx111", score: 35, avatarUrl: "/assets/users/5.png" },
    { rank: 6, msisdn: "955xxxx822", score: 34, avatarUrl: "/assets/users/6.png", isCurrentUser: true },
    { rank: 7, msisdn: "922xxxx999", score: 33, avatarUrl: "/assets/users/7.png" },
    { rank: 8, msisdn: "931xxxx222", score: 32, avatarUrl: "/assets/users/8.png" },
    { rank: 9, msisdn: "944xxxx888", score: 31, avatarUrl: "/assets/users/9.png" },
    { rank: 10, msisdn: "966xxxx555", score: 30, avatarUrl: "/assets/users/10.png" },
];

const stars = [
    { top: "12%", left: "15%", size: "2px", delay: "0s" },
    { top: "25%", left: "8%", size: "1px", delay: "0.5s" },
    { top: "18%", left: "30%", size: "3px", delay: "1.2s" },
    { top: "35%", left: "22%", size: "1.5px", delay: "0.2s" },
    { top: "10%", left: "60%", size: "2.5px", delay: "0.8s" },
    { top: "22%", left: "50%", size: "1px", delay: "1.5s" },
    { top: "15%", left: "80%", size: "2px", delay: "0.4s" },
    { top: "28%", left: "90%", size: "1.5px", delay: "1.1s" },
    { top: "40%", left: "75%", size: "2.5px", delay: "0.7s" },
];

// --- Star Icon Component to represent Score ---
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`${className} inline fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

// --- Premium Big Medal Component with Ribbons ---
const BigMedal: React.FC<{ rank: number; color: string; ribbonColor: string; className?: string; size?: "sm" | "md" | "lg" }> = ({ rank, color, ribbonColor, className, size = "md" }) => {
    const isLg = size === "lg";
    const isSm = size === "sm";

    const ribbonClass = isLg ? "w-16 h-10" : isSm ? "w-11 h-6" : "w-13 h-8";
    const circleClass = isLg ? "w-14 h-14 -mt-2.5 text-sm" : isSm ? "w-10 h-10 -mt-1 text-[11px]" : "w-12 h-12 -mt-1.5 text-xs";

    return (
        <div className={`relative flex flex-col items-center justify-center ${className} select-none`}>
            {/* Ribbon SVG */}
            <svg className={`${ribbonClass} drop-shadow-sm`} viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Ribbon tail */}
                <path d="M12 1L17 18H21L15 1H12Z" fill={ribbonColor} opacity="0.9" />
                {/* Right Ribbon tail */}
                <path d="M28 1L23 18H19L25 1H28Z" fill={ribbonColor} opacity="0.9" />
                {/* Ribbon folds */}
                <path d="M9 1H31L27 10H13L9 1Z" fill={ribbonColor} />
            </svg>
            {/* Medal Circle */}
            <div
                className={`${circleClass} rounded-full flex items-center justify-center shadow-lg border-2 z-10`}
                style={{
                    background: `radial-gradient(circle at 35% 35%, ${color} 0%, #0c0d12 140%)`,
                    borderColor: color
                }}
            >
                <span className="font-black font-sans tracking-tighter text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
                    {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
                </span>
            </div>
        </div>
    );
};

export const LeaderboardJazzStatic2: React.FC = () => {
    const navigate = useNavigate();

    const rank1 = players.find((p) => p.rank === 1) || players[0];
    const rank2 = players.find((p) => p.rank === 2) || players[1];
    const rank3 = players.find((p) => p.rank === 3) || players[2];
    const restPlayers = players.filter((p) => p.rank > 3);

    // Current user rank info
    const currentUser = players.find((p) => p.isCurrentUser);

    return (
        <>
            <div className=" bg-[#0a0a0a] flex flex-col font-sans antialiased text-white max-w-md mx-auto w-full border-x border-white/5 shadow-2xl relative pb-4">

                <style>{`
                    .custom-scroll::-webkit-scrollbar {
                        width: 5px;
                    }
                    .custom-scroll::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scroll::-webkit-scrollbar-thumb {
                        background-color: #3b9f9e;
                        border-radius: 99px;
                    }
                    .custom-scroll {
                        scrollbar-width: thin;
                        scrollbar-color: #3b9f9e transparent;
                    }
                `}</style>

                {/* Header at Top */}
                <div className="flex items-center justify-between px-4 py-3 bg-transparent relative z-20 shrink-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center text-white bg-white/5 hover:bg-white/10 backdrop-blur-md w-9 h-9 rounded-xl transition active:scale-95 border border-white/10 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <img 
                            src="/assets/images/img/trophy.png" 
                            alt="Trophy" 
                            className="w-6 h-6 object-contain"
                        />
                        Leaderboard
                    </h2>
                    <div className="w-9 h-9" /> {/* Spacer for balance */}
                </div>

                {/* 1. Header Area with Brand Gradient - Compact overlay style */}
                <div className="h-[110px] w-full bg-brand-gradient relative shrink-0 z-0">
                    {/* Glowing background bubble */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-[80px] pointer-events-none" />

                    {/* Faint Dark Background Stars/Particles */}
                    {stars.map((star, idx) => (
                        <div
                            key={idx}
                            className="absolute rounded-full bg-black/15 animate-pulse"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                animationDelay: star.delay,
                                animationDuration: "2.5s",
                            }}
                        />
                    ))}
                </div>

                {/* 2. Top 3 Podium Card - Overlapping layout style of LeaderboardPageNew with Glassmorphism */}
                <div className="relative z-10 -mt-14 px-3 mb-4">
                    <div className="bg-black/60 backdrop-blur-[100px] rounded-2xl shadow-2xl p-4 pb-0 border border-white/[0.08]">
                        <div className="flex items-end justify-center bg-transparent gap-2 pt-2">

                            {/* Rank 2 (Left) */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                                {/* Avatar, Name, Score */}
                                <div className="flex flex-col items-center mb-1 w-full">
                                    <div className="relative">
                                        <div className="p-0.5 rounded-full bg-black/40 shadow-[0_0_12px_rgba(0,0,0,0.25)]">
                                            <img
                                                src={rank2.avatarUrl}
                                                alt="Rank 2 Avatar"
                                                className="w-12 h-12 rounded-full object-cover border border-white/10"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-white/90 mt-1 truncate w-full text-center px-1">{rank2.msisdn}</span>
                                    <div className="mt-1 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-[#FFCA20] shadow flex items-center gap-0.5 max-w-full">
                                        <StarIcon className="w-2.5 h-2.5 text-[#FFCA20] shrink-0" />
                                        <span className="truncate">Score {rank2.score}</span>
                                    </div>
                                </div>
                                {/* 3D Block Stand */}
                                <div className="relative w-full">
                                    {/* Top Face */}
                                    {/* <div className="h-3 bg-[#222]/50 rounded-t-lg border-t border-x border-white/5 skew-x-[-10deg] origin-bottom" /> */}
                                    {/* Front Face with Ribbon Medal */}
                                    <div className="h-[75px] bg-gradient-to-b from-[#222]/80 to-[#121212]/95 flex flex-col items-center justify-center rounded-b-lg border-b border-x border-white/30 relative">
                                        <BigMedal rank={2} color="#cbd5e1" ribbonColor="#2563eb" className="w-16 h-18" size="md" />
                                    </div>
                                </div>
                            </div>

                            {/* Rank 1 (Center) */}
                            <div className="flex flex-col items-center flex-[1.15] z-20 min-w-0">
                                {/* Avatar, Name, Score */}
                                <div className="flex flex-col items-center mb-1 w-full">
                                    <div className="relative -mt-6">
                                        {/* Floating Gold Crown */}
                                        <motion.div
                                            animate={{ y: [0, -3, 0] }}
                                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                            className="absolute -top-6 left-1/2 -translate-x-1/2"
                                        >
                                            <svg className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 18L5 8L10 13L12 4L14 13L19 8L22 18H2Z" fill="#FBBF24" stroke="#78350f" strokeWidth="1.5" strokeLinejoin="round" />
                                                <circle cx="2" cy="18" r="0.8" fill="#FFF" />
                                                <circle cx="5" cy="8" r="0.8" fill="#FFF" />
                                                <circle cx="12" cy="4" r="1.2" fill="#FFF" />
                                                <circle cx="19" cy="8" r="0.8" fill="#FFF" />
                                                <circle cx="22" cy="18" r="0.8" fill="#FFF" />
                                            </svg>
                                        </motion.div>
                                        <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                            <img
                                                src={rank1.avatarUrl}
                                                alt="Rank 1 Avatar"
                                                className="w-[60px] h-[60px] rounded-full object-cover border border-white/20"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-white mt-1 truncate w-full text-center px-1">{rank1.msisdn}</span>
                                    <div className="mt-1 bg-brand-gradient border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-black text-brand-black-100 shadow flex items-center gap-0.5 max-w-full">
                                        <StarIcon className="w-2.5 h-2.5 text-brand-black-100 shrink-0" />
                                        <span className="truncate">Score {rank1.score}</span>
                                    </div>
                                </div>
                                {/* 3D Block Stand */}
                                <div className="relative w-full">
                                    {/* Top Face */}
                                    {/* <div className="h-4 bg-[#222]/60 rounded-t-xl border-t-2 border-x-2 border-amber-400/50 skew-x-[-10deg] origin-bottom" /> */}
                                    {/* Front Face with Ribbon Medal */}
                                    <div className="h-[95px] bg-gradient-to-b from-[#2b2b2b] to-[#121212] flex flex-col items-center justify-center rounded-b-xl border-b-2 border-x-2 border-amber-400/80 relative shadow-xl">
                                        <BigMedal rank={1} color="#FFCA20" ribbonColor="#dc2626" className="w-20 h-22" size="lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Rank 3 (Right) */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                                {/* Avatar, Name, Score */}
                                <div className="flex flex-col items-center mb-1 w-full">
                                    <div className="relative">
                                        <div className="p-0.5 rounded-full bg-amber-600/20 shadow-[0_0_12px_rgba(0,0,0,0.15)]">
                                            <img
                                                src={rank3.avatarUrl}
                                                alt="Rank 3 Avatar"
                                                className="w-12 h-12 rounded-full object-cover border border-white/10"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-white/90 mt-1 truncate w-full text-center px-1">{rank3.msisdn}</span>
                                    <div className="mt-1 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-[#FFCA20] shadow flex items-center gap-0.5 max-w-full">
                                        <StarIcon className="w-2.5 h-2.5 text-[#FFCA20] shrink-0" />
                                        <span className="truncate">Score {rank3.score}</span>
                                    </div>
                                </div>
                                {/* 3D Block Stand */}
                                <div className="relative w-full">
                                    {/* Top Face */}
                                    {/* <div className="h-3 bg-[#222]/50 rounded-t-lg border-t border-x border-white/5 skew-x-[-10deg] origin-bottom" /> */}
                                    {/* Front Face with Ribbon Medal */}
                                    <div className="h-[60px] bg-gradient-to-b from-[#222]/80 to-[#121212]/95 flex flex-col items-center justify-center rounded-b-lg border-b border-x border-white/30 relative">
                                        <BigMedal rank={3} color="#fb923c" ribbonColor="#16a34a" className="w-12 h-14" size="sm" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 3. Rest of Rankings - Structured inside a separate card block with Glassmorphism */}
                <div className="px-3 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scroll pb-24">
                    <div className="bg-white/[0.02] backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/[0.08] mb-4">
                        <div className="space-y-1">
                            {restPlayers.map((player) => {
                                const isYou = player.isCurrentUser === true;

                                return (
                                    <div
                                        key={player.rank}
                                        className={`flex items-center justify-between py-3 border-b border-white/[0.04] last:border-b-0 ${isYou ? "bg-white/[0.08] rounded-xl px-2.5 -mx-2.5 border-b-transparent" : ""
                                            }`}
                                    >
                                        {/* Left Side: Rank, Avatar, Name */}
                                        <div className="flex items-center gap-3.5">
                                            {/* Rank Number */}
                                            <span className="text-xs font-black text-slate-500 w-4 text-center">
                                                {player.rank}
                                            </span>

                                            {/* Avatar */}
                                            <img
                                                src={player.avatarUrl}
                                                alt={player.msisdn}
                                                className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/[0.06]"
                                            />

                                            {/* Name */}
                                            <div className="flex flex-col">
                                                <span className={`text-[13px] font-bold text-white flex items-center gap-1.5`}>
                                                    {player.msisdn}
                                                    {isYou && (
                                                        <span className="text-[8px] bg-[#3b9f9e]/15 text-[#3b9f9e] px-1.5 py-0.5 rounded-md font-black uppercase">
                                                            You
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Score */}
                                        <div className="text-right flex items-center gap-1 pr-2">
                                            <StarIcon className="w-3.5 h-3.5 text-[#FFCA20] shrink-0" />
                                            <span className="text-sm font-black font-mono text-white/90">
                                                {player.score.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 4. Sticky User Rank Card (floating at the bottom, matching LeaderboardPageNew) with Gold Glassmorphism */}
                {currentUser && (
                    <div className="fixed bottom-20 left-0 right-0 px-3 z-10">
                        <div className="max-w-md mx-auto bg-gradient-to-r from-amber-500/15 to-yellow-500/10 backdrop-blur-lg rounded-xl p-3 shadow-2xl border border-amber-400/35">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 bg-amber-400/20 border border-amber-400/35 rounded-lg flex items-center justify-center">
                                        <span className="text-base font-extrabold text-amber-400">
                                            {currentUser.rank}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-extrabold text-sm leading-tight">
                                            Your Rank
                                        </p>
                                        <p className="text-white/60 text-xs font-bold leading-tight mt-0.5">
                                            Keep climbing! 🚀
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <StarIcon className="w-4 h-4 text-amber-400 shrink-0" />
                                    <p className="text-lg font-black font-mono text-amber-400">
                                        Score {currentUser.score}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <BottomNavBar />
        </>
    );
};

export default LeaderboardJazzStatic2;
