import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionLabel from "./SectionLabel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Gamepad2, Play, Clock, Trophy } from "lucide-react";
import { useTheme } from "next-themes";

interface DailyTournament {
  dailyTournaments: any;
}

const gradientClasses = ["gradient-2", "gradient-1"];

const getGradientClass = (id: string) => {
  const index = Number(id) % gradientClasses.length;
  return gradientClasses[index];
};

const getGameImage = (gameName: string, defaultImage: string, index: number) => {
  const name = gameName?.toLowerCase() || "";
  if (name.includes("alien galaxy war")) {
    return "/assets/images/Alien Galaxy.png";
  }
  if (name.includes("stick monkey")) {
    return "/assets/images/Stick Monkey.png";
  }
  const images = ["/assets/images/4.png", "/assets/images/6.png", "/assets/images/9.png"];
  return images[index % images.length];
};

const DailyTournamentNew: React.FC<DailyTournament> = ({
  dailyTournaments,
}) => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [countdowns, setCountdowns] = useState<Record<string, string>>({});

  const handleGameClick = (game: any) => {
    navigate("/tournamentPage", {
      state: { tournament_id: game?.tournament_id },
    });
  };

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
      dailyTournaments?.forEach((t: any) => {
        updated[t.tournament_id] = calculateCountdown(t.tournament_end);
      });
      setCountdowns(updated);
    }, 1000);
    return () => clearInterval(timer);
  }, [dailyTournaments]);

  return (
    <>
      <div
        className="rounded-2xl"
      >
        <div className="mb-1 px-1 text-center">

          <Swiper
            loop={true}
            centeredSlides={false}
            slidesPerView={2.2}
            spaceBetween={5}
            navigation={{
              nextEl: ".next-button",
              prevEl: ".prev-button",
            }}
            pagination={{
              el: ".tns-nav",
              clickable: true,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="tiny-slider-one flex justify-center items-center"
          >
            {dailyTournaments?.map((game: any, index: any) => {
              const borderClass = isDark
                ? "border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                : "border-slate-200/60 shadow-[0_6px_20px_rgba(124,58,237,0.06)]";
              const cardBg = isDark
                ? "bg-white/[0.03] backdrop-blur-md"
                : "bg-white";

              return (
                <SwiperSlide
                  key={game?.tournament_id}
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => handleGameClick(game)}
                >
                  {/* Outer Premium Rounded Card */}
                  <div
                    className={`w-full flex flex-col overflow-hidden rounded-2xl border ${borderClass} ${cardBg} transition-all duration-200 active:scale-[0.98] relative shadow-sm`}
                  >
                    {/* Game Image with rounded corner */}
                    <div className="relative w-full aspect-[285/380] rounded-xl overflow-hidden border border-slate-200/10 shadow-sm">
                      <img
                        src={getGameImage(game?.tournament_name, game?.tournament_game_image, index)}
                        className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={game?.tournament_name}
                      />
                      {/* Soft ambient dark overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                      {/* Floating Countdown Badge */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-0.5 bg-black/45 backdrop-blur-md text-white border border-white/10 rounded-full text-[12px] font-bold shadow-md z-10 pointer-events-none">
                        <Clock className="h-3 w-3 text-brand-yellow-100 animate-pulse" />
                        <span>
                          {countdowns[game?.tournament_id] || "Loading..."}
                        </span>
                      </div>

                      {/* Coins & Join Button Overlay */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-center z-10">
                        <div className="font-extrabold flex items-center gap-1 text-[12px] text-brand-yellow-100 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]">
                          <img
                            src="/assets/images/img/gold-coin.png"
                            alt="coin"
                            className="w-5 h-5 object-contain"
                          />
                          <span className="tracking-wide text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]">{Number(game?.fee_prize_1).toLocaleString()} Coins</span>
                        </div>

                        <button
                          className="w-6 h-6 rounded-lg flex items-center justify-center  hover:brightness-110 text-brand-black-100 shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto"
                          aria-label="Play Game"
                        >
                          <img
                            src="/assets/images/playicon.png"
                            className="w-10 h-10 object-contain"
                            alt="Play"
                          />
                        </button>
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
  );
};

export default DailyTournamentNew;
