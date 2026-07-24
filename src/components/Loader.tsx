"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";

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

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-500 ${isOverlay
        ? "bg-black/75 backdrop-blur-lg"
        : "bg-gradient-to-br from-[#080916] via-[#04050d] to-[#0c0d24]"
        }`}
    >
      {/* ── NEON ATMOSPHERIC BACKGROUND GLOW ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[20%] left-[10%] w-[250px] h-[250px] bg-cyan-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-pink-500/20 blur-[120px] rounded-full animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative flex flex-col items-center gap-8 text-center max-w-sm px-6">
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
            className="absolute w-36 h-36 rounded-full border border-dashed border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 rounded-full border border-double border-pink-500/30"
          />
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full bg-indigo-500/10 blur-[15px] pointer-events-none"
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
              className="w-24 h-18 filter drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]"
            >
              {/* Gamepad Outer Shell */}
              <path
                d="M20,15 L80,15 C90,15 95,22 95,32 L90,58 C88,64 80,68 72,60 L62,50 L38,50 L28,60 C20,68 12,64 10,58 L5,32 C5,22 10,15 20,15 Z"
                fill="#0d0e22"
                stroke="url(#neonPinkCyan)"
                strokeWidth="2.5"
              />

              {/* Glowing Accents */}
              <path
                d="M12,28 C12,28 17,25 22,30 C27,35 25,48 18,52"
                stroke="#06b6d4"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M88,28 C88,28 83,25 78,30 C73,35 75,48 82,52"
                stroke="#ec4899"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />

              {/* D-Pad */}
              <g transform="translate(18, 25)">
                <path
                  d="M6,0 L10,0 L10,6 L16,6 L16,10 L10,10 L10,16 L6,16 L6,10 L0,10 L0,6 L6,6 Z"
                  fill="#06b6d4"
                />
                <circle cx="8" cy="8" r="2" fill="#0d0e22" />
              </g>

              {/* Action Buttons */}
              <g transform="translate(62, 23)">
                <circle cx="12" cy="4" r="3" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
                <circle cx="4" cy="12" r="3" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
                <circle cx="20" cy="12" r="3" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
                <circle cx="12" cy="20" r="3" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
              </g>

              {/* Thumbsticks */}
              <g transform="translate(36, 42)">
                <circle cx="6" cy="6" r="6" fill="#1e203c" stroke="#06b6d4" strokeWidth="1" />
                <circle cx="6" cy="6" r="2.5" fill="#06b6d4" />
              </g>
              <g transform="translate(56, 42)">
                <circle cx="6" cy="6" r="6" fill="#1e203c" stroke="#ec4899" strokeWidth="1" />
                <circle cx="6" cy="6" r="2.5" fill="#ec4899" />
              </g>

              {/* Menu Details */}
              <rect x="44" y="24" width="4" height="2" rx="0.5" fill="#94a3b8" />
              <rect x="50" y="24" width="4" height="2" rx="0.5" fill="#94a3b8" />

              <defs>
                <linearGradient id="neonPinkCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
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
              <img
                src="/assets/images/img/gold-coin.png"
                alt="Gold Coin"
                className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                onError={() => setCoinError(true)}
              />
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
              <img
                src="/assets/images/giftkarte.webp"
                alt="Voucher"
                className="w-10 h-10 object-contain filter drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]"
                onError={() => setDiamondError(true)}
              />
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
              <img
                src="/assets/images/img/trophy.png"
                alt="Trophy"
                className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                onError={() => setTrophyError(true)}
              />
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
            <Phone className="w-8 h-8 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
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
              className="text-white text-base font-bold tracking-[0.15em] "
              style={{
                textShadow: "0 0 10px rgba(6,182,212,0.4)",
                // fontFamily: "'Atom Sans', sans-serif",
              }}
            >
              {phrases[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── PREMIUM XP LEVELING PROGRESS BAR ── */}
        <div className="flex flex-col items-center gap-1 w-full max-w-[200px] mt-2">
          <div className="w-full h-1.5 bg-[#0b0c1e] rounded-full overflow-hidden border border-cyan-500/20 p-[1px] shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500"
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