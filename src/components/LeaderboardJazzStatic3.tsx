import React from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavBar } from "./BottomNavBar";

interface Player {
    rank: number;
    name: string;
    score: number;
    avatar: string;
    isCurrentUser?: boolean;
}

const players: Player[] = [
    {
        rank: 1,
        name: "Jordyn Kenter",
        score: 96239,
        avatar: "/assets/users/1.png",
    },
    {
        rank: 2,
        name: "Alena Bator",
        score: 84787,
        avatar: "/assets/users/2.png",
    },
    {
        rank: 3,
        name: "Carl Oliver",
        score: 82139,
        avatar: "/assets/users/3.png",
    },
    {
        rank: 4,
        name: "Davis Curtis",
        score: 80857,
        avatar: "/assets/users/4.png",
    },
    {
        rank: 5,
        name: "Isona Othid",
        score: 76128,
        avatar: "/assets/users/5.png",
    },
    {
        rank: 6,
        name: "Makenna George",
        score: 71667,
        avatar: "/assets/users/6.png",
        isCurrentUser: true,
    },
    {
        rank: 7,
        name: "Kianna Batista",
        score: 68439,
        avatar: "/assets/users/7.png",
    },
    {
        rank: 8,
        name: "Maxith Cullep",
        score: 66981,
        avatar: "/assets/users/8.png",
    },
    {
        rank: 9,
        name: "Zain Dias",
        score: 50546,
        avatar: "/assets/users/9.png",
    },
];

const formatScore = (value: number) => value.toLocaleString();

const getOrdinal = (rank: number) => {
    if (rank === 1) return "1st";
    if (rank === 2) return "2nd";
    if (rank === 3) return "3rd";
    return `${rank}th`;
};

const first = players.find((p) => p.rank === 1)!;
const second = players.find((p) => p.rank === 2)!;
const third = players.find((p) => p.rank === 3)!;

const restPlayers = players.filter((p) => p.rank > 3);

/* ===========================================================
    ICONS
=========================================================== */

const LogoIcon = ({ className = "" }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="12"
            cy="12"
            r="9"
            stroke="#ff5da8"
            strokeWidth="2"
        />
        <circle
            cx="12"
            cy="12"
            r="5"
            stroke="#ff5da8"
            strokeWidth="1.6"
        />
    </svg>
);

const MenuIcon = ({ className = "" }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00E7FF"
        strokeWidth="2.4"
        strokeLinecap="round"
    >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="20" y2="12" />
        <line x1="12" y1="18" x2="20" y2="18" />
    </svg>
);

const DiamondIcon = ({ className = "" }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 20 20"
        fill="#27D980"
    >
        <path d="M10 1L1 10L10 19L19 10L10 1Z" />
    </svg>
);

/* ===========================================================
    LAUREL BADGE
=========================================================== */

const RankBadge = ({
    rank,
    gold = false,
}: {
    rank: number;
    gold?: boolean;
}) => {
    return (
        <div className="relative w-16 h-16 flex items-center justify-center">

            <svg
                className="absolute inset-0"
                viewBox="0 0 64 64"
            >
                {/* Left */}
                <path
                    d="M22 50
             C10 42 9 24 22 14"
                    stroke={gold ? "#FDBA2D" : "#D4D8E8"}
                    strokeWidth="2.2"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Right */}
                <path
                    d="M42 50
             C54 42 55 24 42 14"
                    stroke={gold ? "#FDBA2D" : "#D4D8E8"}
                    strokeWidth="2.2"
                    fill="none"
                    strokeLinecap="round"
                />

                {[
                    [20, 42],
                    [18, 35],
                    [18, 28],
                    [20, 21],
                    [44, 42],
                    [46, 35],
                    [46, 28],
                    [44, 21],
                ].map(([x, y], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="1.8"
                        fill={gold ? "#FDBA2D" : "#D4D8E8"}
                    />
                ))}
            </svg>

            <div className="absolute text-white font-bold text-lg">
                {getOrdinal(rank)}
            </div>
        </div>
    );
};

/* ===========================================================
    PODIUM CARD
=========================================================== */

interface PodiumCardProps {
    player: Player;
    position: 1 | 2 | 3;
}

const PodiumCard: React.FC<PodiumCardProps> = ({
    player,
    position,
}) => {
    const center = position === 1;

    const gradient =
        position === 1
            ? "from-[#E5B541] via-[#8B6428] to-[#35241A]"
            : position === 2
                ? "from-[#538FFF] via-[#274E91] to-[#1A1736]"
                : "from-[#C97A2B] via-[#7D4318] to-[#261623]";

    return (
        <div className="flex flex-col items-center">

            <div
                className={`
        relative
        overflow-hidden
        rounded-t-3xl
        rounded-b-2xl
        bg-gradient-to-b
        ${gradient}
        border
        border-white/10
        shadow-2xl
        ${center
                        ? "w-[118px] h-[190px]"
                        : "w-[100px] h-[165px]"
                    }
      `}
            >
                {/* Laurel */}

                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                    <RankBadge
                        rank={player.rank}
                        gold={position !== 2}
                    />
                </div>

                {/* Glow */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Avatar */}

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">

                    <img
                        src={player.avatar}
                        alt={player.name}
                        className={`
            object-cover
            ${center
                                ? "w-[110px] h-[110px]"
                                : "w-[95px] h-[95px]"
                            }
          `}
                    />

                </div>
            </div>

            <div className="mt-3 text-center">

                <div
                    className={`${center ? "text-[14px]" : "text-[13px]"
                        } font-semibold text-white`}
                >
                    {player.name}
                </div>

                <div className="mt-1 flex items-center justify-center gap-1">

                    <DiamondIcon className="w-3.5 h-3.5" />

                    <span className="text-[#7CFFB8] font-bold">
                        {formatScore(player.score)}
                    </span>

                </div>

            </div>

        </div>
    );
};

/* ===========================================================
    MAIN COMPONENT
=========================================================== */

export default function LeaderboardJazzStatic3() {
    const navigate = useNavigate();

    return (
        <>
            <div
                className="
          min-h-screen
          max-w-md
          mx-auto
          relative
          overflow-hidden
          text-white
          pb-28
        "
                style={{
                    background:
                        "radial-gradient(circle at top,#55206F 0%,#28124B 35%,#120B27 70%,#090514 100%)",
                }}
            >
                {/* Background Glow */}
                <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

                {/* Header */}
                <header className="relative z-20 flex items-center justify-between px-5 pt-6 pb-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-95"
                    >
                        <LogoIcon className="w-6 h-6" />
                    </button>

                    <h1 className="text-xl font-bold tracking-wide">
                        Leaderboard
                    </h1>

                    <button
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>

                </header>

                {/* ==========================
              PODIUM
        =========================== */}

                <section className="relative px-4">

                    {/* Connected Base */}
                    <div
                        className="
              absolute
              left-4
              right-4
              bottom-10
              h-[145px]
              rounded-[34px]
              bg-white/[0.04]
              border
              border-white/10
              backdrop-blur-xl
            "
                    />

                    <div className="relative z-10 flex items-end justify-center gap-3">

                        {/* SECOND */}

                        <PodiumCard
                            player={second}
                            position={2}
                        />

                        {/* FIRST */}

                        <div className="-mb-2">
                            <PodiumCard
                                player={first}
                                position={1}
                            />
                        </div>

                        {/* THIRD */}

                        <PodiumCard
                            player={third}
                            position={3}
                        />

                    </div>

                </section>

                {/* ==========================
            LEADERBOARD CARD
        =========================== */}

                <section
                    className="
            relative
            mt-10
            rounded-t-[34px]
            bg-white/[0.06]
            backdrop-blur-xl
            border-t
            border-white/10
            px-4
            pt-7
            pb-8
          "
                >

                    {/* Green Accent */}

                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">

                        <div className="relative">

                            <div
                                className="
                  w-14
                  h-1
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_20px_#3AF79E]
                "
                            />

                            <div
                                className="
                  absolute
                  -top-2
                  left-1/2
                  -translate-x-1/2
                  w-0
                  h-0
                  border-l-[8px]
                  border-r-[8px]
                  border-b-[10px]
                  border-l-transparent
                  border-r-transparent
                  border-b-emerald-400
                "
                            />

                        </div>

                    </div>

                    {/* List */}

                    <div className="space-y-3 mt-3">

                        {restPlayers.map((player) => (
                            <div
                                key={player.rank}
                                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-white/5
                  bg-white/[0.03]
                  px-4
                  py-3
                  backdrop-blur-md
                "
                            >

                                {/* Left */}

                                <div className="flex items-center gap-3">

                                    <img
                                        src={player.avatar}
                                        alt={player.name}
                                        className="
                      w-12
                      h-12
                      rounded-full
                      object-cover
                      border-2
                      border-white/10
                    "
                                    />

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <span className="font-semibold text-[15px]">
                                                {player.name}
                                            </span>

                                            {player.isCurrentUser && (
                                                <span
                                                    className="
                            text-[10px]
                            uppercase
                            px-2
                            py-0.5
                            rounded-full
                            bg-emerald-500/20
                            text-emerald-300
                            font-bold
                          "
                                                >
                                                    You
                                                </span>
                                            )}

                                        </div>

                                        <div className="flex items-center gap-1 mt-1">

                                            <DiamondIcon className="w-3 h-3" />

                                            <span className="text-sm font-bold text-emerald-300">
                                                {formatScore(player.score)}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* Right */}

                                <RankBadge rank={player.rank} />

                            </div>
                        ))}

                    </div>

                    {/* Bottom Padding */}
                    <div className="h-6" />
                </section>

                {/* Bottom Gradient */}
                <div
                    className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            h-32
            bg-gradient-to-t
            from-black/50
            to-transparent
          "
                />
            </div>

            {/* Bottom Navigation */}
            <BottomNavBar />
        </>
    );
}