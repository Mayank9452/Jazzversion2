import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SectionLabel from "./SectionLabel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Gamepad2, Play, Clock, Trophy } from "lucide-react";
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
}

interface Props {
    weeklyTournaments: WeeklyTournament[];
}

const gradientClasses = ["gradient-1", "gradient-2"];

const getGradientClass = (id: string) => {
    const index = Number(id) % gradientClasses.length;
    return gradientClasses[index];
};

const getGameImage = (gameName: string, defaultImage: string) => {
    const name = gameName?.toLowerCase() || "";
    if (name.includes("alien galaxy war")) {
        return "/assets/images/alien_galaxy_war.png";
    }
    if (name.includes("stick monkey")) {
        return "/assets/images/stick_monkey.png";
    }
    return defaultImage;
};

const WeeklyTournamentTesting: React.FC<Props> = ({ weeklyTournaments }) => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [countdowns, setCountdowns] = useState<Record<string, string>>({});

    const calculateCountdown = (endTime: string) => {
        const end = new Date(endTime).getTime();
        const now = Date.now();
        const diff = end - now;
        if (diff <= 0) return "00 : 00 : 00 : 00";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const pad = (num: number) => String(num).padStart(2, "0");

        return `${pad(days)} : ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
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
                <div
                    className="rounded-2xl"
                >
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={1.2}
                        breakpoints={{
                            650: {
                                slidesPerView: 2.2,
                                spaceBetween: 5,
                            },
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        modules={[Pagination, Navigation]}
                    >
                        {weeklyTournaments?.map((tournament, index: any) => {
                            const borderClass = isDark
                                ? " dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                : "border-slate-200/60 shadow-[0_6px_20px_rgba(59,130,246,0.06)]";
                            const cardBg = isDark
                                ? " backdrop-blur-md"
                                : "bg-white";

                            return (
                                <SwiperSlide
                                    key={tournament?.tournament_id}
                                    onClick={() => handleGameClick(tournament)}
                                    className="overflow-hidden cursor-pointer group"
                                >
                                    <div
                                        className={`w-full flex flex-col overflow-hidden rounded-2xl transition-all duration-200 active:scale-[0.98]`}
                                    >
                                        {/* Complete 3D Banner */}
                                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-sm">
                                            <img
                                                src={getGameImage(tournament?.tournament_name, tournament?.tournament_game_image)}
                                                alt={tournament?.tournament_name}
                                                className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Separate line to distinguish text and banner */}
                                        <div className="border-t border-slate-200 dark:border-white/20" />

                                        {/* Timer row (dd : hh : mm : ss) centered in white */}
                                        <div className="flex items-center justify-center gap-1.5 py-1 pb-0">
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 dark:bg-white/[0.08] text-white text-[11px] font-bold font-mono tracking-wider shadow-sm">
                                                <Clock className="h-3.5 w-3.5 text-white" />
                                                <span>{countdowns[tournament?.tournament_id] || "00 : 00 : 00 : 00"}</span>
                                            </div>
                                        </div>

                                        {/* Coins & Join Button on the next line */}
                                        <div className="flex justify-between items-center px-1.5 pb-1.5 pt-1.5 border-t border-slate-100 dark:border-white/[0.04]">
                                            <div className="font-extrabold flex items-center gap-1.5 text-xs">
                                                {tournament?.fee_reward_type === "1" && (
                                                    <>
                                                        <img
                                                            src="/assets/images/img/gold-coin.png"
                                                            alt="coin"
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                        <span className="tracking-wide text-brand-gold-100 dark:text-brand-yellow-100 font-bold">
                                                            {Number(tournament?.fee_prize_1).toLocaleString()} Coins
                                                        </span>
                                                    </>
                                                )}
                                                {tournament?.fee_reward_type === "2" && (
                                                    <span className="tracking-wide text-brand-gold-100 dark:text-brand-yellow-300 font-bold">
                                                        {tournament?.fee_prize_1} GB Data
                                                    </span>
                                                )}
                                                {tournament?.fee_reward_type === "3" && (
                                                    <span className="tracking-wide text-emerald-600 dark:text-emerald-400 font-bold">
                                                        Rs {tournament?.fee_prize_1}
                                                    </span>
                                                )}
                                            </div>

                                            <button className="font-extrabold px-3 py-2 rounded-lg bg-brand-gradient hover:brightness-110 text-brand-black-100 text-xs uppercase tracking-wider shadow-md pointer-events-auto active:scale-95 transition-all">
                                                Join
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            )}
        </>
    );
};

export default WeeklyTournamentTesting;
