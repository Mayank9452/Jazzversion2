import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SectionLabel from "./SectionLabel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Gamepad2, Play, Clock, Trophy, Phone, PhoneCall } from "lucide-react";
import { useTheme } from "next-themes";

interface DailyTournament {
    dailyTournaments: any;
}

const getGameImage = (gameName: string, defaultImage: string, index: number) => {
    const name = gameName?.toLowerCase() || "";
    if (name.includes("alien galaxy war")) {
        return "/assets/images/Alien Galaxy.png";
    }
    if (name.includes("stick monkey")) {
        return "/assets/images/Stick Monkey.png";
    }
    const images = [
        "/assets/images/01.png",
        "/assets/images/02.png",
        "/assets/images/03.png",
        "/assets/images/box tower.jpeg",
        "/assets/images/knife ninja.jpeg"
    ];
    return images[index % images.length];
};

const formatNumberInText = (text: string) => {
    if (!text) return "";
    return text.replace(/\d+/g, (match) => Number(match).toLocaleString('en-IN'));
};

const DailyTournamentMixedTesting2: React.FC<DailyTournament> = ({
    dailyTournaments,
}) => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const [countdowns, setCountdowns] = useState<Record<string, string>>({});

    const handleGameClick = (game: any) => {
        navigate("/tournamentPageStatic", {
            state: {
                tournament_id: game?.tournament_id,
                fromMixedTesting2: true
            },
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
                <div className="rounded-2xl">
                    <div className="mb-1 px-1 text-center">
                        <Swiper
                            loop={true}
                            centeredSlides={false}
                            slidesPerView={2}
                            spaceBetween={5}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            modules={[Pagination, Navigation, Autoplay]}
                            className="tiny-slider-one flex justify-center items-center overflow-visible"
                        >
                            {dailyTournaments?.map((game: any, index: any) => {
                                const rewardType = index % 3; // 0 = Coins, 1 = Voucher, 2 = Topup
                                return (
                                    <SwiperSlide
                                        key={game?.tournament_id}
                                        className="overflow-visible cursor-pointer group relative"
                                        onClick={() => handleGameClick(game)}
                                    >
                                        {/* Yellow blur glow behind the transparent/opaque banner */}
                                        <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[70%] aspect-square rounded-full bg-[#FFCA20]/25 blur-[25px] pointer-events-none z-0" />

                                        <div
                                            className="w-full flex flex-col overflow-visible rounded-2xl transition-all duration-200 active:scale-[0.98] relative z-10"
                                        >
                                            {/* Game Image Banner */}
                                            <div className="relative w-full aspect-[285/380] rounded-xl overflow-hidden shadow-sm">
                                                <img
                                                    src={getGameImage(game?.tournament_name, game?.tournament_game_image, index)}
                                                    className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                                                    alt={game?.tournament_name}
                                                />
                                                {/* Floating Play Button on Bottom Right */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGameClick(game);
                                                    }}
                                                    className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto dark:border-2 border-white"
                                                    aria-label="Play Game"
                                                >
                                                    <Play className="h-3.5 w-3.5 fill-brand-black-100 text-brand-black-100 ml-0.5" />
                                                </button>
                                            </div>

                                            {/* Timer Row */}
                                            <div className="flex items-center justify-center gap-1 py-1 pb-0">
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 dark:bg-white/[0.08] text-white text-xs sm:text-[9px] font-bold font-mono tracking-tight shadow-sm whitespace-nowrap">
                                                    <Clock className="h-4 w-4 text-white shrink-0" />
                                                    {countdowns[game?.tournament_id]?.includes(":") ? (
                                                        <span className="flex items-center gap-[2px]">
                                                            {countdowns[game?.tournament_id].split(":").map((part, idx, arr) => (
                                                                <span key={idx} className="flex items-center gap-[2px]">
                                                                    <span>{part}</span>
                                                                    {idx < arr.length - 1 && <span className="opacity-40 font-normal">:</span>}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    ) : (
                                                        <span>{countdowns[game?.tournament_id] || "Loading..."}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reward Row */}
                                            <div className="flex justify-center items-center px-2 py-1.5 mt-1 bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04] rounded-xl whitespace-nowrap min-h-[36px] shadow-[inset_0_-4px_24px_rgba(0,0,0,0.2),inset_0_-2px_1px_rgba(78,78,78,1),inset_0px_0_0px_rgba(255,255,255,0.6),inset_0px_0_0px_rgba(255,255,255,0.6)]">
                                                {rewardType === 0 && (
                                                    <div className="font-extrabold flex items-center gap-1.5 text-sm sm:text-xs">
                                                        <img
                                                            src="/assets/images/img/gold-coin.png"
                                                            alt="coin"
                                                            className="w-5 h-5 object-contain"
                                                        />
                                                        <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                            {Number(game?.fee_prize_1).toLocaleString()} Coins
                                                        </span>
                                                    </div>
                                                )}
                                                {rewardType === 1 && (
                                                    <div className="font-extrabold flex items-center gap-1 text-xs sm:text-[10px]">
                                                        <img
                                                            src="/assets/images/giftkarte.png"
                                                            alt="voucher"
                                                            className="w-6 h-6 object-contain"
                                                        />
                                                        <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                            {formatNumberInText("Rs 100000 Voucher")}
                                                        </span>
                                                    </div>
                                                )}
                                                {rewardType === 2 && (
                                                    <div className="font-extrabold flex items-center gap-1.5 text-xs sm:text-[10px]">
                                                        <PhoneCall className="h-3.5 w-3.5 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                                                        <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                            {formatNumberInText("Rs 100000 Topup")}
                                                        </span>
                                                    </div>
                                                )}
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

export default DailyTournamentMixedTesting2;
