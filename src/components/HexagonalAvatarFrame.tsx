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
      {/* Circle avatar image in center */}
      <button
        onClick={onEditClick}
        className="w-full h-full overflow-hidden relative z-10 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <img src={imageUrl} alt="Avatar" className="w-full h-full object-contain" />
      </button>

      {/* Edit pencil icon */}
      <button
        onClick={onEditClick}
        className={`absolute bottom-0 right-0 w-7 h-7 rounded-full bg-yellow-main flex items-center justify-center text-blue-main hover:scale-110 active:scale-95 transition-transform z-20 shadow-lg border ${isDark ? "border-black-main" : "border-white"
          }`}
      >
        <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
