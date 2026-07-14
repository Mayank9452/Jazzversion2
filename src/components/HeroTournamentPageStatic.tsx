import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    HelpCircle,
    Clock,
    Trophy,
    ChevronRight,
    Lock,
    Unlock,
    Coins,
    AlertCircle,
    X,
    Play,
    Gamepad2,
    Users
} from "lucide-react";
import { useTheme } from "next-themes";
import { fetchLiveTournament, playLiveTournament } from "@/apiServices/igplApi";
import GameViewerNew from "./GameViewerNew";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import LeaderboardJoinPopup from "./LeaderboardJoinPopup";

const HeroTournamentPageStatic: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Retrieve tournament ID from router state
    const stateData = location.state as { tournament_id: any; fromMixedTesting2?: boolean } | null;
    const tournament_id = stateData?.tournament_id;
    const fromMixedTesting2 = stateData?.fromMixedTesting2 || false;

    // Local state variables
    const [loading, setLoading] = useState<boolean>(true);
    const [liveTournamentData, setLiveTournamentData] = useState<any | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [playURL, setPlayURL] = useState<string>("");
    const [gamePlayData, setGamePlayData] = useState<any | null>(null);
    const [selectedGame, setSelectedGame] = useState<any | null>(null);
    const [leaderboardMessage, setLeaderboardMessage] = useState<string>("");
    const [launchingGame, setLaunchingGame] = useState<boolean>(false);
    const [joined, setJoined] = useState<boolean>(false);
    const [isLeaderboardPopupOpen, setIsLeaderboardPopupOpen] = useState<boolean>(false);

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    // Modal Handlers
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Fetch Live Tournament Data (Static Mock)
    const getLiveTournamentData = async (showSpinner = true) => {
        if (showSpinner) setLoading(true);
        try {
            // Mock API network latency
            await new Promise((resolve) => setTimeout(resolve, 600));
            const future = new Date();
            future.setDate(future.getDate() + 3);

            const mockData = {
                joined: false,
                myRank: 4,
                tournamentInfo: {
                    tournament_id: tournament_id || "static-1",
                    game_name: "Pistol Bottle Battle",
                    game_gameboost_id: "stick-monkey",
                    game_image_url: "/assets/images/pistol-bottle.png",
                    fee_fee: "10",
                    fee_prize_1: "10,000",
                    fee_reward_type: "1",
                    game_help: encodeURIComponent("Tap to aim at the target bottles. Release to shoot. Hit golden bottles to get double points. Avoid shooting the bombs! You have 60 seconds to score as high as possible."),
                    game_description: "An arcade shooting game where you target and break bottles.",
                    tournament_end: future.toISOString(),
                    game_screen: "1" // Portrait
                },
                rewardRanksList: [
                    { rank: "1", prize: "5,000" },
                    { rank: "2", prize: "2,500" },
                    { rank: "3", prize: "1,200" },
                    { rank: "4 - 10", prize: "500" },
                    { rank: "11 - 50", prize: "100" }
                ]
            };
            setLiveTournamentData(mockData);
            setJoined(mockData.joined);
        } catch (error) {
            console.error("Error loading tournament:", error);
        } finally {
            if (showSpinner) setLoading(false);
        }
    };

    useEffect(() => {
        getLiveTournamentData();
    }, [tournament_id]);

    // Countdown Timer Hook
    useEffect(() => {
        const endString = liveTournamentData?.tournamentInfo?.tournament_end;
        if (!endString) return;

        const endTime = new Date(endString).getTime();
        if (isNaN(endTime)) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
            });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [liveTournamentData?.tournamentInfo?.tournament_end]);

    // Format the game rules/instructions text
    const formatGameHelp = (helpText: string | undefined) => {
        if (!helpText) return "Loading instructions...";
        try {
            return decodeURIComponent(helpText)
                .replace(/[^a-zA-Z0-9.,!?:\-\s]/g, " ") // Clean up layout strings safely
                .replace(/\s+/g, " ")
                .trim();
        } catch (e) {
            return helpText.replace(/\s+/g, " ").trim();
        }
    };

    // Launch live tournament gameplay API (Static)
    const handlePlayLiveTournament = async () => {
        if (launchingGame) return;
        setLaunchingGame(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            setGamePlayData({
                player_profile_id: "static-player-123"
            });
            setPlayURL(
                `https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=static-player-123&gameid=stick-monkey`
            );
            setSelectedGame({
                tournamentInfo: {
                    game_name: "Pistol Bottle Battle",
                    game_screen: "1"
                }
            });
        } catch (error) {
            console.error("Error starting game:", error);
        } finally {
            setLaunchingGame(false);
        }
    };

    // Leaderboard redirection logic (Static)
    const navigateToLeaderBoard = () => {
        setLeaderboardMessage("");
        navigate("/leaderboard", {
            state: {
                game: tournament_id || "static-1",
            },
        });
    };

    // Back action navigation
    const handleClickBack = () => {
        navigate(-1);
    };

    // Safe checks for metadata fields
    const info = liveTournamentData?.tournamentInfo;
    const rewardTypeLabel = () => {
        if (!info) return "Rewards";
        switch (String(info.fee_reward_type)) {
            case "1":
                return "Reward Coins";
            case "2":
                return "Top Up";
            case "3":
                return "GB";
            default:
                return "Rewards";
        }
    };

    return (
        <>
            {/* <TopBar /> */}
            <div className="bg-[#0c0f1d] text-foreground transition-colors duration-300 max-w-md mx-auto relative shadow-2xl overflow-y-auto overflow-x-hidden">
                {/* Full Screen Background Ambient Blur */}
                {!loading && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src="/assets/images/02.png"
                            alt="Background ambient blur"
                            className="w-full h-full object-cover blur-3xl opacity-15"
                        />
                    </div>
                )}

                {/* ─── LOADING SKELETON STATE ─── */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0c0f1d] z-50 flex flex-col p-4 space-y-6"
                        >
                            {/* Header placeholder */}
                            <div className="relative aspect-[16/10] bg-muted/40 rounded-2xl animate-pulse flex items-center justify-between p-4">
                                <div className="w-10 h-10 bg-muted/50 rounded-xl" />
                                <div className="w-24 h-6 bg-muted/50 rounded-lg" />
                            </div>
                            {/* Timer placeholder */}
                            <div className="h-28 bg-muted/20 border border-border/30 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3">
                                <div className="w-32 h-4 bg-muted/40 rounded animate-pulse" />
                                <div className="flex gap-3 justify-center w-full">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-14 h-12 bg-muted/30 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                            {/* Button placeholder */}
                            <div className="w-56 h-12 bg-muted/40 rounded-full animate-pulse mx-auto" />
                            {/* Cards placeholder */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="h-20 bg-muted/20 border border-border/20 rounded-2xl" />
                                <div className="h-20 bg-muted/20 border border-border/20 rounded-2xl" />
                            </div>
                            {/* Leaderboard panel placeholder */}
                            <div className="h-16 bg-muted/25 rounded-2xl" />
                            {/* Table placeholder */}
                            <div className="h-40 bg-[#12162a]/20 rounded-2xl" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── MAIN CONTENT VIEW ─── */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full flex flex-col relative z-10"
                    >
                        {/* 1. Complete Image Banner Header - Full Width, Native Aspect ratio */}
                        <div className="relative w-full aspect-[285/380] bg-slate-950 flex items-center justify-center border-b border-white/10">
                            {/* Complete Image */}
                            <img
                                src="/assets/images/02.png"
                                alt="Tournament Banner"
                                className="w-full h-full object-contain"
                            />
                            {/* Floating control buttons */}
                            <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between z-20 w-full">
                                <button
                                    onClick={handleClickBack}
                                    className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/75 active:scale-95 transition-all flex items-center justify-center text-white shadow-md pointer-events-auto cursor-pointer shrink-0"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>

                                <h2 className="text-base font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center px-2 truncate max-w-[200px] select-none">
                                    {info?.game_name || "Pistol Bottle Battle"}
                                </h2>

                                <div className="w-10" />
                            </div>
                        </div>

                        {/* Glassmorphic Content overlapping the bottom 20% of the image header container */}
                        <div className="px-2 -mt-[58%] relative z-20 space-y-5">
                            <div className="rounded-3xl bg-slate-900/60 dark:bg-black/60 backdrop-blur-[2px] border border-white/20 shadow-2xl p-5 space-y-5 relative">
                                {/* Play Button floating on top right, overlapping bottom of image banner header */}
                                <button
                                    onClick={handlePlayLiveTournament}
                                    className="absolute -top-6 right-6 h-10 px-4 rounded-[2rem] bg-gradient-to-r from-[#ffd43f] to-[#ffb800] text-[#0b2f5f] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 z-30 cursor-pointer border-none font-black text-base"
                                    style={{ animationDuration: "3s" }}
                                >
                                    <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                                    <span>Play</span>
                                </button>

                                {/* Title (Centered) */}
                                {/* <div className="flex justify-center items-center border-b border-white/5 pb-3">
                                    <h2 className="text-xl font-black text-white text-center drop-shadow-md">
                                        {info?.game_name || "Pistol Bottle Battle"}
                                    </h2>
                                </div> */}

                                {/* Stats Grid row (Prize Pool, Leaderboard, Players Joined) */}
                                <div className="grid grid-cols-3 gap-1 bg-[#12162a]/65 backdrop-blur-md border border-white/5 rounded-2xl p-2 text-center">
                                    {/* Prize Pool Column */}
                                    <div className="flex flex-col items-center justify-center">
                                        <Trophy className="w-4 h-4 text-[#ffc200] mb-1" />
                                        <span className="text-sm font-black text-[#ffc200]">10000</span>
                                        <span className="text-xs text-white/50 font-bold mt-0.5">Prize Pool</span>
                                    </div>
                                    {/* Leaderboard Column */}
                                    <button
                                        onClick={() => {
                                            if (fromMixedTesting2) {
                                                navigate("/leaderboardPageStatic");
                                            } else {
                                                if (joined) {
                                                    navigateToLeaderBoard();
                                                } else {
                                                    setIsLeaderboardPopupOpen(true);
                                                }
                                            }
                                        }}
                                        className="flex flex-col items-center justify-center border-x border-white/5 w-full hover:bg-white/5 active:scale-95 transition-all py-1 border-none bg-transparent cursor-pointer"
                                    >
                                        <img src="/assets/images/img/trophy.png" className="w-9 h-9 object-contain mb-1" alt="Leaderboard" />
                                        <span className="text-xs text-white/50 font-bold mt-0.5">Leaderboard</span>
                                    </button>
                                    {/* Players Joined Column */}
                                    <div className="flex flex-col items-center justify-center">
                                        <Users className="w-4 h-4 text-[#ffc200] mb-1" />
                                        <span className="text-sm font-black text-white">200</span>
                                        <span className="text-xs text-white/50 font-bold mt-0.5">Players Joined</span>
                                    </div>
                                </div>

                                {/* Full-width Tournament Timer Badge */}
                                <div className="bg-[#12162a]/65 backdrop-blur-md border border-white/5 rounded-2xl p-2.5 flex items-center justify-between px-3">
                                    <div className="flex items-center gap-1 text-xs text-white/80 shrink-0">
                                        <Clock className="w-3.5 h-3.5 text-[#ffc200]" />
                                        <span className="font-bold">Ends In</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-base font-black text-white font-mono">
                                        <span className="bg-white/5 px-2 py-2 rounded border border-white/5">{timeLeft.days}d</span>
                                        <span className="text-white/40 mx-0.5">:</span>
                                        <span className="bg-white/5 px-2 py-2 rounded border border-white/5">{timeLeft.hours}h</span>
                                        <span className="text-white/40 mx-0.5">:</span>
                                        <span className="bg-white/5 px-2 py-2 rounded border border-white/5">{timeLeft.minutes}m</span>
                                        <span className="text-white/40 mx-0.5">:</span>
                                        <span className="bg-white/5 px-2 py-2 rounded border border-white/5 text-[#ffc200]">{timeLeft.seconds}s</span>
                                    </div>
                                </div>

                                {/* About Tournament Description & How to Play */}
                                <div className="space-y-1.5">
                                    <h3 className="text-xs font-black uppercase text-[#ffc200] tracking-wider">How to Play</h3>
                                    <div className="text-xs text-white/80 leading-relaxed font-medium bg-[#12162a]/40 border border-white/5 rounded-2xl p-3.5 space-y-3">
                                        {/* <p>
                                            {(info?.game_description !== "" && formatGameHelp(info?.game_description)) || "An arcade shooting game where you target and break bottles. Test your accuracy!"}
                                        </p> */}
                                        <div className="">
                                            {/* <span className="text-[10px] font-black uppercase tracking-wider text-[#ffc200] block mb-1">Gameplay Instructions</span> */}
                                            <p className="text-white/70 text-xs">
                                                {(info?.game_help !== "" && formatGameHelp(info?.game_help)) || "Tap to aim at the target bottles. Release to shoot. Hit golden bottles to get double points. Avoid shooting the bombs! You have 60 seconds to score as high as possible."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Standings rankings card */}
                                <div className="space-y-1.5">
                                    <h3 className="text-xs font-black uppercase text-[#ffc200] tracking-wider">Your Rank</h3>
                                    <div className="bg-[#12162a]/55 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                                                {/* <Trophy className="w-5 h-5 text-[#ffc200]" /> */}
                                                <img src="/assets/images/img/trophy.png" className="w-10 h-10 object-contain" alt="Leaderboard" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Your Position</span>
                                                <span className="text-xs font-black text-white mt-0.5">
                                                    {fromMixedTesting2 ? "4" : (joined ? `Rank #${liveTournamentData?.myRank || 4}` : "Not Joined")}
                                                </span>
                                            </div>
                                        </div>
                                        {/* {joined ? (
                                            <button
                                                onClick={navigateToLeaderBoard}
                                                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-bold text-[#ffc200] uppercase tracking-wider flex items-center gap-0.5 transition-colors cursor-pointer border-none"
                                            >
                                                Leaderboard
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setIsLeaderboardPopupOpen(true)}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 active:scale-95 transition-all cursor-pointer"
                                                title="View Leaderboard"
                                            >
                                                <img src="/assets/images/img/trophy.png" className="w-5 h-5 object-contain" alt="Leaderboard" />
                                            </button>
                                        )} */}
                                        <button
                                            onClick={() => {
                                                if (fromMixedTesting2) {
                                                    navigate("/leaderboardPageStatic");
                                                } else {
                                                    setIsLeaderboardPopupOpen(true);
                                                }
                                            }}
                                            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-[#ffc200] tracking-[0.5px] flex items-center gap-0.5 transition-colors cursor-pointer border-none"
                                        >
                                            Leaderboard
                                            {fromMixedTesting2 ? (
                                                <Unlock className="w-3.5 h-3" />
                                            ) : (
                                                <Lock className="w-3.5 h-3" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Rewards Rank payouts */}
                                {liveTournamentData?.rewardRanksList?.length > 0 && (
                                    <div className="space-y-1.5">
                                        <h3 className="text-xs font-black uppercase text-[#ffc200] tracking-wider">Reward Distribution</h3>
                                        <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#12162a]/45 divide-y divide-white/5">
                                            {liveTournamentData.rewardRanksList.map((item: any, idx: number) => {
                                                const isTopThree = idx < 3;
                                                const rankTextClass =
                                                    idx === 0 ? "text-[#ffc200] font-black" :
                                                        idx === 1 ? "text-slate-300 font-black" :
                                                            idx === 2 ? "text-amber-600 font-black" : "text-white/80 font-semibold";

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors duration-150"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {isTopThree && (
                                                                <span className={`text-xs ${idx === 0 ? "text-[#ffc200]" :
                                                                    idx === 1 ? "text-slate-300" : "text-amber-600"
                                                                    }`}>
                                                                    ●
                                                                </span>
                                                            )}
                                                            <span className={`text-xs ${rankTextClass}`}>
                                                                Rank {item?.rank}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs font-extrabold text-white">
                                                                {item?.prize}
                                                            </span>
                                                            <img
                                                                src="/assets/images/img/gold-coin.png"
                                                                width="14"
                                                                height="14"
                                                                alt="Coin"
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── CUSTOM INSTRUCTION MODAL ─── */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Blurred dark backdrop overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleCloseModal}
                                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            />

                            {/* Modal Box */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                                className="bg-card border border-border w-full max-w-sm rounded-3xl p-5 shadow-2xl relative overflow-hidden text-foreground z-10 flex flex-col"
                            >
                                {/* Glow accent decoration */}
                                <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="flex justify-between items-center border-b border-border/50 pb-3 mb-3 relative z-10">
                                    <div className="flex items-center gap-1.5">
                                        <HelpCircle className="w-5 h-5 text-primary" />
                                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                                            How to Play
                                        </h3>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className="w-8 h-8 rounded-lg bg-muted/40 hover:bg-muted/80 flex items-center justify-center border border-border text-foreground/80 hover:text-foreground transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Instructions text */}
                                <div className="text-xs font-semibold leading-relaxed max-h-60 overflow-y-auto pr-1 text-foreground/90 relative z-10">
                                    {(info?.game_help !== "" &&
                                        formatGameHelp(info?.game_help)) ||
                                        (info?.game_description !== "" &&
                                            formatGameHelp(info?.game_description)) ||
                                        "No rules specified. Start playing to learn!"}
                                </div>

                                {/* Footer action */}
                                <div className="mt-5 relative z-10">
                                    <button
                                        onClick={handleCloseModal}
                                        className="w-full py-2.5 bg-primary text-primary-foreground font-extrabold uppercase rounded-xl hover:bg-primary/95 text-xs transition-all shadow-md active:scale-98"
                                    >
                                        Understood
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ─── LEADERBOARD JOIN POPUP ─── */}
                <LeaderboardJoinPopup
                    isOpen={isLeaderboardPopupOpen}
                    onClose={() => setIsLeaderboardPopupOpen(false)}
                    onJoin={() => {
                        setJoined(true);
                    }}
                />

                {/* ─── LIVE GAMEPLAY VIEWER MODAL ─── */}
                {selectedGame && (
                    <GameViewerNew
                        fromGame={false}
                        url={playURL}
                        name={selectedGame?.tournamentInfo?.game_name}
                        orientation={
                            selectedGame?.tournamentInfo?.game_screen === "1"
                                ? "Portrait"
                                : "Landscape"
                        }
                        onClose={() => {
                            getLiveTournamentData(false); // Refresh silently on close
                            setSelectedGame(null);
                        }}
                        game={gamePlayData}
                    />
                )}
            </div>
            <BottomNavBar />
        </>
    );
};

export default HeroTournamentPageStatic;
