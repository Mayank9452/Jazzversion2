import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Gamepad2, Zap, Play, Compass, Flame, Map,
  Puzzle, Flag, ChevronRight, ChevronLeft, Trophy, Bolt,
  Star, Crown, Sparkles, TrendingUp, HelpCircle
} from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppSelector } from "@/app/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { fetchGamesPageCategories, playGameApi, randomGames } from "@/apiServices/igplApi";
import { getSubscriptionUIState } from "@/utils/subscriptionUtils";
import PopupBannerUnsubscribe from "./PopupBannerUnsubscribe";
import LowBalancePopup from "./LowBalancePopup";
import GameViewerNew from "./GameViewerNew";
import WaitLoader from "./Loader";

// ─── Play Store UI Constants (Locked to Brand Color Palette) ─────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Action: Zap,
  Adventure: Map,
  Arcade: Gamepad2,
  "Puzzle & Logic": Puzzle,
  "Sports & Racing": Flag,
};

// Gradients restricted to brand black, gray, yellow, and gold colors only
const GENRE_GRADIENTS: Record<string, string> = {
  Action: "from-[#DFA208] to-[#FFCA20]", // Gold to Yellow
  Adventure: "from-[#2B2B2B] to-[#DFA208]", // Dark Gray to Gold
  Arcade: "from-[#3D3D3D] to-[#FFD34B]", // Medium Gray to Yellow
  "Puzzle & Logic": "from-[#DFA208] to-[#2B2B2B]", // Gold to Dark Gray
  "Sports & Racing": "from-[#FFCA20] to-[#E6B53A]", // Yellow to Mid Gold
  Default: "from-[#2B2B2B] to-[#3D3D3D]", // Gray shades
};

// Deterministic mock data generators for Google Play Store style info
const getMockRating = (gameId: number) => {
  const seed = (gameId * 7) % 10;
  return (4.0 + seed * 0.1).toFixed(1);
};

const getMockSize = (gameId: number) => {
  const seed = (gameId * 13) % 80;
  return `${seed + 15} MB`;
};

const getMockDownloads = (gameId: number) => {
  const seed = (gameId * 17) % 5;
  const suffixes = ["100K+", "500K+", "1M+", "5M+", "10M+"];
  return suffixes[seed];
};

// ─── Sub-Components ────────────────────────────────────────────────────────────

// 1. Hero Spotlight Slide (Landscape card with content description)
function PlayStoreHeroCard({ game, onPlay }: { game: any; onPlay: () => void }) {
  const rating = getMockRating(game?.game_id || 1);
  return (
    <div
      onClick={onPlay}
      className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden cursor-pointer shadow-md group transition-all active:scale-[0.98] duration-200"
    >
      <img
        src={game?.game_image_url}
        alt={game?.game_name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4" />

      {/* Floating Play Button (Yellow-main fill) */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-yellow-main backdrop-blur-md border-2 border-white flex items-center justify-center text-black shadow-lg hover:scale-105 transition-all">
        <Play className="w-4 h-4 fill-current ml-0.5" />
      </div>

      {/* Content */}
      <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-3">
        <img
          src={game?.game_image_url}
          alt=""
          className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
        />
        <div className="flex-1 min-w-0 text-start">
          <div className="text-white font-bold text-[14px] truncate leading-tight">
            {game?.game_name}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-slate-300 text-[10px]">
            <span className="font-semibold text-white/90">{game?.category_name || "Hot Picks"}</span>
            {/* <span>•</span>
            <div className="flex items-center text-[#FFCA20] gap-0.5">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="font-bold text-white/90">{rating}</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Play Store App Card (Rounded 1:1 Icon - Theme Aware)
function PlayStoreAppCard({ game, onPlay }: { game: any; onPlay: () => void }) {
  const rating = getMockRating(game?.game_id || 1);
  const size = getMockSize(game?.game_id || 1);
  return (
    <div
      onClick={onPlay}
      className="w-[100px] flex flex-col cursor-pointer transition-transform active:scale-95 duration-150 shrink-0"
    >
      <div className="w-[100px] h-[100px] rounded-[22px] overflow-hidden relative shadow-sm border border-slate-200/80 bg-white/90 dark:bg-[#2B2B2B] dark:border-[#3D3D3D]">
        <img
          src={game?.game_image_url}
          alt={game?.game_name}
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors" /> */}
        {/* Play Icon Badge */}
        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 dark:bg-yellow-main backdrop-blur-sm flex items-center justify-center text-slate-800 dark:text-black border border-slate-200 dark:border-white">
          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
        </div>
      </div>
      {/* <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-2 truncate w-full leading-tight text-start">
        {game?.game_name}
      </div> */}
      {/* <div className="flex items-center gap-1 mt-0.5 text-[9px] text-slate-500 dark:text-[#BDBDBD] font-semibold justify-start">
        <span>{rating}</span>
        <Star className="w-2.5 h-2.5 text-[#FFCA20] fill-current" />
        <span>•</span>
        <span className="truncate max-w-[40px]">{size}</span>
      </div> */}
    </div>
  );
}

// 3. Promoted Promo Card (Large landscape banner with footer details - Theme Aware)
function PlayStorePromotedBanner({ game, onPlay }: { game: any; onPlay: () => void }) {
  const rating = getMockRating(game?.game_id || 1);
  const downloads = getMockDownloads(game?.game_id || 1);
  return (
    <div
      onClick={onPlay}
      className="mx-2 my-2.5 overflow-hidden rounded-2xl border border-slate-200 dark:border-[#3D3D3D] bg-white dark:bg-[#2B2B2B] shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="aspect-[21/9] w-full relative overflow-hidden">
        <img src={`https://jazzgplapi.gamenow.com.pk/uploads/webp/640X360/${game?.game_image}`} alt="" className="w-full h-full object-cover" />
        {/* <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-[#191919]/90 text-slate-800 dark:text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#3D3D3D]">
          Featured Promo
        </div> */}
      </div>
      <div className="p-2 flex items-center justify-between gap-3 bg-white dark:bg-[#2B2B2B]">
        <div className="flex items-center gap-2.5 min-w-0 text-start">
          <img src={game?.game_image_url} alt="" className="w-10 h-10 rounded-[12px] object-cover shrink-0 border border-slate-200 dark:border-[#3D3D3D]" />
          <div className="min-w-0">
            <div className="text-slate-800 dark:text-white font-bold text-[13px] truncate leading-tight">
              {game?.game_name}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-[#BDBDBD] mt-0.5 truncate">
              {game?.category_name || "Instant Play"}
            </p>
          </div>
        </div>
        <button className="bg-yellow-main border-2 border-white text-black font-black text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-full active:scale-95 transition-transform shrink-0 shadow-sm flex items-center gap-1">
          <Play className="w-2.5 h-2.5 fill-current ml-0.5" /> Play
        </button>
      </div>
    </div>
  );
}

// 4. Top Charts Item (Numbered rank row - Theme Aware)
function PlayStoreRankItem({ rank, game, onPlay }: { rank: number; game: any; onPlay: () => void }) {
  const imageUrl = game?.game_image
    ? `http://jazzgplapi.gamenow.com.pk/uploads/webp/suggested_games/${game.game_image}`
    : game?.game_image_url;

  return (
    <div
      onClick={onPlay}
      className="aspect-[285/380] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#3D3D3D]/40 shadow-sm dark:shadow-md cursor-pointer relative shrink-0 dark:border-[#FFCA20]/30"
    >
      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      <button
        className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto dark:border-2 border-white"
        aria-label="Play Game"
      >
        <Play className="h-3.5 w-3.5 fill-brand-black-100 text-brand-black-100 ml-0.5" />
      </button>
    </div>
  );
}

// 5. Premium App Card (VIP Tag - Theme Aware)
function PlayStorePremiumCard({ game, onPlay }: { game: any; onPlay: () => void }) {
  const rating = getMockRating(game?.game_id || 1);
  return (
    <div
      onClick={onPlay}
      className="bg-white/90 border border-slate-200/80 shadow-md hover:shadow-lg dark:bg-[#2B2B2B] dark:border-[#FFCA20]/20 rounded-2xl overflow-hidden transition-all p-2 cursor-pointer relative"
    >
      {/* <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FFCA20] to-[#DFA208] text-[#191919] text-[8px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm z-10">
        <Crown className="w-2.5 h-2.5 fill-current" />
        <span>VIP</span>
      </div> */}
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-[#191919] border border-slate-200 dark:border-[#3D3D3D]">
        <img src={game?.game_image_url} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="text-[12px] font-bold text-slate-800 dark:text-white mt-2.5 truncate text-start">
        {game?.game_name}
      </div>
      <button
        // onClick={(e) => {
        //   e.stopPropagation();
        //   handleGameClick(game);
        // }}
        className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto dark:border-2 border-white"
        aria-label="Play Game"
      >
        <Play className="h-3.5 w-3.5 fill-brand-black-100 text-brand-black-100 ml-0.5" />
      </button>
      {/* <div className="flex items-center justify-between mt-1 text-start">
        <span className="text-[10px] text-slate-500 dark:text-[#BDBDBD] font-medium truncate max-w-[70%]">
          {game?.category_name || "Premium"}
        </span>
        <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#FFCA20]">
          <Star className="w-2.5 h-2.5 fill-current" />
          <span>{rating}</span>
        </div>
      </div> */}
    </div>
  );
}

// 6. Play Store 3-Game Vertical Column Item (Management Simulators layout - Theme Aware)
function PlayStoreColumnItem({ game, onPlay }: { game: any; onPlay: () => void }) {
  const rating = getMockRating(game?.game_id || 1);
  const size = getMockSize(game?.game_id || 1);
  const mockDesc = game?.game_name ? `Enjoy the thrill of ${game.game_name} directly in your browser!` : "Top rated simulator game.";
  return (
    <div onClick={onPlay} className="flex items-center gap-2 cursor-pointer py-1.5 select-none hover:bg-black/[0.02] dark:hover:bg-white/[0.02] bg-white/95  shadow-sm dark:bg-[#292929] rounded-xl px-2 transition-colors relative">
      <img
        src={game?.game_image_url}
        alt=""
        className="w-20 h-20 rounded-[14px] object-cover border border-slate-200  shrink-0"
      />
      <div className="flex-1 min-w-0 text-start pl-0.5 pr-8">
        <div className="text-[12.5px] font-bold text-slate-800 dark:text-white truncate leading-snug">
          {game?.game_name}
        </div>
        <p className="text-[10px] text-slate-500 dark:text-[#BDBDBD] truncate leading-normal mt-0.5">
          {game?.category_name || "Premium"}
        </p>
      </div>
      <button
        className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-brand-gradient hover:brightness-110 text-brand-black-100 shadow-md active:scale-90 transition-all shrink-0 pointer-events-auto dark:border-2 border-white"
        aria-label="Play Game"
      >
        <Play className="h-3.5 w-3.5 fill-brand-black-100 text-brand-black-100 ml-0.5" />
      </button>
    </div>
  );
}

// 7. Play Store Landscape App Card (Run, jump, run! layout - Theme Aware)
function PlayStoreLandscapeCard({ game, onPlay }: { game: any; onPlay: () => void }) {
  const rating = getMockRating(game?.game_id || 1);
  const size = getMockSize(game?.game_id || 1);
  return (
    <div onClick={onPlay} className="flex flex-col cursor-pointer select-none bg-white/95 border border-slate-200/80 shadow-md dark:border-b dark:border-x-0 dark:border-t-0 dark:border-slate-800 dark:bg-[#292929] rounded-xl p-1 dark:p-0 relative dark:shadow-none">
      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#3D3D3D] relative bg-slate-100 dark:bg-[#2B2B2B]">
        <img
          src={game?.game_image_url}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Play Icon overlay */}
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-[#191919]/80 flex items-center justify-center text-slate-800 dark:text-white border border-slate-200 dark:border-[#3D3D3D]">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2.5 my-2 text-start mx-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            src={game?.game_image_url}
            alt=""
            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-[#3D3D3D] mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-bold text-slate-800 dark:text-white truncate leading-tight">
              {game?.game_name}
            </div>
            <p className="text-[9.5px] text-slate-500 dark:text-[#BDBDBD] truncate leading-tight mt-0.5">
              {game?.category_name || "Action"} • Run & gun
            </p>
          </div>
        </div>

        {/* Play icon rounded button on bottom right */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-yellow-main border-2 border-white text-black shadow-md hover:scale-105 active:scale-90 transition-transform shrink-0">
          <Play className="w-3 h-3 fill-current ml-0.5" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

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

  // States
  const [chartFilter, setChartFilter] = useState<"top_free" | "trending">("top_free");
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState<any | null>(null);

  const userInfo = homeData?.data?.userInfo;
  const dValidTill = homeData?.data?.dValidTill;
  const subUIState = useMemo(
    () => getSubscriptionUIState(userInfo, dValidTill),
    [userInfo, dValidTill]
  );

  const avatar = userInfo?.user_profile_img ? `${userInfo.user_profile_img}.png` : "9.png";

  // Load API Data
  useEffect(() => {
    const loadSafe = async () => {
      setLoading(true);
      try {
        const [catRes, randRes] = await Promise.all([
          fetchGamesPageCategories(),
          randomGames(),
        ]);
        if (catRes?.status && catRes?.categoriesList?.length > 0) {
          setCategories(catRes.categoriesList);
        }
        if (randRes?.status) setRandomGamesData(randRes?.data);
      } catch (e) {
        console.error("Error loading games:", e);
      } finally {
        setLoading(false);
      }
    };
    loadSafe();
  }, []);

  // Handle query parameter scroll logic
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
        setSelectedCategoryDetail(matchedCat);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [loading, categories, scrollToCategory]);

  // Extract all unique games
  const allGames = useMemo(() => {
    const list: any[] = [];
    const ids = new Set<number>();

    // Add category games
    categories.forEach((cat) => {
      (cat.games || []).forEach((game: any) => {
        if (!ids.has(game.game_id)) {
          ids.add(game.game_id);
          list.push({ ...game, category_name: cat.category_name });
        }
      });
    });

    // Add random/hot games
    (randomGamesData?.usergamesList || []).forEach((game: any) => {
      const gId = game.game_id || game.report_game_id;
      if (gId && !ids.has(gId)) {
        ids.add(gId);
        list.push({ ...game, game_id: gId, category_name: "Hot Pick" });
      }
    });

    return list;
  }, [categories, randomGamesData]);

  // Top Free & Trending computed lists for Top Charts
  const topFreeChartsList = useMemo(() => {
    return allGames.slice(0, 5);
  }, [allGames]);

  const trendingChartsList = useMemo(() => {
    return [...allGames].reverse().slice(0, 5);
  }, [allGames]);

  // Game Launch Trigger
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
      {/* Theme Aware Viewport Container with Soft Light Gradient and Glassmorphism blobs */}
      <div className="w-full max-w-[480px] mx-auto min-h-screen bg-gradient-to-tr from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#191919] dark:to-[#191919] text-slate-800 dark:text-white pb-8 border-x border-slate-200 dark:border-[#3D3D3D]/30 shadow-xl dark:shadow-2xl relative flex flex-col transition-colors duration-300 overflow-hidden">
        {/* Ambient background glow effects for light theme glassmorphism layout (hidden in dark mode) */}
        <div className="absolute top-[15%] -left-20 w-72 h-72 bg-[#FFCA20]/8 rounded-full blur-[90px] pointer-events-none z-0 dark:hidden" />
        <div className="absolute bottom-[25%] -right-20 w-72 h-72 bg-blue-500/8 rounded-full blur-[90px] pointer-events-none z-0 dark:hidden" />

        {/* ─── Solid Black Header (Remains same in light & dark theme matching TournamentHistory structure) ─── */}
        <div className="sticky top-0 z-[99] mb-3 bg-[#191919] transition-colors duration-300">
          <div className="relative overflow-hidden bg-[#191919] border-b border-white/10 p-2 flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="w-full flex justify-between items-center gap-5">
              <div>
                <button
                  onClick={() => {
                    if (selectedCategoryDetail) {
                      setSelectedCategoryDetail(null);
                    } else {
                      navigate(-1);
                    }
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-yellow-main bg-white/10 hover:bg-brand-gradient hover:text-brand-black-100 transition-colors text-white shadow-sm"
                  title="Back"
                >
                  <ChevronLeft className="w-4.5 h-4.5 text-yellow-main" />
                </button>
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-white leading-tight">
                  Play Free Games
                </h1>
              </div>
              {/* Right side: Profile avatar in rounded-xl container matching TournamentHistory style */}
              <div
                onClick={() => navigate("/profile")}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-main/5 rounded-xl shadow-[0_0_15px_rgba(254,203,19,0.15)] border border-[#fecb13]/25 cursor-pointer overflow-hidden active:scale-95 transition-all hover:scale-105"
              >
                <img
                  src={`/assets/users/${avatar}`}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/users/9.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT RENDERING ─── */}
        <div className="pt-1 flex-1">
          <AnimatePresence mode="wait">

            {selectedCategoryDetail ? (
              /* Detail view of a clicked Category */
              <motion.div
                key="category_detail"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4 px-4"
              >
                <div className="flex items-center gap-3 bg-white dark:bg-[#2B2B2B] border border-slate-200 dark:border-[#3D3D3D] p-3 rounded-2xl shadow-sm text-start">
                  <button
                    onClick={() => setSelectedCategoryDetail(null)}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#191919]/60 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-transform border border-slate-200 dark:border-[#3D3D3D]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <div className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-white">
                      {selectedCategoryDetail.category_name}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-[#BDBDBD] font-semibold uppercase tracking-wider">
                      {selectedCategoryDetail.games?.length || 0} Games Available
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                  {(selectedCategoryDetail.games || []).map((game: any, i: number) => (
                    <div key={game.game_id || i} className="flex justify-center">
                      <PlayStoreAppCard
                        game={{ ...game, category_name: selectedCategoryDetail.category_name }}
                        onPlay={() => handleGameLaunch({ ...game, category_name: selectedCategoryDetail.category_name })}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Single Unified Scroll Feed (Theme Aware) - No Heading Elements */
              <motion.div
                key="unified_feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* 1. Hero Spotlight Carousel */}
                {randomGamesData?.usergamesList?.length > 0 && (
                  <div className="px-4">
                    <Swiper
                      loop={randomGamesData.usergamesList.length > 2}
                      slidesPerView={1.3}
                      centeredSlides={true}
                      spaceBetween={12}
                      autoplay={{ delay: 4000, disableOnInteraction: false }}
                      modules={[Autoplay]}
                    >
                      {randomGamesData.usergamesList.map((game: any, i: number) => (
                        <SwiperSlide key={game.game_id || game.report_game_id || i}>
                          <PlayStoreHeroCard
                            game={{ ...game, game_id: game.game_id || game.report_game_id }}
                            onPlay={() => handleGameLaunch({ ...game, game_id: game.game_id || game.report_game_id })}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}

                {/* 2. Suggested For You Row */}
                {allGames.length > 0 && (
                  <div>
                    {/* Commented Out Suggested Heading for Clean View */}
                    {/*
                    <div className="flex justify-between items-center px-4 mb-3">
                      <div className="text-[14px] font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#FFCA20] fill-current" /> Suggested for you
                      </div>
                    </div>
                    */}
                    <div
                      className="overflow-hidden w-full px-4 pb-2.5 flex"
                      style={{
                        // maskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
                        // WebkitMaskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)"
                      }}
                    >
                      <motion.div
                        className="flex gap-2 shrink-0"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                          ease: "linear",
                          duration: 25,
                          repeat: Infinity,
                        }}
                        style={{
                          width: "max-content",
                          willChange: "transform"
                        }}
                      >
                        {allGames.slice(0, 10).concat(allGames.slice(0, 10)).map((game, i) => (
                          <PlayStoreAppCard
                            key={`${game.game_id || i}-${i}`}
                            game={game}
                            onPlay={() => handleGameLaunch(game)}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* 3. Premium Mini Grid */}
                {allGames.length > 0 && (
                  <div>
                    {/* Commented Out Premium Heading for Clean View */}
                    {/*
                    <div className="flex justify-between items-center px-4 mb-3">
                      <div className="text-[14px] font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-[#FFCA20] fill-current" /> Premium Games
                      </div>
                    </div>
                    */}
                    <div className="grid grid-cols-2 gap-2.5 px-2">
                      {allGames.slice(0, 4).map((game, i) => (
                        <PlayStorePremiumCard
                          key={game.game_id || i}
                          game={game}
                          onPlay={() => handleGameLaunch(game)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Top Charts Section (Mini Charts Block) */}
                {allGames.length > 0 && (
                  <div className="space-y-3">
                    {/* Commented Out Top Charts Heading for Clean View */}
                    {/*
                    <div className="flex justify-between items-center px-4">
                      <div className="text-[14px] font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#FFCA20]" /> Top Charts
                      </div>
                    </div>
                    */}

                    {/* Sub-Filter toggle background (Brand Colors - Theme Aware) */}
                    {/* <div className="flex justify-end px-4 mb-3">
                      <div className="flex gap-1 bg-slate-200 dark:bg-[#2B2B2B] p-0.5 rounded-full border border-slate-300 dark:border-[#3D3D3D]">
                        <button
                          onClick={() => setChartFilter("top_free")}
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${chartFilter === "top_free"
                            ? "bg-gradient-to-r from-[#FFCA20] to-[#DFA208] text-[#191919] shadow-sm font-black"
                            : "text-slate-600 dark:text-[#BDBDBD] hover:text-slate-800 dark:hover:text-white"
                            }`}
                        >
                          Free
                        </button>
                        <button
                          onClick={() => setChartFilter("trending")}
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${chartFilter === "trending"
                            ? "bg-gradient-to-r from-[#FFCA20] to-[#DFA208] text-[#191919] shadow-sm font-black"
                            : "text-slate-600 dark:text-[#BDBDBD] hover:text-slate-800 dark:hover:text-white"
                            }`}
                        >
                          Trending
                        </button>
                      </div>
                    </div> */}

                    <div className="px-2 w-full">
                      <Swiper
                        spaceBetween={8}
                        slidesPerView={2.5}
                        centeredSlides={false}
                        className="w-full"
                      >
                        {(chartFilter === "top_free" ? topFreeChartsList : trendingChartsList).map((game, idx) => (
                          <SwiperSlide key={game.game_id || idx}>
                            <PlayStoreRankItem
                              rank={idx + 1}
                              game={game}
                              onPlay={() => handleGameLaunch(game)}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                )}



                {/* 5. Dynamic Alternating Category highlights */}
                {categories.map((cat, catIdx) => {
                  const games = cat.games || [];
                  if (games.length === 0) return null;

                  const layoutType = catIdx % 3;

                  return (
                    <div key={cat.category_id} className="pt-1">
                      {/* Commented Out Dynamic Highlights Title Row */}
                      {/*
                      <div className="flex justify-between items-center px-4 mb-3">
                        <div className="text-[14px] font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5 text-start">
                          {cat.category_name} Highlights
                        </div>
                        <button
                          onClick={() => setSelectedCategoryDetail(cat)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-[#2B2B2B] rounded-full text-slate-500 dark:text-slate-300"
                        >
                          <ChevronRight className="w-4.5 h-4.5" />
                        </button>
                      </div>
                      */}

                      {/* Layout 0: 3-Game Columns stacked snaps (Management Simulators layout!) */}
                      {layoutType === 0 && (
                        <div className="flex gap-2 overflow-x-auto scrollbar-none ms-2 px-2 pb-2 w-full snap-x snap-mandatory">
                          {(() => {
                            const chunks = [];
                            const limitGames = games.slice(0, 9);
                            for (let i = 0; i < limitGames.length; i += 3) {
                              chunks.push(limitGames.slice(i, i + 3));
                            }
                            return chunks.map((chunk, chunkIdx) => (
                              <div key={chunkIdx} className="flex flex-col gap-3.5 w-[200px] shrink-0 snap-start">
                                {chunk.map((g: any, i: number) => (
                                  <PlayStoreColumnItem
                                    key={g.game_id || i}
                                    game={g}
                                    onPlay={() => handleGameLaunch(g)}
                                  />
                                ))}
                              </div>
                            ));
                          })()}
                        </div>
                      )}

                      {/* Layout 1: Landscape swipe row (Run, jump, run! layout) */}
                      {layoutType === 1 && (
                        <Swiper
                          slidesPerView={1.5}
                          spaceBetween={12}
                          slidesOffsetBefore={16}
                          slidesOffsetAfter={16}
                          autoplay={{ delay: 4000, disableOnInteraction: false }}
                          modules={[Autoplay]}
                          className="w-full"
                        >
                          {games.map((g: any, i: number) => (
                            <SwiperSlide key={g.game_id || i}>
                              <PlayStoreLandscapeCard
                                game={{ ...g, category_name: cat.category_name }}
                                onPlay={() => handleGameLaunch(g)}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}

                      {/* Layout 2: Single Promo Card followed by mini scroll */}
                      {layoutType === 2 && (
                        <div>
                          <PlayStorePromotedBanner
                            game={games[0]}
                            onPlay={() => handleGameLaunch(games[0])}
                          />
                          {games.length > 1 && (
                            <div
                              className="overflow-hidden w-full px-2 mt-6 pb-1 flex"
                              style={{
                                // maskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
                                // WebkitMaskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)"
                              }}
                            >
                              <motion.div
                                className="flex gap-2 shrink-0"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                  ease: "linear",
                                  duration: 20,
                                  repeat: Infinity,
                                }}
                                style={{
                                  width: "max-content",
                                  willChange: "transform"
                                }}
                              >
                                {games.slice(1, 6).concat(games.slice(1, 6)).map((g: any, i: number) => (
                                  <PlayStoreAppCard
                                    key={`${g.game_id || i}-${i}`}
                                    game={g}
                                    onPlay={() => handleGameLaunch(g)}
                                  />
                                ))}
                              </motion.div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      <BottomNavBar />

      {/* Game Play Frame Overlay */}
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

      {/* Subscription Requirement Popup */}
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

      {/* Low Balance Popup */}
      <LowBalancePopup
        visible={showLowBalance}
        onClose={() => setShowLowBalance(false)}
        avatarUrl={userInfo?.user_image}
      />
    </>
  );
}