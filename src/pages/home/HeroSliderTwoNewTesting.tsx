import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionLabel from "./SectionLabel";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trophy, Gamepad2, Play } from "lucide-react";
import { useTheme } from "next-themes";

interface HeroGames {
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
    current_rank: string;
}

interface HeroSliderTwoProps {
    heroGames: HeroGames[];
    onCountdownChange?: (countdown: string) => void;
}

const gradientClasses = ["gradient-1", "gradient-2"];

const getGradientClass = (id: string) => {
    const index = Number(id) % gradientClasses.length;
    return gradientClasses[index];
};

const getGameImage = (gameName: string, defaultImage: string) => {
    const name = gameName?.toLowerCase() || "";
    if (name.includes("alien galaxy war")) {
        return "/assets/images/Alien Galaxy.png";
    }
    if (name.includes("stick monkey")) {
        return "/assets/images/Stick Monkey.png";
    }
    if (
        name.includes("pistol") ||
        name.includes("bottle") ||
        name.includes("battle")
    ) {
        return "/assets/images/pistol-bottle-640-360.png";
    }
    return defaultImage;
};

const HeroSliderTwoNewTesting: React.FC<HeroSliderTwoProps> = ({ heroGames, onCountdownChange }) => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [countdowns, setCountdowns] = useState<Record<string, string>>({});
    const [activeIndex, setActiveIndex] = useState(0);

    const handleGameClick = (game: HeroGames) => {
        navigate("/tournamentPageStatic", {
            state: { tournament_id: game?.tournament_id },
        });
    };

    // Function to calculate countdown
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

    // Update countdowns every second
    useEffect(() => {
        const timer = setInterval(() => {
            const updated: Record<string, string> = {};
            heroGames?.forEach((game) => {
                updated[game.tournament_id] = calculateCountdown(game.tournament_end);
            });
            setCountdowns(updated);
        }, 1000);

        return () => clearInterval(timer);
    }, [heroGames]);

    // Send active countdown up to parent
    useEffect(() => {
        if (onCountdownChange) {
            const activeGame = heroGames?.[activeIndex];
            const activeCountdown = activeGame ? countdowns[activeGame.tournament_id] : "";
            onCountdownChange(activeCountdown || "Loading...");
        }
    }, [activeIndex, countdowns, heroGames, onCountdownChange]);

    return (
        <>
            {heroGames && heroGames?.length > 0 && (
                <>
                    <div className="">
                        <div className="rounded-2xl">
                            <Swiper
                                loop={true}
                                centeredSlides={true}
                                slidesPerView={1}
                                spaceBetween={20}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                pagination={{
                                    el: ".tns-nav",
                                    clickable: true,
                                }}
                                modules={[Pagination, Navigation, Autoplay]}
                                navigation={{
                                    nextEl: ".next-button",
                                    prevEl: ".prev-button",
                                }}
                                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                className="tiny-slider-one rounded-2xl"
                            >
                                {heroGames?.map((game, index: any) => {
                                    const borderClass = isDark
                                        ? "border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                        : "border-slate-200/60 shadow-[0_8px_24px_rgba(255,202,32,0.12)]";
                                    const cardBg = isDark
                                        ? ""
                                        : "bg-white";

                                    return (
                                        <SwiperSlide
                                            key={game?.tournament_game_id}
                                            onClick={() => handleGameClick(game)}
                                            className="overflow-hidden cursor-pointer"
                                        >
                                            <div
                                                className={`w-full flex flex-col gap-0 overflow-hidden rounded-[24px] transition-all duration-200 active:scale-[0.98] ${borderClass} ${cardBg}`}
                                            >
                                                {/* Game Banner Image */}
                                                <div className="relative w-full aspect-[2.1/1] rounded-[18px] overflow-hidden shadow-sm">
                                                    <img
                                                        src={getGameImage(game?.tournament_name, game?.tournament_game_image)}
                                                        alt={game?.tournament_name}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                                    />

                                                    {/* Floating My Rank card without Medal */}
                                                    <div className="absolute bottom-2.5 left-2.5 z-10 p-2 px-3 rounded-[12px] bg-slate-900/60 dark:bg-black/55 border border-slate-200/10 dark:border-white/10 shadow-lg min-w-[65px] flex flex-col justify-center">
                                                        <div className="text-[10px] text-slate-400 dark:text-white font-bold uppercase tracking-widest leading-none">
                                                            My Rank
                                                        </div>
                                                        <div className="text-[10px] font-black text-brand-gold-100 dark:text-brand-yellow-100 mt-1 leading-none">
                                                            #{game?.current_rank || "-"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Prize Pool & Play Button */}
                                                <div className="flex justify-between items-center mx-1 px-2.5 py-2 border-t border-slate-200/50 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.03] rounded-b-[24px] shadow-[inset_0_-4px_24px_rgba(0,0,0,0.2),inset_0_-2px_1px_rgba(78,78,78,1),inset_0px_0_0px_rgba(255,255,255,0.6),inset_0px_0_0px_rgba(255,255,255,0.6)]">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src="/assets/images/img/gold-coin.png"
                                                            className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] shrink-0"
                                                            alt="Coin"
                                                        />
                                                        <div>
                                                            <div className="text-xs text-slate-800 dark:text-white font-bold leading-none tracking-[0.5px]">Prize Pool</div>
                                                            <div className="text-sm font-black text-brand-gold-100 dark:text-brand-yellow-100 mt-1 tracking-[0.5px]">
                                                                {(!game?.fee_reward_type || game?.fee_reward_type === "1") && `${Number(game?.fee_prize_1).toLocaleString()} Coins`}
                                                                {game?.fee_reward_type === "2" && `${game?.fee_prize_1} GB Data`}
                                                                {game?.fee_reward_type === "3" && `Rs ${game?.fee_prize_1}`}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="px-3 py-2 rounded-xl flex items-center justify-center gap-1 bg-brand-gradient hover:brightness-110 text-brand-black-100 text-sm font-black shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto dark:border-2 border-white"
                                                        aria-label="Play Game"
                                                    >
                                                        <Play className="w-3.5 h-3.5 fill-current" />
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
                </>
            )}
        </>
    );
};

export default HeroSliderTwoNewTesting;
