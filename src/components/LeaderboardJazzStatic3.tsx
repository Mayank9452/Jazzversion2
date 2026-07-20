import React from "react";
import { Gem, Menu } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data — swap this out for your real API / store data               */
/* ------------------------------------------------------------------ */

const TOP_THREE = [
    {
        rank: 2,
        name: "Alena Bator",
        score: 84787,
        avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Alena&backgroundColor=b6e3f4",
    },
    {
        rank: 1,
        name: "Jordyn Kenter",
        score: 96239,
        avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jordyn&backgroundColor=ffd5a6",
    },
    {
        rank: 3,
        name: "Carl Oliver",
        score: 82139,
        avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Carl&backgroundColor=e0c3fc",
    },
];

const REST = [
    { rank: 4, name: "Davis Curtis", score: 80857, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Davis&backgroundColor=cfe8f9" },
    { rank: 5, name: "Isona Othid", score: 76128, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Isona&backgroundColor=f6d6e8" },
    { rank: 6, name: "Makenna George", score: 71667, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Makenna&backgroundColor=cde7d8" },
    { rank: 7, name: "Kianna Batista", score: 68439, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kianna&backgroundColor=f9d8c2" },
    { rank: 8, name: "Maxith Cullep", score: 66981, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Maxith&backgroundColor=d6d3f0" },
    { rank: 9, name: "Zain Dias", score: 50546, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Zain&backgroundColor=cfe0f7" },
];

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function fmt(n) {
    return n.toLocaleString("en-US");
}

/** Gold laurel-wreath medal with the rank number in the middle */
function LaurelBadge({ rank, size = "md" }) {
    const dims = size === "lg" ? "w-16 h-16 text-lg" : "w-11 h-11 text-sm";
    return (
        <div className={`relative ${dims} flex items-center justify-center shrink-0`}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <defs>
                    <linearGradient id={`gold-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="55%" stopColor="#f5b642" />
                        <stop offset="100%" stopColor="#c9820f" />
                    </linearGradient>
                </defs>
                {/* left branch */}
                <g opacity="0.95">
                    {[...Array(5)].map((_, i) => {
                        const angle = -70 + i * 22;
                        const rad = (angle * Math.PI) / 180;
                        const cx = 50 + Math.cos(rad) * 34;
                        const cy = 50 + Math.sin(rad) * 34;
                        return (
                            <ellipse
                                key={`l-${i}`}
                                cx={cx}
                                cy={cy}
                                rx="7"
                                ry="3.2"
                                transform={`rotate(${angle + 90} ${cx} ${cy})`}
                                fill={`url(#gold-${rank})`}
                            />
                        );
                    })}
                    {[...Array(5)].map((_, i) => {
                        const angle = 250 - i * 22;
                        const rad = (angle * Math.PI) / 180;
                        const cx = 50 + Math.cos(rad) * 34;
                        const cy = 50 + Math.sin(rad) * 34;
                        return (
                            <ellipse
                                key={`r-${i}`}
                                cx={cx}
                                cy={cy}
                                rx="7"
                                ry="3.2"
                                transform={`rotate(${angle - 90} ${cx} ${cy})`}
                                fill={`url(#gold-${rank})`}
                            />
                        );
                    })}
                </g>
                <circle cx="50" cy="50" r="24" fill={`url(#gold-${rank})`} stroke="#8a5a05" strokeWidth="1.5" />
            </svg>
            <span className="relative font-bold text-[#5c3a06]" style={{ fontSize: size === "lg" ? 18 : 13 }}>
                {rank}
                <sup className="text-[9px]">{rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th"}</sup>
            </span>
        </div>
    );
}

function ScorePill({ score, className = "" }) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <Gem className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" strokeWidth={0} />
            <span className="text-emerald-400 font-semibold text-sm">{fmt(score)}</span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Podium card (top 3)                                                */
/* ------------------------------------------------------------------ */

function PodiumCard({ person }) {
    const isFirst = person.rank === 1;

    const bg = isFirst
        ? "bg-gradient-to-b from-[#f8c94a] via-[#e8942f] to-[#a8438f]"
        : person.rank === 2
            ? "bg-gradient-to-b from-[#3d6fd6] via-[#2c4fa8] to-[#1b2a63]"
            : "bg-gradient-to-b from-[#c05fd6] via-[#8a3fae] to-[#3a1f63]";

    return (
        <div className={`flex flex-col items-center ${isFirst ? "-mt-6" : "mt-6"}`}>
            <LaurelBadge rank={person.rank} size={isFirst ? "lg" : "md"} />
            <div
                className={`relative mt-[-14px] rounded-3xl ${bg} px-3 pt-6 pb-3 flex flex-col items-center shadow-lg ${isFirst ? "w-28" : "w-24"
                    }`}
            >
                <div
                    className={`rounded-full overflow-hidden ring-4 ring-white/20 bg-black/20 ${isFirst ? "w-16 h-16" : "w-12 h-12"
                        }`}
                >
                    <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                </div>
                <p className="mt-2 text-white text-[11px] font-medium text-center leading-tight truncate w-full">
                    {person.name}
                </p>
                <ScorePill score={person.score} className="mt-1" />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  List row (rank 4+)                                                 */
/* ------------------------------------------------------------------ */

function ListRow({ person }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-white/10">
                <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{person.name}</p>
                <ScorePill score={person.score} className="mt-0.5" />
            </div>
            <LaurelBadge rank={person.rank} />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main screen                                                        */
/* ------------------------------------------------------------------ */

export default function Leaderboard() {
    const [second, first, third] = TOP_THREE;

    return (
        <div className="min-h-screen w-full bg-[#120c24] flex justify-center">
            <div
                className="relative w-full max-w-sm min-h-screen text-white overflow-hidden"
                style={{
                    background:
                        "radial-gradient(120% 60% at 50% 0%, #3a2a63 0%, #1c1435 45%, #120c24 100%)",
                }}
            >
                {/* status bar spacer */}
                <div className="h-10" />

                {/* header */}
                <div className="flex items-center justify-between px-5 pb-2">
                    <button className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-pink-400" />
                    </button>
                    <h1 className="text-lg font-semibold tracking-wide">Leaderboard</h1>
                    <button className="w-9 h-9 flex items-center justify-center text-sky-300">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* podium */}
                <div className="flex items-end justify-center gap-3 px-5 pt-6 pb-8">
                    <PodiumCard person={second} />
                    <PodiumCard person={first} />
                    <PodiumCard person={third} />
                </div>

                {/* list panel */}
                <div className="relative bg-[#1a1330]/90 backdrop-blur rounded-t-[32px] pt-4 pb-6 min-h-[300px]">
                    {/* pull handle / active tab indicator */}
                    <div className="flex justify-center mb-3">
                        <div className="w-16 h-1.5 rounded-full bg-emerald-400" />
                    </div>

                    <div className="divide-y divide-white/5">
                        {REST.map((person) => (
                            <ListRow key={person.rank} person={person} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}