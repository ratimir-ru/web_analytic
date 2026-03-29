import React from "react";
import { useTheme } from "./ThemeProvider";

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  size?: number;
}

function getColor(pct: number): { solid: string; glow: string } {
  if (pct < 0.4) return { solid: "#ef4444", glow: "rgba(239,68,68,0.5)" };
  if (pct < 0.72) return { solid: "#f59e0b", glow: "rgba(245,158,11,0.5)" };
  return { solid: "#10b981", glow: "rgba(16,185,129,0.5)" };
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "%",
  size = 160,
}: GaugeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pct = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const { solid, glow } = getColor(pct);

  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = size / 2 - 16;
  const startAngle = -180;
  const totalSpan = 180;
  const endAngle = startAngle + totalSpan * pct;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (sa: number, ea: number, radius: number) => {
    const x1 = cx + radius * Math.cos(toRad(sa));
    const y1 = cy + radius * Math.sin(toRad(sa));
    const x2 = cx + radius * Math.cos(toRad(ea));
    const y2 = cy + radius * Math.sin(toRad(ea));
    const large = ea - sa > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const dotX = cx + r * Math.cos(toRad(endAngle));
  const dotY = cy + r * Math.sin(toRad(endAngle));

  const tickCount = 6;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const angle = startAngle + (totalSpan / tickCount) * i;
    const innerR = r - 10;
    const outerR = r - 4;
    const x1 = cx + innerR * Math.cos(toRad(angle));
    const y1 = cy + innerR * Math.sin(toRad(angle));
    const x2 = cx + outerR * Math.cos(toRad(angle));
    const y2 = cy + outerR * Math.sin(toRad(angle));
    return { x1, y1, x2, y2 };
  });

  const svgH = size / 2 + 30;

  const trackStroke = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const tickStroke = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const valueFill = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const labelColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH + 8}`}>
        <defs>
          <filter id={`glow-${value}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={arcPath(startAngle, startAngle + totalSpan, r)}
          fill="none"
          stroke={trackStroke}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Zone segments */}
        <path
          d={arcPath(startAngle, startAngle + totalSpan * 0.4, r)}
          fill="none"
          stroke="rgba(239,68,68,0.18)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={arcPath(startAngle + totalSpan * 0.4, startAngle + totalSpan * 0.72, r)}
          fill="none"
          stroke="rgba(245,158,11,0.15)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={arcPath(startAngle + totalSpan * 0.72, startAngle + totalSpan, r)}
          fill="none"
          stroke="rgba(16,185,129,0.15)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Value arc */}
        {pct > 0.01 && (
          <path
            d={arcPath(startAngle, endAngle, r)}
            fill="none"
            stroke={solid}
            strokeWidth="7"
            strokeLinecap="round"
            filter={`url(#glow-${value})`}
            style={{ opacity: 0.9 }}
          />
        )}

        {/* Ticks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={tickStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Dot at end */}
        {pct > 0.01 && (
          <circle
            cx={dotX}
            cy={dotY}
            r={5}
            fill={solid}
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
          />
        )}

        {/* Center value */}
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize={size * 0.155}
          fontWeight="900"
          fill={valueFill}
          fontFamily="system-ui, sans-serif"
        >
          {value}{unit}
        </text>
      </svg>
      {label && (
        <p
          className="text-center text-xs leading-tight mt-0.5 px-2"
          style={{ color: labelColor }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
