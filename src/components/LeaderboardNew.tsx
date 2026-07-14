import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Crown,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Zap,
  Gem,
} from "lucide-react";
import type { LeaderboardUser } from "@/types";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";

interface LeaderboardProps {
  weeklyUsers: LeaderboardUser[];
  monthlyUsers: LeaderboardUser[];
}

const maskMSISDN = (phone: string) => {
  if (!phone || phone.length < 12) return phone;

  // Remove first 2 digits (country code like 95)
  const trimmed = phone.slice(2);

  // Ensure it's 10 digits after trimming
  if (trimmed.length !== 10) return phone;

  const start = trimmed.slice(0, 3);
  const end = trimmed.slice(-3);

  return `${start}xxxx${end}`;
};

const generatePhone = (userId: string | number) => {
  const num = Number(userId);

  // create pseudo-random but stable 9-digit number
  const randomPart = (num * 9301 + 49297) % 1000000000;

  const padded = String(randomPart).padStart(9, "0");

  const actualNumber = `9${padded}`;

  return `95${actualNumber}`;
};

export default function LeaderboardNew({
  weeklyUsers,
  monthlyUsers,
}: LeaderboardProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const formatUsers = useCallback((data: any) => {
    if (!data) return [];

    const combined = [...(data.top_3 || []), ...(data.others || [])];

    return combined.map((user: any) => {
      // Deterministic avatar index based on user_id
      let avatarIndex = (Number(user.user_id) % 15) + 1;

      return {
        id: user.user_id,
        name: `User ${user.user_id}`, // fallback name
        phone: maskMSISDN(`${user.user_phone}`),
        score: Number(user.points),
        bids: user.bidsCount || (Number(user.user_id) % 900) + 100, // stable pseudo-random
        avatar: `${avatarIndex}.png`,
      };
    });
  }, [t.bids]);

  const users = useMemo(() =>
    activeTab === "weekly"
      ? formatUsers(weeklyUsers)
      : formatUsers(monthlyUsers)
    , [activeTab, weeklyUsers, monthlyUsers, formatUsers]);

  const topThree = useMemo(() => users.slice(0, 3), [users]);
  const theRest = useMemo(() => users.slice(3, 5), [users]);

  return (
    <div className="w-full max-w-md mx-auto relative group -mt-16">
      {/* Outer Glow / Mesh Gradient Background */}
      <div className="absolute -inset-1 rounded-[2.6rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

      <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] px-2 pb-2 pt-4 overflow-hidden">
        {/* Decorative Animated Blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/50 rounded-xl blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/50 rounded-xl blur-3xl animate-pulse" />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center px-3">
            <div className="space-y-1 w-1/2">
              <div className="flex items-center gap-2">
                {/* <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" /> */}
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ">
                  {t.rankings}
                </h2>
              </div>
              {/* <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-7">
                {t.live}
              </p> */}
            </div>

            {/* Custom Styled Switch */}
            <div className="flex bg-slate-100/80 p-1 rounded-2xl shadow-inner">
              {["weekly", "monthly"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`relative px-4 py-2 text-xs font-bold capitalize transition-all duration-500 rounded-xl ${activeTab === tab ? "text-white" : "text-slate-500"
                    }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="vibrantTab"
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 text-white rounded-xl shadow-lg shadow-indigo-200"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10  text-sm">
                    {tab === "weekly" ? t.weekly : t.monthly}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D-Style Podium */}
        <div className="relative z-10 flex items-end justify-center pt-3 h-54">
          {topThree[1] && (
            <PodiumItem user={topThree[1]} rank={2} type="silver" delay={0.1} />
          )}
          {topThree[0] && (
            <PodiumItem user={topThree[0]} rank={1} type="gold" delay={0} />
          )}
          {topThree[2] && (
            <PodiumItem user={topThree[2]} rank={3} type="bronze" delay={0.2} />
          )}
        </div>

        {/* List Section with Gradient Accents */}
        <div className="relative z-10 space-y-1 mt-2">
          <AnimatePresence mode="popLayout">
            {theRest.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex items-center justify-between p-4 bg-gradient-to-br from-violet-100 to-indigo-100 
hover:from-violet-200 hover:to-indigo-200 rounded-[1.5rem] transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 text-center font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                    {index + 4}
                  </div>
                  {/* <div className="relative">
                    <img
                      src={`https://bidblast.club/assets/frontend/users/${index + 1}.png`}
                      className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-slate-100 p-0.5"
                      alt="avatar"
                    />
                  </div> */}
                  <div
                    className={`w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-0.5`}
                  >
                    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                      <img
                        src={`/assets/users/${user.avatar}`}
                        alt={user.name}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {user.phone}
                    </h4>
                    <span className="text-xs font-bold text-pink-600 ">
                      {user.bids} {t.bids}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-slate-900">
                      <div className="relative ">
                        <img
                          src="/assets/images/diamond5.png"
                          alt="diamond"
                          className="h-5  object-cover"
                        />

                        {/* premium shimmer */}
                        {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent 
                                animate-[shimmer_2s_linear_infinite] opacity-50 rotate-[25deg] pointer-events-none rounded-full" /> */}
                      </div>
                      <span>{user.score.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* <div className="text-[10px] font-bold text-emerald-500 flex items-center justify-end">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                  </div> */}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Button - Neon Style */}
        <button
          className="relative z-10 w-full mt-2 py-4 bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 text-white rounded-2xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 "
          onClick={() => {
            navigate("/leaderboard");
          }}
        >
          {t.seeFullRankings} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// function PodiumItem({ user, rank, color, delay, isGold, height }: any) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.8, type: "spring" }}
//       className="relative flex flex-col items-center flex-1 group"
//     >
//       <div className="relative mb-4">
//         {/* Avatar with Ring */}
//         <div
//           className={`w-16 h-16 rounded-xl p-1 ${isGold ? "bg-gradient-to-tr from-yellow-400 to-amber-600" : "bg-slate-200"} shadow-lg transition-transform duration-500 group-hover:scale-110`}
//         >
//           <div className="bg-white rounded-xl w-full h-full flex items-center justify-center overflow-hidden">
//             <img
//               src={`https://bidblast.club/assets/frontend/users/${Math.floor(Math.random() * 10) + 1}.png`}
//               alt="user"
//               className="w-12 h-12"
//             />
//           </div>
//         </div>

//         {/* Rank Badge */}
//         <div
//           className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${color} ${isGold ? "text-white" : "text-slate-700"} text-[10px] font-bold w-7 h-7 flex items-center justify-center rounded-xl shadow-lg border-2 border-white`}
//         >
//           {rank}
//         </div>

//         {isGold && (
//           <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-400 w-7 h-7 drop-shadow-lg animate-bounce" />
//         )}
//       </div>

//       <div className="text-center z-10 mb-2">
//         <p className="text-[11px] font-bold text-slate-800 truncate px-1">
//           {user.phone}
//         </p>
//         <p className="text-xs font-bold text-indigo-600">
//           {user.score.toLocaleString()}
//         </p>
//       </div>

//       {/* The 3D Podium Block */}
//       <motion.div
//         initial={{ height: 0 }}
//         animate={{ height: isGold ? 100 : rank === 2 ? 70 : 50 }}
//         className={`w-full rounded-t-[1.5rem] bg-gradient-to-b ${isGold ? "from-amber-500/50 to-amber-500/50" : "from-cyan-200/50 to-cyan-200"} border-x border-t border-slate-100 shadow-inner`}
//       />
//     </motion.div>
//   );
// }

const PodiumItem = React.memo(({ user, rank, type, delay }: any) => {
  const { t } = useLanguage();
  const styles = {
    gold: {
      ring: {
        background:
          "linear-gradient(135deg, hsl(45, 85%, 35%), hsl(48, 95%, 75%), hsl(45, 85%, 35%))",
      },
      badge: "bg-yellow-500 text-white",
      podium: {
        background:
          "linear-gradient(135deg, hsl(45, 85%, 35%), hsl(48, 95%, 75%), hsl(45, 85%, 35%))",
      },
      glow: "shadow-yellow-500/40",
      text: "text-yellow-500",
    },
    silver: {
      ring: {
        background:
          "linear-gradient(135deg, hsl(0, 0%, 55%), hsl(0, 0%, 90%), hsl(0, 0%, 55%))",
      },
      badge: "bg-gray-500 text-white",
      podium: {
        background:
          "linear-gradient(135deg, hsl(0, 0%, 55%), hsl(0, 0%, 90%), hsl(0, 0%, 55%))",
      },
      glow: "shadow-gray-400/30",
      text: "text-gray-500",
    },
    bronze: {
      ring: {
        background:
          "linear-gradient(135deg, hsl(25, 70%, 35%), hsl(30, 80%, 65%), hsl(25, 70%, 35%))",
      },
      badge: "bg-orange-500 text-white",
      podium: {
        background:
          "linear-gradient(135deg, hsl(25, 70%, 35%), hsl(30, 80%, 65%), hsl(25, 70%, 35%))",
      },
      glow: "shadow-orange-500/40",
      text: "text-orange-500",
    },
  };

  const current = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, type: "spring" }}
      className="relative flex flex-col items-center flex-1 group gap-1"
    >
      {/* Avatar */}
      <div className="relative mb-4">
        {/* <div
          className={`w-16 h-16 rounded-xl p-[2px] ${current.ring} shadow-xl ${current.glow} transition-transform duration-500 group-hover:scale-110`}
        > */}
        <div
          style={current.ring}
          className={`w-16 h-16 rounded-xl p-[2px] shadow-xl ${current.glow}`}
        >
          <div className="bg-white rounded-xl w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={`/assets/users/${user.avatar}`}
              alt="user"
              className="w-12 h-12"
            />
          </div>
        </div>

        {/* Rank Badge */}
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${current.badge} text-xs font-bold w-7 h-7 flex items-center justify-center rounded-xl shadow-lg border-2 border-white`}
        >
          {rank}
        </div>

        {/* Crown only for Gold */}
        {type === "gold" && (
          <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 text-yellow-400 w-7 h-7 drop-shadow-lg animate-bounce" />
        )}
      </div>

      {/* User Info */}
      <div className="text-center flex flex-col justify-center items-center gap-2 text-xs">
        <p className=" font-bold text-slate-800 truncate px-1">
          {user.phone}
        </p>
        <div className="text-right">
          <div className="flex items-center justify-center gap-1 font-bold text-indigo-600">
            <div className="relative ">
              <img
                src="/assets/images/diamond5.png"
                alt="diamond"
                className="h-5 object-cover"
              />

              {/* premium shimmer */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent 
                                animate-[shimmer_2s_linear_infinite] opacity-50 rotate-[25deg] pointer-events-none rounded-full" /> */}
            </div>
            <span>{user.score.toLocaleString()}</span>
          </div>
        </div>
        {/* <p className="text-sm font-bold text-indigo-600">
          
          <Gem className="h-4 w-4 text-blue-400" />
          <span>{user.score.toLocaleString()}</span>
        </p> */}

        <p className={`font-bold  ${current.text}`}>
          {user.bids.toLocaleString()} {t.bids}
        </p>
      </div>

      {/* Podium Block - Hardware accelerated */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5, ease: "easeOut" }}
        style={{
          ...current.podium,
          height: type === "gold" ? 110 : type === "silver" ? 80 : 60,
          transformOrigin: "bottom"
        }}
        className="w-full rounded-t-[1.5rem] border-x border-t border-white/30 shadow-inner will-change-transform"
      />
    </motion.div>
  );
});
