import React from "react";

export interface VesperLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const VesperLogo: React.FC<VesperLogoProps> = ({
  size = 32,
  className = "",
  showText = false,
  textColor = "currentColor",
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="vLaunchLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7a1a" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="vLaunchAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
          <filter id="vLaunchGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#ea580c" floodOpacity="0.25" />
          </filter>
        </defs>
        <rect x="20" y="20" width="472" height="472" rx="116" fill="#ffffff" />
        <rect x="20" y="20" width="472" height="472" rx="116" fill="none" stroke="#ffedd5" strokeWidth="12" />
        <g filter="url(#vLaunchGlow)">
          <path d="M104 136 L192 136 L256 320 L204 320 Z" fill="url(#vLaunchLogoGrad)" />
          <path d="M408 136 L320 136 L256 320 L308 320 Z" fill="url(#vLaunchLogoGrad)" />
          <path d="M204 320 L256 400 L308 320 Z" fill="url(#vLaunchLogoGrad)" />
          <path d="M224 200 L288 200 L256 268 Z" fill="url(#vLaunchAccentGrad)" />
        </g>
      </svg>
      {showText && (
        <span
          className="font-mono font-bold tracking-[0.22em] text-sm uppercase select-none"
          style={{ color: textColor }}
        >
          VESPER
        </span>
      )}
    </div>
  );
};
