import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    Gamepad2, Zap, Play, Compass, Flame, Map,
    Puzzle, Flag, ChevronRight, ChevronLeft, Trophy, Bolt,
    Star, Crown, Sparkles, TrendingUp, HelpCircle, ArrowLeft,
    Clock
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

// 1b. Hero Spotlight Slide V2 (Giant rank number layered BEHIND the card poster)
function PlayStoreHeroCardV2({ game, rank = 1, onPlay }: { game: any; rank?: number; onPlay: () => void }) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <div
            onClick={onPlay}
            className="relative w-full cursor-pointer group transition-all active:scale-[0.98] duration-200 select-none flex items-center justify-end pl-12"
        // style={{ aspectRatio: "314 / 226" }}
        >
            {/* Giant Rank Number (Layered BEHIND the banner image with z-0) */}
            <div className="absolute -left-[0.4rem] bottom-[-4px] sm:bottom-[-15px] z-0 pointer-events-none select-none">
                <span
                    className="text-[130px] sm:text-[145px] font-black leading-none tracking-tighter font-sans select-none"
                    style={{
                        WebkitTextStroke: isDark ? "3px rgba(255, 255, 255, 0.95)" : "3px rgba(20, 20, 20, 0.9)",
                        color: "transparent"
                    }}
                >
                    {rank}
                </span>
            </div>

            <div className="relative z-10 w-[100%] h-full rounded-xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-white/10 bg-[#2B2B2B]">
                <img
                    src={`https://jazzgplapi.gamenow.com.pk/uploads/webp/suggested_games/${game.game_image}`}
                    alt={game?.game_name}
                    className="w-full h-full object-center group-hover:scale-105 transition-transform duration-700"
                />
            </div>
        </div>
    );
}

function PlayStoreHero({ game, onPlay }: { game: any; onPlay: () => void }) {
    const rating = getMockRating(game?.game_id || 1);
    return (
        <div
            onClick={onPlay}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden cursor-pointer shadow-md group transition-all active:scale-[0.98] duration-200"
        >
            <img
                src={`https://jazzgplapi.gamenow.com.pk/uploads/webp/640X360/${game?.game_image}`}
                alt={game?.game_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

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
            </div>
        </div>
    );
}

// 3. Promoted Promo Card (Large landscape banner with footer details - Theme Aware)
function PlayStorePromotedBanner({ game, onPlay }: { game: any; onPlay: () => void }) {
    return (
        <>
            <style>{`
                @keyframes pulse-yellow-glow {
                    0%, 100% {
                        box-shadow: 0 0 10px 1px rgba(255, 202, 32, 0.4);
                        border-color: rgba(255, 202, 32, 0.45);
                    }
                    50% {
                        box-shadow: 0 0 24px 4px rgba(255, 202, 32, 0.85);
                        border-color: rgba(255, 202, 32, 0.85);
                    }
                }
                @keyframes shimmer-sweep {
                    0% {
                        transform: translateX(-200%) skewX(-25deg);
                    }
                    35%, 100% {
                        transform: translateX(200%) skewX(-25deg);
                    }
                }
                .animate-yellow-glow {
                    animation: pulse-yellow-glow 2.2s infinite ease-in-out;
                }
                .shimmer-effect::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 236, 172, 0.2) 20%,
                        rgba(255, 255, 255, 0.7) 60%,
                        transparent
                    );
                    animation: shimmer-sweep 5.2s infinite ease-in-out;
                }
            `}</style>
            <div
                onClick={onPlay}
                className="my-3 overflow-hidden rounded-2xl border-2 border-[#FFCA20]/50 bg-white dark:bg-[#2B2B2B] shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all cursor-pointer relative aspect-[16/9] group animate-yellow-glow shimmer-effect"
            >
                {/* <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-lg bg-[#FFCA20] text-slate-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider shadow-[0_2px_8px_rgba(255,202,32,0.4)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                    🔥 Promoted
                </div> */}
                <img
                    src={`https://jazzgplapi.gamenow.com.pk/uploads/webp/640X360/${game?.game_image}`}
                    alt={game?.game_name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
            </div>
        </>
    );
}



// 6. Play Store 3-Game Vertical Column Item (Management Simulators layout - Theme Aware)
function PlayStoreColumnItem({ game, onPlay }: { game: any; onPlay: () => void }) {
    return (
        <div
            onClick={onPlay}
            className="w-full rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 bg-[#2B2B2B] shadow-sm hover:scale-[1.03] active:scale-95 transition-all select-none"
        >
            <img
                src={`http://jazzgplapi.gamenow.com.pk/uploads/webp/suggested_games/${game.game_image}`}
                alt=""
                className="w-full h-full object-cover"
            />
        </div>
    );
}

// 7. Play Store Landscape App Card (Run, jump, run! layout - Theme Aware)
function PlayStoreLandscapeCard({ game, onPlay }: { game: any; onPlay: () => void }) {
    const rating = getMockRating(game?.game_id || 1);
    const size = getMockSize(game?.game_id || 1);
    return (
        <div
            onClick={onPlay}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden cursor-pointer shadow-md group transition-all active:scale-[0.98] duration-200"
        >
            <img
                src={`https://jazzgplapi.gamenow.com.pk/uploads/webp/640X360/${game?.game_image}`}
                alt={game?.game_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function GamesPageNewTesting() {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollToCategory = location.state?.scrollToCategory;
    const { t } = useLanguage();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
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

    const avatar = userInfo?.user_profile_img ? `${userInfo.user_profile_img}.png` : (localStorage.getItem("selectedAvatarImg") || "9.png");

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

        // Replicate games to 180 for testing if the list is shorter than 180
        if (list.length > 0 && list.length < 180) {
            const baseList = [...list];
            let copyIdx = 0;
            while (list.length < 180) {
                const baseGame = baseList[copyIdx % baseList.length];
                list.push({
                    ...baseGame,
                    game_id: baseGame.game_id * 1000 + list.length
                });
                copyIdx++;
            }
        }

        return list;
    }, [categories, randomGamesData]);

    const trendingGames = useMemo(() => allGames.slice(0, 10), [allGames]);
    const lastPlayedGames = useMemo(() => allGames.slice(10, 15), [allGames]);
    const playAllGames = useMemo(() => allGames.slice(15), [allGames]);

    const cycles = useMemo(() => {
        const list = [...playAllGames];
        const result: any[] = [];
        let cycleIndex = 0;
        let bannerCount = 0;

        while (list.length > 0) {
            // 1. PlayStoreAppCard (8 games)
            const appCards = list.splice(0, Math.min(8, list.length));

            // 2. PlayStoreColumnItem (desired limit 9 * 2^cycleIndex, multiple of 3 and >= 9, or remainder at the end)
            const desiredColumns = 9 * Math.pow(2, cycleIndex);
            let columnItems: any[] = [];
            if (list.length > 0) {
                const limit = Math.min(desiredColumns, list.length);
                let count = limit;
                if (list.length > desiredColumns) {
                    count = limit - (limit % 3);
                } else {
                    count = limit - (limit % 3);
                }
                columnItems = list.splice(0, count);
            }

            // 3. PlayStoreLandscapeCard (5 games)
            const landscapeCards = list.splice(0, Math.min(5, list.length));

            // 4. PlayStorePromotedBanner (1 game, max 4 times total)
            let bannerGame = null;
            if (bannerCount < 4 && list.length > 0) {
                bannerGame = list.shift();
                bannerCount++;
            }

            result.push({
                id: cycleIndex,
                appCards,
                columnItems,
                landscapeCards,
                bannerGame
            });
            cycleIndex++;
        }
        return result;
    }, [playAllGames]);

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

                {/* ── Premium Glassmorphic Header Card (replicated from TournamentHistory.tsx) ── */}
                <div className="relative z-[99]">
                    <div className={`relative overflow-hidden p-2 pr-1 flex items-center justify-between gap-3 border-b transition-all duration-300 ${isDark ? "bg-gradient-to-br from-[#2B2B2B]/40 to-[#191919]/30 border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.2)]" : "bg-gradient-to-br from-white/70 to-white/40 border-slate-200/60 shadow-sm"} backdrop-blur-xl`}>
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
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all pointer-events-auto cursor-pointer shrink-0 ${isDark ? "bg-[#32323299] backdrop-blur-md border border-white/10 text-white hover:bg-black/75" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                                    title="Back"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 text-center">
                                <h1 className={`text-base sm:text-lg font-black tracking-wide uppercase leading-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                                    Play Games
                                </h1>
                                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-muted-foreground mt-1 leading-none">
                                    Explore our collection of games
                                </p>
                            </div>
                            {/* Right side: Modern Profile Avatar Container */}
                            <div
                                onClick={() => navigate("/settingsStatic")}
                                className="w-16 h-16 -my-2 flex-shrink-0 flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:scale-105"
                            >
                                <img
                                    src={`/assets/users/${avatar}`}
                                    className="w-full h-full object-contain"
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
                                className="space-y-2 px-4"
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
                            /* Single Unified Scroll Feed (Theme Aware) with headers and repeating cycles */
                            <motion.div
                                key="unified_feed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 pb-6 text-start"
                            >
                                {/* 1. Top Trending Section */}
                                {trendingGames.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-4 mt-3 mb-1">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center p-2 rounded-xl bg-[#FFCA20]/10 text-[#FFCA20] border border-[#FFCA20]/30 shadow-[0_0_15px_rgba(255,202,32,0.25)]">
                                                    <TrendingUp className="w-4 h-4 fill-current shrink-0 animate-pulse" />
                                                </span>
                                                <div className="flex flex-col text-start">
                                                    {/* <span className="text-[8px] sm:text-[9px] font-black text-[#DFA208] tracking-[3px] uppercase leading-none mb-1">
                                                        // TRENDING NOW
                                                    </span> */}
                                                    <h2 className="text-base sm:text-lg font-black italic tracking-wider bg-gradient-to-r from-[#2B2B2B] to-[#191919] dark:from-[#FFCA20] dark:via-[#E6B53A] dark:to-[#DFA208] bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)]">
                                                        Top Trending
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pl-2 pr-2 overflow-visible">
                                            <Swiper
                                                loop={trendingGames.length > 2}
                                                slidesPerView={1.9}
                                                centeredSlides={false}
                                                spaceBetween={18}
                                                autoplay={{ delay: 4500, disableOnInteraction: false }}
                                                modules={[Autoplay]}
                                                className="overflow-visible"
                                            >
                                                {trendingGames.map((game: any, i: number) => (
                                                    <SwiperSlide key={`v2_${game.game_id || game.report_game_id || i}`} className="overflow-visible">
                                                        <PlayStoreHeroCardV2
                                                            game={game}
                                                            rank={i + 1}
                                                            onPlay={() => handleGameLaunch(game)}
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    </div>
                                )}

                                {/* 2. Last Played Section */}
                                {lastPlayedGames.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-4 mb-1">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center p-2 rounded-xl bg-[#FFCA20]/10 text-[#FFCA20] border border-[#FFCA20]/30 shadow-[0_0_15px_rgba(255,202,32,0.25)]">
                                                    <Clock className="w-4 h-4  shrink-0" />
                                                </span>
                                                <div className="flex flex-col text-start">
                                                    {/* <span className="text-[8px] sm:text-[9px] font-black text-[#DFA208] tracking-[3px] uppercase leading-none mb-1">
                                                        // RESUME PLAY
                                                    </span> */}
                                                    <h2 className="text-base sm:text-lg font-black italic tracking-wider bg-gradient-to-r from-[#2B2B2B] to-[#191919] dark:from-[#FFCA20] dark:via-[#E6B53A] dark:to-[#DFA208] bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)]">
                                                        Last Played
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <Swiper
                                                loop={lastPlayedGames.length > 2}
                                                slidesPerView={1.3}
                                                centeredSlides={true}
                                                spaceBetween={12}
                                                autoplay={{ delay: 4000, disableOnInteraction: false }}
                                                modules={[Autoplay]}
                                            >
                                                {lastPlayedGames.map((game: any, i: number) => (
                                                    <SwiperSlide key={`hero_${game.game_id || game.report_game_id || i}`}>
                                                        <PlayStoreHero
                                                            game={game}
                                                            onPlay={() => handleGameLaunch(game)}
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    </div>
                                )}

                                {/* 3. Play All Section Header */}
                                {playAllGames.length > 0 && (
                                    <div className="flex items-center justify-between px-4 mb-1">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center p-2 rounded-xl bg-[#FFCA20]/10 text-[#FFCA20] border border-[#FFCA20]/30 shadow-[0_0_15px_rgba(255,202,32,0.25)]">
                                                <Gamepad2 className="w-4 h-4 shrink-0" />
                                            </span>
                                            <div className="flex flex-col text-start">
                                                {/* <span className="text-[8px] sm:text-[9px] font-black text-[#DFA208] tracking-[3px] uppercase leading-none mb-1">
                                                    // ARCADE CATALOG
                                                </span> */}
                                                <h2 className="text-base sm:text-lg font-black italic  tracking-wider bg-gradient-to-r from-[#2B2B2B] to-[#191919] dark:from-[#FFCA20] dark:via-[#E6B53A] dark:to-[#DFA208] bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)]">
                                                    Play All
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Repeating Cycles */}
                                {cycles.map((cycle, cIdx) => (
                                    <div key={`cycle_${cycle.id || cIdx}`} className="space-y-6">
                                        {/* PlayStoreAppCard (8 games) - Animate Slide Infinitely */}
                                        {cycle.appCards?.length > 0 && (
                                            <div className="overflow-hidden w-full px-4 pb-1 flex">
                                                <motion.div
                                                    className="flex gap-3 shrink-0"
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
                                                    {cycle.appCards.concat(cycle.appCards).map((g: any, i: number) => (
                                                        <PlayStoreAppCard
                                                            key={`appcard_${g.game_id || i}-${i}`}
                                                            game={g}
                                                            onPlay={() => handleGameLaunch(g)}
                                                        />
                                                    ))}
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* PlayStoreColumnItem (9, 18, 36... games) */}
                                        {cycle.columnItems?.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 px-2 w-full">
                                                {cycle.columnItems.map((g: any, i: number) => (
                                                    <PlayStoreColumnItem
                                                        key={`col_${g.game_id || i}`}
                                                        game={g}
                                                        onPlay={() => handleGameLaunch(g)}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* PlayStoreLandscapeCard (5 games) */}
                                        {cycle.landscapeCards?.length > 0 && (
                                            <div className="w-full">
                                                <Swiper
                                                    loop={cycle.landscapeCards.length > 2}
                                                    slidesPerView={1.5}
                                                    spaceBetween={12}
                                                    // slidesOffsetBefore={16}
                                                    // slidesOffsetAfter={16}
                                                    centeredSlides={true}
                                                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                                                    modules={[Autoplay]}
                                                    className="w-full"
                                                >
                                                    {cycle.landscapeCards.map((g: any, i: number) => (
                                                        <SwiperSlide key={`land_${g.game_id || i}`}>
                                                            <PlayStoreLandscapeCard
                                                                game={g}
                                                                onPlay={() => handleGameLaunch(g)}
                                                            />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        )}

                                        {/* PlayStorePromotedBanner */}
                                        {cycle.bannerGame && (
                                            <div className="px-2">
                                                <PlayStorePromotedBanner
                                                    game={cycle.bannerGame}
                                                    onPlay={() => handleGameLaunch(cycle.bannerGame)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
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