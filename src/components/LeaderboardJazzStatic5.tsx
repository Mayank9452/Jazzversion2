import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Award } from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";

/* ─────────────────────────────────────────────────────────
   MOCK DATA — swap avatarUrl for real user photos when wiring up
───────────────────────────────────────────────────────── */
interface Player {
    rank: number;
    msisdn: string;
    score: number;
    avatarUrl: string;
    isCurrentUser?: boolean;
    tier?: "diamond" | "platinum" | "gold" | "silver" | "bronze";
}

const players: Player[] = [
    { rank: 1, msisdn: "908xxxx890", score: 10000000, avatarUrl: "/assets/users/1.png" },
    { rank: 2, msisdn: "923xxxx456", score: 84787, avatarUrl: "/assets/users/2.png" },
    { rank: 3, msisdn: "912xxxx789", score: 82139, avatarUrl: "/assets/users/3.png" },
    { rank: 4, msisdn: "987xxxx321", score: 80857, avatarUrl: "/assets/users/4.png", tier: "diamond" },
    { rank: 5, msisdn: "955xxxx111", score: 76128, avatarUrl: "/assets/users/5.png", tier: "platinum" },
    { rank: 6, msisdn: "955xxxx822", score: 71667, avatarUrl: "/assets/users/6.png", isCurrentUser: true, tier: "gold" },
    { rank: 7, msisdn: "922xxxx999", score: 68439, avatarUrl: "/assets/users/7.png", tier: "silver" },
    { rank: 8, msisdn: "931xxxx222", score: 66981, avatarUrl: "/assets/users/8.png", tier: "bronze" },
    { rank: 9, msisdn: "944xxxx888", score: 50546, avatarUrl: "/assets/users/9.png", tier: "bronze" },
    { rank: 10, msisdn: "966xxxx555", score: 43210, avatarUrl: "/assets/users/10.png", tier: "bronze" },
];

const formatScore = (num: number) => num.toLocaleString();
const ordinal = (n: number) => (n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`);

const getTierColor = (tier: string | undefined) => {
    const colors = {
        diamond: "bg-gradient-to-r from-cyan-400 to-blue-500",
        platinum: "bg-gradient-to-r from-slate-300 to-slate-500",
        gold: "bg-gradient-to-r from-yellow-400 to-amber-500",
        silver: "bg-gradient-to-r from-gray-300 to-gray-400",
        bronze: "bg-gradient-to-r from-orange-400 to-amber-700",
    };
    return colors[tier as keyof typeof colors] || "bg-gradient-to-r from-gray-600 to-gray-800";
};

const getTierBadge = (tier: string | undefined) => {
    const badges = {
        diamond: "💎",
        platinum: "⚪",
        gold: "🥇",
        silver: "🥈",
        bronze: "🏅",
    };
    return badges[tier as keyof typeof badges] || "🏅";
};

/* ─────────────────────────────────────────────────────────
   STAR SCORE ICON — the golden star next to each score
───────────────────────────────────────────────────────── */
const ScoreIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`${className} inline fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);



/* ─────────────────────────────────────────────────────────
   RANK BADGE — rank number nestled at the base of each podium avatar
───────────────────────────────────────────────────────── */
const LaurelBadge: React.FC<{ rank: number; size?: "sm" | "md" | "lg" }> = ({ rank, size = "md" }) => {
    const dims = { sm: 40, md: 48, lg: 56 }[size];
    return (
        <svg viewBox="0 0 40 40" width={dims} height={dims} className="overflow-visible drop-shadow-md">
            <defs>
                <radialGradient id="badgeCircleGrad" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#3D3D3D" />
                    <stop offset="100%" stopColor="#191919" />
                </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#badgeCircleGrad)" stroke="#FFCA20" strokeWidth="2" />
            <text x="20" y="24.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="inherit">
                {ordinal(rank)}
            </text>
        </svg>
    );
};

/* ─────────────────────────────────────────────────────────
   PODIUM SLOT (top 3) — gradient halo ring behind avatar,
   laurel badge overlapping the chin, name + gem score below
───────────────────────────────────────────────────────── */
const podiumStyles: Record<
    number,
    { ring: string; wrap: string; laurel: "sm" | "md" | "lg" }
> = {
    1: { ring: "from-[#ffd76a] via-[#ff9d5c] to-[#ff5f9e]", wrap: "w-24 h-24", laurel: "lg" },
    2: { ring: "from-[#6fa8ff] via-[#3f6fe0] to-[#22317d]", wrap: "w-20 h-20", laurel: "sm" },
    3: { ring: "from-[#ff8fce] via-[#e767c9] to-[#8b4bd6]", wrap: "w-20 h-20", laurel: "sm" },
};

const PodiumSlot: React.FC<{ player: Player; place: 1 | 2 | 3 }> = ({ player, place }) => {
    const style = podiumStyles[place];
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: place * 0.06, duration: 0.35 }}
            className={`flex flex-col items-center ${place === 1 ? "-mt-6 z-20" : "mt-6 z-10"}`}
        >
            <div className={`relative ${style.wrap} rounded-full bg-gradient-to-br ${style.ring} p-[3px] shadow-lg shadow-black/40`}>
                <div className="w-full h-full rounded-full bg-[#2B2B2B] overflow-hidden flex items-center justify-center">
                    <img src={player.avatarUrl} alt={player.msisdn} className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="-mt-6 relative z-10">
                <LaurelBadge rank={place} size={style.laurel} />
            </div>

            <span className="mt-1 text-[13px] font-semibold text-white/95 text-center leading-tight max-w-[92px] truncate">
                {player.msisdn}
            </span>
            <div className="mt-1 flex items-center gap-1">
                <ScoreIcon className="w-3.5 h-3.5 text-[#FFCA20]" />
                <span className="text-[13px] font-bold text-[#FFCA20]">{formatScore(player.score)}</span>
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────────────────
   RANK COIN — gold-ringed badge used for ranks 4th and below
───────────────────────────────────────────────────────── */
const RankCoin: React.FC<{ rank: number }> = ({ rank }) => {
    return (
        <div className="px-2.5 py-1 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center min-w-[36px] backdrop-blur-sm shrink-0 select-none">
            <span className="text-[#FFCA20] font-black text-[13px] tracking-tight">
                #{rank.toLocaleString()}
            </span>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   LIST ROW (ranks 4+)
 ───────────────────────────────────────────────────────── */
const ListRow: React.FC<{ player: Player; isLast?: boolean }> = ({ player, isLast }) => (
    <div
        className={`flex items-center justify-between py-3.5 ${!isLast ? "border-b border-white/[0.06]" : ""} ${player.isCurrentUser ? "bg-[#FFCA20]/10 border border-[#FFCA20]/20 -mx-4 px-4 rounded-xl shadow-lg" : ""
            }`}
    >
        <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
                <div
                    className={`w-11 h-11 ${getTierColor(player.tier)} rounded-lg p-0.5`}
                >
                    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                            src={player.avatarUrl}
                            alt={player.msisdn}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="absolute -bottom-2 -right-0.5 text-sm">
                    🏅
                </div>
            </div>
            <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white truncate">
                    {player.msisdn}
                    {player.isCurrentUser && <span className="text-white/40 font-normal"> (You)</span>}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                    <ScoreIcon className="w-3.5 h-3.5 text-[#FFCA20]" />
                    <span className="text-[13px] font-bold text-[#FFCA20]">{formatScore(player.score)}</span>
                </div>
            </div>
        </div>

        <RankCoin rank={player.rank} />
    </div>
);

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export const LeaderboardJazzStatic5: React.FC = () => {
    const navigate = useNavigate();

    const rank1 = players.find((p) => p.rank === 1)!;
    const rank2 = players.find((p) => p.rank === 2)!;
    const rank3 = players.find((p) => p.rank === 3)!;
    const restPlayers = players.filter((p) => p.rank > 3);

    return (
        <>
            <div
                className="min-h-screen w-full flex flex-col font-sans antialiased text-white max-w-md mx-auto relative overflow-hidden"
                style={{
                    background: "radial-gradient(120% 60% at 50% 0%, #2B2B2B 0%, #191919 60%, #121212 100%)",
                }}
            >
                {/* Background Trophy Watermark */}
                <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-72 h-72 pointer-events-none opacity-[0.35] z-0 select-none">
                    <img
                        src="/assets/images/img/trophy.png"
                        alt="Background Trophy"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-6 pb-2 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#FFCA20]" strokeWidth={2.4} />
                    </button>
                    <h1 className="text-[17px] font-bold tracking-wide flex items-center gap-1.5">
                        <img
                            src="/assets/images/img/trophy.png"
                            alt="Trophy"
                            className="w-5 h-5 object-contain"
                        />
                        Leaderboard
                    </h1>
                    <div className="w-10" />
                </div>

                {/* User Stats Block (Rank and Best Score) - Value is yellow, label text is pure white */}
                <div className="mx-4 mt-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3.5 flex justify-between items-center text-xs backdrop-blur-md select-none shadow-sm relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold">Your Rank:</span>
                        <span className="text-[#FFCA20] font-black text-sm">#6</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold">Best Score:</span>
                        <div className="flex items-center gap-1">
                            <ScoreIcon className="w-3.5 h-3.5 text-[#FFCA20] -mt-0.5" />
                            <span className="text-[#FFCA20] font-black text-sm">
                                {formatScore(players.find((p) => p.isCurrentUser)?.score || 7166)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Podium */}
                <div className="px-6 pt-8 pb-4 flex items-end justify-center gap-3 select-none relative z-10">
                    <PodiumSlot player={rank2} place={2} />
                    <PodiumSlot player={rank1} place={1} />
                    <PodiumSlot player={rank3} place={3} />
                </div>

                {/* connector chevron */}
                <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    className="flex justify-center -mb-1 relative z-10"
                >
                    <ChevronDown className="w-5 h-5 text-[#FFCA20]" strokeWidth={3} />
                </motion.div>

                {/* List panel */}
                <div
                    className="flex-1 mt-2 mx-3 mb-0 rounded-t-[28px] px-4 pt-4 pb-3 overflow-y-auto backdrop-blur-md relative z-10"
                    style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderBottom: "none",
                    }}
                >
                    {restPlayers.map((player, idx) => (
                        <ListRow key={player.rank} player={player} isLast={idx === restPlayers.length - 1} />
                    ))}
                </div>
            </div>
            <BottomNavBar />
        </>
    );
};

export default LeaderboardJazzStatic5;