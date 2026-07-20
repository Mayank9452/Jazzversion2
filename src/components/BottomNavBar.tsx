"use client"

import {
  ChevronUp,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./context/LanguageContext"
import { useTheme } from "next-themes"
import * as React from "react"

const TrophyIcon = ({ className, style, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <defs>
      <linearGradient id="trophy-silver-cup" x1="32" y1="8" x2="32" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#E5E7EB" />
        <stop offset="60%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="trophy-silver-handle" x1="12" y1="14" x2="24" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#374151" />
      </linearGradient>
      <linearGradient id="trophy-gold-star" x1="32" y1="18" x2="32" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="trophy-reflection" x1="18" y1="10" x2="32" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Left Handle Shadow Outline */}
    <path d="M 19 14 C 11 14 9 22 9 28 C 9 35 16 36 19 36" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Right Handle Shadow Outline */}
    <path d="M 45 14 C 53 14 55 22 55 28 C 55 35 48 36 45 36" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Left Handle Body */}
    <path d="M 19 14 C 11 14 9 22 9 28 C 9 35 16 36 19 36" fill="url(#trophy-silver-handle)" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 19 19 C 14 19 13 23 13 28 C 13 32 16 32 19 32" fill="#4B5563" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Right Handle Body */}
    <path d="M 45 14 C 53 14 55 22 55 28 C 55 35 48 36 45 36" fill="url(#trophy-silver-handle)" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 45 19 C 50 19 51 23 51 28 C 51 32 48 32 45 32" fill="#4B5563" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Stem & Base Shadow Outline */}
    <path d="M 23 43 L 41 43 L 37 52 L 27 52 Z" stroke="#000000" strokeWidth="4.5" strokeLinejoin="round" />
    <path d="M 19 53 L 45 53 L 45 58 L 19 58 Z" stroke="#000000" strokeWidth="4.5" strokeLinejoin="round" />

    {/* Stem & Base Fill */}
    <path d="M 23 43 L 41 43 L 37 52 L 27 52 Z" fill="url(#trophy-silver-cup)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 19 53 L 45 53 L 45 58 L 19 58 Z" fill="url(#trophy-silver-cup)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />

    {/* Main Cup Shadow Outline */}
    <path d="M 17 9 H 47 C 47 9 49 29 32 43 C 15 29 17 9 17 9 Z" stroke="#000000" strokeWidth="4.5" strokeLinejoin="round" />
    {/* Main Cup Fill */}
    <path d="M 17 9 H 47 C 47 9 49 29 32 43 C 15 29 17 9 17 9 Z" fill="url(#trophy-silver-cup)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />

    {/* Specular Highlight Reflection */}
    <path d="M 19 11 C 19 11 20 27 32 40 C 23 32 21 19 21 11 Z" fill="url(#trophy-reflection)" />

    {/* Star in Center Shadow Outline */}
    <path d="M 32 16 L 35.5 23 L 43 24 L 37.5 29.5 L 39 37 L 32 33 L 25 37 L 26.5 29.5 L 21 24 L 28.5 23 Z" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
    {/* Star in Center Fill */}
    <path d="M 32 16 L 35.5 23 L 43 24 L 37.5 29.5 L 39 37 L 32 33 L 25 37 L 26.5 29.5 L 21 24 L 28.5 23 Z" fill="url(#trophy-gold-star)" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

const GamepadIcon = ({ className, style, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <defs>
      <linearGradient id="controller-body-grad" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="20%" stopColor="#F3F4F6" />
        <stop offset="60%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#374151" />
      </linearGradient>
      <linearGradient id="controller-gold-grad" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(45)">
        <stop offset="0%" stopColor="#FFE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="stick-grad" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#4B5563" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>

    {/* Main Controller Body with thick shadow outline */}
    <path
      d="M 18 12 Q 32 15 46 12 C 54 12 60 18 60 28 C 60 40 51 52 45 52 C 40 52 36 44 32 44 C 28 44 24 52 19 52 C 13 52 4 40 4 28 C 4 18 10 12 18 12 Z"
      fill="url(#controller-body-grad)"
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
      fill="url(#controller-gold-grad)"
      stroke="#000000"
      strokeWidth="1.5"
      opacity="0.85"
    />
    <path
      d="M 60 28 C 60 40 51 52 45 52 C 47 46 51 36 51 28 C 51 22 54 16 56 14 C 59 18 60 23 60 28 Z"
      fill="url(#controller-gold-grad)"
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
      fill="url(#controller-gold-grad)"
      stroke="#000000"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Subtle D-Pad cross lines */}
    <path d="M 15 21 V 31 M 10 26 H 20" stroke="#B45309" strokeWidth="0.8" strokeLinecap="round" />

    {/* Action Buttons (Right side) centered at (48, 25) */}
    {/* Y Button (Top) */}
    <circle cx="48" cy="19" r="3.2" fill="#000000" />
    <circle cx="48" cy="18.5" r="2.5" fill="url(#controller-gold-grad)" stroke="#000000" strokeWidth="0.5" />

    {/* X Button (Left) */}
    <circle cx="43.5" cy="24.5" r="3.2" fill="#000000" />
    <circle cx="43.5" cy="24.0" r="2.5" fill="url(#controller-gold-grad)" stroke="#000000" strokeWidth="0.5" />

    {/* B Button (Right) */}
    <circle cx="52.5" cy="24.5" r="3.2" fill="#000000" />
    <circle cx="52.5" cy="24.0" r="2.5" fill="url(#controller-gold-grad)" stroke="#000000" strokeWidth="0.5" />

    {/* A Button (Bottom) */}
    <circle cx="48" cy="30" r="3.2" fill="#000000" />
    <circle cx="48" cy="29.5" r="2.5" fill="url(#controller-gold-grad)" stroke="#000000" strokeWidth="0.5" />

    {/* Left Analog Stick centered at (26, 39) */}
    <circle cx="26" cy="39" r="6.5" fill="#000000" />
    <circle cx="26" cy="39" r="5.5" fill="url(#controller-gold-grad)" />
    <circle cx="26" cy="39" r="4.5" fill="url(#stick-grad)" stroke="#000000" strokeWidth="0.8" />
    <circle cx="26" cy="39" r="1.5" fill="#9CA3AF" />

    {/* Right Analog Stick centered at (38, 39) */}
    <circle cx="38" cy="39" r="6.5" fill="#000000" />
    <circle cx="38" cy="39" r="5.5" fill="url(#controller-gold-grad)" />
    <circle cx="38" cy="39" r="4.5" fill="url(#stick-grad)" stroke="#000000" strokeWidth="0.8" />
    <circle cx="38" cy="39" r="1.5" fill="#9CA3AF" />

    {/* Start / Select Buttons */}
    <rect x="26.5" y="27.5" width="4" height="2" rx="1" fill="#000000" transform="rotate(-15 26.5 27.5)" />
    <rect x="26.5" y="27" width="4" height="1.8" rx="0.9" fill="url(#controller-gold-grad)" transform="rotate(-15 26.5 27)" />

    <rect x="33.5" y="27.5" width="4" height="2" rx="1" fill="#000000" transform="rotate(-15 33.5 27.5)" />
    <rect x="33.5" y="27" width="4" height="1.8" rx="0.9" fill="url(#controller-gold-grad)" transform="rotate(-15 33.5 27)" />

    {/* Glowing Center Logo Button at (32, 20) */}
    <circle cx="32" cy="20.5" r="4.2" fill="#000000" />
    <circle cx="32" cy="20" r="3.5" fill="url(#controller-gold-grad)" />
    <polygon
      points="32,18.2 32.8,19.6 34.4,19.8 33.2,20.8 33.6,22.4 32,21.5 30.4,22.4 30.8,20.8 29.6,19.8 31.2,19.6"
      fill="#FFFFFF"
    />
  </svg>
)

const ProfileIcon = ({ className, style, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <defs>
      <linearGradient id="user-silver-grad" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#E5E7EB" />
        <stop offset="60%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="user-reflection" x1="16" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Torso Outline shadow */}
    <path d="M 12 50 C 12 40 20 36 32 36 C 44 36 52 40 52 50 C 52 53 48 56 32 56 C 16 56 12 53 12 50 Z" stroke="#000000" strokeWidth="4.5" strokeLinejoin="round" />
    {/* Torso Fill */}
    <path d="M 12 50 C 12 40 20 36 32 36 C 44 36 52 40 52 50 C 52 53 48 56 32 56 C 16 56 12 53 12 50 Z" fill="url(#user-silver-grad)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />

    {/* Head Outline shadow */}
    <circle cx="32" cy="22" r="11" stroke="#000000" strokeWidth="4.5" />
    {/* Head Fill */}
    <circle cx="32" cy="22" r="11" fill="url(#user-silver-grad)" stroke="#000000" strokeWidth="2.5" />

    {/* Head highlight reflection */}
    <path d="M 23 20 C 23 16 26 13 32 12 C 28 14 26 17 26 21 C 26 23 27 25 28 27 C 25 25 23 23 23 20 Z" fill="#FFFFFF" fillOpacity="0.6" />

    {/* Torso highlight reflection */}
    <path d="M 15 48 C 17 42 22 39 30 38 C 22 41 18 45 18 49 C 18 51 20 52 23 53 C 18 52 15 50 15 48 Z" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
)

const VOUCHER_IMAGES = [
  "/assets/images/giftkarte.webp"
]

type BottomNavBarProps = {
  isOpen?: boolean
  isToggle?: boolean
  setIsOpen?: (open: boolean) => void
}

const NAVBAR_HEIGHT = 70 // px (safe for toggle + animation)

export function BottomNavBar({
  isOpen = false,
  isToggle = false,
  setIsOpen,
}: BottomNavBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  type DisplayState = 'icon' | 'text' | 'voucher';
  const [currentState, setCurrentState] = React.useState<DisplayState>('icon');
  const [currentVoucher, setCurrentVoucher] = React.useState<string>('/assets/images/giftkarte.webp');

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerToggle = () => {
      setCurrentState((prev) => {
        if (prev === 'icon') {
          return 'text';
        } else if (prev === 'text') {
          // Select a random voucher when transitioning to 'voucher'
          const randomVoucher = VOUCHER_IMAGES[Math.floor(Math.random() * VOUCHER_IMAGES.length)];
          setCurrentVoucher(randomVoucher);
          return 'voucher';
        } else {
          return 'icon';
        }
      });
      const randomDelay = Math.random() * 3000 + 2000; // between 2s and 5s
      timeoutId = setTimeout(triggerToggle, randomDelay);
    };

    timeoutId = setTimeout(triggerToggle, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  const navItems = [
    {
      id: "tournament",
      label: t.navbarTournament || "Tournament",
      icon: TrophyIcon,
      path: ["/dashboard", "/"],
    },
    // {
    //   id: "games",
    //   label: t.navbarGames || "Games",
    //   icon: Gamepad2,
    //   path: ["/games"],
    // },
    {
      id: "playWin",
      label: t.navbarPlayWin || "Play & Win",
      icon: GamepadIcon,
      path: ["/tournamentPageStatic"],
    },
    // {
    //   id: "history",
    //   label: t.navbarHistory || "History",
    //   icon: History,
    //   path: ["/tournament-history", "/profile/tournamentHistory"],
    // },
    {
      id: "profile",
      label: t.navbarProfile || "Profile",
      icon: ProfileIcon,
      path: ["/settingsStatic"],
    },
  ]

  return (
    <>
      {/* 🔹 Spacer to prevent Homepage content overlap */}
      <div
        className="transition-all duration-300"
        style={{ height: isToggle ? (isOpen ? 45 : 125) : NAVBAR_HEIGHT }}
      />

      {/* 🔹 Fixed Navbar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] z-50 grid">
        {isToggle && (
          <div className="flex justify-between">
            <button
              className="bg-brand-black-100 text-white w-16 text-[10px] px-2 py-1 gap-1 pt-2 shadow-md flex justify-center items-center rounded-t-md border-t border-x border-white/10"
              style={{ borderBottom: "none" }}
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
              {t.navbarBack}
            </button>

            <button
              className="bg-brand-black-100 text-white w-12 shadow-md flex justify-center items-center rounded-t-md border-t border-x border-white/10"
              style={{ borderBottom: "none" }}
              onClick={() => setIsOpen?.(!isOpen)}
            >
              <ChevronUp
                className={`transform transition-all duration-300 ${isOpen ? "" : "rotate-180"
                  }`}
              />
            </button>
          </div>
        )}

        <AnimatePresence>
          {!isOpen && (
            <div className="relative w-full  flex items-end">
              {/* Responsive SVG Curved Wave Background */}
              <div className="absolute inset-x-0 bottom-0 -z-10 pointer-events-none ">
                <svg
                  viewBox="0 0 480 95"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  {/* Fill Path */}
                  <path
                    d="M 0,25 L 170,25 C 195,25 205,5 240,5 C 275,5 285,25 310,25 L 480,25 L 480,95 L 0,95 Z"
                    className="fill-brand-black-100 transition-colors duration-300"
                  />
                  {/* Border Stroke Path */}
                  <path
                    d="M 0,25 L 170,25 C 195,25 205,5 240,5 C 275,5 285,25 310,25 L 480,25"
                    fill="none"
                    strokeWidth="2.5"
                    className="stroke-white/10 transition-colors duration-300"
                  />
                </svg>
              </div>

              <div className="flex justify-evenly items-center w-full px-2 backdrop-blur-[20px] pt-0">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.path.includes(location.pathname)
                  const isPlayWin = item.id === "playWin"

                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => navigate(item.path[0])}
                      className={cn(
                        "relative flex flex-col items-center justify-center transition-all duration-300 p-0",
                        isPlayWin
                          ? "w-16 h-12 z-20"
                          : "w-12 h-12 bg-transparent border-transparent shadow-none"
                      )}
                    >
                      {isPlayWin ? (
                        <div
                          className={cn(
                            "absolute bottom-1 w-[80px] h-[80px] rounded-full border-4 flex items-center justify-center transition-all duration-300 overflow-hidden bg-brand-gradient border-brand-black-100 dark:border-white hover:brightness-110",
                            "shadow-[0_0_9px_rgba(255,202,32,0.65)]",
                            isActive && "ring-2 ring-brand-yellow-100/60 scale-105"
                          )}

                        >
                          {/* Pulsing ring background glow */}
                          <div className="absolute inset-0 rounded-full bg-brand-yellow-100/20 animate-ping opacity-60 pointer-events-none scale-105" />
                          <div className="absolute inset-0 rounded-full bg-brand-yellow-100/10 animate-pulse pointer-events-none scale-110" />

                          {/* Metallic Gleam/Shine Sweep Effect */}
                          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0">
                            <motion.div
                              initial={{ left: "-150%" }}
                              animate={{ left: "150%" }}
                              transition={{
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 2.5,
                                ease: "easeInOut",
                                repeatDelay: 2
                              }}
                              className="absolute top-0 w-[40px] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                            />
                          </div>

                          <AnimatePresence mode="wait">
                            {currentState === "icon" && (
                              <motion.div
                                key="icon"
                                initial={{ opacity: 0, scale: 0.6, y: -8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6, y: 8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex items-center justify-center z-10"
                              >
                                <Icon
                                  style={{
                                    transform: "translate3d(0, 0, 0)",
                                    backfaceVisibility: "hidden",
                                    width: "56px",
                                    height: "56px"
                                  }}
                                  className="transition-all duration-300"
                                />
                              </motion.div>
                            )}

                            {currentState === "text" && (
                              <motion.div
                                key="text"
                                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6, y: -8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex flex-col items-center justify-center z-10 font-black leading-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                              >
                                <span className="text-sm tracking-wider font-black uppercase text-brand-black-100">Play</span>
                                <span className="text-xs tracking-widest font-black uppercase text-brand-black-100 mt-0.5">& Win</span>
                              </motion.div>
                            )}

                            {currentState === "voucher" && (
                              <motion.div
                                key="voucher"
                                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6, y: -8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex items-center justify-center z-10"
                              >
                                <img
                                  src={currentVoucher}
                                  alt="Voucher"
                                  className="w-[80px] h-[80px] rounded-full object-cover"
                                // style={{
                                //   transform: "translate3d(0, 0, 0)",
                                //   backfaceVisibility: "hidden",
                                //   width: "56px",
                                //   height: "56px"
                                // }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <>
                          <Icon
                            style={{
                              transform: "translate3d(0, 0, 0)",
                              backfaceVisibility: "hidden",
                              width: "38px",
                              height: "38px"
                            }}
                            className={cn(
                              "transition-all duration-300",
                              isActive ? "animate-bounce-in scale-110" : "opacity-85 hover:opacity-100"
                            )}
                          />
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute bottom-1.5 w-4 h-0.5 rounded-full bg-brand-yellow-100 shadow-[0_0_6px_#FFCA20]"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                        </>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}