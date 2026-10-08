import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Coins } from "lucide-react";
import { useTheme } from "next-themes";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export interface GameBannerItem {
    id?: string;
    title?: string;
    image: string;
    prizePool?: string;
    rank?: string;
    rewardType?: string;
    link?: string;
    tournament_end?: string;
}

// ─── Default internal list of N game banners (independent of heroGames prop) ───
export const HERO_SLIDER_GAMES: GameBannerItem[] = [
    {
        id: "hero-4",
        title: "Air Warfare",
        image: "/assets/images/Air Warfare/VIP-Tournament.png",
        prizePool: "10,000 Coins",
        rank: "4",
    },
    {
        id: "hero-5",
        title: "Snake Color Break",
        image: "/assets/images/SnakeColorBreak/VIP-Tournament.png",
        prizePool: "10,000 Coins",
        rank: "4",
    },
    {
        id: "hero-1",
        title: "Pistol Bottle Battle",
        image: "/assets/images/5fruit/Vip-tournament.png",
        prizePool: "10,000 Coins",
        rank: "4",
    },
    {
        id: "hero-2",
        title: "Knife Ninja",
        image: "/assets/images/Color Up/Vip-tournament.png",
        prizePool: "10,000 Coins",
        rank: "12",
    },
    {
        id: "hero-3",
        title: "Target Challenge",
        image: "/assets/images/Pistol Bottles/Vip-tournament.png",
        prizePool: "100,000 Coins",
        rank: "8",
    },
    {
        id: "hero-4",
        title: "Alien Galaxy War",
        image: "/assets/images/smartsurfer/VIP-Tournament.webp",
        prizePool: "50,000 Coins",
        rank: "2",
    },
    {
        id: "premium-5",
        title: "Alien Galaxy War",
        image: "/assets/images/aliengalaxywar/VipTournament.png",
        prizePool: "50,000 Coins",
        rank: "2",
    }
    // {
    //     id: "hero-6",
    //     title: "Tropical Slicer",
    //     image: "/assets/images/Tropical Slicer name.png",
    //     prizePool: "15,000 Coins",
    //     rank: "7",
    // },
    // {
    //     id: "hero-7",
    //     title: "Road Racer",
    //     image: "/assets/images/Road Racer name.png",
    //     prizePool: "30,000 Coins",
    //     rank: "3",
    // }
];

interface HeroSliderTwoTesting2Props {
    games?: GameBannerItem[];
    banners?: GameBannerItem[];
    heroGames?: any[];
    onCountdownChange?: (countdown: string) => void;
    slidesPerView?: number;
    autoplayDelay?: number;
}

const getGameImage = (gameName?: string, defaultImage?: string) => {
    if (!gameName && defaultImage) return defaultImage;
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
        return "/assets/images/5fruit/Vip-tournament.png";
    }
    return defaultImage || "/assets/images/5fruit/Vip-tournament.png";
};

const HeroSliderTwoNewTesting2: React.FC<HeroSliderTwoTesting2Props> = ({
    games,
    banners,
    heroGames,
    onCountdownChange,
    slidesPerView,
    autoplayDelay = 3000
}) => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [countdowns, setCountdowns] = useState<Record<string, string>>({});
    const [activeIndex, setActiveIndex] = useState(0);

    // Completely independent: displays HERO_SLIDER_GAMES array elements directly
    const displayList: GameBannerItem[] =
        games && games.length > 0
            ? games
            : banners && banners.length > 0
                ? banners
                : HERO_SLIDER_GAMES;

    const handleGameClick = (item: GameBannerItem) => {
        if (item.link) {
            navigate(item.link);
        } else {
            navigate("/tournamentPageStatic", {
                state: { tournament_id: item.id },
            });
        }
    };

    // Calculate countdown timer
    const calculateCountdown = (endTime?: string) => {
        if (!endTime) return "";
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
            displayList.forEach((item, idx) => {
                const key = item.id || `item-${idx}`;
                if (item.tournament_end) {
                    updated[key] = calculateCountdown(item.tournament_end);
                }
            });
            setCountdowns(updated);
        }, 1000);

        return () => clearInterval(timer);
    }, [displayList]);

    useEffect(() => {
        if (onCountdownChange) {
            const activeItem = displayList[activeIndex];
            const key = activeItem?.id || `item-${activeIndex}`;
            const activeCountdown = activeItem ? countdowns[key] : "";
            onCountdownChange(activeCountdown || "02d:14h:36m:10s");
        }
    }, [activeIndex, countdowns, displayList, onCountdownChange]);

    if (!displayList || displayList.length === 0) return null;

    return (
        <div className="w-full">
            <Swiper
                // loop={displayList.length > 1}
                centeredSlides={false}
                slidesPerView={slidesPerView || 1.2}
                spaceBetween={12}
                breakpoints={{
                    320: { slidesPerView: slidesPerView || 1.15, spaceBetween: 12 },
                    480: { slidesPerView: slidesPerView || 1.25, spaceBetween: 14 },
                    640: { slidesPerView: slidesPerView || 2.15, spaceBetween: 16 },
                    768: { slidesPerView: slidesPerView || 2.5, spaceBetween: 18 },
                    1024: { slidesPerView: slidesPerView || 3.2, spaceBetween: 20 },
                }}
                // pagination={{
                //     clickable: true,
                //     dynamicBullets: true,
                // }}
                modules={[Pagination, Navigation]}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="w-full rounded-2xl"
            >
                {displayList.map((item, index) => {
                    const borderClass = isDark
                        ? "border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        : "border-slate-200/60 shadow-[0_8px_24px_rgba(255,202,32,0.12)]";
                    const cardBg = isDark ? "" : "bg-white";

                    return (
                        <SwiperSlide
                            key={item.id || index}
                            onClick={() => handleGameClick(item)}
                            className="overflow-hidden cursor-pointer h-auto"
                        >
                            <div
                                className={`w-full h-full flex flex-col gap-0 overflow-hidden rounded-[24px] transition-all duration-200 active:scale-[0.98] ${borderClass} ${cardBg}`}
                            >
                                {/* Game Banner Image */}
                                <div className="relative w-full rounded-[18px] overflow-hidden shadow-sm aspect-[16/9] sm:aspect-[16/8]">
                                    <img
                                        src={item.image}
                                        alt={item.title || "Game Banner"}
                                        loading="eager"
                                        // @ts-ignore
                                        fetchPriority="high"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/assets/images/5fruit/Vip-tournament.png";
                                        }}
                                    />

                                    {/* Floating My Rank badge */}
                                    {item.rank && (
                                        <div className="absolute bottom-2.5 left-2.5 z-10 p-2 px-3 rounded-[12px] bg-slate-900/65 dark:bg-black/60 border border-slate-200/10 dark:border-white/10 shadow-lg min-w-[65px] flex flex-col justify-center">
                                            <div className="text-[10px] text-slate-300 dark:text-slate-200 font-bold uppercase tracking-widest leading-none">
                                                My Rank
                                            </div>
                                            <div className="text-[10px] font-bold text-brand-gold-100 dark:text-brand-yellow-100 mt-1 leading-none">
                                                #{item.rank}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Prize Pool & Play Button */}
                                <div
                                    className={`flex justify-between items-center mx-1 px-2.5 py-2 border-t rounded-b-[24px] transition-all duration-300 ${isDark
                                        ? "border-[#dfa208]/30 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.03] shadow-[inset_0_-4px_24px_rgba(0,0,0,0.2)]"
                                        : "bg-gradient-to-r from-[#FFFDF0] via-[#FFFCE0] to-[#FFF3CD] border-[#dfa208]/30 shadow-[inset_0_1px_4px_rgba(255,255,255,0.8)]"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Coins className={`w-7 h-7 shrink-0 ${isDark ? "text-brand-gold-100 dark:text-brand-yellow-100" : "text-[#dfa208]"}`} />
                                        <div className="min-w-0">
                                            <div className={`text-[11px] font-bold leading-none tracking-[0.5px] ${isDark ? "text-slate-400 dark:text-slate-300" : "text-slate-600"}`}>
                                                Prize Pool
                                            </div>
                                            <div className={`text-xs sm:text-sm font-bold mt-1 tracking-[0.5px] truncate ${isDark ? "text-brand-gold-100 dark:text-brand-yellow-100" : "text-slate-800 font-extrabold"}`}>
                                                {item.prizePool || "10,000 Coins"}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 bg-brand-gradient hover:brightness-110 text-brand-black-100 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all shrink-0 pointer-events-auto dark:border-2 border-white"
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
    );
};

export default HeroSliderTwoNewTesting2;
