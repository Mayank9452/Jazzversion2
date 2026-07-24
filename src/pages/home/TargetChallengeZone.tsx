import React from "react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { Target, Play, Phone, PhoneCall } from "lucide-react";
import { useTheme } from "next-themes";

// Import Swiper styles for coverflow
import "swiper/css";
import "swiper/css/effect-coverflow";

interface TargetGame {
    id: string;
    name: string;
    image: string;
    target: string;
    prize: string;
}

const targetGames: TargetGame[] = [
    {
        id: "1",
        name: "Zombie Uprising",
        image: "/assets/images/4.png",
        target: "30000",
        prize: "100000 Coins",
    },
    {
        id: "2",
        name: "Alien Galaxy War",
        image: "/assets/images/6.png",
        target: "25000",
        prize: "Rs 100000 Voucher",
    },
    {
        id: "3",
        name: "Tropical Slicer",
        image: "/assets/images/9.png",
        target: "45000",
        prize: "Rs 100000 Topup",
    },
    {
        id: "4",
        name: "Box Tower",
        image: "/assets/images/box tower.jpeg",
        target: "35000",
        prize: "100000 Coins",
    },
    {
        id: "5",
        name: "Knife Ninja",
        image: "/assets/images/knife ninja.jpeg",
        target: "40000",
        prize: "Rs 100000 Voucher",
    },
];

const formatNumberInText = (text: string) => {
    if (!text) return "";
    return text.replace(/\d+/g, (match) => Number(match).toLocaleString('en-IN'));
};

export const TargetChallengeZone: React.FC = () => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const handlePlayClick = () => {
        navigate("/games");
    };

    return (
        <div className="mb-9 overflow-visible mt-2">
            {/* Carousel Slider with 3D Coverflow Effect */}
            <div className="w-full overflow-visible">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={2.2}
                    spaceBetween={3}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: 0,       // Angle of rotation for side slides
                        stretch: -10,     // Overlap of cards (negative pulls them closer)
                        depth: 50,       // Z-depth pushing side cards back
                        modifier: 1,      // Effect multiplier
                        slideShadows: false,
                    }}
                    modules={[Autoplay, EffectCoverflow]}
                    className="w-full flex justify-center items-center overflow-visible"
                >
                    {targetGames.map((game, index) => {
                        const rewardType = index % 3; // 0 = Coins, 1 = Voucher, 2 = Topup
                        return (
                            <SwiperSlide
                                key={game.id}
                                className="overflow-visible cursor-pointer group relative"
                                // style={{ width: "200px" }}
                                onClick={handlePlayClick}
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`w-full flex flex-col transition-all duration-500 ease-out relative ${isActive
                                            ? "opacity-100 scale-[1.1]"
                                            : "opacity-90 scale-[0.7]"
                                            }`}
                                    >
                                        {/* Yellow blur glow behind the transparent/opaque banner */}
                                        <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[70%] aspect-square rounded-full bg-[#FFCA20]/25 blur-[25px] pointer-events-none z-0" />

                                        {/* Game Image Banner */}
                                        <div className="relative w-full aspect-[285/380] rounded-xl overflow-visible z-10">
                                            <img
                                                src={game.image}
                                                className="w-full h-full rounded-lg block object-cover transition-transform duration-500 group-hover:scale-105"
                                                style={{
                                                    filter: "drop-shadow(0 0 14px rgba(255, 202, 32, 0.75))"
                                                }}
                                                alt={game.name}
                                            />

                                            {/* Background dim overlay for inactive slides */}
                                            {/* {!isActive && (
                                                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 pointer-events-none" />
                                            )} */}

                                            {/* Floating Play Button on Bottom Right */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePlayClick();
                                                }}
                                                className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto dark:border-2 border-white"
                                                aria-label="Play Game"
                                            >
                                                <Play className="h-3.5 w-3.5 fill-brand-black-100 text-brand-black-100 ml-0.5" />
                                            </button>
                                        </div>

                                        {/* Target Row */}
                                        <div className="flex items-center justify-center gap-1 py-1.5 pb-0">
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 dark:bg-white/[0.08] text-white text-xs sm:text-[9px] font-bold font-mono tracking-tight shadow-sm whitespace-nowrap">
                                                <Target className="h-4 w-4 text-white shrink-0" />
                                                <span>Target: {formatNumberInText(game.target)}</span>
                                            </div>
                                        </div>

                                        {/* Reward Row */}
                                        <div className="flex justify-center items-center px-2 py-1.5 mt-1 bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04] rounded-xl whitespace-nowrap min-h-[36px] shadow-[inset_0_-4px_24px_rgba(0,0,0,0.2),inset_0_-2px_1px_rgba(78,78,78,1),inset_0px_0_0px_rgba(255,255,255,0.6),inset_0px_0_0px_rgba(255,255,255,0.6)]">
                                            {rewardType === 0 && (
                                                <div className="font-extrabold flex items-center gap-0.5 text-sm sm:text-xs">
                                                    <img
                                                        src="/assets/images/img/gold-coin.png"
                                                        alt="coin"
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                        {formatNumberInText(game.prize)}
                                                    </span>
                                                </div>
                                            )}
                                            {rewardType === 1 && (
                                                <div className="font-extrabold flex items-center gap-0.5 text-xs sm:text-[10px]">
                                                    <img
                                                        src="/assets/images/giftkarte.png"
                                                        alt="voucher"
                                                        className="w-6 h-6 object-contain"
                                                    />
                                                    <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                        {formatNumberInText(game.prize)}
                                                    </span>
                                                </div>
                                            )}
                                            {rewardType === 2 && (
                                                <div className="font-extrabold flex items-center gap-1 text-xs sm:text-[10px]">
                                                    <PhoneCall className="h-3.5 w-3.5 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                                                    <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                        {formatNumberInText(game.prize)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
};

export default TargetChallengeZone;
