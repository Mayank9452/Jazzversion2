import SectionLabel from "./SectionLabel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, Clock, PhoneCall } from "lucide-react";
import { useTheme } from "next-themes";

interface DailyTournament {
    dailyTournaments: any;
}

const getGameImage = (imageName: string, index: number) => {
    const images = [
        "/assets/images/4.png",
        "/assets/images/6.png",
        "/assets/images/9.png"
    ];
    return images[index % images.length];
};

const formatNumberInText = (text: string) => {
    if (!text) return "";
    return text.replace(/\d+/g, (match) => Number(match).toLocaleString('en-IN'));
};

const DailyTournamentMixedTesting3: React.FC<DailyTournament> = ({
    dailyTournaments,
}) => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const [countdowns, setCountdowns] = useState<Record<string, string>>({});

    const handleGameClick = (game: any) => {
        navigate("/tournamentPageStatic", {
            state: { tournament_id: game?.tournament_id },
        });
    };

    const calculateCountdown = (endTime: string) => {
        const end = new Date(endTime).getTime();
        const now = Date.now();
        const diff = end - now;
        if (diff <= 0) return "00:00:00:00";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const pad = (num: number) => String(num).padStart(2, "0");

        return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const updated: Record<string, string> = {};
            dailyTournaments?.forEach((t: any) => {
                updated[t.tournament_id] = calculateCountdown(t.tournament_end);
            });
            setCountdowns(updated);
        }, 1000);
        return () => clearInterval(timer);
    }, [dailyTournaments]);

    return (
        <>
            {dailyTournaments && dailyTournaments?.length > 0 && (
                <div className="flex flex-col gap-3.5 px-2 pb-4 w-full">
                    {dailyTournaments?.map((game: any, index: any) => {
                        const rewardType = index % 3; // 0 = Coins, 1 = Voucher, 2 = Talktime/Topup
                        const imageUrl = getGameImage(game?.image, index);

                        return (
                            <div
                                key={game?.tournament_id || index}
                                onClick={() => handleGameClick(game)}
                                className={`group relative w-full flex items-center gap-1 px-2 rounded-xl border transition-all duration-200 active:scale-[0.98]  cursor-pointer ${isDark
                                    ? "bg-[#1d1d1f]/60 backdrop-blur-md border-white/[0.06] shadow-[inset_0_-4px_24px_rgba(0,0,0,0.2),inset_0_-2px_1px_rgba(78,78,78,1),inset_0px_0_0px_rgba(255,255,255,0.6),inset_0px_0_0px_rgba(255,255,255,0.6)]"
                                    : "bg-white border-slate-200/70 shadow-sm"
                                    }`}
                            >
                                {/* Left Side: Compact Portrait Image */}
                                <div className="relative w-20 h-full sm:w-16 aspect-[3/4] rounded-lg overflow-hidden shadow-sm shrink-0 border border-black/10">
                                    <img
                                        src={imageUrl}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt={game?.tournament_name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/assets/images/4.png";
                                        }}
                                    />
                                </div>

                                {/* Center Details */}
                                <div className="flex-1 flex flex-col justify-center text-left py-0.5 min-w-0">
                                    {/* Game Title & Timer on the right */}
                                    <div className="flex justify-between items-baseline gap-2">
                                        <h3 className={`font-black text-sm sm:text-sm leading-tight tracking-wide truncate flex-1 ${isDark ? "text-white" : "text-slate-800"
                                            }`}>
                                            {game?.tournament_name || "Daily Tournament"}
                                        </h3>
                                        <div className="flex items-center gap-1 shrink-0 font-mono text-sm sm:text-[13px] font-black text-white dark:text-white">
                                            <Clock className="h-3 w-3 shrink-0 animate-pulse" />
                                            <span>{countdowns[game?.tournament_id] || "Loading..."}</span>
                                        </div>
                                    </div>

                                    {/* Info Grid: Row Layout for compact look */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                                        {/* Prize Pool */}
                                        <div className="flex items-center gap-1">
                                            {rewardType === 0 && (
                                                <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                                                    <img
                                                        src="/assets/images/img/gold-coin.png"
                                                        alt="coin"
                                                        className="w-4 h-4 object-contain"
                                                    />
                                                    <span className="font-extrabold text-slate-700 dark:text-brand-yellow-100">
                                                        1,00,000 Coins
                                                    </span>
                                                </div>
                                            )}
                                            {rewardType === 1 && (
                                                <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                                                    <img
                                                        src="/assets/images/Voucher.png"
                                                        alt="Voucher"
                                                        className="w-4 h-4 object-contain"
                                                    />
                                                    <span className="font-extrabold text-slate-700 dark:text-brand-yellow-100">
                                                        Rs 1,00,000 Voucher
                                                    </span>
                                                </div>
                                            )}
                                            {rewardType === 2 && (
                                                <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                                                    <PhoneCall className="h-3 w-3 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                                                    <span className="font-extrabold text-slate-700 dark:text-brand-yellow-100">
                                                        Rs 1,00,000 Topup
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Current Rank Badging */}
                                        <div className="flex items-center">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold border ${isDark
                                                ? "bg-brand-yellow-100/10 text-brand-yellow-100 border-brand-yellow-100/20"
                                                : "bg-slate-100 text-slate-700 border-slate-200"
                                                }`}>
                                                My Rank: #{game?.current_rank || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Action Play Button */}
                                <div className="flex items-center justify-center shrink-0 pl-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGameClick(game);
                                        }}
                                        className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow active:scale-90 transition-all border border-white/10"
                                        aria-label="Play Game"
                                    >
                                        <Play className="h-3.5 w-3.5 fill-brand-black-100 text-brand-black-100 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default DailyTournamentMixedTesting3;
