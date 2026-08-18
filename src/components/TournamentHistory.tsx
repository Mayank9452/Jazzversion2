import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Trophy, Calendar, Clock, Gift, Gamepad2,
  ChevronLeft, ChevronRight, Award, Sword, Medal,
  ArrowLeft,
  CheckCircle2, XCircle, Coins,
  Smartphone
} from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useTheme } from "next-themes";
import { historyPageApi } from "@/apiServices/igplApi";
import WaitLoader from "./Loader";
const Currency = "Rs";

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

// const TopupIcon = ({ className = "w-6 h-6" }: { className?: string }) => {
//   return (
//     <div className={`relative ${className} flex items-center justify-center`}>
//       <Smartphone
//         className="w-full h-full text-yellow-main"
//         strokeWidth={2.5}
//       />
//       <svg
//         className="absolute inset-0 w-full h-full"
//         viewBox="0 0 80 80"
//       >
//         <text
//           x="40"
//           y="48"
//           textAnchor="middle"
//           fill="#FACC15"
//           fontSize="24"
//           fontWeight="900"
//         >
//           ₨
//         </text>
//       </svg>
//     </div>
//   );
// };


const TopupIcon = ({ className = "w-6 h-6" }: { className?: string }) => {
  const color = "#ffca20";

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 80 80"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mobile Outline */}
        <rect
          x="12"
          y="3"
          width="48"
          height="74"
          rx="6"
          stroke={color}
          strokeWidth="5"
        />

        {/* Top Speaker / Camera */}
        <rect
          x="31"
          y="7"
          width="10"
          height="2.5"
          rx="1.25"
          fill={color}
        />

        {/* Top Bezel Divider */}
        <path
          d="M12 12H60"
          stroke={color}
          strokeWidth="5"
        />

        {/* Bottom Bezel Divider */}
        <path
          d="M12 68H60"
          stroke={color}
          strokeWidth="5"
        />

        {/* Speed / Power Lines */}
        <rect
          x="30"
          y="31"
          width="10"
          height="2.5"
          rx="1.25"
          fill={color}
        />

        <rect
          x="26"
          y="39"
          width="14"
          height="2.5"
          rx="1.25"
          fill={color}
        />

        <rect
          x="30"
          y="47"
          width="10"
          height="2.5"
          rx="1.25"
          fill={color}
        />

        {/* Floating Circle */}
        <circle
          cx="61"
          cy="40"
          r="14"
          fill="black"
          stroke={color}
          strokeWidth="5"
        />

        {/* Lightning Bolt */}
        <path
          d="
            M63 31
            L56 40.5
            H61
            L58.5 50
            L66 39
            H62
            L64.5 31
            Z
          "
          fill={color}
        />
      </svg>
    </div>
  );
};


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
  const avatar = localStorage.getItem("selectedAvatarImg") || "9.png";
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

  function formatShortNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }

  const formatNumberInText = (text: string) => {
    if (!text) return "";
    return text.replace(/\d+/g, (match) => Number(match).toLocaleString('en-IN'));
  };

  const displayPlayed = 100000;
  const displayWins = 500000;
  const displayCoins = 10000000;
  const displayVouchers = 1000000;
  const displayTalktime = 2000000;

  return (
    <>
      {/* <TopBar /> */}

      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 mb-8">

        <AccentLine />

        {/* ── Premium Glassmorphic Header Card ── */}
        <div className="pb-4">
          <div className=" relative overflow-hidden bg-gradient-to-br from-white/70 to-white/40 dark:from-[#2B2B2B]/40 dark:to-[#191919]/30 backdrop-blur-xl border border-white/40 dark:border-white/[0.06] p-2 pr-1 flex items-center justify-between gap-3 shadow-[0_3px_1px_rgba(0,0,0,7%)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
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

              <div
                className="w-16 h-16 -my-2 flex-shrink-0 flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:scale-105"
                onClick={() => navigate("/settingsStatic")}
              >
                <img
                  src={`/assets/users/${avatar}`}
                  className="w-full h-full object-contain"
                  alt="User Avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/users/9.png";
                  }}
                />
              </div>

            </div>


          </div>
        </div>

        {/* ── Stats row 1 (Bigger Numbers, slides) ── */}
        <div
          className="overflow-hidden w-full px-4 pb-1.5 flex"

        >
          <motion.div
            className="flex gap-2.5 shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 18,
              repeat: Infinity,
            }}
            style={{
              width: "max-content",
              willChange: "transform"
            }}
          >
            {[
              {
                val: formatNumberInText(displayPlayed.toString()),
                label: "Played",
                color: "gold",
                icon: <Gamepad2 className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: formatNumberInText(displayWins.toString()),
                label: "Won",
                color: "gold",
                icon: <Trophy className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: formatNumberInText(displayCoins.toString()),
                label: "Coins",
                color: "gold",
                icon: <Coins className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: `${Currency} ${formatNumberInText(displayVouchers.toString())}`,
                label: "Giftkarte",
                color: "gold",
                icon: <Gift className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: `${Currency} ${formatNumberInText(displayTalktime.toString())}`,
                label: "Topup",
                color: "gold",
                icon: <TopupIcon className="w-6 h-6" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
            ].concat([
              {
                val: formatNumberInText(displayPlayed.toString()),
                label: "Played",
                color: "gold",
                icon: <Gamepad2 className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: formatNumberInText(displayWins.toString()),
                label: "Won",
                color: "gold",
                icon: <Trophy className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: formatNumberInText(displayCoins.toString()),
                label: "Coins",
                color: "gold",
                icon: <Coins className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: `${Currency} ${formatNumberInText(displayVouchers.toString())}`,
                label: "Giftkarte",
                color: "gold",
                icon: <Gift className="w-6 h-6 text-yellow-main" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
              {
                val: `${Currency} ${formatNumberInText(displayTalktime.toString())}`,
                label: "Topup",
                color: "gold",
                icon: <TopupIcon className="w-6 h-6" />,
                lineColor: "bg-yellow-main",
                iconBg: "bg-yellow-main/20 border border-yellow-main/30",
                valColor: "text-slate-800 dark:text-white"
              },
            ]).map(({ val, label, icon, lineColor, valColor }, idx) => {
              const statCardBg = isDark
                ? "bg-gradient-to-br from-[#2b2b2b6e] to-[#2b2b2b6e]"
                : "bg-gradient-to-br from-white/75 to-white/35 shadow-[0_8px_32px_rgba(31,38,135,0.03)]";
              const statCardBorder = isDark ? "border border-white/[0.06]" : "border border-slate-200/50 shadow-[1px_1px_0px_1px_rgba(0,0,0,0.12)]";

              return (
                <div
                  key={`${label}-${idx}-big`}
                  className={`relative overflow-hidden rounded-2xl ${statCardBorder} ${statCardBg} pt-2 pb-3 px-1 flex flex-col items-center justify-center min-h-[90px] w-[125px] flex-shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.15)] gap-1`}
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



        <AccentLine />

        {/* ── Tournament list ── */}
        <div className="px-3 pt-3">

          {tournaments.length > 0 ? (
            <div className="flex flex-col gap-3.5 max-w-lg mx-auto">
              <AnimatePresence>
                {tournaments.map((item: any, index: number) => {
                  const rank = item.player_reward_rank || "0";

                  // Vary the reward types and reward values (Lakh to 1 Crore range)
                  const mockRewardTypes = ["1", "2", "3"]; // 1 = Coins, 2 = Voucher, 3 = Topup
                  const mockRewardValues = [10000000, 500000, 100000, 2500000, 1200000, 750000];

                  const rewardTypeVal = mockRewardTypes[index % mockRewardTypes.length];
                  const rawPrizeVal = mockRewardValues[index % mockRewardValues.length];
                  const prizeText = formatNumberInText(rawPrizeVal.toString());

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
                        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-visible rounded-2xl flex items-center justify-center p-1.5 transition-all duration-300 border ${LIGHT_BANNER_GRADIENTS[Math.floor(Math.random() * LIGHT_BANNER_GRADIENTS.length)]
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
                        </div>

                        <div className="my-2" />

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 flex gap-5 items-start">
                            <div className="flex flex-col flex-shrink-0">
                              <span className="text-[13px] sm:text-[11px] font-bold text-muted-foreground dark:text-slate-200  leading-none mb-1">
                                Rank
                              </span>
                              <span className="text-[13px] sm:text-base font-bold text-brand-gold-100 dark:text-brand-yellow-100 tracking-wide">
                                #{rank}
                              </span>
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-[13px] sm:text-[11px] font-bold text-muted-foreground dark:text-slate-200  leading-none mb-1">
                                Reward
                              </span>
                              <div className="flex items-center gap-1">
                                {rewardTypeVal === "2" ? (
                                  <>
                                    {/* <img src="/assets/images/giftkarte.png" className="w-4 h-4 object-contain flex-shrink-0" alt="Voucher" /> */}
                                    <Gift className="w-4 h-4 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                                    <span className="text-[13px] sm:text-sm font-semibold text-brand-gold-100 dark:text-brand-yellow-100 leading-none truncate">
                                      {Currency} {prizeText} Giftkarte
                                    </span>
                                  </>
                                ) : rewardTypeVal === "3" ? (
                                  <>
                                    <TopupIcon className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-[13px] sm:text-sm font-semibold text-brand-gold-100 dark:text-brand-yellow-100 leading-none truncate">
                                      {Currency} {prizeText} Topup
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {/* <img
                                      src="/assets/images/img/gold-coin.png"
                                      alt="coin"
                                      className="w-4 h-4 object-contain flex-shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                      }}
                                    /> */}
                                    <Coins className="w-4 h-4 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                                    <span className="text-[13px] sm:text-sm font-semibold text-brand-gold-100 dark:text-brand-yellow-100 leading-none truncate">
                                      {prizeText} Coins
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
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