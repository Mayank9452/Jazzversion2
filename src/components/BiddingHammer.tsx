"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export const BiddingHammer = ({ className = "w-12 h-12" }: { className?: string }) => {
  const [tick, setTick] = useState(0);

  // Sync animation cycles every 2.2 seconds (0.8s animation + 1.4s delay)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* ── HAMMER (GAVEL) ── */}
      <motion.div
        key={`hammer-${tick}`} // Forces re-sync every cycle
        initial={{ rotate: 25 }}
        animate={{
          rotate: [25, -25, 25],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.2, 1],
          ease: "easeInOut",
        }}
        className="relative z-20 origin-right ml-1"
        style={{ transformOrigin: "85% 75%" }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Handle - Golden Wood */}
          <path
            d="M85,75 L45,45 C42,42 38,42 35,45 C32,48 32,52 35,55 L75,85"
            stroke="url(#hammerGold)"
            // strokeWidth="8"
            strokeLinecap="round"
            fill="url(#hammerGold)"
          />
          {/* Handle Cap */}
          {/* <circle cx="83" cy="78" r="5" fill="#ca8a04" /> */}

          {/* Gavel Head */}
          <g transform="translate(10, 20) rotate(-52 25 25)">
            <rect x="5" y="10" width="30" height="20" fill="url(#hammerGold)" />
            {/* Dark Gold Edges */}
            <path d="M5,8 L5,32 L0,35 L0,5 Z" fill="#ca8a04" stroke="#fef3c7" strokeWidth="0.5" />
            <path d="M35,8 L35,32 L40,35 L40,5 Z" fill="#ca8a04" stroke="#fef3c7" strokeWidth="0.5" />
            {/* Bright Highlight Band */}
            <rect x="18" y="10" width="4" height="20" fill="#fef3c7" fillOpacity="0.8" />
          </g>

          <defs>
            <linearGradient id="hammerGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ── STAND (SOUND BLOCK) ── */}
      <div className="relative mt-[-15px]">
        <svg
          viewBox="0 0 100 40"
          className="w-16 h-8 drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sound Block Base */}
          <rect x="20" y="20" width="60" height="12" rx="2" fill="#ca8a04" />
          <rect x="15" y="15" width="70" height="8" rx="2" fill="#fbbf24" />
          {/* Top Surface */}
          <ellipse cx="50" cy="15" rx="35" ry="10" fill="#78350f" />
          {/* Surface Highlight */}
          <ellipse cx="50" cy="13" rx="30" ry="7" fill="url(#hammerGold)" fillOpacity="0.2" />
        </svg>

        {/* ── IMPACT EFFECT ── */}
        <motion.div
          key={`pulse-${tick}`} // Forces re-sync every cycle
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 2.5],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 0.4,
            delay: 0.16, // Hits exactly at 0.16s
            ease: "easeOut",
          }}
          className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-yellow-400 bg-yellow-400/10 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default BiddingHammer;
