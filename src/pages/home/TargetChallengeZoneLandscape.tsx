import React from "react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { Target, Play, Phone } from "lucide-react";
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
        name: "Alien Galaxy",
        image: "/assets/images/Alien Galaxy.png",
        target: "25000",
        prize: "100000 Coins",
    },
    {
        id: "2",
        name: "Gogi Adventure",
        image: "/assets/images/Gogi Adventure.png",
        target: "30000",
        prize: "Rs 100000 Voucher",
    },
    {
        id: "3",
        name: "Pistol Bottle",
        image: "/assets/images/pistol-bottle.png",
        target: "35000",
        prize: "Rs 100000 Topup",
    },
    {
        id: "4",
        name: "Stick Monkey",
        image: "/assets/images/stick_monkey.png",
        target: "40000",
        prize: "100000 Coins",
    },
    {
        id: "5",
        name: "Alien Galaxy War",
        image: "/assets/images/alien_galaxy_war.png",
        target: "45000",
        prize: "Rs 100000 Voucher",
    },
];

export const TargetChallengeZoneLandscape: React.FC = () => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const handlePlayClick = () => {
        navigate("/games");
    };

    return (
        <div className="mb-6 overflow-visible">
            {/* Carousel Slider with 3D Coverflow Effect for Landscape Banners */}
            <div className="w-full overflow-visible">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={1.2}
                    spaceBetween={0}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: 15,       // Slightly lower angle for landscape
                        stretch: -10,     // Adjust overlap stretch for landscape cards
                        depth: 100,       // Adjust depth for landscape cards
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
                                className="overflow-visible cursor-pointer group"
                                // style={{ width: "75%", maxWidth: "290px" }} // Wider card for landscape orientation
                                onClick={handlePlayClick}
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`w-full flex flex-col transition-all duration-500 ease-out ${isActive
                                            ? "opacity-100 scale-105"
                                            : "opacity-90 scale-[1]"
                                            }`}
                                    >
                                        {/* Landscape Game Image Banner */}
                                        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-sm">
                                            <img
                                                src={game.image}
                                                className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
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
                                                className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto"
                                                aria-label="Play Game"
                                            >
                                                <Play className="h-3.5 w-3.5 fill-brand-black-100 text-brand-black-100 ml-0.5" />
                                            </button>
                                        </div>

                                        {/* Target Row */}
                                        <div className="flex items-center justify-center gap-1 py-1.5 pb-0">
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 dark:bg-white/[0.08] text-white text-xs sm:text-[9px] font-bold font-mono tracking-tight shadow-sm whitespace-nowrap">
                                                <Target className="h-4 w-4 text-white shrink-0" />
                                                <span>Target: {game.target}</span>
                                            </div>
                                        </div>

                                        {/* Reward Row */}
                                        <div className="flex justify-center items-center px-2 py-1.5 mt-1 bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04] rounded-xl whitespace-nowrap min-h-[36px]">
                                            {rewardType === 0 && (
                                                <div className="font-extrabold flex items-center gap-1.5 text-sm sm:text-xs">
                                                    <img
                                                        src="/assets/images/img/gold-coin.png"
                                                        alt="coin"
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                        {game.prize}
                                                    </span>
                                                </div>
                                            )}
                                            {rewardType === 1 && (
                                                <div className="font-extrabold flex items-center gap-1 text-xs sm:text-[10px]">
                                                    <img
                                                        src="/assets/images/giftkarte.webp"
                                                        alt="voucher"
                                                        className="w-6 h-6 object-contain"
                                                    />
                                                    <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                        {game.prize}
                                                    </span>
                                                </div>
                                            )}
                                            {rewardType === 2 && (
                                                <div className="font-extrabold flex items-center gap-1.5 text-xs sm:text-[10px]">
                                                    <Phone className="h-3.5 w-3.5 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                                                    <span className="tracking-wide text-slate-800 dark:text-brand-yellow-100 font-bold">
                                                        {game.prize}
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

export default TargetChallengeZoneLandscape;
