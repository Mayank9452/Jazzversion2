"use client";
import React from "react";

function GiftCombo({ size = 48, className = "", tickets = "0", textClassName = "", textStyle = {} }) {
  return (
    <div className="relative flex h-10 items-center">

      {/* 🎁 Animated Open Gift Box */}
      <img
        src="/assets/images/gift_open.png"
        alt="gift"
        style={{ width: size, height: size }}
        className={`
          absolute start-0 top-[100%]
          -translate-y-[79%] -translate-x-[48%]
          drop-shadow-lg h-
          ${className}
        `}
      />

      {/* 🏷 Label */}
      <div
        style={textStyle}
        className={`border text-black font-bold border-l-0 border-[#01FFB4] bg-[#01FFB4] rounded-full py-1 px-4 ps-10 shadow-md ${textClassName ? textClassName : "text-xl"}`}
      >
        {tickets}
      </div>
    </div>
  );
}

export default GiftCombo;