import { useEffect, useState } from "react";

function MyanmarClock() {
  const [hands, setHands] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const mmt = new Date(utc + 6.5 * 3600000);

      const h = mmt.getHours() % 12;
      const m = mmt.getMinutes();
      const s = mmt.getSeconds();

      setHands({
        h: h * 30 + m * 0.5,
        m: m * 6 + s * 0.1,
        s: s * 6,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hand = (deg: number, len: number) => {
    const r = (deg - 90) * (Math.PI / 180);
    return {
      x2: 12 + Math.cos(r) * len,
      y2: 12 + Math.sin(r) * len,
    };
  };

  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      {/* Glow background */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="12" cy="12" r="11" fill="url(#glow)" />

      {/* Main dial */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
      />

      {/* Major ticks */}
      {[0, 90, 180, 270].map((deg) => {
        const r = (deg - 90) * (Math.PI / 180);
        return (
          <line
            key={deg}
            x1={12 + Math.cos(r) * 7.5}
            y1={12 + Math.sin(r) * 7.5}
            x2={12 + Math.cos(r) * 9}
            y2={12 + Math.sin(r) * 9}
            stroke="white"
            strokeWidth="1.4"
          />
        );
      })}

      {/* Minor ticks */}
      {[30, 60, 120, 150, 210, 240, 300, 330].map((deg) => {
        const r = (deg - 90) * (Math.PI / 180);
        return (
          <line
            key={deg}
            x1={12 + Math.cos(r) * 8}
            y1={12 + Math.sin(r) * 8}
            x2={12 + Math.cos(r) * 9}
            y2={12 + Math.sin(r) * 9}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />
        );
      })}

      {/* Hour hand */}
      <line
        x1="12"
        y1="12"
        {...hand(hands.h, 5)}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1="12"
        y1="12"
        {...hand(hands.m, 7)}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Second hand (smooth + highlight) */}
      <line
        x1="12"
        y1="12"
        {...hand(hands.s, 8.5)}
        stroke="#facc15"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ transition: "all 0.2s linear" }}
      />

      {/* Center gradient dot */}
      <circle cx="12" cy="12" r="1.2" fill="white" />

      {/* Tip glow */}
      <circle
        cx={12 + Math.cos((hands.s - 90) * Math.PI / 180) * 8.5}
        cy={12 + Math.sin((hands.s - 90) * Math.PI / 180) * 8.5}
        r="1"
        fill="#facc15"
        opacity="0.9"
      />
    </svg>
  );
}
export default MyanmarClock;