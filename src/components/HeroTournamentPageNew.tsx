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
  Coins,
  AlertCircle,
  X,
  Play
} from "lucide-react";
import { useTheme } from "next-themes";
import { fetchLiveTournament, playLiveTournament } from "@/apiServices/igplApi";
import GameViewerNew from "./GameViewerNew";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";

const HeroTournamentPageNew: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Retrieve tournament ID from router state
  const stateData = location.state as { tournament_id: any } | null;
  const tournament_id = stateData?.tournament_id;

  // Local state variables
  const [loading, setLoading] = useState<boolean>(true);
  const [liveTournamentData, setLiveTournamentData] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [playURL, setPlayURL] = useState<string>("");
  const [gamePlayData, setGamePlayData] = useState<any | null>(null);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [leaderboardMessage, setLeaderboardMessage] = useState<string>("");
  const [launchingGame, setLaunchingGame] = useState<boolean>(false);

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

  // Fetch Live Tournament Data
  const getLiveTournamentData = async (showSpinner = true) => {
    if (!tournament_id) return;
    if (showSpinner) setLoading(true);
    try {
      const response = await fetchLiveTournament(tournament_id);
      if (response?.status) {
        setLiveTournamentData(response.data);
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    if (tournament_id) {
      getLiveTournamentData();
    } else {
      setLoading(false);
    }
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

  // Launch live tournament gameplay API
  const handlePlayLiveTournament = async () => {
    if (launchingGame) return;
    setLaunchingGame(true);
    try {
      const tournamentIdVal = liveTournamentData?.tournamentInfo?.tournament_id;
      const gameboostIdVal = liveTournamentData?.tournamentInfo?.game_gameboost_id;

      if (!tournamentIdVal || !gameboostIdVal) return;

      const response = await playLiveTournament(tournamentIdVal);
      if (response.status) {
        setGamePlayData(response?.data);
        setPlayURL(
          `https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${response?.data?.player_profile_id}&gameid=${gameboostIdVal}`
        );
        setSelectedGame(liveTournamentData);
      }
    } catch (error) {
      console.error("Error playing live tournament:", error);
    } finally {
      setLaunchingGame(false);
    }
  };

  // Leaderboard redirection logic
  const navigateToLeaderBoard = () => {
    if (liveTournamentData?.joined) {
      setLeaderboardMessage("");
      navigate("/leaderboard", {
        state: {
          game: tournament_id,
        },
      });
    } else {
      setLeaderboardMessage("First Join the tournament");
    }
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
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 max-w-md mx-auto relative pb-8 shadow-2xl">

        {/* ─── LOADING SKELETON STATE ─── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background z-50 flex flex-col p-4 space-y-6"
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
              <div className="h-40 bg-muted/20 rounded-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── MAIN CONTENT VIEW ─── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col"
          >
            {/* 1. Dynamic Banner Image Header */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
              <img
                src={info?.game_image_url || "/assets/images/img/game-placeholder.png"}
                alt="Tournament Banner"
                className="w-full h-full object-cover cursor-pointer hover:scale-102 transition-transform duration-700"
                onClick={handlePlayLiveTournament}
              />
              {/* Gradient shadow overlay for clean reading */}
              <div className="absolute inset-0" />

              {/* Glassmorphic floating control buttons */}
              <div className="absolute inset-x-0 top-0 p-3 flex justify-between items-center z-10">
                <button
                  onClick={handleClickBack}
                  className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 active:scale-95 transition-all flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleShowModal}
                  className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 active:scale-95 transition-all text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-[var(--primary)]" />
                  <span>How to Play ?</span>
                </button>
              </div>

              {/* Float badge for joined status */}
              {liveTournamentData?.joined && (
                <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/20 shadow-md">
                  Joined
                </div>
              )}
            </div>

            <div className="px-3.5 space-y-5 mt-4">

              {/* 2. Timer Section */}
              <div className="bg-card/45 backdrop-blur-md border border-border/80 rounded-3xl p-5 flex flex-col items-center shadow-lg relative overflow-hidden">
                {/* Background gradient decorative glow */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-secondary/10 rounded-full blur-xl pointer-events-none animate-pulse" />

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4 text-[hsl(var(--primary))] dark:text-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span>Tournament Ends In</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5 w-full max-w-xs justify-center">
                  {/* Days */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-16 bg-card border border-border/60 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-[50%] bg-white/5 dark:bg-black/5 border-b border-border/30" />
                      <span className="relative z-10 text-2xl font-black font-mono tracking-tighter text-foreground">
                        {timeLeft.days}
                      </span>
                    </div>
                    <span className="text-[8px] text-muted-foreground font-black tracking-widest uppercase mt-2">Days</span>
                  </div>
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-16 bg-card border border-border/60 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-[50%] bg-white/5 dark:bg-black/5 border-b border-border/30" />
                      <span className="relative z-10 text-2xl font-black font-mono tracking-tighter text-foreground">
                        {timeLeft.hours}
                      </span>
                    </div>
                    <span className="text-[8px] text-muted-foreground font-black tracking-widest uppercase mt-2">Hours</span>
                  </div>
                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-16 bg-card border border-border/60 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-[50%] bg-white/5 dark:bg-black/5 border-b border-border/30" />
                      <span className="relative z-10 text-2xl font-black font-mono tracking-tighter text-foreground">
                        {timeLeft.minutes}
                      </span>
                    </div>
                    <span className="text-[8px] text-muted-foreground font-black tracking-widest uppercase mt-2">Mins</span>
                  </div>
                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-16 bg-card border border-border/60 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-[50%] bg-white/5 dark:bg-black/5 border-b border-border/30" />
                      <span className="relative z-10 text-2xl font-black font-mono tracking-tighter text-[#fecb13] dark:text-[#fecb13] drop-shadow-[0_0_8px_rgba(254,203,19,0.3)] animate-pulse">
                        {timeLeft.seconds}
                      </span>
                    </div>
                    <span className="text-[8px] text-muted-foreground font-black tracking-widest uppercase mt-2">Secs</span>
                  </div>
                </div>
              </div>

              {/* 3. Action Play Button */}
              <div className="text-center py-1">
                <button
                  disabled={launchingGame}
                  onClick={handlePlayLiveTournament}
                  className="w-full max-w-xs mx-auto py-4 px-8 bg-[#fecb13] hover:bg-[#e0b20f] active:scale-95 text-[#0b2f5f] font-black uppercase rounded-full shadow-[0_4px_25px_rgba(254,203,19,0.35)] transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wider"
                >
                  {launchingGame ? (
                    <div className="w-5 h-5 border-2 border-[#0b2f5f] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Play & Win</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4. Details Information Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Entry Fee card */}
                <div className="bg-card border border-border/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:border-primary/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <img
                      src="/assets/images/img/gold-coins.png"
                      alt="Gold Coins"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider leading-none mb-1">
                      Entry Fee
                    </span>
                    <span className="text-xs font-black text-foreground truncate">
                      {info?.fee_fee !== "0" ? (
                        <>
                          <span className="text-emerald-500 font-extrabold">{info?.fee_fee}</span> Coins
                        </>
                      ) : (
                        <span className="text-emerald-500 font-extrabold">Free Join</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Win up to card */}
                <div className="bg-card border border-border/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:border-primary/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <img
                      src="/assets/images/img/gold-coin.png"
                      alt="Gold Coin"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider leading-none mb-1">
                      Win Up To
                    </span>
                    <span className="text-xs font-black text-foreground truncate">
                      <span className="text-amber-400 font-extrabold">{info?.fee_prize_1 || 0}</span> {rewardTypeLabel()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Rank Status Panel */}
              <div className="bg-card/45 border border-border/80 rounded-2xl p-4 shadow-md flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:border-primary/25">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>

                <div className="flex-1 min-w-0">
                  {liveTournamentData?.joined ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                        <span>Your Rank:</span>
                        <span className="text-amber-400 font-black text-sm">#{liveTournamentData?.myRank || 0}</span>
                      </div>
                      <button
                        onClick={navigateToLeaderBoard}
                        className="text-left text-[10px] text-primary hover:text-amber-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-0.5 active:translate-x-0.5 transition-transform"
                      >
                        View Leaderboard
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      {leaderboardMessage && (
                        <span className="text-[9px] font-bold text-destructive mt-1 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{leaderboardMessage}</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-foreground">
                        Not played yet
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-muted-foreground/80 flex-shrink-0" />
                        Play game to join the Leaderboard!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Rewards payout Table */}
              {liveTournamentData?.rewardRanksList?.length > 0 && (
                <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 px-4 py-3.5 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-foreground m-0">
                      Leaderboard Payout Rewards
                    </h4>
                  </div>

                  <div className="divide-y divide-border/40">
                    {liveTournamentData.rewardRanksList.map((item: any, idx: number) => {
                      const isTopThree = idx < 3;
                      const rankTextClass =
                        idx === 0 ? "text-yellow-400 font-black" :
                          idx === 1 ? "text-slate-300 font-black" :
                            idx === 2 ? "text-amber-600 font-black" : "text-foreground font-semibold";

                      return (
                        <div
                          key={idx}
                          className="px-4 py-3 flex items-center justify-between hover:bg-white/5 dark:hover:bg-black/5 transition-colors duration-150"
                        >
                          <div className="flex items-center gap-2">
                            {isTopThree && (
                              <span className={`text-xs ${idx === 0 ? "text-yellow-400" :
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
                            <span className="text-xs font-extrabold text-foreground">
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

export default HeroTournamentPageNew;
