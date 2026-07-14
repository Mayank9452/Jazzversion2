import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionLabel from "./SectionLabel";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Trophy } from "lucide-react";
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
    return "/assets/images/pistol-bottle.png";
  }
  return defaultImage;
};

const HeroSliderTwoNew: React.FC<HeroSliderTwoProps> = ({ heroGames }) => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [countdowns, setCountdowns] = useState<Record<string, string>>({});

  const handleGameClick = (game: HeroGames) => {
    navigate("/tournamentPage", {
      state: { tournament_id: game?.tournament_id },
    });
  };

  // Function to calculate countdown
  const calculateCountdown = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) return "00d : 00h : 00m : 00s";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${String(days).padStart(2, "0")}d : ${String(hours).padStart(
      2,
      "0"
    )}h : ${String(minutes).padStart(2, "0")}m : ${String(seconds).padStart(
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
                className="tiny-slider-one rounded-2xl"
              >
                {heroGames?.map((game, index: any) => {
                  const borderClass = isDark
                    ? "border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                    : "border-slate-200/60 shadow-[0_8px_24px_rgba(255,202,32,0.12)]";
                  const cardBg = isDark
                    ? "bg-white/[0.03] backdrop-blur-md"
                    : "bg-white";

                  return (
                    <SwiperSlide
                      key={game?.tournament_game_id}
                      onClick={() => handleGameClick(game)}
                      className="overflow-hidden cursor-pointer"
                    >
                      <div
                        className={`w-full relative overflow-hidden rounded-2xl border ${borderClass} ${cardBg} transition-all duration-200`}
                      >
                        <img
                          src={getGameImage(game?.tournament_name, game?.tournament_game_image)}
                          alt={game?.tournament_name}
                          className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                        />

                        {/* Dark gradient overlay at the bottom of the card for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#191919]/80 via-[#191919]/20 to-transparent z-0 pointer-events-none" />

                        {/* Top Left Row Badge (LIVE and Timer side-by-side) */}
                        <div className="w-[92%] absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10 pointer-events-none">
                          <div className="px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-black tracking-wider uppercase shadow-md animate-pulse">
                            ● LIVE
                          </div>
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/95 dark:bg-black/45 text-slate-800 dark:text-white border border-slate-200/50 dark:border-white/10 rounded-full text-[9px] font-bold tracking-wide shadow-md">
                            <Clock className="h-3.5 w-3.5 text-brand-gold-100 dark:text-brand-yellow-100 animate-pulse" />
                            <span className="font-mono">
                              {countdowns[game?.tournament_id] || "Loading..."}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Left: Prize Pool & Button overlay */}
                        <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1 text-start pointer-events-none">
                          <span className="text-white/80 font-bold text-[9px] uppercase tracking-wider block">
                            Prize Pool
                          </span>
                          {game?.fee_reward_type === "1" && (
                            <div className="font-extrabold text-sm flex items-center text-brand-yellow-100 mb-1">
                              <img
                                src="/assets/images/img/gold-coin.png"
                                className="w-4 h-4 object-contain me-1"
                                alt="Coins"
                              />
                              <span>{game?.fee_prize_1} Coins</span>
                            </div>
                          )}
                          {game?.fee_reward_type === "2" && (
                            <div className="font-extrabold text-sm text-brand-yellow-100 mb-1">
                              {game?.fee_prize_1} GB Data
                            </div>
                          )}
                          {game?.fee_reward_type === "3" && (
                            <div className="font-extrabold text-sm text-brand-yellow-100 mb-1">
                              Rs {game?.fee_prize_1}
                            </div>
                          )}
                          <button className="font-extrabold px-4.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow-lg pointer-events-auto active:scale-95 transition-all flex items-center gap-1">
                            Play Now
                            {/* <span className="font-extrabold ml-0.5">&gt;</span> */}
                          </button>
                        </div>

                        {/* Bottom Right: My Rank badge box */}
                        <div className="absolute bottom-3.5 right-3.5 z-10 flex flex-col items-center justify-center px-3.5 py-2 rounded-2xl min-w-[75px] pointer-events-none bg-background/90 dark:bg-card/90 border border-border shadow-lg">
                          <span className="font-bold text-[8px] uppercase tracking-widest block text-brand-gray-400">
                            My Rank
                          </span>
                          <div className="font-extrabold text-sm mt-0.5 text-brand-gold-100 dark:text-brand-yellow-100">
                            #{game?.current_rank || "-"}
                          </div>
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

export default HeroSliderTwoNew;
