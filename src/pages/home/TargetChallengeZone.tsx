import React from "react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { Target, Play } from "lucide-react";
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
        target: "30,000",
        prize: "10K Coins",
    },
    {
        id: "2",
        name: "Alien Galaxy War",
        image: "/assets/images/6.png",
        target: "25,000",
        prize: "5K Coins",
    },
    {
        id: "3",
        name: "Tropical Slicer",
        image: "/assets/images/9.png",
        target: "45,000",
        prize: "15K Coins",
    },
    {
        id: "4",
        name: "Box Tower",
        image: "/assets/images/box tower.jpeg",
        target: "35,000",
        prize: "8K Coins",
    },
    {
        id: "5",
        name: "Knife Ninja",
        image: "/assets/images/knife ninja.jpeg",
        target: "40,000",
        prize: "12K Coins",
    },
];

export const TargetChallengeZone: React.FC = () => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const handlePlayClick = () => {
        navigate("/games");
    };

    return (
        <div className="mb-6 overflow-visible">
            {/* Carousel Slider with 3D Coverflow Effect */}
            <div className="w-full overflow-visible">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={2.2}
                    spaceBetween={0}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: 20,       // Angle of rotation for side slides
                        stretch: -10,     // Overlap of cards (negative pulls them closer)
                        depth: 50,       // Z-depth pushing side cards back
                        modifier: 1,      // Effect multiplier
                        slideShadows: false,
                    }}
                    modules={[Autoplay, EffectCoverflow]}
                    className="w-full flex justify-center items-center overflow-visible"
                >
                    {targetGames.map((game) => {
                        return (
                            <SwiperSlide
                                key={game.id}
                                className="overflow-visible cursor-pointer group"
                                // style={{ width: "200px" }}
                                onClick={handlePlayClick}
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`w-full flex flex-col transition-all duration-500 ease-out ${isActive
                                            ? "opacity-100 scale-105"
                                            : "opacity-90 scale-[1]"
                                            }`}
                                    >
                                        {/* Game Image Banner */}
                                        <div className="relative w-full aspect-[285/380] rounded-xl overflow-hidden shadow-sm">
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
