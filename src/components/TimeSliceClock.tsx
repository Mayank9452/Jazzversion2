import { useMemo } from "react";

export default function TimeSliceClock({ index }: { index: number }) {
  // ── Slice calculation ─────────────────────────────
  const sliceStart = index * 6; // 0, 6, 12, 18
  const sliceEnd = sliceStart + 6; // 6, 12, 18, 24

  // Convert to 12h clock angles
  const hourDeg = (sliceStart % 12) * 30;
  const minDeg = (sliceEnd % 12) * 30; // treat "6" as 30deg * 6

  // ── Helpers ─────────────────────────────
  const hand = (deg: number, len: number) => {
    const r = (deg - 90) * (Math.PI / 180);
    return {
      x2: 12 + Math.cos(r) * len,
      y2: 12 + Math.sin(r) * len,
    };
  };

  const polar = (deg: number, r: number) => {
    const rad = (deg - 90) * (Math.PI / 180);
    return {
      x: 12 + Math.cos(rad) * r,
      y: 12 + Math.sin(rad) * r,
    };
  };

  // ── 24 ticks ─────────────────────────────
  const ticks = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const deg = (i / 24) * 360;

      const outer = polar(deg, 9);
      const inner = polar(deg, i % 6 === 0 ? 7 : 8); // major every 6

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

      {/* Hour hand (start of slice) */}
      <line
        x1="12"
        y1="12"
        {...hand(hourDeg, 4)}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Minute hand (end of slice) */}
      <line
        x1="12"
        y1="12"
        {...hand(minDeg, 8)}
        stroke="#fa0c0c"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Center */}
      <circle cx="12" cy="12" r="1.2" fill="white" />
    </svg>
  );
}