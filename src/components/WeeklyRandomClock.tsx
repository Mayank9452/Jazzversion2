import { useMemo } from "react";

export default function WeeklyRandomClock({ seed }: { seed: number }) {
  // ── Generate stable random (based on index/seed) ─────────────
  const { startHour, endHour } = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(seed * 999 + n) * 10000;
      return x - Math.floor(x);
    };

    const start = Math.floor(rand(1) * 24); // 0–23
    const span = 3 + Math.floor(rand(2) * 8); // 3–10 hours span
    const end = (start + span) % 24;

    return { startHour: start, endHour: end };
  }, [seed]);

  // ── Convert to degrees ─────────────────────────────
  const startDeg = (startHour / 24) * 360;
  const endDeg = (endHour / 24) * 360;

  const hourDeg = (startHour % 12) * 30;
  const minDeg = (endHour % 12) * 30;

  // ── Helpers ─────────────────────────────
  const polar = (deg: number, r: number) => {
    const rad = (deg - 90) * (Math.PI / 180);
    return {
      x: 12 + Math.cos(rad) * r,
      y: 12 + Math.sin(rad) * r,
    };
  };

  const describeArc = (start: number, end: number) => {
    const s = polar(end, 10);
    const e = polar(start, 10);

    const diff = (end - start + 360) % 360;
    const largeArc = diff > 180 ? 1 : 0;

    return `M ${s.x} ${s.y}
            A 10 10 0 ${largeArc} 0 ${e.x} ${e.y}`;
  };

  const hand = (deg: number, len: number) => {
    const r = (deg - 90) * (Math.PI / 180);
    return {
      x2: 12 + Math.cos(r) * len,
      y2: 12 + Math.sin(r) * len,
    };
  };

  // ── 12 ticks ─────────────────────────────
  const ticks = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const deg = (i / 12) * 360;

      const outer = polar(deg, 9);
      const inner = polar(deg, i % 6 === 0 ? 7 : 8);

      return (
        <line
          key={i}
          x1={inner.x}
          y1={inner.y}
          x2={outer.x}
          y2={outer.y}
          stroke={i % 6 === 0 ? "white" : "rgba(255,255,255,0.5)"}
          strokeWidth={i % 6 === 0 ? 1.4 : 0.7}
        />
      );
    });
  }, []);

  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      {/* Dial */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="rgba(255,255,255,0.08)"
        stroke="white"
        strokeWidth="1"
      />

      {/* 24 ticks */}
      {ticks}

      {/* Random slice */}
      {/* <path
        d={describeArc(startDeg, endDeg)}
        stroke="#f43f5e"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      /> */}

      {/* Hour hand */}
      <line
        x1="12"
        y1="12"
        {...hand(hourDeg, 5)}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1="12"
        y1="12"
        {...hand(minDeg, 7)}
        stroke="#facc15"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Center */}
      <circle cx="12" cy="12" r="1.2" fill="white" />
    </svg>
  );
}