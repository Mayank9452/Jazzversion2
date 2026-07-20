import React from "react";

interface LaurelWreathProps {
  size?: number;
  color?: string;
  className?: string;
}

const LaurelWreath: React.FC<LaurelWreathProps> = ({
  size = 100,
  color = "currentColor",
  className = ""
}) => {
  // Coordinates and rotations for the left leaves to fit a premium curved branch
  const leftLeaves = [
    { cx: 34, cy: 75, rx: 5.5, ry: 9.5, rotate: -42 },
    { cx: 28, cy: 68, rx: 5.5, ry: 9.5, rotate: -36 },
    { cx: 23, cy: 60, rx: 5.5, ry: 9.5, rotate: -26 },
    { cx: 20, cy: 51, rx: 5.5, ry: 9.5, rotate: -14 },
    { cx: 20, cy: 41, rx: 5.5, ry: 9.5, rotate: 2 },
    { cx: 23, cy: 32, rx: 5.5, ry: 9.5, rotate: 20 },
    { cx: 29, cy: 24, rx: 5.5, ry: 9.5, rotate: 42 },
    { cx: 38, cy: 18, rx: 5.5, ry: 9.5, rotate: 64 },
    { cx: 48, cy: 16, rx: 5.5, ry: 9.5, rotate: 84 }
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central stems */}
      <path
        d="M 33,78 C 15,68 15,30 45,18"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M 67,78 C 85,68 85,30 55,18"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Ribbon bow at bottom */}
      <path
        d="M 44,81 C 47,78 53,78 56,81 C 58,83 54,88 50,85 C 46,88 42,83 44,81 Z"
        fill={color}
      />
      <path d="M 46,83 C 41,87 38,91 39,92" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 54,83 C 59,87 62,91 61,92" stroke={color} strokeWidth="2.8" strokeLinecap="round" />

      {/* Left side leaves */}
      {leftLeaves.map((leaf, idx) => (
        <ellipse
          key={`left-leaf-${idx}`}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          transform={`rotate(${leaf.rotate} ${leaf.cx} ${leaf.cy})`}
          fill={color}
        />
      ))}

      {/* Right side leaves (mirrored horizontally) */}
      {leftLeaves.map((leaf, idx) => {
        const cx = 100 - leaf.cx;
        const rotate = -leaf.rotate;
        return (
          <ellipse
            key={`right-leaf-${idx}`}
            cx={cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            transform={`rotate(${rotate} ${cx} ${leaf.cy})`}
            fill={color}
          />
        );
      })}
    </svg>
  );
};

export default LaurelWreath;
