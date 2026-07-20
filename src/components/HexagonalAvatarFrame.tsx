import React from "react";
import { Pencil } from "lucide-react";

interface HexagonalAvatarFrameProps {
  imageUrl: string;
  onEditClick: () => void;
  isDark: boolean;
}

export const HexagonalAvatarFrame = ({
  imageUrl,
  onEditClick,
  isDark,
}: HexagonalAvatarFrameProps) => {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* Outer Hexagon frame SVG */}
      <svg className="absolute inset-0 w-full h-full filter drop-shadow-[0_0_6px_rgba(254,203,19,0.2)]" viewBox="0 0 100 100" fill="none">
        <polygon
          points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5"
          stroke={isDark ? "url(#avatar-grad)" : "var(--color-yellow-main)"}
          strokeWidth="2"
        />
        <polygon
          points="50,7 87,28.5 87,71.5 50,93 13,71.5 13,28.5"
          stroke={isDark ? "var(--color-blue-main)" : "var(--color-yellow-main)"}
          strokeWidth="1.5"
        />
        <polygon
          points="50,8 86,29 86,71 50,92 14,71 14,29"
          stroke={isDark ? "var(--color-aqua-main)" : "var(--color-yellow-main)"}
          strokeOpacity={0.35}
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <defs>
          <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-yellow-main)" />
            <stop offset="50%" stopColor="var(--color-blue-v2)" />
            <stop offset="100%" stopColor="var(--color-aqua-main)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Circle avatar image in center */}
      <div className={`w-[72px] h-[72px] rounded-full overflow-hidden relative z-10 border-2 ${isDark ? "bg-blue-main/30 border-blue-main/50" : "bg-white border-[#fecb13]/50"
        }`}>
        <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
      </div>

      {/* Edit pencil icon */}
      <button
        onClick={onEditClick}
        className={`absolute bottom-1 right-1 w-7 h-7 rounded-full bg-yellow-main flex items-center justify-center text-blue-main hover:scale-110 active:scale-95 transition-transform z-20 shadow-lg border ${isDark ? "border-black-main" : "border-white"
          }`}
      >
        <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
