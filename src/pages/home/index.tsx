import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchJazzHomeDataThunk, fetchJazzInstantGamesThunk } from "@/features/jazzHome/jazzHomeSlice";

import ArGames from "./ArGames";
import HeroSliderNew from "./HeroSliderNew";
import HeroSliderTwoNew from "./HeroSliderTwoNew";
import WeeklyTournamentNew from "./WeeklyTournamentNew";
import SuggestedGamesNew from "./SuggestedGamesNew";
import InstantGamesNew from "./InstantGamesNew";
import DailyTournamentNew from "./DailyTournamentNew";

import { Link, useNavigate } from "react-router-dom";
import { BottomNavBar } from "@/components/BottomNavBar";
import { TopBar } from "@/components/TopBar";
import { Trophy, Calendar, Flame, Zap, Gamepad2, Star, Target, Swords, Car, Clock, ShieldAlert, Compass } from "lucide-react";
import { useTheme } from "next-themes";
import WeeklyTournamentTesting from "./WeeklyTournamentTesting";
import WeeklyTournamentTestingV2 from "./WeeklyTournamentTestingV2";
import DailyTournamentNewTesting from "./DailyTournamentNewTesting";
import DailyTournamentNewTestingV from "./DailyTournamentNewTestingV";
import HeroSliderTwoNewTesting from "./HeroSliderTwoNewTesting";
import JazzPremiumZone from "./JazzPremiumZone";
import TargetChallengeZone from "./TargetChallengeZone";
import TargetChallengeZoneLandscape from "./TargetChallengeZoneLandscape";
import DailyTournamentNewTesting3 from "./DailyTournamentNewTesting3";
import DailyTournamentNewTesting4 from "./DailyTournamentNewTesting4";
import DailyTournamentNewTesting5 from "./DailyTournamentNewTesting5";
import DailyTournamentNewTesting6 from "./DailyTournamentNewTesting6";
import DailyTournamentNewTesting7 from "./DailyTournamentNewTesting7";
import DailyTournamentMixedTesting from "./DailyTournamentMixedTesting";
import DailyTournamentMixedTesting2 from "./DailyTournamentMixedTesting2";

/* ─── Section Header ─────────────────────────────────────────────────────── */

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  accent?: "purple" | "blue" | "aqua";
  action?: { label: string; href: string };
  extra?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  accent = "purple",
  action,
  extra,
}) => {
  return (
    <div className="flex items-center justify-between mb-4.5 px-0.5">
      <div className="flex items-center gap-2.5">
        {/* Icon */}
        {icon && (
          <span className="flex items-center justify-center p-2 rounded-xl bg-brand-yellow-100/10 dark:bg-brand-yellow-100/15 text-brand-gold-100 dark:text-brand-yellow-100 border border-brand-yellow-100/20 dark:border-brand-yellow-100/10 shadow-sm shadow-brand-yellow-100/5">
            {icon}
          </span>
        )}
        {/* Title */}
        <h2 className="text-brand-black-100 dark:text-white font-black text-[13px] tracking-wide">
          {title}
        </h2>
      </div>
      {extra ? (
        extra
      ) : (
        action && (
          <Link
            to={action.href}
            className="text-[10px] font-black text-brand-gold-100 dark:text-brand-yellow-100 hover:opacity-80 transition-opacity flex items-center gap-0.5"
          >
            {action.label}
            <span className="text-[9px] font-black">&gt;</span>
          </Link>
        )
      )}
    </div>
  );
};

/* ─── Section Wrapper ─────────────────────────────────────────────────────── */

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`mb-0 ${className}`}>
    {children}
  </div>
);

/* ─── Spin & Win Banner ───────────────────────────────────────────────────── */

const SpinWinBanner: React.FC = () => (
  <Link
    to="/spin-win"
    className="group block w-full rounded-2xl overflow-hidden border border-primary/20
               shadow-sm transition-all duration-300
               active:scale-95 hover:border-primary/40"
  >
    <div className="relative">
      <img
        src="/assets/images/img/spinbanner.jpg"
        alt="Spin and Win"
        className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
      />
      {/* Subtle overlay gradient so it blends with bg */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#12122a]/60 to-transparent pointer-events-none" />
    </div>
  </Link>
);

/* ─── Loading skeleton ────────────────────────────────────────────────────── */

const SkeletonPulse: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />
);

const LoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-6">
    <SkeletonPulse className="h-44 w-full" />
    <div className="space-y-2">
      <SkeletonPulse className="h-4 w-1/3" />
      <SkeletonPulse className="h-28 w-full" />
    </div>
    <div className="space-y-2">
      <SkeletonPulse className="h-4 w-1/3" />
      <SkeletonPulse className="h-28 w-full" />
    </div>
    <div className="space-y-2">
      <SkeletonPulse className="h-4 w-1/3" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonPulse className="h-36" />
        <SkeletonPulse className="h-36" />
      </div>
    </div>
  </div>
);

/* ─── Category Navigation ────────────────────────────────────────────────── */

const categories = [
  { id: "all", label: "Friends Cricket", image: "/assets/images/friend cricket name.png" },
  { id: "action", label: "Zombie Uprising", image: "/assets/images/Zombie Uprising.png" },
  { id: "moba", label: "Tropical Slicer", image: "/assets/images/Tropical Slicer name.png" },
  { id: "racing", label: "Road Racer", image: "/assets/images/Road Racer name.png" },
  { id: "adventure", label: "Gogi Adventure", image: "/assets/images/gogi name.png" }
];

const trendingCategories = [
  { id: "all", label: "All Games", image: "/assets/images/Road Racer.png" },
  { id: "action", label: "Action", image: "/assets/images/friend cricket.png" },
  { id: "shooter", label: "Shooter", image: "/assets/images/color up.png" },
  { id: "moba", label: "MOBA", image: "/assets/images/Tropical Slicer.png" },
  { id: "racing", label: "Racing", image: "/assets/images/car_raing.png" },
  { id: "adventure", label: "Adventure", image: "/assets/images/gogi.png" },
  { id: "sports", label: "Sports", image: "/assets/images/friend cricket.png" },
  { id: "arcade", label: "Arcade", image: "/assets/images/Alien Galaxy.png" },
  { id: "puzzle", label: "Puzzle", image: "/assets/images/box tower.jpeg" }
];

const CategoryNavigation = ({ categoriesList = categories }: { categoriesList?: typeof categories }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (catId: string, label: string) => {
    setActiveCategory(catId);
    navigate("/games", { state: { scrollToCategory: label === "All Games" ? "" : label } });
  };

  return (
    <div className="relative overflow-hidden py-1">
      <div
        className="flex gap-1 w-max px-2 animate-slide-right hover:[animation-play-state:paused] will-change-transform"
        style={{ animationDuration: "15s" }}
      >
        {[...categoriesList, ...categoriesList, ...categoriesList].map((cat, index) => {
          const isActive = activeCategory === cat.id;
          const imageUrl = cat.image;

          return (
            <div
              key={`${cat.id}-${index}`}
              onClick={() => handleCategoryClick(cat.id, cat.label)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 active:scale-95"
            >
              {/* Glassmorphic Circle Container */}
              <div
                className={` w-[110px] h-[110px] rounded-full flex items-center justify-center border-2 backdrop-blur-[12px] transition-all duration-300 ${isActive
                  ? "bg-brand-yellow-100/25 dark:bg-brand-yellow-100/15 border-brand-yellow-100 dark:border-brand-yellow-100/80 shadow-[0_6px_15px_rgba(255,202,32,0.25)] "
                  : "bg-white/70 dark:bg-white/[0.03] border-brand-yellow-200/30 dark:border-brand-yellow-100/10 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                  }`}
              >
                <img
                  src={imageUrl}
                  alt={cat.label}
                  className={`w-full h-full object-cover rounded-full transition-transform duration-300 ${isActive ? "scale-105" : ""}`}
                />
              </div>

              {/* Sub-line Indicator */}
              {/* {isActive && (
                <div className="w-8 h-[2.5px] rounded-full bg-primary" />
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoryNavigationTesting = ({ categoriesList = categories }: { categoriesList?: typeof categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (catId: string, label: string) => {
    navigate("/games", { state: { scrollToCategory: label } });
  };

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="flex gap-3 w-max px-2 animate-slide-right hover:[animation-play-state:paused] will-change-transform"
        style={{ animationDuration: "15s" }}
      >
        {[...categoriesList, ...categoriesList, ...categoriesList].map((cat, index) => {
          const imageUrl = cat.image;

          return (
            <div
              key={`${cat.id}-${index}`}
              onClick={() => handleCategoryClick(cat.id, cat.label)}
              className="flex flex-col items-center cursor-pointer group transition-transform duration-300 active:scale-95"
            >
              {/* Premium Image Card Container */}
              <div
                className="w-[110px] h-[110px] rounded-[2rem] flex items-center justify-center border border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-[8px] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden group-hover:border-brand-yellow-100/60 group-hover:shadow-[0_6px_20px_rgba(255,202,32,0.15)]"
              >
                <img
                  src={imageUrl}
                  alt={cat.label}
                  className="w-full h-full object-cover rounded-[2rem] transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Game Title Label */}
              {/* <span
                className="text-[10px] font-black uppercase tracking-wider transition-colors duration-300 mt-2 text-slate-700 dark:text-slate-300 group-hover:text-brand-gold-100 dark:group-hover:text-brand-yellow-100 text-start max-w-[95px] truncate"
              >
                {cat.label}
              </span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CatAllIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-all" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="20%" stopColor="#F3F4F6" />
        <stop offset="60%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#374151" />
      </linearGradient>
      <linearGradient id="cat-gold-all" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(45)">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="cat-stick-all" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#4B5563" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>

    {/* Main Controller Body with thick shadow outline */}
    <path
      d="M 18 12 Q 32 15 46 12 C 54 12 60 18 60 28 C 60 40 51 52 45 52 C 40 52 36 44 32 44 C 28 44 24 52 19 52 C 13 52 4 40 4 28 C 4 18 10 12 18 12 Z"
      fill="url(#cat-silver-all)"
      stroke="#000000"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Specular Highlight Curve on Top */}
    <path
      d="M 18 14 Q 32 17 46 14 C 52 14 56 16 57 21 C 50 17 41 18 32 18 C 23 18 14 17 7 21 C 8 16 12 14 18 14 Z"
      fill="#FFFFFF"
      fillOpacity="0.45"
    />

    {/* Custom Gold Accent Grip Plates on Sides */}
    <path
      d="M 4 28 C 4 40 13 52 19 52 C 17 46 13 36 13 28 C 13 22 10 16 8 14 C 5 18 4 23 4 28 Z"
      fill="url(#cat-gold-all)"
      stroke="#000000"
      strokeWidth="1.5"
      opacity="0.85"
    />
    <path
      d="M 60 28 C 60 40 51 52 45 52 C 47 46 51 36 51 28 C 51 22 54 16 56 14 C 59 18 60 23 60 28 Z"
      fill="url(#cat-gold-all)"
      stroke="#000000"
      strokeWidth="1.5"
      opacity="0.85"
    />

    {/* D-Pad (Left side) centered at (15, 25) */}
    {/* Black shadow path for D-pad */}
    <path
      d="M 9 24 H 13 V 20 H 17 V 24 H 21 V 28 H 17 V 32 H 13 V 28 H 9 Z"
      fill="#000000"
      stroke="#000000"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Golden D-Pad fill */}
    <path
      d="M 9 24 H 13 V 20 H 17 V 24 H 21 V 28 H 17 V 32 H 13 V 28 H 9 Z"
      fill="url(#cat-gold-all)"
      stroke="#000000"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Subtle D-Pad cross lines */}
    <path d="M 15 21 V 31 M 10 26 H 20" stroke="#B45309" strokeWidth="0.8" strokeLinecap="round" />

    {/* Action Buttons (Right side) centered at (48, 25) */}
    {/* Y Button (Top) */}
    <circle cx="48" cy="19" r="3.2" fill="#000000" />
    <circle cx="48" cy="18.5" r="2.5" fill="url(#cat-gold-all)" stroke="#000000" strokeWidth="0.5" />

    {/* X Button (Left) */}
    <circle cx="43.5" cy="24.5" r="3.2" fill="#000000" />
    <circle cx="43.5" cy="24.0" r="2.5" fill="url(#cat-gold-all)" stroke="#000000" strokeWidth="0.5" />

    {/* B Button (Right) */}
    <circle cx="52.5" cy="24.5" r="3.2" fill="#000000" />
    <circle cx="52.5" cy="24.0" r="2.5" fill="url(#cat-gold-all)" stroke="#000000" strokeWidth="0.5" />

    {/* A Button (Bottom) */}
    <circle cx="48" cy="30" r="3.2" fill="#000000" />
    <circle cx="48" cy="29.5" r="2.5" fill="url(#cat-gold-all)" stroke="#000000" strokeWidth="0.5" />

    {/* Left Analog Stick centered at (26, 39) */}
    <circle cx="26" cy="39" r="6.5" fill="#000000" />
    <circle cx="26" cy="39" r="5.5" fill="url(#cat-gold-all)" />
    <circle cx="26" cy="39" r="4.5" fill="url(#cat-stick-all)" stroke="#000000" strokeWidth="0.8" />
    <circle cx="26" cy="39" r="1.5" fill="#9CA3AF" />

    {/* Right Analog Stick centered at (38, 39) */}
    <circle cx="38" cy="39" r="6.5" fill="#000000" />
    <circle cx="38" cy="39" r="5.5" fill="url(#cat-gold-all)" />
    <circle cx="38" cy="39" r="4.5" fill="url(#cat-stick-all)" stroke="#000000" strokeWidth="0.8" />
    <circle cx="38" cy="39" r="1.5" fill="#9CA3AF" />

    {/* Start / Select Buttons */}
    <rect x="26.5" y="27.5" width="4" height="2" rx="1" fill="#000000" transform="rotate(-15 26.5 27.5)" />
    <rect x="26.5" y="27" width="4" height="1.8" rx="0.9" fill="url(#cat-gold-all)" transform="rotate(-15 26.5 27)" />

    <rect x="33.5" y="27.5" width="4" height="2" rx="1" fill="#000000" transform="rotate(-15 33.5 27.5)" />
    <rect x="33.5" y="27" width="4" height="1.8" rx="0.9" fill="url(#cat-gold-all)" transform="rotate(-15 33.5 27)" />

    {/* Glowing Center Logo Button at (32, 20) */}
    <circle cx="32" cy="20.5" r="4.2" fill="#000000" />
    <circle cx="32" cy="20" r="3.5" fill="url(#cat-gold-all)" />
    <polygon
      points="32,18.2 32.8,19.6 34.4,19.8 33.2,20.8 33.6,22.4 32,21.5 30.4,22.4 30.8,20.8 29.6,19.8 31.2,19.6"
      fill="#FFFFFF"
    />
  </svg>
)

const CatActionIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-action" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E5E7EB" />
        <stop offset="70%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="cat-gold-action" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path d="M 38 6 L 18 34 H 30 L 22 58 L 46 28 H 32 Z" stroke="#000000" strokeWidth="5" strokeLinejoin="round" />
    <path d="M 38 6 L 18 34 H 30 L 22 58 L 46 28 H 32 Z" fill="url(#cat-silver-action)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 36 10 L 23 31 H 32 L 26 50 L 41 29 H 31 Z" fill="url(#cat-gold-action)" opacity="0.85" />
  </svg>
)

const CatShooterIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-shooter" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E5E7EB" />
        <stop offset="70%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="cat-gold-shooter" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="22" stroke="#000000" strokeWidth="4.5" />
    <circle cx="32" cy="32" r="22" fill="url(#cat-silver-shooter)" stroke="#000000" strokeWidth="2" />
    <circle cx="32" cy="32" r="14" stroke="#000000" strokeWidth="3" />
    <circle cx="32" cy="32" r="14" fill="#6B7280" stroke="#000000" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="7" stroke="#000000" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="7" fill="url(#cat-gold-shooter)" stroke="#000000" strokeWidth="1.2" />
    <path d="M 32 6 V 16" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 32 6 V 16" stroke="url(#cat-gold-shooter)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 32 48 V 58" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 32 48 V 58" stroke="url(#cat-gold-shooter)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 6 32 H 16" stroke="#000000" strokeWidth="4.5" stroke-linecap="round" />
    <path d="M 6 32 H 16" stroke="url(#cat-gold-shooter)" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 48 32 H 58" stroke="#000000" strokeWidth="4.5" stroke-linecap="round" />
    <path d="M 48 32 H 58" stroke="url(#cat-gold-shooter)" stroke-width="2.5" stroke-linecap="round" />
  </svg>
)

const CatMobaIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-moba" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#374151" />
      </linearGradient>
      <linearGradient id="cat-gold-moba" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(45)">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path d="M 46 12 L 48 18 L 22 44 L 18 40 Z" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 46 12 L 48 18 L 22 44 L 18 40 Z" fill="url(#cat-silver-moba)" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 16 46 L 24 38" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
    <path d="M 16 46 L 24 38" stroke="url(#cat-gold-moba)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 17 45 L 11 51" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 17 45 L 11 51" stroke="#4B5563" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="10.5" cy="51.5" r="3" fill="url(#cat-gold-moba)" stroke="#000000" strokeWidth="1.5" />
    <path d="M 18 12 L 46 40 L 42 44 L 16 18 Z" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 18 12 L 46 40 L 42 44 L 16 18 Z" fill="url(#cat-silver-moba)" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 48 46 L 40 38" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
    <path d="M 48 46 L 40 38" stroke="url(#cat-gold-moba)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 47 45 L 53 51" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 47 45 L 53 51" stroke="#4B5563" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="53.5" cy="51.5" r="3" fill="url(#cat-gold-moba)" stroke="#000000" strokeWidth="1.5" />
  </svg>
)

const CatRacingIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-racing" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E5E7EB" />
        <stop offset="70%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="cat-gold-racing" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="22" stroke="#000000" strokeWidth="6.5" />
    <circle cx="32" cy="32" r="22" fill="url(#cat-silver-racing)" stroke="#000000" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="16" fill="#111827" stroke="#000000" strokeWidth="2.5" />
    <path d="M 12 32 H 24" stroke="#000000" strokeWidth="5" />
    <path d="M 12 32 H 24" stroke="url(#cat-silver-racing)" strokeWidth="2" />
    <path d="M 40 32 H 52" stroke="#000000" stroke-width="5" />
    <path d="M 40 32 H 52" stroke="url(#cat-silver-racing)" strokeWidth="2" />
    <path d="M 32 40 V 52" stroke="#000000" stroke-width="5" />
    <path d="M 32 40 V 52" stroke="url(#cat-silver-racing)" stroke-width="2" />
    <circle cx="32" cy="32" r="6" stroke="#000000" strokeWidth="3" />
    <circle cx="32" cy="32" r="6" fill="url(#cat-gold-racing)" stroke="#000000" strokeWidth="1.2" />
  </svg>
)

const CatAdventureIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-adventure" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E5E7EB" />
        <stop offset="70%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="cat-gold-adventure" x1="32" y1="14" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="22" stroke="#000000" strokeWidth="5" />
    <circle cx="32" cy="32" r="22" fill="url(#cat-silver-adventure)" stroke="#000000" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="18" fill="#1F2937" stroke="#000000" strokeWidth="2" />
    <path d="M 32 16 V 19" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
    <path d="M 32 45 V 48" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
    <path d="M 16 32 H 19" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
    <path d="M 45 32 H 48" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
    <path d="M 32 14 L 36 32 L 32 29 Z" fill="url(#cat-gold-adventure)" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 32 14 L 28 32 L 32 29 Z" fill="#D97706" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 32 50 L 36 32 L 32 35 Z" fill="#E5E7EB" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 32 50 L 28 32 L 32 35 Z" fill="#9CA3AF" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="32" cy="32" r="3.5" fill="#FFE047" stroke="#000000" strokeWidth="2" />
  </svg>
)

const CatSportsIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-sports" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E5E7EB" />
        <stop offset="70%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="cat-gold-sports" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path d="M 16 48 L 44 20 L 48 24 L 20 52 Z" stroke="#000000" strokeWidth="5" strokeLinejoin="round" />
    <path d="M 12 52 L 16 48" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
    <path d="M 16 48 L 44 20 L 48 24 L 20 52 Z" fill="url(#cat-silver-sports)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 12 52 L 16 48" stroke="url(#cat-gold-sports)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="46" cy="46" r="8" stroke="#000000" strokeWidth="5" />
    <circle cx="46" cy="46" r="8" fill="url(#cat-gold-sports)" stroke="#000000" strokeWidth="2.5" />
  </svg>
);

const CatArcadeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-arcade" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E5E7EB" />
        <stop offset="70%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="cat-gold-arcade" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path d="M 14 46 L 50 46 L 46 54 L 18 54 Z" stroke="#000000" strokeWidth="5" strokeLinejoin="round" />
    <path d="M 14 46 L 50 46 L 46 54 L 18 54 Z" fill="url(#cat-silver-arcade)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 32 46 V 26" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
    <path d="M 32 46 V 26" stroke="url(#cat-silver-arcade)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="20" r="9" stroke="#000000" strokeWidth="5" />
    <circle cx="32" cy="20" r="9" fill="url(#cat-gold-arcade)" stroke="#000000" strokeWidth="2.5" />
  </svg>
);

const CatPuzzleIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="cat-silver-puzzle" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E5E7EB" />
        <stop offset="70%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="cat-gold-puzzle" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path d="M 18 18 H 28 C 28 22, 36 22, 36 18 H 46 V 28 C 42 28, 42 36, 46 36 V 46 H 36 C 36 42, 28 42, 28 46 H 18 V 36 C 22 36, 22 28, 18 28 Z" stroke="#000000" strokeWidth="5" strokeLinejoin="round" />
    <path d="M 18 18 H 28 C 28 22, 36 22, 36 18 H 46 V 28 C 42 28, 42 36, 46 36 V 46 H 36 C 36 42, 28 42, 28 46 H 18 V 36 C 22 36, 22 28, 18 28 Z" fill="url(#cat-silver-puzzle)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="32" cy="32" r="5" fill="url(#cat-gold-puzzle)" stroke="#000000" strokeWidth="1.5" />
  </svg>
);

const getCategoryIcon = (id: string, className?: string) => {
  switch (id) {
    case "all":
      return <CatAllIcon className={className} />;
    case "action":
      return <CatActionIcon className={className} />;
    case "shooter":
      return <CatShooterIcon className={className} />;
    case "moba":
      return <CatMobaIcon className={className} />;
    case "racing":
      return <CatRacingIcon className={className} />;
    case "adventure":
      return <CatAdventureIcon className={className} />;
    case "sports":
      return <CatSportsIcon className={className} />;
    case "arcade":
      return <CatArcadeIcon className={className} />;
    case "puzzle":
      return <CatPuzzleIcon className={className} />;
    default:
      return <CatAllIcon className={className} />;
  }
};

const CategoryNavigationIcon = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (catId: string, label: string) => {
    setActiveCategory(catId);
    navigate("/games", { state: { scrollToCategory: label === "All Games" ? "" : label } });
  };

  return (
    <div className="relative overflow-hidden py-1">
      <div
        className="flex gap-4 w-max px-2 animate-slide-right hover:[animation-play-state:paused] will-change-transform"
        style={{ animationDuration: "20s" }}
      >
        {[...categories, ...categories, ...categories].map((cat, index) => {
          const isActive = true;

          return (
            <div
              key={`${cat.id}-${index}`}
              onClick={() => handleCategoryClick(cat.id, cat.label)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 active:scale-95"
            >
              {/* Glassmorphic Square Container */}
              <div
                className={` w-[64px] h-[64px] rounded-lg flex items-center justify-center border-2 backdrop-blur-[12px] transition-all duration-300 ${isActive
                  ? "bg-brand-yellow-100/25 dark:bg-[#ffc200] border-black dark:border-white shadow-[0_6px_15px_rgba(255,202,32,0.25)] "
                  : "bg-white/70 dark:bg-white/[0.03] border-brand-yellow-200/30 dark:border-brand-yellow-100/10 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                  }`}
              >
                {getCategoryIcon(cat.id, `w-12 h-12 transition-transform duration-300 ${isActive ? "scale-105" : ""}`)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Recent Results ─────────────────────────────────────────────────────── */

interface ResultItem {
  id: string;
  gameName: string;
  gameImage: string;
  rank: number;
  totalPlayers: number;
  coins: number;
  status: "WON" | "COMPLETED" | "ELIMINATED";
  date: string;
}

const mockResults: ResultItem[] = [
  {
    id: "1",
    gameName: "Battle Legends Cup",
    gameImage: "/assets/images/img/playimg.jpg",
    rank: 1,
    totalPlayers: 100,
    coins: 5000,
    status: "WON",
    date: "12 May",
  },
  {
    id: "2",
    gameName: "Shadow Arena",
    gameImage: "/assets/images/img/playimg.jpg",
    rank: 3,
    totalPlayers: 50,
    coins: 2000,
    status: "COMPLETED",
    date: "12 May",
  },
  {
    id: "3",
    gameName: "Death Squad Cup",
    gameImage: "/assets/images/img/playimg.jpg",
    rank: 12,
    totalPlayers: 60,
    coins: 2500,
    status: "ELIMINATED",
    date: "11 May",
  },
];

const RecentResults: React.FC = () => {
  const getStatusBadge = (status: ResultItem["status"]) => {
    switch (status) {
      case "WON":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            Won
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
            Completed
          </span>
        );
      case "ELIMINATED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
            Eliminated
          </span>
        );
    }
  };

  return (
    <div className="space-y-2">
      {mockResults.map((result) => (
        <div
          key={result.id}
          className="flex items-center justify-between p-2 rounded-xl bg-card/70 dark:bg-card/40 border border-border/50 transition-all hover:bg-card dark:hover:bg-card/65 shadow-sm"
        >
          {/* Left: Image & Info */}
          <div className="flex items-center gap-3">
            <img
              src={result.gameImage}
              alt={result.gameName}
              className="w-11 h-9 rounded-lg object-cover border border-border/80"
            />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-bold text-foreground leading-tight">
                {result.gameName}
              </span>
              <div className="flex items-center gap-1 text-[9.5px] text-muted-foreground mt-0.5 font-medium">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span>{result.date}</span>
              </div>
            </div>
          </div>

          {/* Right: Rank, Coins, Badge */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-black text-primary">
                #{result.rank}
              </span>
              <span className="text-[9.5px] text-muted-foreground font-bold ml-[1px]">
                /{result.totalPlayers}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-extrabold text-foreground dark:text-amber-400">
              <img
                src="/assets/images/img/gold-coin.png"
                alt="coin"
                className="w-3.5 h-3.5 object-contain"
              />
              <span>{result.coins.toLocaleString()}</span>
            </div>

            {getStatusBadge(result.status)}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Home ────────────────────────────────────────────────────────────────── */

const Home = () => {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [vipCountdown, setVipCountdown] = useState<string>("");
  const [premiumCountdown, setPremiumCountdown] = useState<string>("");

  const {
    data: jazzHomePageData,
    status: homeStatus,
    instantGames: jazzInstantGamesData,
    instantGamesStatus,
  } = useAppSelector((state) => state.jazzHome);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "1";
    if (homeStatus === "idle") {
      dispatch(fetchJazzHomeDataThunk(userId));
    }
    if (!jazzInstantGamesData && instantGamesStatus === "idle") {
      dispatch(fetchJazzInstantGamesThunk());
    }
  }, [dispatch, homeStatus, jazzInstantGamesData, instantGamesStatus]);

  const freegames =
    jazzHomePageData?.current_free_games?.map((game: any) => ({
      ...game,
      fg_game_name: jazzHomePageData?.game_names?.[game.fg_game_id] || "",
    })) || null;

  const loading =
    homeStatus === "loading" ||
    (instantGamesStatus === "loading" && !jazzInstantGamesData);

  return (
    <>
      {/* ── Global background ── */}
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Ambient top glow */}
        <div
          className="pointer-events-none fixed inset-x-0 top-0 h-96 z-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,202,32,0.15) 0%, transparent 75%)"
              : "radial-gradient(ellipse 90% 70% at 50% -20%, rgba(255,202,32,0.2) 0%, rgba(255,243,205,0.12) 50%, transparent 100%)",
          }}
        />

        <TopBar />

        {loading ? (
          <LoadingSkeleton />
        ) : (
          jazzHomePageData && (
            <div className="relative z-10">
              <div className="px-1 pt-1 space-y-3">



                {/* ── VIP / Hero Tournaments ── */}
                {/* {jazzHomePageData?.heroTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="VIP Tournament"
                      icon={<Trophy size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                      accent="purple"
                    />
                    <HeroSliderTwoNew heroGames={jazzHomePageData.heroTournaments} />
                  </Section>
                )} */}

                {jazzHomePageData?.heroTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="VIP Tournament"
                      icon={<Trophy size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                      accent="purple"
                      extra={
                        vipCountdown && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 dark:bg-black/40 border border-slate-200/10 dark:border-white/10 text-white text-[12px] font-bold font-mono tracking-tight shadow-sm whitespace-nowrap">
                            <Clock className="h-3.5 w-3.5 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                            {vipCountdown.includes(":") ? (
                              <span className="flex items-center gap-[2px]">
                                {vipCountdown.split(":").map((part, idx, arr) => (
                                  <span key={idx} className="flex items-center gap-[2px]">
                                    <span>{part}</span>
                                    {idx < arr.length - 1 && <span className="opacity-40 text-brand-gold-100 dark:text-brand-yellow-100">:</span>}
                                  </span>
                                ))}
                              </span>
                            ) : (
                              <span>{vipCountdown}</span>
                            )}
                          </div>
                        )
                      }
                    />
                    <HeroSliderTwoNewTesting
                      heroGames={jazzHomePageData.heroTournaments}
                      onCountdownChange={setVipCountdown}
                    />
                  </Section>
                )}

                {jazzHomePageData?.heroTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Jazz Premium zone"
                      icon={<Star size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                      accent="purple"
                      extra={
                        premiumCountdown && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 dark:bg-black/40 border border-slate-200/10 dark:border-white/10 text-white text-[12px] font-bold font-mono tracking-tight shadow-sm whitespace-nowrap">
                            <Clock className="h-3.5 w-3.5 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
                            {premiumCountdown.includes(":") ? (
                              <span className="flex items-center gap-[2px]">
                                {premiumCountdown.split(":").map((part, idx, arr) => (
                                  <span key={idx} className="flex items-center gap-[2px]">
                                    <span>{part}</span>
                                    {idx < arr.length - 1 && <span className="opacity-40 text-brand-gold-100 dark:text-brand-yellow-100">:</span>}
                                  </span>
                                ))}
                              </span>
                            ) : (
                              <span>{premiumCountdown}</span>
                            )}
                          </div>
                        )
                      }
                    />
                    <JazzPremiumZone
                      heroGames={jazzHomePageData.heroTournaments}
                      onCountdownChange={setPremiumCountdown}
                    />
                  </Section>
                )}



                {/* ── Daily Tournaments ── */}
                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentNew
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentNewTestingV
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing (Coins)"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentNewTesting3
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing (Voucher)"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentNewTesting4
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing (Talktime)"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentNewTesting7
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}



                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing (Coins - 2)"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentNewTesting
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing (Voucher - 2)"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    
                    />
                    <DailyTournamentNewTesting5
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing (Talktime - 2)"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                   
                    />
                    <DailyTournamentNewTesting6
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentMixedTesting2
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )}

                {/* {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Weekly Tournaments Testing"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentNewTestingV
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )} */}

                {/* ── Weekly Tournaments ── */}
                {/* {jazzHomePageData?.weeklyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Daily Tournaments"
                      icon={<Trophy size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                      accent="blue"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <WeeklyTournamentNew
                      weeklyTournaments={jazzHomePageData.weeklyTournaments}
                    />
                  </Section>
                )} */}

                {/* ── Weekly Tournaments ── */}
                {/* {jazzHomePageData?.weeklyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Daily Tournaments V2"
                      icon={<Trophy size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                      accent="blue"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <WeeklyTournamentTesting
                      weeklyTournaments={jazzHomePageData.weeklyTournaments}
                    />
                  </Section>
                )} */}

                {/* {jazzHomePageData?.weeklyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Daily Tournaments V3 (VIP Style)"
                      icon={<Trophy size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                      accent="blue"
                    />
                    <WeeklyTournamentTestingV2
                      weeklyTournaments={jazzHomePageData.weeklyTournaments}
                    />
                  </Section>
                )} */}


                {jazzHomePageData?.dailyTournaments?.length > 0 && (
                  <Section>
                    <SectionHeader
                      title="Daily Tournaments"
                      icon={<Clock size={15} className="text-brand-gold-100 dark:text-brand-yellow-100" />}
                      accent="purple"
                    // action={{ label: "View All", href: "/games" }}
                    />
                    <DailyTournamentMixedTesting
                      dailyTournaments={jazzHomePageData.dailyTournaments}
                    />
                  </Section>
                )}




                <Section>
                  <SectionHeader
                    title="Trending Games"
                    icon={<Star size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                  // action={{ label: "View All", href: "/tournament-history" }}
                  />
                  <CategoryNavigationIcon />
                </Section>








                {/* ── Suggested Games ── */}
                {/* <Section>
                  <SectionHeader
                    title="Practice Games"
                    icon={<Star size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                    accent="aqua"
                  />
                  <SuggestedGamesNew />
                </Section> */}


                {/* ── Recent Results ── */}
                <Section>
                  <SectionHeader
                    title="Spin and Win"
                    icon={<Trophy size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                  // action={{ label: "View All", href: "/tournament-history" }}
                  />
                  <SpinWinBanner />
                </Section>



                {/* <Section>
                  <SectionHeader
                    title="Testing Games"
                    icon={<Star size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                  // action={{ label: "View All", href: "/tournament-history" }}
                  />
                  <CategoryNavigation categoriesList={trendingCategories} />
                </Section> */}

                <Section>
                  <SectionHeader
                    title="Upcoming Tournaments"
                    icon={<Star size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                  // action={{ label: "View All", href: "/tournament-history" }}
                  />
                  <CategoryNavigationTesting />
                </Section>

                <Section>
                  <SectionHeader
                    title="Target Challenge Zone"
                    icon={<Target size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                  />
                  <TargetChallengeZone />
                </Section>

                <Section>
                  <SectionHeader
                    title="Target Challenge Zone Landscape"
                    icon={<Target size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                  />
                  <TargetChallengeZoneLandscape />
                </Section>




                {/* <Section>
                  <SectionHeader
                    title="Testing Games"
                    icon={<Star size={15} className="text-brand-gold-100 dark:text-brand-yellow-100 fill-brand-gold-100/10 dark:fill-brand-yellow-100/10" />}
                  // action={{ label: "View All", href: "/tournament-history" }}
                  />
                  <CategoryNavigation categoriesList={trendingCategories} />
                </Section> */}

                {/* ── Spin & Win Banner ── */}
                {/* <SpinWinBanner /> */}

                {/* ── Category Navigation ── */}


              </div>
            </div>
          )
        )}
      </div>

      <BottomNavBar />
    </>
  );
};

export default Home;