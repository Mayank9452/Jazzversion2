// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { ArrowLeft, Wifi, Battery, Signal } from "lucide-react";
// import { BottomNavBar } from "./BottomNavBar";

// // --- Mock Data representing the exact images and scores ---
// interface Player {
//   rank: number;
//   msisdn: string;
//   score: number;
//   avatarUrl: string;
//   isCurrentUser?: boolean;
// }

// const players: Player[] = [
//   { rank: 1, msisdn: "908xxxx890", score: 9623, avatarUrl: "/assets/users/1.png" },
//   { rank: 2, msisdn: "923xxxx456", score: 8478, avatarUrl: "/assets/users/2.png" },
//   { rank: 3, msisdn: "912xxxx789", score: 8213, avatarUrl: "/assets/users/3.png" },
//   { rank: 4, msisdn: "987xxxx321", score: 8085, avatarUrl: "/assets/users/4.png" },
//   { rank: 5, msisdn: "955xxxx111", score: 7612, avatarUrl: "/assets/users/5.png" },
//   { rank: 6, msisdn: "955xxxx822", score: 7166, avatarUrl: "/assets/users/6.png", isCurrentUser: true },
//   { rank: 7, msisdn: "922xxxx999", score: 6843, avatarUrl: "/assets/users/7.png" },
//   { rank: 8, msisdn: "931xxxx222", score: 6698, avatarUrl: "/assets/users/8.png" },
//   { rank: 9, msisdn: "944xxxx888", score: 5054, avatarUrl: "/assets/users/9.png" },
//   { rank: 10, msisdn: "966xxxx555", score: 4321, avatarUrl: "/assets/users/10.png" },
// ];

// const formatScore = (num: number) => num.toLocaleString();

// // --- Star Icon Component to represent Score ---
// const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
//   <svg className={`${className} inline fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//   </svg>
// );

// // --- Realistic Crown SVG Component ---
// const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
//   <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
//     {/* Crown base headband */}
//     <path d="M12 46H52V42H12V46Z" fill="#FFCA20" />

//     {/* Headband jewels details */}
//     <circle cx="18" cy="44" r="1.5" fill="#FFFFFF" />
//     <circle cx="25" cy="44" r="1.5" fill="#FF007E" />
//     <circle cx="32" cy="44" r="1.5" fill="#FFFFFF" />
//     <circle cx="39" cy="44" r="1.5" fill="#3b82f6" />
//     <circle cx="46" cy="44" r="1.5" fill="#FFFFFF" />

//     {/* Peaks / Arches */}
//     <path d="M12 42L16 20L25 32L32 10L39 32L48 20L52 42H12Z" fill="#FFCA20" stroke="#DFA208" strokeWidth="1" />

//     {/* Jewels on peaks */}
//     <circle cx="16" cy="19" r="2.5" fill="#FFFFFF" className="drop-shadow" />
//     <circle cx="32" cy="9" r="3.5" fill="#FFFFFF" className="drop-shadow" />
//     <circle cx="48" cy="19" r="2.5" fill="#FFFFFF" className="drop-shadow" />

//     {/* Arches shadow accents */}
//     <path d="M22 36L25 32L32 10" stroke="#DFA208" strokeWidth="1" opacity="0.7" />
//     <path d="M42 36L39 32L32 10" stroke="#DFA208" strokeWidth="1" opacity="0.7" />
//   </svg>
// );

// // --- Premium Big Medal Component with Ribbons ---
// const BigMedal: React.FC<{ rank: number; color: string; ribbonColor: string; className?: string; size?: "sm" | "md" | "lg" }> = ({ rank, color, ribbonColor, className, size = "md" }) => {
//   const isLg = size === "lg";
//   const isSm = size === "sm";

//   const ribbonClass = isLg ? "w-16 h-10" : isSm ? "w-11 h-6" : "w-13 h-8";
//   const circleClass = isLg ? "w-14 h-14 -mt-2.5 text-sm" : isSm ? "w-10 h-10 -mt-1 text-[11px]" : "w-12 h-12 -mt-1.5 text-xs";

//   return (
//     <div className={`relative flex flex-col items-center justify-center ${className} select-none`}>
//       {/* Ribbon SVG */}
//       <svg className={`${ribbonClass} drop-shadow-sm`} viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         {/* Left Ribbon tail */}
//         <path d="M12 1L17 18H21L15 1H12Z" fill={ribbonColor} opacity="0.9" />
//         {/* Right Ribbon tail */}
//         <path d="M28 1L23 18H19L25 1H28Z" fill={ribbonColor} opacity="0.9" />
//         {/* Ribbon folds */}
//         <path d="M9 1H31L27 10H13L9 1Z" fill={ribbonColor} />
//       </svg>
//       {/* Medal Circle */}
//       <div
//         className={`${circleClass} rounded-full flex items-center justify-center shadow-lg border-2 z-10`}
//         style={{
//           background: `radial-gradient(circle at 35% 35%, ${color} 0%, #0c0d12 140%)`,
//           borderColor: color
//         }}
//       >
//         <span className="font-black font-sans tracking-tighter text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
//           {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
//         </span>
//       </div>
//     </div>
//   );
// };

// export const LeaderboardJazzStatic: React.FC = () => {
//   const navigate = useNavigate();
//   const [coinImgError, setCoinImgError] = React.useState(false);

//   const rank1 = players.find((p) => p.rank === 1) || players[0];
//   const rank2 = players.find((p) => p.rank === 2) || players[1];
//   const rank3 = players.find((p) => p.rank === 3) || players[2];
//   const restPlayers = players.filter((p) => p.rank > 3);

//   return (
//     <>
//       <div className=" bg-[#121212] flex flex-col font-sans antialiased text-white selection:bg-[#FFCA20]/25 max-w-md mx-auto w-full border-x border-white/5 shadow-2xl relative">

//         {/* Header Action Row */}
//         <div className="px-4 py-3 flex items-center justify-between z-30 border-b border-white/[0.02]">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-1 rounded-full active:scale-95 transition-all text-[#FFCA20] hover:text-[#FFD34B]"
//           >
//             <ArrowLeft className="w-6 h-6 stroke-[3px]" />
//           </button>
//           <h1 className="text-lg font-black tracking-wide text-white">Leaderboard</h1>
//           <div className="w-8" /> {/* spacer */}
//         </div>

//         {/* User Stats Block (Rank and Best Score) - Value is yellow, label text is pure white */}
//         <div className="mx-4 mt-3 bg-[#1e2029]/80 border border-white/[0.04] rounded-2xl p-3.5 flex justify-between items-center text-xs backdrop-blur-sm select-none shadow-sm">
//           <div className="flex items-center gap-2">
//             <span className="text-white font-bold">Your Rank:</span>
//             <span className="text-[#FFCA20] font-black text-sm">#6</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-white font-bold">Best Score:</span>
//             <div className="flex items-center gap-1">
//               <StarIcon className="w-3.5 h-3.5 text-[#FFCA20] -mt-0.5" />
//               <span className="text-[#FFCA20] font-black text-sm">
//                 {formatScore(players.find((p) => p.isCurrentUser)?.score || 7166)}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Modern, Fancy & Eye-catching Winner Announcement Banner */}
//         <div className="mx-4 mt-2.5 relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-950/40 via-amber-900/10 to-transparent p-3.5 shadow-lg shadow-amber-950/20 select-none">
//           {/* Subtle gold radial background glow */}
//           <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

//           {/* Glare sheen animation sliding across the banner */}
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: "220%" }}
//             transition={{ repeat: Infinity, duration: 2.8, ease: "linear", repeatDelay: 3 }}
//             className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
//           />

//           <div className="flex items-center justify-between relative z-10">
//             <div className="flex items-center gap-3">
//               {/* Animating Trophy Wrapper */}
//               <motion.div
//                 animate={{ y: [0, -3, 0] }}
//                 transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
//                 className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-md shadow-amber-500/10 text-lg"
//               >
//                 🏆
//               </motion.div>

//               <div className="flex flex-col">
//                 <span className="text-[9px] uppercase font-black tracking-widest text-amber-500/60 leading-none">GRAND PRIZE PAYOUT</span>
//                 <h3 className="text-xs font-black text-white mt-1.5 flex items-center gap-1.5">
//                   Winner Won{" "}
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 font-extrabold text-sm drop-shadow-[0_0_6px_rgba(245,158,11,0.25)]">
//                     100,000
//                   </span>{" "}
//                   coins
//                 </h3>
//               </div>
//             </div>

//             {/* Rotating / Floating Gold Coin Asset */}
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
//               className="flex items-center justify-center"
//             >
//               {!coinImgError ? (
//                 <img
//                   src="/assets/images/img/gold-coin.png"
//                   className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]"
//                   alt="Gold Coin"
//                   onError={() => setCoinImgError(true)}
//                 />
//               ) : (
//                 <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border border-yellow-200 flex items-center justify-center text-[10px] font-black shadow-[0_0_8px_rgba(245,158,11,0.5)] text-amber-950">
//                   $
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         </div>

//         {/* Scrollable Container */}
//         <div className="flex-1 overflow-y-auto pb-4 px-4 scrollbar-none space-y-5">

//           {/* ───────────────── TOP 3 3D PODIUM SECTION ───────────────── */}
//           <div className="pt-8 pb-3 relative z-10 flex flex-col items-center select-none">
//             {/* Background ambient glow behind podium */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

//             {/* Podium grid wrapper */}
//             <div className="flex items-end justify-between w-full relative gap-1 px-1">

//               {/* ──────────────── Rank 2 (Left) ──────────────── */}
//               <div className="flex flex-col items-center flex-1 min-w-0 relative z-20">
//                 {/* Avatar */}
//                 <div className="flex flex-col items-center mb-2 w-full">
//                   <img
//                     src={rank2.avatarUrl}
//                     alt="Rank 2 Avatar"
//                     className="w-14 h-14 rounded-full object-cover border-[3px] border-slate-400/50 shadow-lg"
//                   />
//                   <span className="text-[11px] font-bold text-white mt-1.5 truncate w-full text-center px-1">
//                     {rank2.msisdn}
//                   </span>
//                   <div className="mt-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#FFCA20] shadow flex items-center gap-0.5 max-w-full">
//                     <StarIcon className="w-3 h-3 text-[#FFCA20] -mt-0.5 shrink-0" />
//                     <span className="truncate">{formatScore(rank2.score)}</span>
//                   </div>
//                 </div>

//                 {/* 3D Box Stand */}
//                 <div className="relative w-full">
//                   {/* Top face */}
//                   <div className="h-4 bg-[#1e253e] rounded-t-xl border-t border-x border-slate-500/20 skew-x-[-15deg] origin-bottom" />
//                   {/* Front face with Medal */}
//                   <div className="h-[75px] bg-gradient-to-b from-[#161a2e] to-[#0e111d] border-b border-x border-white/5 flex flex-col items-center justify-center rounded-b-xl shadow-lg relative">
//                     <BigMedal rank={2} color="#cbd5e1" ribbonColor="#2563eb" className="w-16 h-18" size="md" />
//                   </div>
//                 </div>
//               </div>

//               {/* ──────────────── Rank 1 (Center - Elevated & Glowing) ──────────────── */}
//               <div className="flex flex-col items-center flex-[1.15] min-w-0 relative z-30 filter drop-shadow-[0_0_15px_rgba(255,202,32,0.15)]">
//                 {/* Avatar and Animated Crown */}
//                 <div className="flex flex-col items-center mb-3 w-full">
//                   <div className="relative">
//                     {/* Glowing Animating Crown */}
//                     <motion.div
//                       animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
//                       transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
//                       className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
//                     >
//                       <CrownIcon className="w-10 h-10 drop-shadow-[0_2px_4px_rgba(255,202,32,0.4)]" />
//                     </motion.div>
//                     <img
//                       src={rank1.avatarUrl}
//                       alt="Rank 1 Avatar"
//                       className="w-[66px] h-[66px] rounded-full object-cover border-[3px] border-[#FFCA20] shadow-xl"
//                     />
//                   </div>
//                   <span className="text-xs font-black text-white mt-2 truncate w-full text-center px-1 drop-shadow">
//                     {rank1.msisdn}
//                   </span>
//                   <div className="mt-1 bg-brand-gradient border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-black text-brand-black-100 shadow-md flex items-center gap-0.5 max-w-full">
//                     <StarIcon className="w-3 h-3 text-brand-black-100 -mt-0.5 shrink-0" />
//                     <span className="truncate">{formatScore(rank1.score)}</span>
//                   </div>
//                 </div>

//                 {/* 3D Box Stand */}
//                 <div className="relative w-full">
//                   {/* Top face with bright golden borders */}
//                   <div className="h-5 bg-[#312c29] rounded-t-2xl border-t-2 border-x-2 border-[#FFCA20]/60 skew-x-[-15deg] origin-bottom shadow-[inset_0_1px_8px_rgba(255,202,32,0.3)]" />
//                   {/* Front face with gold Medal */}
//                   <div className="h-[95px] bg-gradient-to-b from-[#221e1a] to-[#0f0e0b] border-b-2 border-x-2 border-[#FFCA20]/40 flex flex-col items-center justify-center rounded-b-2xl shadow-xl relative">
//                     <BigMedal rank={1} color="#FFCA20" ribbonColor="#dc2626" className="w-20 h-22" size="lg" />
//                   </div>
//                 </div>
//               </div>

//               {/* ──────────────── Rank 3 (Right) ──────────────── */}
//               <div className="flex flex-col items-center flex-1 min-w-0 relative z-20">
//                 {/* Avatar */}
//                 <div className="flex flex-col items-center mb-2 w-full">
//                   <img
//                     src={rank3.avatarUrl}
//                     alt="Rank 3 Avatar"
//                     className="w-14 h-14 rounded-full object-cover border-[3px] border-amber-600/50 shadow-lg"
//                   />
//                   <span className="text-[11px] font-bold text-white mt-1.5 truncate w-full text-center px-1">
//                     {rank3.msisdn}
//                   </span>
//                   <div className="mt-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#FFCA20] shadow flex items-center gap-0.5 max-w-full">
//                     <StarIcon className="w-3 h-3 text-[#FFCA20] -mt-0.5 shrink-0" />
//                     <span className="truncate">{formatScore(rank3.score)}</span>
//                   </div>
//                 </div>

//                 {/* 3D Box Stand */}
//                 <div className="relative w-full">
//                   {/* Top face */}
//                   <div className="h-4 bg-[#1a232f] rounded-t-xl border-t border-x border-amber-600/20 skew-x-[-15deg] origin-bottom" />
//                   {/* Front face with Medal */}
//                   <div className="h-[60px] bg-gradient-to-b from-[#111624] to-[#0c0e16] border-b border-x border-white/5 flex flex-col items-center justify-center rounded-b-xl shadow-md relative">
//                     <BigMedal rank={3} color="#fb923c" ribbonColor="#16a34a" className="w-12 h-14" size="sm" />
//                   </div>
//                 </div>
//               </div>

//             </div>

//           </div>

//           {/* ───────────────── LIST OF CARDS ───────────────── */}
//           <div className="space-y-2 mt-4 select-none">
//             {restPlayers.map((player) => {
//               const isYou = player.isCurrentUser === true;

//               return (
//                 <div
//                   key={player.rank}
//                   className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${isYou
//                     ? "bg-brand-gradient text-brand-black-100 shadow-lg border border-[#DFA208]/30 scale-[1.02]"
//                     : "bg-[#1f2029] border border-white/[0.03] text-white/90 hover:bg-[#282935]"
//                     }`}
//                 >
//                   {/* Left Side: Rank, Avatar, Name */}
//                   <div className="flex items-center gap-4">
//                     {/* Rank */}
//                     <span className={`text-sm font-black w-4 text-center ${isYou ? "text-brand-black-100" : "text-white/50"}`}>
//                       {player.rank}
//                     </span>

//                     {/* Avatar */}
//                     <img
//                       src={player.avatarUrl}
//                       alt={player.msisdn}
//                       className="w-10 h-10 rounded-full object-cover border border-white/10"
//                     />

//                     {/* Name (MSISDN + (You) indicator for current user) */}
//                     <div className="flex flex-col">
//                       <span className={`text-sm font-black tracking-wide ${isYou ? "text-brand-black-100" : "text-white"}`}>
//                         {player.msisdn}
//                       </span>
//                       {isYou && (
//                         <span className="text-[10px] font-bold text-brand-black-100/70 leading-none">
//                           (You)
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Right Side: Score */}
//                   <div className="text-right flex items-center gap-1">
//                     <StarIcon className={`w-3.5 h-3.5 ${isYou ? "text-brand-black-100" : "text-[#FFCA20]"}`} />
//                     <span className={`text-sm font-black font-mono ${isYou ? "text-brand-black-100" : "text-white/90"}`}>
//                       {formatScore(player.score)}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//         </div>

//       </div>
//       <BottomNavBar />
//     </>
//   );
// };

// export default LeaderboardJazzStatic;



import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wifi, Battery, Signal } from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";

// --- Mock Data representing the exact images and scores ---
interface Player {
  rank: number;
  msisdn: string;
  score: number;
  avatarUrl: string;
  isCurrentUser?: boolean;
}

const players: Player[] = [
  { rank: 1, msisdn: "908xxxx890", score: 9623, avatarUrl: "/assets/users/1.png" },
  { rank: 2, msisdn: "923xxxx456", score: 8478, avatarUrl: "/assets/users/2.png" },
  { rank: 3, msisdn: "912xxxx789", score: 8213, avatarUrl: "/assets/users/3.png" },
  { rank: 4, msisdn: "987xxxx321", score: 8085, avatarUrl: "/assets/users/4.png" },
  { rank: 5, msisdn: "955xxxx111", score: 7612, avatarUrl: "/assets/users/5.png" },
  { rank: 6, msisdn: "955xxxx822", score: 7166, avatarUrl: "/assets/users/6.png", isCurrentUser: true },
  { rank: 7, msisdn: "922xxxx999", score: 6843, avatarUrl: "/assets/users/7.png" },
  { rank: 8, msisdn: "931xxxx222", score: 6698, avatarUrl: "/assets/users/8.png" },
  { rank: 9, msisdn: "944xxxx888", score: 5054, avatarUrl: "/assets/users/9.png" },
  { rank: 10, msisdn: "966xxxx555", score: 4321, avatarUrl: "/assets/users/10.png" },
];

const formatScore = (num: number) => num.toLocaleString();

// --- Star Icon Component to represent Score ---
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`${className} inline fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// --- Realistic Crown SVG Component ---
const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Crown base headband */}
    <path d="M12 46H52V42H12V46Z" fill="#FFCA20" />

    {/* Headband jewels details */}
    <circle cx="18" cy="44" r="1.5" fill="#FFFFFF" />
    <circle cx="25" cy="44" r="1.5" fill="#FF007E" />
    <circle cx="32" cy="44" r="1.5" fill="#FFFFFF" />
    <circle cx="39" cy="44" r="1.5" fill="#3b82f6" />
    <circle cx="46" cy="44" r="1.5" fill="#FFFFFF" />

    {/* Peaks / Arches */}
    <path d="M12 42L16 20L25 32L32 10L39 32L48 20L52 42H12Z" fill="#FFCA20" stroke="#DFA208" strokeWidth="1" />

    {/* Jewels on peaks */}
    <circle cx="16" cy="19" r="2.5" fill="#FFFFFF" className="drop-shadow" />
    <circle cx="32" cy="9" r="3.5" fill="#FFFFFF" className="drop-shadow" />
    <circle cx="48" cy="19" r="2.5" fill="#FFFFFF" className="drop-shadow" />

    {/* Arches shadow accents */}
    <path d="M22 36L25 32L32 10" stroke="#DFA208" strokeWidth="1" opacity="0.7" />
    <path d="M42 36L39 32L32 10" stroke="#DFA208" strokeWidth="1" opacity="0.7" />
  </svg>
);

// --- Premium Big Medal Component with Ribbons ---
const BigMedal: React.FC<{ rank: number; color: string; ribbonColor: string; className?: string; size?: "sm" | "md" | "lg" }> = ({ rank, color, ribbonColor, className, size = "md" }) => {
  const isLg = size === "lg";
  const isSm = size === "sm";

  const ribbonClass = isLg ? "w-16 h-10" : isSm ? "w-11 h-6" : "w-13 h-8";
  const circleClass = isLg ? "w-14 h-14 -mt-2.5 text-sm" : isSm ? "w-10 h-10 -mt-1 text-[11px]" : "w-12 h-12 -mt-1.5 text-xs";

  return (
    <div className={`relative flex flex-col items-center justify-center ${className} select-none`}>
      {/* Ribbon SVG */}
      <svg className={`${ribbonClass} drop-shadow-sm`} viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Ribbon tail */}
        <path d="M12 1L17 18H21L15 1H12Z" fill={ribbonColor} opacity="0.9" />
        {/* Right Ribbon tail */}
        <path d="M28 1L23 18H19L25 1H28Z" fill={ribbonColor} opacity="0.9" />
        {/* Ribbon folds */}
        <path d="M9 1H31L27 10H13L9 1Z" fill={ribbonColor} />
      </svg>
      {/* Medal Circle */}
      <div
        className={`${circleClass} rounded-full flex items-center justify-center shadow-lg border-2 z-10`}
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color} 0%, #0c0d12 140%)`,
          borderColor: color
        }}
      >
        <span className="font-black font-sans tracking-tighter text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
          {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
        </span>
      </div>
    </div>
  );
};

export const LeaderboardJazzStatic: React.FC = () => {
  const navigate = useNavigate();
  const [coinImgError, setCoinImgError] = React.useState(false);

  const rank1 = players.find((p) => p.rank === 1) || players[0];
  const rank2 = players.find((p) => p.rank === 2) || players[1];
  const rank3 = players.find((p) => p.rank === 3) || players[2];
  const restPlayers = players.filter((p) => p.rank > 3);

  return (
    <>
      <div className=" bg-[#121212] flex flex-col font-sans antialiased text-white selection:bg-[#FFCA20]/25 max-w-md mx-auto w-full border-x border-white/5 shadow-2xl relative">

        {/* Header Action Row */}
        <div className="px-4 py-3 flex items-center justify-between z-30 border-b border-white/[0.02]">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full active:scale-95 transition-all text-[#FFCA20] hover:text-[#FFD34B]"
          >
            <ArrowLeft className="w-6 h-6 stroke-[3px]" />
          </button>
          <h1 className="text-lg font-black tracking-wide text-white">Leaderboard</h1>
          <div className="w-8" /> {/* spacer */}
        </div>

        {/* User Stats Block (Rank and Best Score) - Value is yellow, label text is pure white */}
        <div className="mx-4 mt-3 bg-[#1e2029]/80 border border-white/[0.04] rounded-2xl p-3.5 flex justify-between items-center text-xs backdrop-blur-sm select-none shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">Your Rank:</span>
            <span className="text-[#FFCA20] font-black text-sm">#6</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">Best Score:</span>
            <div className="flex items-center gap-1">
              <StarIcon className="w-3.5 h-3.5 text-[#FFCA20] -mt-0.5" />
              <span className="text-[#FFCA20] font-black text-sm">
                {formatScore(players.find((p) => p.isCurrentUser)?.score || 7166)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pb-4 px-4 scrollbar-none space-y-5">

          {/* ───────────────── TOP 3 3D PODIUM SECTION ───────────────── */}
          <div className="pt-8 pb-3 relative z-10 flex flex-col items-center select-none">
            {/* Background ambient glow behind podium */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Podium grid wrapper */}
            <div className="flex items-end justify-between w-full relative gap-1 px-1">

              {/* ──────────────── Rank 2 (Left) ──────────────── */}
              <div className="flex flex-col items-center flex-1 min-w-0 relative z-20">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-2 w-full">
                  <img
                    src={rank2.avatarUrl}
                    alt="Rank 2 Avatar"
                    className="w-14 h-14 rounded-full object-cover border-[3px] border-slate-400/50 shadow-lg"
                  />
                  <span className="text-[11px] font-bold text-white mt-1.5 truncate w-full text-center px-1">
                    {rank2.msisdn}
                  </span>
                  <div className="mt-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#FFCA20] shadow flex items-center gap-0.5 max-w-full">
                    <StarIcon className="w-3 h-3 text-[#FFCA20] -mt-0.5 shrink-0" />
                    <span className="truncate">{formatScore(rank2.score)}</span>
                  </div>
                </div>

                {/* 3D Box Stand */}
                <div className="relative w-full">
                  {/* Top face */}
                  {/* <div className="h-4 bg-[#1e253e] rounded-t-xl border-t border-x border-slate-500/20 skew-x-[-15deg] origin-bottom" /> */}
                  {/* Front face with Medal */}
                  <div className="h-[75px] bg-gradient-to-b from-[#161a2e] to-[#0e111d] border-b border-x border-white/30 flex flex-col items-center justify-center rounded-b-xl shadow-lg relative">
                    <BigMedal rank={2} color="#cbd5e1" ribbonColor="#2563eb" className="w-16 h-18" size="md" />
                  </div>
                </div>
              </div>

              {/* ──────────────── Rank 1 (Center - Elevated & Glowing) ──────────────── */}
              <div className="flex flex-col items-center flex-[1.15] min-w-0 relative z-30 filter drop-shadow-[0_0_15px_rgba(255,202,32,0.15)]">
                {/* Avatar and Animated Crown */}
                <div className="flex flex-col items-center mb-3 w-full">
                  <div className="relative">
                    {/* Glowing Animating Crown */}
                    <motion.div
                      animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                    >
                      <CrownIcon className="w-10 h-10 drop-shadow-[0_2px_4px_rgba(255,202,32,0.4)]" />
                    </motion.div>
                    <img
                      src={rank1.avatarUrl}
                      alt="Rank 1 Avatar"
                      className="w-[66px] h-[66px] rounded-full object-cover border-[3px] border-[#FFCA20] shadow-xl"
                    />
                  </div>
                  <span className="text-xs font-black text-white mt-2 truncate w-full text-center px-1 drop-shadow">
                    {rank1.msisdn}
                  </span>
                  <div className="mt-1 bg-brand-gradient border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-black text-brand-black-100 shadow-md flex items-center gap-0.5 max-w-full">
                    <StarIcon className="w-3 h-3 text-brand-black-100 -mt-0.5 shrink-0" />
                    <span className="truncate">{formatScore(rank1.score)}</span>
                  </div>
                </div>

                {/* 3D Box Stand */}
                <div className="relative w-full">
                  {/* Top face with bright golden borders */}
                  {/* <div className="h-5 bg-[#312c29] rounded-t-2xl border-t-2 border-x-2 border-[#FFCA20]/60 skew-x-[-15deg] origin-bottom shadow-[inset_0_1px_8px_rgba(255,202,32,0.3)]" /> */}
                  {/* Front face with gold Medal */}
                  <div className="h-[95px] bg-gradient-to-b from-[#221e1a] to-[#0f0e0b] border-b-2 border-x-2 border-[#FFCA20]/80 flex flex-col items-center justify-center rounded-b-2xl shadow-xl relative">
                    <BigMedal rank={1} color="#FFCA20" ribbonColor="#dc2626" className="w-20 h-22" size="lg" />
                  </div>
                </div>
              </div>

              {/* ──────────────── Rank 3 (Right) ──────────────── */}
              <div className="flex flex-col items-center flex-1 min-w-0 relative z-20">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-2 w-full">
                  <img
                    src={rank3.avatarUrl}
                    alt="Rank 3 Avatar"
                    className="w-14 h-14 rounded-full object-cover border-[3px] border-amber-600/50 shadow-lg"
                  />
                  <span className="text-[11px] font-bold text-white mt-1.5 truncate w-full text-center px-1">
                    {rank3.msisdn}
                  </span>
                  <div className="mt-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#FFCA20] shadow flex items-center gap-0.5 max-w-full">
                    <StarIcon className="w-3 h-3 text-[#FFCA20] -mt-0.5 shrink-0" />
                    <span className="truncate">{formatScore(rank3.score)}</span>
                  </div>
                </div>

                {/* 3D Box Stand */}
                <div className="relative w-full">
                  {/* Top face */}
                  {/* <div className="h-4 bg-[#1a232f] rounded-t-xl border-t border-x border-amber-600/20 skew-x-[-15deg] origin-bottom" /> */}
                  {/* Front face with Medal */}
                  <div className="h-[60px] bg-gradient-to-b from-[#111624] to-[#0c0e16] border-b border-x border-white/30 flex flex-col items-center justify-center rounded-b-xl shadow-md relative">
                    <BigMedal rank={3} color="#fb923c" ribbonColor="#16a34a" className="w-12 h-14" size="sm" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ───────────────── LIST OF CARDS ───────────────── */}
          <div className="space-y-2 mt-4 select-none">
            {restPlayers.map((player) => {
              const isYou = player.isCurrentUser === true;

              return (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${isYou
                    ? "bg-brand-gradient text-brand-black-100 shadow-lg border border-[#DFA208]/30 scale-[1.02]"
                    : "bg-[#1f2029] border border-white/[0.03] text-white/90 hover:bg-[#282935]"
                    }`}
                >
                  {/* Left Side: Rank, Avatar, Name */}
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <span className={`text-sm font-black w-4 text-center ${isYou ? "text-brand-black-100" : "text-white/50"}`}>
                      {player.rank}
                    </span>

                    {/* Avatar */}
                    <img
                      src={player.avatarUrl}
                      alt={player.msisdn}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />

                    {/* Name (MSISDN + (You) indicator for current user) */}
                    <div className="flex flex-col">
                      <span className={`text-sm font-black tracking-wide ${isYou ? "text-brand-black-100" : "text-white"}`}>
                        {player.msisdn}
                      </span>
                      {isYou && (
                        <span className="text-[10px] font-bold text-brand-black-100/70 leading-none">
                          (You)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Score */}
                  <div className="text-right flex items-center gap-1">
                    <StarIcon className={`w-3.5 h-3.5 ${isYou ? "text-brand-black-100" : "text-[#FFCA20]"}`} />
                    <span className={`text-sm font-black font-mono ${isYou ? "text-brand-black-100" : "text-white/90"}`}>
                      {formatScore(player.score)}
                    </span>
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

