import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Trophy } from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";
import { BottomNavBarNew } from "./BottomNavBarNew";

// --- Mock Data representing the exact images, msisdn, and scores ---
interface Player {
  rank: number;
  msisdn: string;
  score: number;
  avatarUrl: string;
  avatarBg: string; // Brand-aligned backgrounds for avatars
}

const players: Player[] = [
  { rank: 1, msisdn: "908xxxx890", score: 96239, avatarUrl: "/assets/users/1.png", avatarBg: "from-[#DFA208] to-[#191919]" },
  { rank: 2, msisdn: "923xxxx456", score: 84787, avatarUrl: "/assets/users/2.png", avatarBg: "from-[#3D3D3D] to-[#191919]" },
  { rank: 3, msisdn: "912xxxx789", score: 82139, avatarUrl: "/assets/users/3.png", avatarBg: "from-[#2B2B2B] to-[#191919]" },
  { rank: 4, msisdn: "987xxxx321", score: 80857, avatarUrl: "/assets/users/4.png", avatarBg: "from-[#3D3D3D] to-[#2B2B2B]" },
  { rank: 5, msisdn: "955xxxx111", score: 76128, avatarUrl: "/assets/users/5.png", avatarBg: "from-[#3D3D3D] to-[#2B2B2B]" },
  { rank: 6, msisdn: "955xxxx822", score: 71667, avatarUrl: "/assets/users/12.png", avatarBg: "from-[#2B2B2B] to-[#191919]" },
  { rank: 7, msisdn: "922xxxx999", score: 68439, avatarUrl: "/assets/users/7.png", avatarBg: "from-[#3D3D3D] to-[#2B2B2B]" },
  { rank: 8, msisdn: "931xxxx222", score: 66981, avatarUrl: "/assets/users/8.png", avatarBg: "from-[#2B2B2B] to-[#191919]" },
  { rank: 9, msisdn: "944xxxx888", score: 50546, avatarUrl: "/assets/users/9.png", avatarBg: "from-[#3D3D3D] to-[#2B2B2B]" },
  { rank: 10, msisdn: "966xxxx555", score: 43210, avatarUrl: "/assets/users/10.png", avatarBg: "from-[#2B2B2B] to-[#191919]" },
];

const formatScore = (num: number) => num.toLocaleString();

// --- Custom Laurel Badge Component with centered rank number/text ---
const LaurelBadge: React.FC<{ rankText: string; color?: string; size?: number; isDark?: boolean }> = ({ rankText, color, size = 60, isDark = true }) => {
  const numberPart = rankText.replace(/[a-z]/g, "");
  const textPart = rankText.replace(/[0-9]/g, "").toUpperCase();

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Laurel Wreath Leaves Image */}
      <img
        src="/assets/images/laurel_leaf.png"
        alt="laurel leaf"
        className="w-full h-full object-contain absolute inset-0"
      />
      {/* Rank text centered in the space */}
      <div className={`font-black z-10 select-none flex flex-col items-center justify-center leading-none ${isDark ? "text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" : "text-slate-800"}`} style={{ transform: "translateY(-4%)" }}>
        <span className={`${textPart ? "text-[16px] sm:text-[18px]" : "text-[14px] sm:text-[16px]"} font-black`}>{numberPart}</span>
        {textPart && (
          <span className="text-[7.5px] font-black tracking-widest uppercase mt-[1px]">{textPart}</span>
        )}
      </div>
    </div>
  );
};

export const LeaderboardJazzStatic: React.FC = () => {
  const navigate = useNavigate();

  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkTheme(isDark);

    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const rank1 = players.find((p) => p.rank === 1) || players[0];
  const rank2 = players.find((p) => p.rank === 2) || players[1];
  const rank3 = players.find((p) => p.rank === 3) || players[2];
  const restPlayers = players.filter((p) => p.rank > 3);

  return (
    <>

      {/* Root viewport container supporting dark and light theme styles dynamically */}
      <div className={`flex flex-col max-w-[480px] mx-auto min-h-screen w-full border-x shadow-2xl relative overflow-hidden transition-colors duration-300 ${isDarkTheme ? "bg-[#191919] text-white border-[#3D3D3D]/30 selection:bg-[#FFCA20]/25" : "bg-[#f8f9fa] text-slate-800 border-slate-200/50 selection:bg-[#dfa208]/15"}`}>

        {/* ── Premium Glassmorphic Header Card (replicated from TournamentHistory.tsx) ── */}
        <div className="pb-4 z-30">
          <div className={`relative overflow-hidden p-2 pr-0 flex items-center justify-between gap-3 border-b transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-br from-[#2B2B2B]/40 to-[#191919]/30 border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.2)]" : "bg-brand-gradient border-[#dfa208]/30 shadow-sm"} backdrop-blur-xl`}>
            <div className="w-full flex justify-between items-center gap-5">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all pointer-events-auto cursor-pointer shrink-0 ${isDarkTheme ? "bg-[#32323299] backdrop-blur-md border border-white/10 text-white hover:bg-black/75" : "bg-white/40 border border-[#dfa208]/30 text-black hover:bg-white/60"}`}
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2">
                <img
                  src="/assets/images/img/trophy.png"
                  alt="Trophy"
                  className="w-10 h-8 object-contain"
                />
                <div className="flex flex-col text-start leading-none">
                  <h1 className={`text-base sm:text-lg font-black tracking-wide uppercase leading-tight ${isDarkTheme ? "text-white" : "text-black"}`}>
                    Leaderboard
                  </h1>
                  <p className={`text-[11px] sm:text-xs font-bold mt-0.5 leading-none ${isDarkTheme ? "text-slate-500 dark:text-muted-foreground" : "text-black/70"}`}>
                    Top Player Rankings
                  </p>
                </div>
              </div>
              <div className="w-16 h-16 -my-2 flex-shrink-0 flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:scale-105"
                onClick={() => navigate("/settingsStatic")}
              >
                <img
                  src={`/assets/users/${localStorage.getItem("selectedAvatarImg") || "9.png"}`}
                  alt="User Avatar"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/users/9.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Block (Rank and Best Score) */}
        <style>{`
          @keyframes border-glow-pulse {
            0%, 100% {
              box-shadow: 0 0 10px rgba(255, 202, 32, 0.35);
              border-color: rgba(255, 202, 32, 0.25);
            }
            50% {
              box-shadow: 0 0 24px rgba(255, 202, 32, 0.85);
              border-color: rgba(255, 202, 32, 0.85);
            }
          }
          .animate-glow-pulse {
            animation: border-glow-pulse 2.2s infinite ease-in-out;
          }
        `}</style>
        <div className="mx-4 mt-3 rounded-full py-3.5 px-6 flex justify-between items-center text-xs select-none relative z-10 border bg-gradient-to-r from-[#FFCA20] to-[#E6B53A] text-slate-950 font-black animate-glow-pulse transition-all">
          <div className="flex items-center gap-2">
            <span className="text-slate-950/70 font-bold tracking-[0.5px] text-sm">Your Rank : </span>
            <span className="font-black text-sm text-slate-950">#6</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-950/70 font-bold tracking-[0.5px] text-sm">Best Score : </span>
            <span className="font-black text-sm text-slate-950">
              {formatScore(players.find((p) => p.rank === 6)?.score || 71667)}
            </span>
          </div>
        </div>

        {/* ───────────────── TOP 3 3D PODIUM SECTION ───────────────── */}
        <div className="flex items-end justify-center w-full px-5 mt-5 gap-1.5 select-none">

          {/* ──────────────── Rank 2 (Left) ──────────────── */}
          <div className="flex flex-col items-center w-[29%]">
            {/* 3D Box Stand */}
            <div className={`w-full aspect-[3/4.8] flex flex-col items-center justify-between pt-3 pb-0 rounded-2xl overflow-hidden relative border transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-b from-[#175A9C] via-[#0E3566]/80 to-[#081938]/95 border-white/[0.08] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" : "bg-gradient-to-b from-[#3b82f6]/95 via-[#2563eb]/95 to-[#1d4ed8] border-blue-200/50 shadow-sm"}`}>
              {/* Silver Wreath */}
              <LaurelBadge rankText="2nd" color="#BAC3D6" size={90} isDark={true} />

              {/* Avatar overlapping bottom */}
              <div className="w-full relative mt-auto flex justify-center pb-2">
                <div className={`w-16 h-16 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md `}>
                  <img
                    src={rank2.avatarUrl}
                    alt={rank2.msisdn}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            {/* Player details */}
            <span className={`text-[12px] font-bold mt-2.5 truncate w-full text-center px-1 ${isDarkTheme ? "text-white" : "text-slate-800"}`}>
              {rank2.msisdn}
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className={`text-[12.5px] font-black ${isDarkTheme ? "text-[#FFCA20]" : "text-[#dfa208]"}`}>{formatScore(rank2.score)}</span>
            </div>
          </div>

          {/* ──────────────── Rank 1 (Center - Elevated) ──────────────── */}
          <div className="flex flex-col items-center w-[33%] z-10">
            {/* 3D Box Stand */}
            <div className={`w-full aspect-[3/5.2] flex flex-col items-center justify-between pt-4.5 pb-0 rounded-2xl overflow-hidden relative border transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-b from-[#DFA208] via-[#8C6D0F]/85 to-[#191919]/95 border-2 border-[#FFCA20]/45 shadow-[0_12px_28px_rgba(0,0,0,0.6)]" : "bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] border-2 border-[#fbbf24]/50 shadow-sm"}`}>
              {/* Gold Wreath */}
              <LaurelBadge rankText="1st" color="#FFCA20" size={100} isDark={true} />

              {/* Avatar overlapping bottom */}
              <div className="w-full relative mt-auto flex justify-center pb-2.5">
                <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center shadow-md `}>
                  <img
                    src={rank1.avatarUrl}
                    alt={rank1.msisdn}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Player details */}
            <span className={`text-[12.5px] font-black mt-2.5 truncate w-full text-center px-1 ${isDarkTheme ? "text-white" : "text-slate-800"}`}>
              {rank1.msisdn}
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className={`text-[13px] font-black ${isDarkTheme ? "text-[#FFCA20]" : "text-[#dfa208]"}`}>{formatScore(rank1.score)}</span>
            </div>
          </div>

          {/* ──────────────── Rank 3 (Right) ──────────────── */}
          <div className="flex flex-col items-center w-[29%]">
            {/* 3D Box Stand */}
            <div className={`w-full aspect-[3/4.4] flex flex-col items-center justify-between pt-2.5 pb-0 rounded-2xl overflow-hidden relative border transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-b from-[#8E24AA] via-[#4A148C]/80 to-[#1F0038]/95 border border-white/[0.08] shadow-[0_6px_16px_rgba(0,0,0,0.4)]" : "bg-gradient-to-b from-[#c084fc]/95 via-[#a855f7]/95 to-[#7e22ce] border-purple-200/50 shadow-sm"}`}>
              {/* Bronze Wreath */}
              <LaurelBadge rankText="3rd" color="#C5A059" size={80} isDark={true} />

              {/* Avatar overlapping bottom */}
              <div className="w-full relative mt-auto flex justify-center pb-2">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md`}>
                  <img
                    src={rank3.avatarUrl}
                    alt={rank3.msisdn}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            {/* Player details */}
            <span className={`text-[12px] font-bold mt-2.5 truncate w-full text-center px-1 ${isDarkTheme ? "text-white" : "text-slate-800"}`}>
              {rank3.msisdn}
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className={`text-[12.5px] font-black ${isDarkTheme ? "text-[#FFCA20]" : "text-[#dfa208]"}`}>{formatScore(rank3.score)}</span>
            </div>
          </div>

        </div>

        {/* ───────────────── LIST OF PLAYERS ───────────────── */}
        <div className={`mx-4 rounded-[32px] border flex-1 mt-6 px-5 pt-2 pb-4 overflow-y-auto relative scrollbar-none transition-colors duration-300 ${isDarkTheme ? "bg-[#313131] backdrop-blur-xl border-[#b8b8b84d] shadow-[inset_0_4px_24px_rgba(0,0,0,0.2),0_-4px_1px_rgba(255,255,255,0.7)]" : "bg-white border-slate-100 shadow-lg shadow-slate-100/40"}`}>
          {/* Glowing brand yellow accent indicator capsule centered at top edge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-12 h-[3.5px] bg-[#FFCA20] rounded-full shadow-[0_0_12px_#FFCA20]" />
          </div>

          <div>
            {restPlayers.map((player, idx) => {
              const isCurrentUser = player.rank === 6;
              return (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between select-none transition-all ${isCurrentUser
                    ? isDarkTheme
                      ? "bg-yellow-main/30 border-2 border-[#FFCA20]/45 -mx-3 px-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] my-1"
                      : "bg-[#fffbeb] border-2 border-[#FFCA20]/45 -mx-3 px-3 rounded-xl shadow-sm my-1"
                    : idx === restPlayers.length - 1 ? "" : (isDarkTheme ? "border-b border-[#535151]" : "border-b border-slate-100")
                    }`}
                >
                  {/* Left Side: Avatar, MSISDN, Score */}
                  <div className="flex items-center gap-3">
                    {/* Brand-aligned Avatar Wrapper with gradient bg and border */}
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 `}>
                      <img
                        src={player.avatarUrl}
                        alt={player.msisdn}
                        className="object-contain mt-1"
                      />
                    </div>

                    <div className="flex flex-col text-start">
                      <span className={`text-[14px] font-bold leading-tight ${isDarkTheme ? "text-white" : "text-slate-800"}`}>
                        {player.msisdn}
                        {isCurrentUser && <span className={`font-semibold text-[11px] ml-1.5 ${isDarkTheme ? "text-white/60" : "text-slate-400"}`}>(You)</span>}
                      </span>
                      {/* Brand yellow score */}
                      <div className="flex items-center gap-1 mt-1 leading-none">
                        <span className={`text-[13px] font-black leading-none ${isDarkTheme ? "text-[#FFCA20]" : "text-[#dfa208]"}`}>
                          {formatScore(player.score)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Gold Wreath Badge */}
                  <div className="shrink-0 mr-1">
                    <LaurelBadge rankText={`${player.rank}`} color="#C5A059" size={70} isDark={isDarkTheme} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
      <BottomNavBarNew />
    </>
  );
};

export default LeaderboardJazzStatic;
