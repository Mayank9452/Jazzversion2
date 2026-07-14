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

const WeeklyTournamentNew: React.FC<Props> = ({ weeklyTournaments }) => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [countdowns, setCountdowns] = useState<Record<string, string>>({});

  const calculateCountdown = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return "00h 00m";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
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
                spaceBetween: 20,
              },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            modules={[Pagination, Navigation]}
          >
            {weeklyTournaments?.map((tournament, index: any) => {
              const borderClass = isDark
                ? "border-white/[0.06]"
                : "border-slate-200/50 shadow-sm";
              const cardBg = isDark
                ? "bg-[#0d102d]/40 backdrop-blur-sm"
                : "bg-white";

              return (
                <SwiperSlide
                  key={tournament?.tournament_id}
                  onClick={() => handleGameClick(tournament)}
                  className="overflow-hidden cursor-pointer group"
                >
                  <div
                    className={`w-full flex flex-col overflow-hidden rounded-2xl border ${borderClass} ${cardBg} p-1.5 transition-all duration-200 active:scale-[0.98]`}
                  >
                    {/* Image container with rounded corners */}
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200/10 shadow-sm">
                      <img
                        src={getGameImage(tournament?.tournament_name, tournament?.tournament_game_image)}
                        alt={tournament?.tournament_name}
                        className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Soft ambient dark overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                      {/* Floating Countdown Badge */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-0.5 bg-black/45 backdrop-blur-md text-white border border-white/10 rounded-full text-[9px] font-bold shadow-md z-10 pointer-events-none">
                        <Clock className="h-3 w-3 text-white" />
                        <span>
                          {countdowns[tournament?.tournament_id] || "Loading..."}
                        </span>
                      </div>

                      {/* Coins & Join Button Overlay (instead of Tournament Name) */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-center z-10">
                        <div className="font-extrabold flex items-center gap-1 text-[11px] text-amber-400 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]">
                          {tournament?.fee_reward_type === "1" && (
                            <>
                              <img
                                src="/assets/images/img/gold-coin.png"
                                alt="coin"
                                className="w-3.5 h-3.5 object-contain"
                              />
                              <span className="tracking-wide text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]">{Number(tournament?.fee_prize_1).toLocaleString()} Coins</span>
                            </>
                          )}
                          {tournament?.fee_reward_type === "2" && (
                            <span className="tracking-wide text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]">{tournament?.fee_prize_1} GB Data</span>
                          )}
                          {tournament?.fee_reward_type === "3" && (
                            <span className="tracking-wide text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]">Rs {tournament?.fee_prize_1}</span>
                          )}
                        </div>

                        <button className="font-black px-4 py-1.5 rounded-lg bg-brand-gradient hover:bg-violet-700 text-brand-black-100  text-[9.5px] uppercase tracking-wider shadow-md pointer-events-auto hover:brightness-105 active:scale-95 transition-all">
                          Join
                        </button>
                      </div>
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

export default WeeklyTournamentNew;
