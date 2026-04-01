import React, { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

// ── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  accentColor?: string;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface ChartTitleProps {
  children: ReactNode;
}

// ── StatCard Component ───────────────────────────────────────────────────────

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  accentColor = "#3b82f6",
}: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)";
  const cardBorder = isDark
    ? "rgba(71, 85, 105, 0.3)"
    : "rgba(226, 232, 240, 0.5)";

  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: cardBg,
        backdropFilter: "blur(20px)",
        border: `1px solid ${cardBorder}`,
      }}
    >
      <div
        className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
        style={{ background: accentColor }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <div
              className="p-1.5 rounded-lg"
              style={{
                background: `${accentColor}20`,
                color: accentColor,
              }}
            >
              {icon}
            </div>
          )}
          <div className="text-xs opacity-60">{title}</div>
        </div>
        <div
          className="text-2xl mb-1"
          style={{ color: accentColor }}
        >
          {value}
        </div>
        {subtitle && (
          <div className="text-xs opacity-50">{subtitle}</div>
        )}
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs mt-1">
            <span
              style={{
                color: change >= 0 ? "#1A8D7A" : "#ba2447",
              }}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
            {changeLabel && (
              <span className="opacity-50">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SectionHeader Component ──────────────────────────────────────────────────

export function SectionHeader({
  title,
  subtitle,
  description,
  badge,
  icon,
  action,
}: SectionHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className="p-2 rounded-xl"
            style={{
              background: isDark
                ? "rgba(59, 130, 246, 0.1)"
                : "rgba(59, 130, 246, 0.08)",
              color: "#3b82f6",
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{title}</h2>
            {badge && (
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.06)",
                  color: isDark
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(0,0,0,0.6)",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {(subtitle || description) && (
            <p
              className="text-sm mt-1"
              style={{
                color: isDark
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.4)",
              }}
            >
              {subtitle || description}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── GlassCard Component ──────────────────────────────────────────────────────

export function GlassCard({
  children,
  className = "",
  glow,
  onClick,
  style,
}: GlassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark
    ? "rgba(255,255,255,0.02)"
    : "rgba(0,0,0,0.01)";
  const cardBorder = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.06)";

  return (
    <div
      className={`rounded-2xl relative overflow-hidden transition-all duration-300 hover-card ${onClick ? "cursor-pointer" : ""} ${className} px-[18px] py-[15px] mx-[0px] mt-[16px] mb-[10px]`}
      style={{
        background: cardBg,
        backdropFilter: "blur(20px)",
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.3)"
          : "0 8px 32px rgba(0,0,0,0.08)",
        ...style,
      }}
      onClick={onClick}
    >
      {glow && (
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 pointer-events-none blur-3xl"
          style={{ background: glow }}
        />
      )}
      {children}
    </div>
  );
}

// ── GlassCardInstructions Component ──────────────────────────────────────────────────────

export function GlassCardInstructions({
  children,
  className = "",
  glow,
  onClick,
  style,
}: GlassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark
    ? "rgba(255,255,255,0.02)"
    : "rgba(0,0,0,0.01)";
  const cardBorder = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.06)";

  return (
    <div
      className={`rounded-2xl relative overflow-hidden transition-all duration-300 hover-card ${onClick ? "cursor-pointer" : ""} ${className} px-[18px] py-[15px] mx-[0px] mt-[0px] mb-[0px]`}
      style={{
        background: cardBg,
        backdropFilter: "blur(20px)",
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.3)"
          : "0 8px 32px rgba(0,0,0,0.08)",
        ...style,
      }}
      onClick={onClick}
    >
      {glow && (
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 pointer-events-none blur-3xl"
          style={{ background: glow }}
        />
      )}
      {children}
    </div>
  );
}

// ── ChartTitle Component ─────────────────────────────────────────────────────

export function ChartTitle({ children }: ChartTitleProps) {
  return (
    <div className="text-sm opacity-70 text-center mx-[0px] mt-[-1px] mb-[12px] px-[0px] pt-[10px] pb-[20px]">
      {children}
    </div>
  );
}

// ── Chart Props Configurations ───────────────────────────────────────────────

// ── Custom Chart Tooltips ────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function CustomChartTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: isDark
          ? "rgba(15,20,25,0.92)"
          : "rgba(250,250,252,0.92)",
        backdropFilter: "blur(80px)",
        WebkitBackdropFilter: "blur(80px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        color: isDark ? "white" : "black",
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.5)"
          : "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <p className="font-bold mb-1.5">{label}</p>
      {payload.map((p: any, index: number) => (
        <div
          key={index}
          className="flex items-center gap-1.5 mb-0.5"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: p.stroke || p.color || p.fill,
            }}
          />
          <span
            style={{
              color: isDark
                ? "rgba(255,255,255,0.9)"
                : "rgba(0,0,0,0.9)",
            }}
          >
            {p.name}:{" "}
            <span className="font-semibold">{p.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function CustomPieTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!active || !payload?.length) return null;

  const data = payload[0];

  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: isDark
          ? "rgba(15,20,41,0.95)"
          : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        color: isDark ? "white" : "black",
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.4)"
          : "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: data.payload.fill }}
        />
        <span className="font-bold">{data.name}</span>
      </div>
      <p className="mt-1 font-semibold">{data.value}</p>
    </div>
  );
}

export function chartProps(isDark: boolean = false) {
  return {
    cartesianGrid: {
      strokeDasharray: "3 3",
      stroke: isDark
        ? "rgba(71, 85, 105, 0.2)"
        : "rgba(0, 0, 0, 0.15)",
      vertical: false,
    },
    xAxis: {
      stroke: isDark
        ? "rgba(100, 116, 139, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      tick: {
        fill: isDark
          ? "rgba(148, 163, 184, 0.5)"
          : "rgba(0, 0, 0, 0.7)",
        fontSize: 11,
      },
      tickLine: false,
      axisLine: false,
    },
    yAxis: {
      stroke: isDark
        ? "rgba(100, 116, 139, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      tick: {
        fill: isDark
          ? "rgba(148, 163, 184, 0.5)"
          : "rgba(0, 0, 0, 0.7)",
        fontSize: 11,
      },
      tickLine: false,
      axisLine: false,
    },
    legend: {
      iconSize: 8,
      wrapperStyle: {
        fontSize: "11px",
        opacity: 1.05,
        color: isDark ? "#ffffff" : "#000000",
      },
    },
  };
}

export const darkChartProps = {
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: "rgba(71, 85, 105, 0.2)",
    vertical: false,
  },
  xAxis: {
    stroke: "rgba(100, 116, 139, 0.3)",
    tick: { fill: "rgba(148, 163, 184, 0.5)", fontSize: 11 },
    tickLine: false,
    axisLine: false,
  },
  yAxis: {
    stroke: "rgba(100, 116, 139, 0.3)",
    tick: { fill: "rgba(148, 163, 184, 0.5)", fontSize: 11 },
    tickLine: false,
    axisLine: false,
  },
  legend: {
    iconSize: 8,
    wrapperStyle: {
      fontSize: "11px",
      opacity: 1.05,
      color: "#ffffff",
    },
  },
};