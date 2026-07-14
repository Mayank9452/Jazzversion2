import React, { useEffect, useState, useMemo } from "react";
import { Trophy, Crown, Medal, Star, Sparkles, Timer, Zap, Award } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

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

// Mock winner data
const WEEKLY_WINNERS = [
  {
    id: 1,
    rank: 1,
    phone: "+91 98765 43210",
    uniqueNumber: "4523",
    avatar: "winner1",
    time: "2m ago",
  },
  {
    id: 2,
    rank: 2,
    phone: "+91 87654 32109",
    uniqueNumber: "7891",
    avatar: "winner2",
    time: "5m ago",
  },
  {
    id: 3,
    rank: 3,
    phone: "+91 76543 21098",
    uniqueNumber: "2156",
    avatar: "winner3",
    time: "8m ago",
  },
  {
    id: 4,
    rank: 4,
    phone: "+91 65432 10987",
    uniqueNumber: "9384",
    avatar: "winner4",
    time: "12m ago",
  },
  {
    id: 5,
    rank: 5,
    phone: "+91 54321 09876",
    uniqueNumber: "5672",
    avatar: "winner5",
    time: "15m ago",
  },
];

const gradientStyles = [
  "from-indigo-600 to-purple-600",
  "from-emerald-500 to-blue-600",
  "from-rose-500 to-orange-500",
  "from-violet-600 to-pink-500",
];

const getRankIcon = (rank: number) => {
  if (rank === 1)
    return <Crown className="w-4 h-4 text-yellow-400" fill="currentColor" />;
  if (rank <= 5) return <Award className="w-4 h-4 text-white" />;
  return <Star className="w-3 h-3 text-white" />;
};

// Generate random sparkles with staggered animations
const generateSparkles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${2 + Math.random() * 2}s`, // 2-4s
    size: Math.random() > 0.5 ? "w-3 h-3" : "w-2 h-2",
  }));
};

// const sparkles = generateSparkles(15);

export default function WinnerList({ lastWeeklyWinners }) {
  const { t } = useLanguage();

  const cardSparkles = useMemo(() => generateSparkles(5), []);

  const weeklyWinners = useMemo(() => {
    if (!Array.isArray(lastWeeklyWinners)) return [];

    return lastWeeklyWinners.map((item: any, index: number) => {
      // Deterministic avatar index based on user_id or index
      let avatarIndex = (Number(item.user_id || index) % 15) + 1;

      return {
        id: item.cycle_id,
        rank: Number(item.cycle_reward_rank),
        phone: maskMSISDN(item.user_phone),
        avatar: `${avatarIndex}.png`,
        uniqueNumber: item.cycle_id,
        time: t.justNow,
      };
    });
  }, [lastWeeklyWinners, t.justNow]);
  // console.log("lastWeeklyWinners", lastWeeklyWinners);
  return (
    <div className="relative overflow-hidden">
      {/* Floating Gold Sparkles - Background Layer */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className={`absolute ${sparkle.size}`}
            style={{
              left: sparkle.left,
              top: sparkle.top,
              animation: `float-sparkle ${sparkle.duration} ease-in-out infinite`,
              animationDelay: sparkle.delay,
            }}
          >
            <Sparkles className="text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]" fill="currentColor" />
          </div>
        ))}
      </div> */}

      <div className=" px-2 relative z-10">
        {/* Header Section with Sparkles */}
        <div className="rounded-xl relative bg-gradient-to-r from-[#0a0f7ac4] to-pink-700 pt-4 pb-16 px-3 overflow-hidden mb-4">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />

          {/* Header Sparkles */}
          {/* {sparkles.slice(0, 8).map((sparkle) => (
            <div
              key={`header-${sparkle.id}`}
              className="absolute w-1 h-1"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                animation: `twinkle ${sparkle.duration} ease-in-out infinite`,
                animationDelay: sparkle.delay,
              }}
            >
              <div className="w-full h-full bg-yellow-300 rounded-full shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
            </div>
          ))} */}

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center relative">
                <Trophy className="w-6 h-6 text-white" fill="currentColor" />
                {/* Trophy Sparkle */}
                <div className="absolute -top-1 -right-1 w-2 h-2 animate-ping">
                  <Sparkles
                    className="w-2 h-2 text-yellow-300"
                    fill="currentColor"
                  />
                </div>
              </div>
              {cardSparkles.map((sparkle) => (
                <div
                  key={`card-${sparkle.id}`}
                  className="absolute w-1 h-1"
                  style={{
                    left: sparkle.left,
                    top: sparkle.top,
                    animation: `twinkle ${sparkle.duration} ease-in-out infinite`,
                    animationDelay: sparkle.delay,
                  }}
                >
                  <div className="w-full h-full bg-yellow-300 rounded-full shadow-[0_0_6px_rgba(253,224,71,0.9)]" />
                </div>
              ))}
              <h1 className="text-xl font-bold text-white ">
                {t.weeklyWinners}
              </h1>
            </div>
            <p className="text-center text-white/90 text-sm font-semibold ">
              {t.congratulationsChampions}
            </p>
          </div>
        </div>

        {/* Scrolling Section */}
        <div className="relative -mt-20 mx-1">
          <div className="relative overflow-hidden py-2 pb-1">
            <div
              className={`
    flex gap-4 px-4 will-change-transform
    ${weeklyWinners.length > 1
                  ? "animate-[slide-right_25s_linear_infinite] hover:[animation-play-state:paused] w-max"
                  : "justify-center"
                }
  `}
            >
              {[...weeklyWinners, ...weeklyWinners].map((winner, index) => (
                <WinnerBanner
                  key={`${winner.id}-${index}`}
                  winner={winner}
                  bgGradient={gradientStyles[(index % weeklyWinners.length) % gradientStyles.length]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float-sparkle {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 1;
          }
          75% {
            transform: translateY(-15px) rotate(270deg);
            opacity: 0.6;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes sparkle-rotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes shimmer-sparkle {
          0%, 100% {
            opacity: 0;
            transform: translateX(-100%) translateY(-100%);
          }
          50% {
            opacity: 1;
            transform: translateX(100%) translateY(100%);
          }
        }

        
      `}</style>
    </div>
  );
}

const WinnerBanner = React.memo(({ winner, bgGradient }: any) => {
  const { t } = useLanguage();
  const cardSparkles = useMemo(() => generateSparkles(3), []);
  // console.log("winner", winner);

  return (
    <div
      className={`relative flex-shrink-0 w-[260px] rounded-2xl p-3 shadow-lg border border-white/20 overflow-hidden bg-gradient-to-br ${bgGradient} active:scale-95 transition-transform will-change-transform`}
    >
      {/* Card-specific floating sparkles */}
      {cardSparkles.map((sparkle) => (
        <div
          key={`card-${sparkle.id}`}
          className="absolute w-1 h-1"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animation: `twinkle ${sparkle.duration} ease-in-out infinite`,
            animationDelay: sparkle.delay,
          }}
        >
          <div className="w-full h-full bg-yellow-300 rounded-full shadow-[0_0_6px_rgba(253,224,71,0.9)]" />
        </div>
      ))}

      {/* Background Decorative Icon */}
      <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-white/10 -rotate-12" />

      {/* Diagonal Shimmer Effect */}
      {/* <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-200/20 to-transparent"
        style={{
          animation: 'shimmer-sparkle 3s ease-in-out infinite',
          animationDelay: `${winner.rank * 0.5}s`
        }}
      /> */}

      {/* Avatar + Info */}
      <div className="flex items-center justify-evenly gap-1">
        <div className="flex-shrink-0 relative">
          <div className="w-12 h-12 rounded-xl bg-white/30 p-0.5 border-2 border-white/40 shadow-xl">
            <div className="w-full h-full rounded-lg overflow-hidden bg-white">
              <img
                src={`/assets/users/${winner.avatar}`}
                alt="Winner"
                className="w-full h-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          {/* Avatar Corner Sparkle for Rank 1 */}
          {winner.rank === 1 && (
            <div className="absolute -top-1 -right-1">
              <Sparkles
                className="w-3 h-3 text-yellow-300 drop-shadow-[0_0_4px_rgba(250,204,21,1)]"
                fill="currentColor"
                style={{
                  animation: "sparkle-rotate 1.5s linear infinite",
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center w-[50%] gap-1">
          <div className="text-sm font-bold text-white">{winner.phone}</div>
          <div className="flex flex-col justify-center gap-1">
            <div className="text-[11px] font-semibold text-white  italic leading-none">
              {t.uniqueBidNumber}
            </div>
            <div className="text-[11px] font-semibold leading-none">
              {winner.uniqueNumber}
            </div>
            {/* {winner.rank === 1 && (
                <span className="text-[9px] font-bold text-yellow-300 flex items-center gap-1 animate-pulse">
                  🏆 TOP PRIZE
                </span>
              )} */}
          </div>
        </div>
        <div className="relative z-10 flex flex-col justify-center">
          {/* Top Row: Rank & Icon */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              {/* <div className="w-2 h-2 rounded-full bg-white" /> */}
              <span className="text-[10px] font-semibold text-white uppercase tracking-widest">
                {t.rank} {winner.rank}
              </span>
            </div>
            <div className="bg-white/30 p-1 rounded-lg border border-white/70 relative">
              {getRankIcon(winner.rank)}
              {/* Icon Sparkle for Top 3 */}
              {winner.rank <= 3 && (
                <div className="absolute -top-1 -right-1 w-2 h-2">
                  <Sparkles
                    className="w-2 h-2 text-yellow-300"
                    fill="currentColor"
                    style={{
                      animation: "sparkle-rotate 2s linear infinite",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shine Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
});
