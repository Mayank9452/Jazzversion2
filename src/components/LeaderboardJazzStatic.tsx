import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Trophy } from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";

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
  { rank: 6, msisdn: "955xxxx822", score: 71667, avatarUrl: "/assets/users/6.png", avatarBg: "from-[#2B2B2B] to-[#191919]" },
  { rank: 7, msisdn: "922xxxx999", score: 68439, avatarUrl: "/assets/users/7.png", avatarBg: "from-[#3D3D3D] to-[#2B2B2B]" },
  { rank: 8, msisdn: "931xxxx222", score: 66981, avatarUrl: "/assets/users/8.png", avatarBg: "from-[#2B2B2B] to-[#191919]" },
  { rank: 9, msisdn: "944xxxx888", score: 50546, avatarUrl: "/assets/users/9.png", avatarBg: "from-[#3D3D3D] to-[#2B2B2B]" },
  { rank: 10, msisdn: "966xxxx555", score: 43210, avatarUrl: "/assets/users/10.png", avatarBg: "from-[#2B2B2B] to-[#191919]" },
];

const formatScore = (num: number) => num.toLocaleString();

// --- Custom Laurel Badge Component with centered rank number/text ---
const LaurelBadge: React.FC<{ rankText: string; color: string; size?: number; isDark?: boolean }> = ({ rankText, color, size = 60, isDark = true }) => {
  const numberPart = rankText.replace(/[a-z]/g, "");
  const textPart = rankText.replace(/[0-9]/g, "").toUpperCase();

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Laurel Wreath Leaves SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      >
        {/* Left Laurel stem */}
        <path d="M 32,80 C 12,68 12,32 42,20" />
        {/* Right Laurel stem */}
        <path d="M 68,80 C 88,68 88,32 58,20" />

        {/* Bow ribbon at bottom */}
        <path d="M 44,82 C 47,79 53,79 56,82 C 58,84 54,89 50,86 C 46,89 42,84 44,82 Z" fill={color} />
        <path d="M 46,84 C 41,88 38,92 39,93" />
        <path d="M 54,84 C 59,88 62,92 61,93" />

        {/* Leaves left */}
        <path d="M 32,80 C 28,78 25,71 30,68 C 35,65 35,73 32,80" fill={color} />
        <path d="M 25,73 C 19,70 18,63 24,61 C 30,59 29,67 25,73" fill={color} />
        <path d="M 20,64 C 14,60 14,53 20,51 C 26,49 25,57 20,64" fill={color} />
        <path d="M 18,54 C 13,49 14,42 20,41 C 26,40 24,48 18,54" fill={color} />
        <path d="M 19,43 C 16,37 18,30 24,31 C 30,32 26,39 19,43" fill={color} />
        <path d="M 24,33 C 23,26 27,21 32,24 C 37,27 32,33 24,33" fill={color} />
        <path d="M 32,25 C 33,18 39,15 42,20 C 45,25 38,29 32,25" fill={color} />

        {/* Leaves right */}
        <path d="M 68,80 C 72,78 75,71 70,68 C 65,65 65,73 68,80" fill={color} />
        <path d="M 75,73 C 81,70 82,63 76,61 C 70,59 71,67 75,73" fill={color} />
        <path d="M 80,64 C 86,60 86,53 80,51 C 74,49 75,57 80,64" fill={color} />
        <path d="M 82,54 C 87,49 86,42 80,41 C 74,40 76,48 82,54" fill={color} />
        <path d="M 81,43 C 84,37 82,30 76,31 C 70,32 74,39 81,43" fill={color} />
        <path d="M 76,33 C 77,26 73,21 68,24 C 63,27 68,33 76,33" fill={color} />
        <path d="M 68,25 C 67,18 61,15 58,20 C 55,25 62,29 68,25" fill={color} />
      </svg>
      {/* Rank text centered */}
      <div className={`font-sans font-black z-10 select-none flex flex-col items-center leading-none -mt-1 ${isDark ? "text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" : "text-slate-800"}`}>
        <span className="text-[17px] font-black">{numberPart}</span>
        <span className="text-[7.5px] font-black tracking-widest uppercase">{textPart}</span>
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
      <div className={`flex flex-col font-sans antialiased max-w-[480px] mx-auto min-h-screen w-full border-x shadow-2xl relative overflow-hidden transition-colors duration-300 ${isDarkTheme ? "bg-[#191919] text-white border-[#3D3D3D]/30 selection:bg-[#FFCA20]/25" : "bg-[#f8f9fa] text-slate-800 border-slate-200/50 selection:bg-[#dfa208]/15"}`}>

        {/* ── Premium Glassmorphic Header Card (replicated from TournamentHistory.tsx) ── */}
        <div className="pb-2 z-30">
          <div className={`relative overflow-hidden p-4 flex items-center justify-between gap-3 border-b transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-br from-[#2B2B2B]/40 to-[#191919]/30 border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.2)]" : "bg-white border-slate-200/60 shadow-sm"}`}>
            <div className="w-full flex justify-between items-center gap-5">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-all cursor-pointer shadow-sm ${isDarkTheme ? "border-[#FFCA20] bg-[#2B2B2B]/40 hover:bg-[#FFCA20] hover:text-[#191919] text-white" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"}`}
                  title="Back"
                >
                  <ChevronLeft className={`w-4.5 h-4.5 ${isDarkTheme ? "text-[#FFCA20]" : "text-slate-800"}`} />
                </button>
              </div>
              <div className="flex-1 text-center">
                <h1 className={`text-base sm:text-lg font-black tracking-wide uppercase leading-tight flex items-center justify-center gap-1.5 ${isDarkTheme ? "text-white" : "text-slate-800"}`}>
                  <img
                    src="/assets/images/img/trophy.png"
                    alt="Trophy"
                    className="w-10 h-8 object-contain"
                  />
                  Leaderboard
                </h1>
              </div>
              <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden border shadow-sm ${isDarkTheme ? "bg-[#2B2B2B]/80 border-[#3D3D3D]" : "bg-white border-slate-200"}`}>
                <img
                  src={players.find((p) => p.rank === 6)?.avatarUrl || "/assets/users/6.png"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Block (Rank and Best Score) */}
        <div className={`mx-4 mt-3 rounded-2xl p-3.5 flex justify-between items-center text-xs select-none relative z-10 border transition-all duration-300 ${isDarkTheme ? "bg-[#313131] border-white/20 shadow-[inset_0_4px_24px_rgba(0,0,0,0.2),0_-2px_0px_rgba(255,255,255,0.7)] text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"}`}>
          <div className="flex items-center gap-2">
            <span className={isDarkTheme ? "text-white font-bold" : "text-slate-500 font-bold"}>Your Rank:</span>
            <span className={`font-black text-sm ${isDarkTheme ? "text-[#FFCA20]" : "text-[#dfa208]"}`}>#6</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isDarkTheme ? "text-white font-bold" : "text-slate-500 font-bold"}>Best Score:</span>
            <span className={`font-black text-sm ${isDarkTheme ? "text-[#FFCA20]" : "text-[#dfa208]"}`}>
              {formatScore(players.find((p) => p.rank === 6)?.score || 71667)}
            </span>
          </div>
        </div>

        {/* ───────────────── TOP 3 3D PODIUM SECTION ───────────────── */}
        <div className="flex items-end justify-center w-full px-5 mt-5 gap-1.5 select-none">

          {/* ──────────────── Rank 2 (Left) ──────────────── */}
          <div className="flex flex-col items-center w-[29%]">
            {/* 3D Box Stand */}
            <div className={`w-full aspect-[3/4.8] flex flex-col items-center justify-between pt-3 pb-0 rounded-2xl overflow-hidden relative border transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-b from-[#175A9C] via-[#0E3566]/80 to-[#081938]/95 border-white/[0.08] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" : "bg-gradient-to-b from-[#E6F0FA] to-[#F1F7FC] border-blue-100/80 shadow-sm"}`}>
              {/* Silver Wreath */}
              <LaurelBadge rankText="2nd" color="#BAC3D6" size={64} isDark={isDarkTheme} />

              {/* Avatar overlapping bottom */}
              <div className="w-full relative mt-auto flex justify-center pb-2">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-md bg-gradient-to-b ${isDarkTheme ? "border-white/20 from-slate-700 to-slate-900" : "border-white from-[#E8EAF6] to-[#C5CAE9]"}`}>
                  <img
                    src={rank2.avatarUrl}
                    alt={rank2.msisdn}
                    className="w-[85%] h-[85%] object-contain"
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
            <div className={`w-full aspect-[3/5.2] flex flex-col items-center justify-between pt-4.5 pb-0 rounded-2xl overflow-hidden relative border transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-b from-[#DFA208] via-[#8C6D0F]/85 to-[#191919]/95 border-2 border-[#FFCA20]/45 shadow-[0_12px_28px_rgba(0,0,0,0.6)]" : "bg-gradient-to-b from-[#FFF2CC] via-[#FFF9E6] to-[#FFFBF0] border-[#FFCA20]/45 shadow-sm"}`}>
              {/* Gold Wreath */}
              <LaurelBadge rankText="1st" color="#FFCA20" size={72} isDark={isDarkTheme} />

              {/* Avatar overlapping bottom */}
              <div className="w-full relative mt-auto flex justify-center pb-2.5">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-md bg-gradient-to-b ${isDarkTheme ? "border-[#FFCA20]/45 from-slate-700 to-slate-900" : "border-white from-[#FFF5F5] to-[#FCE4EC]"}`}>
                  <img
                    src={rank1.avatarUrl}
                    alt={rank1.msisdn}
                    className="w-[85%] h-[85%] object-contain"
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
            <div className={`w-full aspect-[3/4.4] flex flex-col items-center justify-between pt-2.5 pb-0 rounded-2xl overflow-hidden relative border transition-all duration-300 ${isDarkTheme ? "bg-gradient-to-b from-[#8E24AA] via-[#4A148C]/80 to-[#1F0038]/95 border border-white/[0.08] shadow-[0_6px_16px_rgba(0,0,0,0.4)]" : "bg-gradient-to-b from-[#FCEAE6] to-[#FDF4F2] border-orange-100/80 shadow-sm"}`}>
              {/* Bronze Wreath */}
              <LaurelBadge rankText="3rd" color="#C5A059" size={60} isDark={isDarkTheme} />

              {/* Avatar overlapping bottom */}
              <div className="w-full relative mt-auto flex justify-center pb-2">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-md bg-gradient-to-b ${isDarkTheme ? "border-white/20 from-slate-700 to-slate-900" : "border-white from-[#FFE0B2] to-[#FFCC80]"}`}>
                  <img
                    src={rank3.avatarUrl}
                    alt={rank3.msisdn}
                    className="w-[85%] h-[85%] object-contain"
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
                  className={`flex items-center justify-between py-3 select-none transition-all ${isCurrentUser
                    ? isDarkTheme 
                      ? "bg-yellow-main/30 border-2 border-[#FFCA20]/45 -mx-3 px-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] my-1"
                      : "bg-[#fffbeb] border-2 border-[#FFCA20]/45 -mx-3 px-3 rounded-xl shadow-sm my-1"
                    : idx === restPlayers.length - 1 ? "" : (isDarkTheme ? "border-b border-[#535151]" : "border-b border-slate-100")
                    }`}
                >
                  {/* Left Side: Avatar, MSISDN, Score */}
                  <div className="flex items-center gap-3">
                    {/* Brand-aligned Avatar Wrapper with gradient bg and border */}
                    <div className={`w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center shrink-0 ${isDarkTheme ? `border-[#3D3D3D] bg-gradient-to-tr ${player.avatarBg}` : "border-slate-100 bg-[#fff5f5]"}`}>
                      <img
                        src={player.avatarUrl}
                        alt={player.msisdn}
                        className="w-[85%] h-[85%] object-contain mt-1"
                      />
                    </div>

                    <div className="flex flex-col text-start">
                      <span className={`text-[14px] font-bold leading-tight ${isDarkTheme ? "text-white" : "text-slate-800"}`}>
                        {player.msisdn}
                        {isCurrentUser && <span className={`font-semibold text-[11px] ml-1.5 ${isDarkTheme ? "text-white/60" : "text-slate-400"}`}>(You)</span>}
                      </span>
                      {/* Brand yellow score */}
                      <div className="flex items-center gap-1 mt-1 leading-none">
                        <span className={`text-[13px] font-black font-mono leading-none ${isDarkTheme ? "text-[#FFCA20]" : "text-[#dfa208]"}`}>
                          {formatScore(player.score)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Gold Wreath Badge */}
                  <div className="shrink-0 mr-1">
                    <LaurelBadge rankText={`${player.rank}th`} color="#C5A059" size={46} isDark={isDarkTheme} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
      <BottomNavBar />
    </>
  );
};

export default LeaderboardJazzStatic;
