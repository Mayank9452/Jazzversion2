"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Gift, Phone, Trophy } from "lucide-react";

export default function WaitLoader({ isOverlay = false }: { isOverlay?: boolean }) {
  const [index, setIndex] = useState(0);
  const [coinError, setCoinError] = useState(false);
  const [diamondError, setDiamondError] = useState(false);
  const [trophyError, setTrophyError] = useState(false);

  const phrases = useMemo(() => [
    "Initializing Game Systems...",
    "Connecting to Game Servers...",
    "Syncing Tournament Leaderboard...",
    "Loading Rewards & Diamonds...",
    "Preparing Arcade Lobby...",
  ], []);

  // Cycle through phrases
  useEffect(() => {
    const textTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);

    return () => {
      clearInterval(textTimer);
    };
  }, [phrases.length]);

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
            strokeWidth="6"
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
            strokeWidth="6"
          />

          {/* Bottom Bezel Divider */}
          <path
            d="M12 68H60"
            stroke={color}
            strokeWidth="6"
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
            strokeWidth="6"
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

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-500 ${isOverlay
        ? "bg-black/80 backdrop-blur-lg"
        : "bg-gradient-to-br from-[#191919] via-[#121212] to-[#0A0A0A]"
        }`}
    >
      {/* ── NEON ATMOSPHERIC BACKGROUND GLOW ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[20%] left-[10%] w-[250px] h-[250px] bg-[#FFCA20]/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#DFA208]/15 blur-[120px] rounded-full animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative flex flex-col items-center gap-4 text-center max-w-sm px-6">
        {/* ── PORTAL BRAND LOGO ── */}
        {/* <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-2"
        >
          <motion.img
            src="/assets/images/img/gamenow-logo-new.png"
            alt="GameNow Logo"
            className="h-16 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onError={(e) => {
              // Graceful fallback to text if logo fails to load
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-400/80 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
            Game Portal
          </span>
        </motion.div> */}

        {/* ── CENTRAL ENGAGING ANIMATION (PORTAL GATE & GAMEPAD) ── */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Neon Portal Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-36 h-36 rounded-full border border-dashed border-[#FFCA20]/40 shadow-[0_0_15px_rgba(255,202,32,0.25)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 rounded-full border border-double border-[#DFA208]/30 shadow-[0_0_12px_rgba(223,162,8,0.15)]"
          />
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full bg-[#FFCA20]/5 blur-[15px] pointer-events-none"
          />

          {/* Central Pulsing Game Controller SVG */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 1.5, -1.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-20 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 100 70"
              className="w-24 h-18 filter drop-shadow-[0_0_15px_rgba(255,202,32,0.5)]"
            >
              {/* Gamepad Outer Shell */}
              <path
                d="M20,15 L80,15 C90,15 95,22 95,32 L90,58 C88,64 80,68 72,60 L62,50 L38,50 L28,60 C20,68 12,64 10,58 L5,32 C5,22 10,15 20,15 Z"
                fill="#191919"
                stroke="url(#brandYellowGold)"
                strokeWidth="2.5"
              />

              {/* Glowing Accents */}
              <path
                d="M12,28 C12,28 17,25 22,30 C27,35 25,48 18,52"
                stroke="#FFCA20"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M88,28 C88,28 83,25 78,30 C73,35 75,48 82,52"
                stroke="#DFA208"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />

              {/* D-Pad */}
              <g transform="translate(18, 25)">
                <path
                  d="M6,0 L10,0 L10,6 L16,6 L16,10 L10,10 L10,16 L6,16 L6,10 L0,10 L0,6 L6,6 Z"
                  fill="#FFCA20"
                />
                <circle cx="8" cy="8" r="2" fill="#191919" />
              </g>

              {/* Action Buttons */}
              <g transform="translate(62, 23)">
                <circle cx="12" cy="4" r="3" fill="#FFE082" stroke="#FFCA20" strokeWidth="1" />
                <circle cx="4" cy="12" r="3" fill="#FFE082" stroke="#FFCA20" strokeWidth="1" />
                <circle cx="20" cy="12" r="3" fill="#FFE082" stroke="#FFCA20" strokeWidth="1" />
                <circle cx="12" cy="20" r="3" fill="#FFE082" stroke="#FFCA20" strokeWidth="1" />
              </g>

              {/* Thumbsticks */}
              <g transform="translate(36, 42)">
                <circle cx="6" cy="6" r="6" fill="#2B2B2B" stroke="#FFCA20" strokeWidth="1" />
                <circle cx="6" cy="6" r="2.5" fill="#FFCA20" />
              </g>
              <g transform="translate(56, 42)">
                <circle cx="6" cy="6" r="6" fill="#2B2B2B" stroke="#DFA208" strokeWidth="1" />
                <circle cx="6" cy="6" r="2.5" fill="#DFA208" />
              </g>

              {/* Menu Details */}
              <rect x="44" y="24" width="4" height="2" rx="0.5" fill="#94a3b8" />
              <rect x="50" y="24" width="4" height="2" rx="0.5" fill="#94a3b8" />

              <defs>
                <linearGradient id="brandYellowGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFCA20" />
                  <stop offset="50%" stopColor="#E6B53A" />
                  <stop offset="100%" stopColor="#DFA208" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* ── FLOATING GEMS & ITEMS ── */}
          {/* Gold Coin */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              x: [0, 4, 0],
              rotateY: [0, 360],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-2 left-2 z-30"
          >
            {!coinError ? (
              // <img
              //   src="/assets/images/img/gold-coin.png"
              //   alt="Gold Coin"
              //   className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              //   onError={() => setCoinError(true)}
              // />
              <Coins className="w-8 h-8 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
            ) : (
              // Styled Coin Fallback SVG
              <svg viewBox="0 0 24 24" className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                <circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="12" cy="12" r="7" fill="#f59e0b" />
                <text x="12" y="15" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">C</text>
              </svg>
            )}
          </motion.div>

          {/* Diamond */}
          <motion.div
            animate={{
              y: [0, 8, 0],
              x: [0, -4, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute bottom-2 right-2 z-30"
          >
            {!diamondError ? (
              // <img
              //   src="/assets/images/giftkarte.png"
              //   alt="Voucher"
              //   className="w-10 h-10 object-contain filter drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]"
              //   onError={() => setDiamondError(true)}
              // />
              <Gift className="w-8 h-8 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
            ) : (
              // Styled Voucher Fallback SVG
              <svg viewBox="0 0 24 24" className="w-10 h-10 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                <rect x="2" y="6" width="20" height="12" rx="2" fill="#22d3ee" stroke="#0891b2" strokeWidth="2" />
                <path d="M12 6v12M2 12h20" stroke="#fff" strokeWidth="1" strokeDasharray="2" />
              </svg>
            )}
          </motion.div>

          {/* Trophy */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              x: [0, -3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
            className="absolute top-4 right-2 z-30"
          >
            {!trophyError ? (
              // <img
              //   src="/assets/images/img/trophy.png"
              //   alt="Trophy"
              //   className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              //   onError={() => setTrophyError(true)}
              // />
              <Trophy className="w-8 h-8 text-brand-gold-100 dark:text-brand-yellow-100 shrink-0" />
            ) : (
              // Styled Trophy Fallback SVG
              <svg viewBox="0 0 24 24" className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                <path d="M5 2h14v4c0 3.3-2.7 6-6 6h-2c-3.3 0-6-2.7-6-6V2z" fill="#fbb03b" />
                <path d="M12 12v6m-4 0h8" stroke="#fbb03b" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 4H2v3c0 2 2 3 4 3h1V4zM20 4h2v3c0 2-2 3-4 3h-1V4z" fill="#f59e0b" />
              </svg>
            )}
          </motion.div>

          {/* Talktime (Phone) */}
          <motion.div
            animate={{
              y: [0, 8, 0],
              x: [0, 3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
            className="absolute bottom-4 left-4 z-30"
          >
            <TopupIcon className="w-8 h-8 text-[#FFCA20] filter drop-shadow-[0_0_8px_rgba(255,202,32,0.6)]" />
          </motion.div>
        </div>

        {/* ── DYNAMIC STATUS PHRASES ── */}
        <div className="relative h-12 flex items-center justify-center w-full mt-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-white text-base font-semibold "
              style={{
                textShadow: "0 0 12px rgba(255,202,32,0.4)",
                // fontFamily: "'Atom Sans', sans-serif",
              }}
            >
              {phrases[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── PREMIUM XP LEVELING PROGRESS BAR ── */}
        <div className="flex flex-col items-center gap-1 w-full max-w-[200px] mt-2">
          <div className="w-full h-1.5 bg-[#191919] rounded-full overflow-hidden border border-[#FFCA20]/25 p-[1px] shadow-[0_0_10px_rgba(255,202,32,0.1)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FFCA20] via-[#E6B53A] to-[#DFA208]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          {/* <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-400/60">
            XP LOADING...
          </span> */}
        </div>
      </div>
    </div>
  );
}