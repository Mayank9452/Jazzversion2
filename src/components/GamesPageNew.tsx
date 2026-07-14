import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Gamepad2, Zap, Play, Compass, Flame, Map,
  Puzzle, Flag, ChevronRight, Search, Bell, Trophy, Bolt
} from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppSelector } from "@/app/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fetchGamesPageCategories, playGameApi, randomGames } from "@/apiServices/igplApi";
import { getSubscriptionUIState } from "@/utils/subscriptionUtils";
import PopupBannerUnsubscribe from "./PopupBannerUnsubscribe";
import LowBalancePopup from "./LowBalancePopup";
import GameViewerNew from "./GameViewerNew";
import WaitLoader from "./Loader";

const ICON_MAP: Record<string, React.ElementType> = {
  Action: Zap,
  Adventure: Map,
  Arcade: Gamepad2,
  "Puzzle & Logic": Puzzle,
  "Sports & Racing": Flag,
};

const BANNERS = [
  "https://jazzgplapi.gamenow.com.pk/uploads/webp/640X360/4.webp",
  "https://jazzgplapi.gamenow.com.pk/uploads/webp/640X360/7.webp",
  "https://jazzgplapi.gamenow.com.pk/uploads/webp/640X360/86.webp"
];

// ─── Accent line ──────────────────────────────────────────────────────────────
function AccentLine() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-[#0b2f5f]/20 dark:via-[#80c7c5] to-transparent opacity-40 mx-4" />
  );
}

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  variant = "gold",
  onViewAll,
}: {
  icon: React.ElementType;
  title: string;
  variant?: "gold" | "aqua";
  onViewAll?: () => void;
}) {
  const isGold = variant === "gold";
  return (
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${isGold
            ? "bg-[#fecb13]/15 border border-[#fecb13]/30 text-[#b28200] dark:bg-[#fecb13]/10 dark:border-[#fecb13]/25 dark:text-[#fecb13]"
            : "bg-[#80c7c5]/20 border border-[#80c7c5]/40 text-[#076866] dark:bg-[#80c7c5]/10 dark:border-[#80c7c5]/25 dark:text-[#80c7c5]"
            }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[13px] font-black tracking-[1.5px] uppercase text-[#0b2f5f] dark:text-white">
          {title}
        </span>
      </div>
      {/* {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-[9px] font-bold tracking-[1px] uppercase text-[#076866] border border-[#80c7c5]/40 bg-[#80c7c5]/10 rounded-md px-2.5 py-1.5 active:scale-95 transition-transform dark:text-[#80c7c5] dark:border-[#80c7c5]/25 dark:bg-[#80c7c5]/07"
        >
          View All <ChevronRight className="w-3 h-3" />
        </button>
      )} */}
    </div>
  );
}

// ─── Category header bar ─────────────────────────────────────────────────────
function CategoryBar({
  icon: Icon,
  name,
  onViewAll,
}: {
  icon: React.ElementType;
  name: string;
  onViewAll: () => void;
}) {
  return (
    <div className="relative flex items-center justify-between bg-white border border-slate-200 dark:bg-[#0d2540] dark:border-[#1a3a5c] rounded-xl px-4 py-2.5 mb-3 overflow-hidden shadow-sm dark:shadow-none">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#fecb13] rounded-none" />
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-[#b28200] dark:text-[#fecb13]" />
        <span className="text-[12px] font-black tracking-[1.5px] uppercase text-[#0b2f5f] dark:text-white">
          {name}
        </span>
      </div>
      <div className="absolute -right-1.5 top-1.5 z-20 flex flex-col items-end">
        <button
          onClick={onViewAll}
          className="font-black px-3 py-1 rounded-l-md text-[9px] tracking-wider uppercase bg-[#fecb13] hover:bg-[#e0b20f] dark:bg-[#f59e0b] dark:hover:bg-[#d97706] text-[#07192e] dark:text-white transition-all shadow-md active:scale-95 duration-150"
        >
          View All
        </button>
        {/* Ribbon fold triangle */}
        <div className="w-1.5 h-1.5 bg-[#b28200] dark:bg-[#92400e] [clip-path:polygon(0_0,_100%_0,_0_100%)]" />
      </div>
    </div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────
function FeaturedCard({
  game,
  index,
  onPlay,
}: {
  game: any;
  index: number;
  onPlay: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Ornate card theme styling matching TournamentHistory
  const cardBg = isDark ? "bg-gradient-to-br from-[#121316] via-[#090a0c] to-[#121316]" : "bg-gradient-to-br from-[#fcfaf5] via-[#f7f2e4] to-[#fcfaf5]";
  const cardBorder = isDark ? "border-[#9a7e4e]" : "border-[#b09668]";
  const studdedLine = isDark ? "border-[#e6c687]/20" : "border-[#b09668]/30";
  const shadowFilter = isDark ? "shadow-[0_6px_16px_rgba(0,0,0,0.6)]" : "shadow-[0_4px_10px_rgba(176,150,104,0.08)]";
  const trendTagBg = "bg-black/70 border border-[#d4b27a]/40 text-[#ffe596]";
  const playButtonBg = "bg-[#fecb13] text-[#07192e] shadow-[0_0_8px_rgba(254,203,19,0.55)]";

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onPlay}
      className={`relative overflow-hidden rounded-xl border-[3px] ${cardBorder} cursor-pointer transition-all duration-300 ${cardBg} ${shadowFilter}`}
    >
      {/* Inner gold dashed studded line */}
      <div className={`absolute inset-0 pointer-events-none border border-dashed ${studdedLine} m-0.5 rounded-[9px] z-10`} />

      {/* Corner Rubies / Gemstones in gold bezels */}
      <div className="absolute top-0.5 left-0.5 w-3 h-3 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1.5 h-1.5 rounded-full border border-[#e6c687]/50 shadow-[0_0_3px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>
      <div className="absolute top-0.5 right-0.5 w-3 h-3 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1.5 h-1.5 rounded-full border border-[#e6c687]/50 shadow-[0_0_3px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>
      <div className="absolute bottom-0.5 left-0.5 w-3 h-3 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1.5 h-1.5 rounded-full border border-[#e6c687]/50 shadow-[0_0_3px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>
      <div className="absolute bottom-0.5 right-0.5 w-3 h-3 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1.5 h-1.5 rounded-full border border-[#e6c687]/50 shadow-[0_0_3px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>

      {/* Thumbnail */}
      <div className="aspect-[3/4] relative overflow-hidden m-0.5 rounded-[8px]">
        <img
          src={game?.game_image_url}
          alt={game?.game_name}
          className="w-full h-full object-cover"
        />
        {/* Play icon bottom right */}
        <div className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 active:scale-90 transition-transform ${playButtonBg}`}>
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        </div>
        {/* Trend tag */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md px-2 py-0.5 z-10 text-[8px] font-black tracking-wider uppercase ${trendTagBg}`}>
          <Flame className="w-2.5 h-2.5" />
          <span>
            {index % 2 === 0 ? "Trending" : "Popular"}
          </span>
        </div>
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

// ─── Game grid card ──────────────────────────────────────────────────────────
function GameCard({
  game,
  index,
  onPlay,
  aspectClass = "aspect-[4/3]",
}: {
  game: any;
  index: number;
  onPlay: () => void;
  aspectClass?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Ornate card theme styling matching TournamentHistory (scaled slightly for grids)
  const cardBg = isDark ? "bg-gradient-to-br from-[#121316] via-[#090a0c] to-[#121316]" : "bg-gradient-to-br from-[#fcfaf5] via-[#f7f2e4] to-[#fcfaf5]";
  const cardBorder = isDark ? "border-[#9a7e4e]" : "border-[#b09668]";
  const studdedLine = isDark ? "border-[#e6c687]/15" : "border-[#b09668]/25";
  const shadowFilter = isDark ? "shadow-[0_4px_10px_rgba(0,0,0,0.5)]" : "shadow-[0_2.5px_8px_rgba(176,150,104,0.06)]";
  const playButtonBg = "bg-[#fecb13] text-[#07192e] shadow-[0_0_6px_rgba(254,203,19,0.45)]";

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onPlay}
      className={`relative overflow-hidden rounded-lg border-2 ${cardBorder} cursor-pointer transition-all duration-300 ${cardBg} ${shadowFilter}`}
    >
      {/* Inner gold dashed studded line */}
      <div className={`absolute inset-0 pointer-events-none border border-dashed ${studdedLine} m-0.5 rounded-[5px] z-10`} />

      {/* Tiny Corner Rubies / Gemstones in gold bezels */}
      <div className="absolute top-0.5 left-0.5 w-2 h-2 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1 h-1 rounded-full border border-[#e6c687]/40 shadow-[0_0_2px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>
      <div className="absolute top-0.5 right-0.5 w-2 h-2 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1 h-1 rounded-full border border-[#e6c687]/40 shadow-[0_0_2px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>
      <div className="absolute bottom-0.5 left-0.5 w-2 h-2 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1 h-1 rounded-full border border-[#e6c687]/40 shadow-[0_0_2px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>
      <div className="absolute bottom-0.5 right-0.5 w-2 h-2 flex items-center justify-center pointer-events-none z-20">
        <div
          className="w-1 h-1 rounded-full border border-[#e6c687]/40 shadow-[0_0_2px_#ff0000]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #ff5c5c 0%, #b30000 60%, #540000 100%)' }}
        />
      </div>

      <div className={`${aspectClass} relative overflow-hidden m-0.5 rounded-[5px]`}>
        <img
          src={game?.game_image_url || "/placeholder.png"}
          alt={game?.game_name}
          className="w-full h-full object-cover"
        />
        {/* Play icon bottom right */}
        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10 ${playButtonBg}`}>
          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GamesPageNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToCategory = location.state?.scrollToCategory;
  const { t } = useLanguage();
  const { data: homeData } = useAppSelector((state) => state.home);

  const [categories, setCategories] = useState<any[]>([]);
  const [randomGamesData, setRandomGamesData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [playURL, setPlayURL] = useState("");
  const [gamePlayData, setGamePlayData] = useState<any | null>(null);
  const [showNotSubscribed, setShowNotSubscribed] = useState(false);
  const [showLowBalance, setShowLowBalance] = useState(false);

  const userInfo = homeData?.data?.userInfo;
  const dValidTill = homeData?.data?.dValidTill;
  const subUIState = useMemo(
    () => getSubscriptionUIState(userInfo, dValidTill),
    [userInfo, dValidTill]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catRes, randRes] = await Promise.all([
          fetchGamesPageCategories(),
          randomGames(),
        ]);
        if (catRes?.status && catRes?.categoriesList?.length > 0) {
          const listWithBanners = catRes.categoriesList.map((cat: any) => ({
            ...cat,
            bannerUrl: BANNERS[Math.floor(Math.random() * BANNERS.length)],
          }));
          setCategories(listWithBanners);
        }
        if (randRes?.status) setRandomGamesData(randRes?.data);
      } catch (e) {
        console.error("Error loading games:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loading && categories.length > 0 && scrollToCategory) {
      const matchedCat = categories.find((cat: any) => {
        const name = cat.category_name.toLowerCase();
        const target = scrollToCategory.toLowerCase();
        if (target === "racing" && name.includes("racing")) return true;
        if (target === "shooter" && name.includes("action")) return true;
        if (target === "moba" && name.includes("action")) return true;
        return name.includes(target) || target.includes(name);
      });

      if (matchedCat) {
        const element = document.getElementById(`category-${matchedCat.category_id}`);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    }
  }, [loading, categories, scrollToCategory]);

  const handleGameLaunch = useCallback(
    async (game: any) => {
      const isSuspend =
        userInfo?.user_subscription_status?.toLowerCase() === "suspend";
      if (!subUIState.hasAccess && !isSuspend) {
        if (subUIState.popupToShow === "lowBalance") setShowLowBalance(true);
        else setShowNotSubscribed(true);
        return;
      }
      try {
        setLoading(true);
        const res = await playGameApi(game.game_id);
        if (res.status) {
          setGamePlayData(res?.data);
          setPlayURL(
            `https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${res?.data?.playerProfileId}&gameid=${res?.data?.gameInfo?.game_gameboost_id || game.game_gameboost_id
            }`
          );
          setSelectedGame(game);
        }
      } catch (e) {
        console.error("Error launching game:", e);
      } finally {
        setLoading(false);
      }
    },
    [userInfo, subUIState]
  );

  return (
    <>
      <TopBar />

      <div className="bg-[#f8fafc] dark:bg-[#07192e] text-slate-800 dark:text-white pb-5">

        <AccentLine />

        {/* ── Hero ── */}
        <div className="px-4 pt-5 pb-4">

          <h1 className="text-[26px] font-black text-[#0b2f5f] dark:text-white leading-tight tracking-wide mb-1">
            Explore &<br />
            <span className="text-[#076866] dark:text-[#80c7c5]">Play Games</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.5px] uppercase text-slate-500 dark:text-[#4a7a9b] mb-4">
            No downloads · Instant play · Win rewards
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { val: `${randomGamesData?.usergamesList?.length || 0}+`, label: "Hot Picks" },
              { val: `${categories.length || 0}`, label: "Genres" },
              { val: "Live", label: "Status" },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="bg-white border border-slate-200 dark:bg-[#0d2540] dark:border-[#1a3a5c] rounded-xl py-2.5 text-center shadow-sm dark:shadow-none"
              >
                <span className="block text-[18px] font-black text-[#b28200] dark:text-[#fecb13] tracking-wide leading-none">
                  {val}
                </span>
                <span className="block text-[9px] font-bold text-slate-500 dark:text-[#4a7a9b] tracking-[1px] uppercase mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AccentLine />

        {/* ── Hot Picks slider ── */}
        {randomGamesData?.usergamesList?.length > 0 && (
          <div className="pt-4 pb-2">
            <div className="px-4 mb-3">
              <SectionHeader
                icon={Flame}
                title="Hot Picks"
                variant="gold"
                onViewAll={() =>
                  navigate("/games/viewAll", {
                    state: { title: "Hot Picks", categoryId: 0 },
                  })
                }
              />
            </div>
            <Swiper
              loop
              slidesPerView={2.3}
              spaceBetween={10}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay, Pagination]}
              className="!px-4"
            >
              {randomGamesData.usergamesList.map((game: any, i: number) => (
                <SwiperSlide key={game.report_game_id || i}>
                  <FeaturedCard
                    game={game}
                    index={i}
                    onPlay={() => handleGameLaunch(game)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* ── Category sections ── */}
        <div className="pt-2 space-y-6 pb-4">
          {categories.length > 0 ? (
            categories.map((cat, catIdx) => {
              const Icon = ICON_MAP[cat.category_name] || Compass;
              const games = (cat.games || []).slice(0, 6);
              
              if (games.length === 0) return null;

              // Alternating layouts: 0 = 3x3 grid, 1 = slider, 2 = 2x2 grid
              const layoutType = catIdx % 3;

              return (
                <div key={cat.category_id} id={`category-${cat.category_id}`}>
                  <div className="px-2">
                    <CategoryBar
                      icon={Icon}
                      name={cat.category_name}
                      onViewAll={() =>
                        navigate("/games/viewAll", {
                          state: { title: cat.category_name, categoryId: cat.category_id },
                        })
                      }
                    />

                    {/* 3x3 layout (3 columns grid showing up to 6 games) */}
                    {layoutType === 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {games.map((game: any, i: number) => (
                          <GameCard
                            key={game.game_id}
                            game={game}
                            index={i}
                            onPlay={() => handleGameLaunch(game)}
                            aspectClass="aspect-[4/3]"
                          />
                        ))}
                      </div>
                    )}

                    {/* Slider layout (up to 6 games) */}
                    {layoutType === 1 && (
                      <div className="mt-1">
                        <Swiper
                          loop={games.length > 2}
                          slidesPerView={2.4}
                          spaceBetween={10}
                          autoplay={{ delay: 3000, disableOnInteraction: false }}
                          modules={[Autoplay]}
                          className="!px-0"
                        >
                          {games.map((game: any, i: number) => (
                            <SwiperSlide key={game.game_id || i}>
                              <GameCard
                                game={game}
                                index={i}
                                onPlay={() => handleGameLaunch(game)}
                                aspectClass="aspect-[4/3]"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}

                    {/* 2x2 layout (2 columns grid showing up to 6 games) */}
                    {layoutType === 2 && (
                      <div className="grid grid-cols-2 gap-3">
                        {games.map((game: any, i: number) => (
                          <GameCard
                            key={game.game_id}
                            game={game}
                            index={i}
                            onPlay={() => handleGameLaunch(game)}
                            aspectClass="aspect-[16/9]"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            !loading && (
              <div className="mx-4 py-12 text-center border border-slate-200 dark:border-[#1a3a5c] rounded-2xl bg-white dark:bg-[#0d2540] shadow-sm dark:shadow-none">
                <Gamepad2 className="w-10 h-10 text-slate-300 dark:text-[#1e4a7a] mx-auto mb-3" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4a7a9b]">
                  No games available
                </p>
              </div>
            )
          )}
        </div>

      </div>

      <BottomNavBar />

      {selectedGame && (
        <GameViewerNew
          fromGame
          url={playURL}
          name={selectedGame?.game_name}
          orientation={selectedGame?.game_screen === "1" ? "Portrait" : "Landscape"}
          onClose={() => {
            setSelectedGame(null);
            setPlayURL("");
            setGamePlayData(null);
          }}
        />
      )}

      {loading && <WaitLoader isOverlay />}

      <PopupBannerUnsubscribe
        isShow={showNotSubscribed}
        onClose={() => setShowNotSubscribed(false)}
        onConfirm={() => setShowNotSubscribed(false)}
        confirmText={t?.subscribeNow || "Subscribe"}
        data={{
          title: t?.notSubscribedTitle || "Subscription Required!",
          description: t?.notSubscribedDesc || "Please subscribe with a Daily or Weekly plan.",
          image: true,
          autoCloseTimer: 0,
        }}
      />

      <LowBalancePopup
        visible={showLowBalance}
        onClose={() => setShowLowBalance(false)}
        avatarUrl={userInfo?.user_image}
      />
    </>
  );
}