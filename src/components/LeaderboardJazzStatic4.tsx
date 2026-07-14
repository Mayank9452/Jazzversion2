import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
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
}

const players: Player[] = [
    { rank: 1, msisdn: "908xxxx890", score: 96239, avatarUrl: "/assets/users/1.png" },
    { rank: 2, msisdn: "923xxxx456", score: 84787, avatarUrl: "/assets/users/2.png" },
    { rank: 3, msisdn: "912xxxx789", score: 82139, avatarUrl: "/assets/users/3.png" },
    { rank: 4, msisdn: "987xxxx321", score: 80857, avatarUrl: "/assets/users/4.png" },
    { rank: 5, msisdn: "955xxxx111", score: 76128, avatarUrl: "/assets/users/5.png" },
    { rank: 6, msisdn: "955xxxx822", score: 71667, avatarUrl: "/assets/users/6.png", isCurrentUser: true },
    { rank: 7, msisdn: "922xxxx999", score: 68439, avatarUrl: "/assets/users/7.png" },
    { rank: 8, msisdn: "931xxxx222", score: 66981, avatarUrl: "/assets/users/8.png" },
    { rank: 9, msisdn: "944xxxx888", score: 50546, avatarUrl: "/assets/users/9.png" },
    { rank: 10, msisdn: "966xxxx555", score: 43210, avatarUrl: "/assets/users/10.png" },
];

const formatScore = (num: number) => num.toLocaleString();
const ordinal = (n: number) => (n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`);

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
const RankCoin: React.FC<{ rank: number }> = ({ rank }) => (
    <div className="relative w-11 h-11 shrink-0">
        <svg viewBox="0 0 44 44" className="w-full h-full">
            <defs>
                <linearGradient id={`coinRing${rank}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFCA20" />
                    <stop offset="100%" stopColor="#DFA208" />
                </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="19.5" fill="#2B2B2B" stroke={`url(#coinRing${rank})`} strokeWidth="2.4" />
            {[...Array(6)].map((_, i) => {
                const a = (Math.PI / 5) * i - Math.PI / 2 - 0.35;
                const x1 = 22 + Math.cos(a) * 20.5;
                const y1 = 22 + Math.sin(a) * 20.5;
                const x2 = 22 + Math.cos(a) * 17.5;
                const y2 = 22 + Math.sin(a) * 17.5;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFCA20" strokeWidth="1.4" opacity="0.5" />;
            })}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
            {ordinal(rank)}
        </span>
    </div>
);

/* ─────────────────────────────────────────────────────────
   LIST ROW (ranks 4+)
 ───────────────────────────────────────────────────────── */
const ListRow: React.FC<{ player: Player; isLast?: boolean }> = ({ player, isLast }) => (
    <div
        className={`flex items-center justify-between py-3.5 ${!isLast ? "border-b border-white/[0.06]" : ""} ${player.isCurrentUser ? "bg-[#FFCA20]/10 border border-[#FFCA20]/20 -mx-4 px-4 rounded-xl shadow-lg" : ""
            }`}
    >
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-[#2B2B2B] shrink-0">
                <img src={player.avatarUrl} alt={player.msisdn} className="w-full h-full object-cover" />
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
export const LeaderboardJazzStatic4: React.FC = () => {
    const navigate = useNavigate();

    const rank1 = players.find((p) => p.rank === 1)!;
    const rank2 = players.find((p) => p.rank === 2)!;
    const rank3 = players.find((p) => p.rank === 3)!;
    const restPlayers = players.filter((p) => p.rank > 3);

    return (
        <>
            <div
                className="min-h-screen w-full flex flex-col font-sans antialiased text-white max-w-md mx-auto"
                style={{
                    background: "radial-gradient(120% 60% at 50% 0%, #2B2B2B 0%, #191919 60%, #121212 100%)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-6 pb-2">
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

                {/* Podium */}
                <div className="px-6 pt-8 pb-4 flex items-end justify-center gap-3 select-none">
                    <PodiumSlot player={rank2} place={2} />
                    <PodiumSlot player={rank1} place={1} />
                    <PodiumSlot player={rank3} place={3} />
                </div>

                {/* connector chevron */}
                <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    className="flex justify-center -mb-1"
                >
                    <ChevronDown className="w-5 h-5 text-[#FFCA20]" strokeWidth={3} />
                </motion.div>

                {/* List panel */}
                <div
                    className="flex-1 mt-2 mx-3 mb-0 rounded-t-[28px] px-4 pt-4 pb-3 overflow-y-auto backdrop-blur-md"
                    style={{
                        background: "var(--glass-bg-medium, rgba(25, 25, 25, 0.7))",
                        border: "1px solid var(--glass-border, rgba(255, 255, 255, 0.08))",
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

export default LeaderboardJazzStatic4;