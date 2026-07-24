import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Trophy, Calendar, Clock, Gift, Gamepad2,
  ChevronLeft, ChevronRight, Award, Sword, Medal,
  ArrowLeft,
  CheckCircle2, XCircle, Coins,
  PhoneCall
} from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useTheme } from "next-themes";
import { historyPageApi } from "@/apiServices/igplApi";
import WaitLoader from "./Loader";

function formatDateRange(start: string, end: string) {
  try {
    const s = new Date(start.replace(/-/g, "/"));
    const e = new Date(end.replace(/-/g, "/"));
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return `${start} – ${end}`;
    const opt = { day: "numeric", month: "short" } as const;
    return `${s.toLocaleDateString("en-US", opt)} – ${e.toLocaleDateString("en-US", opt)}`;
  } catch {
    return `${start} – ${end}`;
  }
}

function formatTimeRange(start: string, end: string) {
  try {
    const s = new Date(start.replace(/-/g, "/"));
    const e = new Date(end.replace(/-/g, "/"));
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return `${start} – ${end}`;
    const opt = { hour: "numeric", minute: "2-digit", hour12: true } as const;
    return `${s.toLocaleTimeString("en-US", opt)} – ${e.toLocaleTimeString("en-US", opt)}`;
  } catch {
    return `${start} – ${end}`;
  }
}

function AccentLine() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-[#0b2f5f]/10 dark:via-[#80c7c5]/20 to-transparent opacity-30 mx-4" />
  );
}

function getTournamentStatus(item: any) {
  return "COMPLETED";
}

function StatusBadge({ status }: { status: string }) {
  if (status === "COMPLETED") {
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-full border border-teal-500/40 bg-teal-950/20 dark:bg-[#0c2438]/80 text-teal-500 dark:text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.15)] flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-teal-500 dark:text-teal-400 fill-teal-500/10" />
      </div>
    );
  }
  if (status === "ENDED") {
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-full border border-slate-400/40 bg-slate-100 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 flex-shrink-0">
        <XCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 fill-slate-500/10" />
      </div>
    );
  }
  // ELIMINATED
  return (
    <div className="flex items-center justify-center w-7 h-7 rounded-full border border-red-500/40 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)] flex-shrink-0">
      <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 fill-red-500/10" />
    </div>
  );
}

const LOCAL_IMAGES = [
  "/assets/images/01.png",
  "/assets/images/02.png",
  "/assets/images/03.png",
  "/assets/images/4.png",
  "/assets/images/8.png",
  "/assets/images/9.png"
];

const LIGHT_BANNER_GRADIENTS = [
  "bg-gradient-to-br from-[#FFF5D6] to-[#FFE39F] border-[#FFE180] shadow-[0_4px_12px_rgba(255,202,32,0.12)]",
  "bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] border-[#7DD3FC] shadow-[0_4px_12px_rgba(14,165,233,0.1)]",
  "bg-gradient-to-br from-[#F5F3FF] to-[#DDD6FE] border-[#C4B5FD] shadow-[0_4px_12px_rgba(139,92,246,0.1)]",
  "bg-gradient-to-br from-[#FFF1F2] to-[#FECDD3] border-[#FDA4AF] shadow-[0_4px_12px_rgba(244,63,94,0.1)]",
  "bg-gradient-to-br from-[#ECFDF5] to-[#A7F3D0] border-[#6EE7B7] shadow-[0_4px_12px_rgba(16,185,129,0.1)]"
];

const TournamentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [loading, setLoading] = useState(false);
  const [tournamentHistoryData, setTournamentHistoryData] = useState<any | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await historyPageApi();
        if (res.status === true || res.data) {
          setTournamentHistoryData(res.data || res);
        }
      } catch (e) {
        console.error("Error fetching tournament history:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const tournaments = tournamentHistoryData?.tournamentsList || [];

  const totalCoins = tournaments.reduce((sum: number, t: any) => {
    const type = String(t.fee_reward_type || t.reward_type || "1");
    if (type === "1") return sum + Number(t.player_reward_prize || 0);
    return sum;
  }, 0);

  const totalVouchers = tournaments.reduce((sum: number, t: any) => {
    const type = String(t.fee_reward_type || t.reward_type || "");
    if (type === "2") return sum + Number(t.player_reward_prize || 0);
    return sum;
  }, 0);

  const totalTalktime = tournaments.reduce((sum: number, t: any) => {
    const type = String(t.fee_reward_type || t.reward_type || "");
    if (type === "3") return sum + Number(t.player_reward_prize || 0);
    return sum;
  }, 0);

  const totalWins = tournaments.reduce((sum: number, t: any) => {
    const rank = String(t.player_reward_rank || "0");
    const prize = Number(t.player_reward_prize || 0);
    if ((rank !== "0" && rank !== "00" && rank !== "") || prize > 0) {
      return sum + 1;
    }
    return sum;
  }, 0);

  return (
    <>
      {/* <TopBar /> */}

      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

        <AccentLine />

        {/* ── Premium Glassmorphic Header Card ── */}
        <div className="pb-4">
          <div className=" relative overflow-hidden bg-gradient-to-br from-white/70 to-white/40 dark:from-[#2B2B2B]/40 dark:to-[#191919]/30 backdrop-blur-xl border border-white/40 dark:border-white/[0.06] p-4 flex items-center justify-between gap-3 shadow-[0_3px_1px_rgba(0,0,0,7%)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
            {/* Left side: Titles */}
            <div className="w-full flex justify-between items-center gap-5">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all pointer-events-auto cursor-pointer shrink-0 ${isDark ? "bg-[#32323299] backdrop-blur-md border border-white/10 text-white hover:bg-black/75" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <div >

                <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-800 dark:text-white leading-tight">
                  Tournament History
                </h1>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-muted-foreground mt-1 leading-none">
                  Your past battles & rewards
                </p>

              </div>

              {/* Right side: Modern Trophy Badge */}
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center  bg-yellow-main/5 dark:bg-[#2B2B2B]/80 rounded-xl shadow-[0_0_15px_rgba(254,203,19,0.15)]" onClick={() => navigate("/settingsStatic")}>
                {/* <Trophy className="w-4.5 h-4.5 text-yellow-main fill-yellow-main/10" /> */}
                <img src="/assets/users/1.png" className="w-4.5 h-4.5 text-yellow-main fill-yellow-main/10" alt="1.png" />
              </div>

            </div>


          </div>
        </div>

        {/* ── Stats row ── */}
        {tournaments.length > 0 && (
          <div
            className="overflow-hidden w-full px-4 pb-2.5 flex"
            style={{
              maskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)"
            }}
          >
            <motion.div
              className="flex gap-2.5 shrink-0"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 16,
                repeat: Infinity,
              }}
              style={{
                width: "max-content",
                willChange: "transform"
              }}
            >
              {[
                {
                  val: tournaments.length.toString(),
                  label: "Played",
                  color: "gold",
                  icon: <Gamepad2 className="w-6 h-6 text-yellow-main" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalWins.toString(),
                  label: "Won",
                  color: "gold",
                  icon: <Trophy className="w-6 h-6 text-yellow-main" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalCoins.toLocaleString(),
                  label: "Coins",
                  color: "gold",
                  icon: <img src="/assets/images/img/gold-coin.png" className="w-6 h-6 object-contain" alt="Coins" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalVouchers.toString(),
                  label: "Voucher",
                  color: "gold",
                  icon: <img src="/assets/images/giftkarte.png" className="w-6 h-6 object-contain" alt="Voucher" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalTalktime.toString(),
                  label: "Topup",
                  color: "gold",
                  icon: <PhoneCall className="w-6 h-6 text-yellow-main" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
              ].concat([
                {
                  val: tournaments.length.toString(),
                  label: "Played",
                  color: "gold",
                  icon: <Gamepad2 className="w-6 h-6 text-yellow-main" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalWins.toString(),
                  label: "Won",
                  color: "gold",
                  icon: <Trophy className="w-6 h-6 text-yellow-main" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalCoins.toLocaleString(),
                  label: "Coins",
                  color: "gold",
                  icon: <img src="/assets/images/img/gold-coin.png" className="w-6 h-6 object-contain" alt="Coins" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalVouchers.toString(),
                  label: "Voucher",
                  color: "gold",
                  icon: <img src="/assets/images/giftkarte.png" className="w-6 h-6 object-contain" alt="Voucher" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
                {
                  val: totalTalktime.toString(),
                  label: "Topup",
                  color: "gold",
                  icon: <PhoneCall className="w-6 h-6 text-yellow-main" />,
                  lineColor: "bg-yellow-main",
                  iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                  valColor: "text-slate-800 dark:text-white"
                },
              ]).map(({ val, label, icon, lineColor, valColor }, idx) => {
                const statCardBg = isDark
                  ? "bg-gradient-to-br from-[#2b2b2b6e] to-[#2b2b2b6e] backdrop-blur-xl"
                  : "bg-gradient-to-br from-white/75 to-white/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.03)]";
                const statCardBorder = isDark ? "border border-white/[0.06]" : "border border-slate-200/50 shadow-[1px_1px_0px_1px_rgba(0,0,0,0.12)]";

                return (
                  <div
                    key={`${label}-${idx}`}
                    className={`relative overflow-hidden rounded-2xl ${statCardBorder} ${statCardBg} pt-2 pb-3 px-1 flex flex-col items-center justify-center min-h-[90px] w-[95px] flex-shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.15)] gap-1`}
                  >
                    {/* Top: Circular Icon */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1">
                      {icon}
                    </div>

                    {/* Middle: Value */}
                    <span className={`text-sm sm:text-base font-black ${valColor} tracking-wide leading-none truncate max-w-full px-1`}>
                      {val}
                    </span>

                    {/* Bottom: Label */}
                    <span className="text-[10px] sm:text-[10px] font-black text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
                      {label}
                    </span>

                    {/* Underline Decoration */}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[4px] ${lineColor} rounded-full`} />
                  </div>
                );
              })}
            </motion.div>
          </div>
        )}

        <AccentLine />

        {/* ── Tournament list ── */}
        <div className="px-3 pt-3">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Marcellus&display=swap');
            .font-elegant-serif {
              font-family: 'Cinzel', 'Marcellus', Georgia, serif;
            }
          `}</style>

          {tournaments.length > 0 ? (
            <div className="flex flex-col gap-3.5 max-w-lg mx-auto">
              <AnimatePresence>
                {tournaments.map((item: any, index: number) => {
                  const rank = item.player_reward_rank || "0";
                  const prize = Number(item.player_reward_prize || 0).toLocaleString();

                  let startDateText = "12 May 2024";
                  let startTimeText = "10:00 PM";
                  try {
                    const startD = new Date(item.tournament_start.replace(/-/g, "/"));
                    if (!isNaN(startD.getTime())) {
                      startDateText = startD.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
                      startTimeText = startD.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                    }
                  } catch (e) {
                    console.error("Error formatting start date:", e);
                  }

                  let endDateText = "15 May 2024";
                  let endTimeText = "10:00 PM";
                  try {
                    const endD = new Date(item.tournament_end.replace(/-/g, "/"));
                    if (!isNaN(endD.getTime())) {
                      endDateText = endD.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
                      endTimeText = endD.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                    }
                  } catch (e) {
                    console.error("Error formatting end date:", e);
                  }

                  const status = getTournamentStatus(item);

                  const cardBg = isDark
                    ? "bg-gradient-to-br from-[#6e6e6e6e] to-[#191919]/30 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                    : "bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]";
                  const cardBorder = isDark
                    ? "border border-white/[0.06]"
                    : "border border-slate-200/50";
                  const cardTextColor = "text-slate-800 dark:text-white";

                  return (
                    <motion.div
                      key={item.tournament_id || index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                      onClick={() => {
                        if (item.tournament_id) {
                          navigate("/tournamentPage", {
                            state: { tournament_id: item.tournament_id },
                          });
                        }
                      }}
                      className={`relative w-full rounded-2xl overflow-hidden ${cardBg} ${cardBorder} p-3.5 ${cardTextColor} flex gap-4 transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:shadow-yellow-500/[0.05] dark:hover:shadow-yellow-500/[0.02]`}
                    >
                      {/* Left: Standard Rounded Rectangle Game Cover */}
                      {isDark ? (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                          <img
                            src={LOCAL_IMAGES[index % LOCAL_IMAGES.length]}
                            alt={item.tournament_name}
                            className="w-full h-full object-contain rounded-xl border border-white/2 border-r-2 border-r-yellow-main shadow-md transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-visible rounded-2xl flex items-center justify-center p-1.5 transition-all duration-300 border ${LIGHT_BANNER_GRADIENTS[index % LIGHT_BANNER_GRADIENTS.length]
                          }`}>
                          {/* Soft yellow ambient backdrop glow */}
                          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%] aspect-square rounded-full bg-[#FFCA20]/20 blur-[16px] pointer-events-none z-0" />

                          <img
                            src={LOCAL_IMAGES[index % LOCAL_IMAGES.length]}
                            alt={item.tournament_name}
                            className="relative z-10 w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                            style={{
                              filter: "drop-shadow(0 0 6px rgba(255, 202, 32, 0.55))"
                            }}
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Right: Info details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex flex-col gap-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-white font-semibold tracking-wide">
                            <div className="flex items-center gap-1.5 truncate">
                              <Calendar className="w-3.5 h-3.5 text-yellow-main flex-shrink-0" />
                              <span>Starts: {startDateText} | {startTimeText}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <Calendar className="w-3.5 h-3.5 text-yellow-main flex-shrink-0" />
                              <span>Ends: {endDateText} | {endTimeText}</span>
                            </div>
                          </div>

                          {/* <div className="flex-shrink-0">
                            <StatusBadge status={status} />
                          </div> */}
                        </div>

                        <div className="my-2" />

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[13px] sm:text-[11px] font-bold text-muted-foreground dark:text-slate-200  leading-none mb-1">
                                Rank
                              </span>
                              <span className="text-sm sm:text-base font-bold text-[#14b8a6] dark:text-yellow-main tracking-wide">
                                #{rank}
                              </span>
                            </div>

                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] sm:text-[11px] font-bold text-muted-foreground dark:text-slate-200  leading-none mb-1">
                                Reward
                              </span>
                              <div className="flex items-center gap-1">
                                {String(item.fee_reward_type || item.reward_type) === "2" ? (
                                  <>
                                    <img src="/assets/images/img/giftkarte.png" className="w-4 h-4 object-contain flex-shrink-0" alt="Voucher" />
                                    <span className="text-xs sm:text-sm font-black text-purple-600 dark:text-purple-400 leading-none truncate">
                                      {prize} Voucher
                                    </span>
                                  </>
                                ) : String(item.fee_reward_type || item.reward_type) === "3" ? (
                                  <>
                                    <Award className="w-4 h-4 text-yellow-main flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 leading-none truncate">
                                      Rs {prize}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <img
                                      src="/assets/images/img/gold-coin.png"
                                      alt="coin"
                                      className="w-4 h-4 object-contain flex-shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                      }}
                                    />
                                    <span className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-none truncate">
                                      {prize}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>



                          </div>

                          {/* <div className="flex flex-col">
                            <span className="text-[11px] sm:text-[11px] font-black text-slate-400 dark:text-slate-200  leading-none mb-1">
                              Category
                            </span>
                            <span className="text-sm sm:text-base font-bold text-[#14b8a6] dark:text-yellow-main tracking-wide">
                              Arcade
                            </span>
                          </div> */}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-black/[0.01] dark:bg-[#2B2B2B]/20 backdrop-blur-sm border border-slate-200/50 dark:border-white/[0.06] rounded-2xl p-8 text-center shadow-sm dark:shadow-none"
              >
                <div className="w-14 h-14 bg-slate-100 dark:bg-black/35 backdrop-blur-md border border-slate-200 dark:border-white/20 text-yellow-main rounded-[14px] flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-7 h-7 text-yellow-main" />
                </div>
                <h3 className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-[1px] mb-2">
                  {t.noTournaments || "No Tournament History"}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 dark:text-[#4a7a9b] tracking-wide mb-5 px-4 leading-relaxed">
                  {t.noTournamentsDesc ||
                    "You haven't participated in any tournaments yet. Join one and win rewards!"}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#fecb13] hover:bg-[#e0b20f] text-[#07192e] text-[10px] font-black tracking-[1.5px] uppercase rounded-xl px-6 py-2.5 active:scale-95 transition-transform"
                >
                  {t.exploreGames || "Explore Tournaments"}
                </button>
              </motion.div>
            )
          )}
        </div>
      </div>

      <BottomNavBar />
      {loading && <WaitLoader isOverlay />}
    </>
  );
};

export default TournamentHistory;