import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, Play, Trophy } from "lucide-react";
import { useTheme } from "next-themes";

interface WeeklyTournament {
    tournament_id: string;
    tournament_name: string;
    tournament_game_id: string;
    tournament_description: string;
    tournament_type: string;
    tournament_section: string;
    tournament_start: string;
    tournament_end: string;
    tournament_category_id: string;
    tournament_status: string;
    added_on: string;
    updated_on: string;
    fee_id: string;
    fee_tournament_id: string;
    fee_country_id: string;
    fee_reward_type: string;
    fee_fee: string;
    fee_prize_1: string;
    fee_prize_2: string;
    fee_prize_3: string;
    fee_prize_4: string;
    fee_prize_5: string;
    fee_prize_6: string;
    fee_prize_7: string;
    fee_prize_8: string;
    fee_prize_9: string;
    banner_type: string;
    players_joined: string;
    tournament_game_image: string;
    current_rank?: string;
}

interface Props {
    weeklyTournaments: WeeklyTournament[];
}

const getGameImage = (gameName: string, defaultImage: string) => {
    return "/assets/images/pistol-bottle.png";
};

const WeeklyTournamentTestingV2: React.FC<Props> = ({
    weeklyTournaments,
}) => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [countdowns, setCountdowns] = useState<Record<string, string>>({});

    const calculateCountdown = (endTime: string) => {
        const end = new Date(endTime).getTime();
        const now = Date.now();
        const diff = end - now;
        if (diff <= 0) return "00d:00h:00m:00s";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${String(days).padStart(2, "0")}d:${String(hours).padStart(
            2,
            "0"
        )}h:${String(minutes).padStart(2, "0")}m:${String(seconds).padStart(
            2,
            "0"
        )}s`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const updated: Record<string, string> = {};
            weeklyTournaments?.forEach((t) => {
                updated[t.tournament_id] = calculateCountdown(t.tournament_end);
            });
            setCountdowns(updated);
        }, 1000);
        return () => clearInterval(timer);
    }, [weeklyTournaments]);

    const handleGameClick = (game: WeeklyTournament) => {
        navigate("/tournamentPage", {
            state: { tournament_id: game?.tournament_id },
        });
    };

    return (
        <>
            {weeklyTournaments && weeklyTournaments?.length > 0 && (
                <div className="w-full flex flex-col gap-3">
                    <div className="rounded-2xl">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={1.15}
                            breakpoints={{
                                650: {
                                    slidesPerView: 2.15,
                                    spaceBetween: 10,
                                },
                            }}
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            loop={true}
                            modules={[Pagination, Navigation, Autoplay]}
                            className="tiny-slider-one rounded-2xl"
                        >
                            {weeklyTournaments?.map((tournament, index) => {
                                const borderClass = isDark
                                    ? "border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                    : "border-slate-200/60 shadow-[0_8px_24px_rgba(255,202,32,0.12)]";
                                const cardBg = isDark
                                    ? ""
                                    : "bg-white";

                                return (
                                    <SwiperSlide
                                        key={tournament?.tournament_id}
                                        onClick={() => handleGameClick(tournament)}
                                        className="overflow-hidden cursor-pointer"
                                    >
                                        <div
                                            className={`w-full flex flex-col gap-0 overflow-hidden rounded-[24px] transition-all duration-200 active:scale-[0.98] ${borderClass} ${cardBg}`}
                                        >
                                            {/* Game Banner Image */}
                                            <div className="relative w-full aspect-[2.1/1] rounded-[18px] overflow-hidden shadow-sm">
                                                <img
                                                    src={getGameImage(tournament?.tournament_name, tournament?.tournament_game_image)}
                                                    alt={tournament?.tournament_name}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                                />

                                                {/* Floating Timer Badge */}
                                                <div className="absolute top-2.5 left-2.5 z-10 p-1.5 px-2.5 rounded-[12px] bg-slate-900/60 dark:bg-black/55 backdrop-blur-md border border-slate-200/10 dark:border-white/10 shadow-lg flex items-center gap-1.5 text-white text-xs font-bold font-mono tracking-tight whitespace-nowrap">
                                                    <Clock className="h-3.5 w-3.5 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                                                    {countdowns[tournament?.tournament_id]?.includes(":") ? (
                                                        <span className="flex items-center gap-[2px]">
                                                            {countdowns[tournament?.tournament_id].split(":").map((part, idx, arr) => (
                                                                <span key={idx} className="flex items-center gap-[2px]">
                                                                    <span>{part}</span>
                                                                    {idx < arr.length - 1 && <span className="opacity-40 font-normal">:</span>}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    ) : (
                                                        <span>{countdowns[tournament?.tournament_id] || "Loading..."}</span>
                                                    )}
                                                </div>

                                                {/* Floating My Rank card */}
                                                <div className="absolute bottom-2.5 left-2.5 z-10 p-2 px-3 rounded-[12px] bg-slate-900/60 dark:bg-black/55 border border-slate-200/10 dark:border-white/10 shadow-lg min-w-[65px] flex flex-col justify-center">
                                                    <div className="text-[10px] text-slate-400 dark:text-white font-bold uppercase tracking-widest leading-none">
                                                        My Rank
                                                    </div>
                                                    <div className="text-[10px] font-black text-brand-gold-100 dark:text-brand-yellow-100 mt-1 leading-none">
                                                        #{tournament?.current_rank || "-"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Prize Pool & Play Button */}
                                            <div className="flex justify-between items-center px-2.5 py-2 border-t border-slate-200/50 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.01]">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="/assets/images/img/gold-coin.png"
                                                        className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] shrink-0"
                                                        alt="Coin"
                                                    />
                                                    <div>
                                                        <div className="text-[11px] text-slate-400 dark:text-white font-bold leading-none">Prize Pool</div>
                                                        <div className="text-sm font-black text-brand-gold-100 dark:text-brand-yellow-100 mt-1 leading-none">
                                                            {(!tournament?.fee_reward_type || tournament?.fee_reward_type === "1") && `${Number(tournament?.fee_prize_1).toLocaleString()} Coins`}
                                                            {tournament?.fee_reward_type === "2" && `${tournament?.fee_prize_1} GB Data`}
                                                            {tournament?.fee_reward_type === "3" && `Rs ${tournament?.fee_prize_1}`}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    className="px-4 py-1.5 rounded-lg flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 text-[11px] font-black shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto uppercase"
                                                    aria-label="Play Game"
                                                >
                                                    Play
                                                </button>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
};

export default WeeklyTournamentTestingV2;
