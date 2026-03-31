import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Truck,
  ClipboardList,
  Activity,
  Bot,
  ExternalLink,
  BarChart2,
  Layers,
  PercentSquare,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { StatCard, SectionHeader, GlassCard, ChartTitle, chartProps, CustomChartTooltip } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import AlertBlock from "../../../imports/AlertBlock";
import {
  ПОКАЗАТЕЛИ,
  РАЗРЕЗЫ,
  ТЕРРИТОРИИ,
  ПОДРАЗДЕЛЕНИЯ,
  ВИДЫ_БИЗНЕСА,
  businessTypeToProductGroups,
  divisionGroupToDivisions,
} from "../filtersData";

// ── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#1A8D7A";
const YELLOW = "#f59e0b";
const RED = "#ba2447";

// Muted/softer variants for summary text and decorative elements
const MUTED_GREEN = "#86efac";
const MUTED_YELLOW = "#fcd34d";
const MUTED_RED = "#fca5a5";

// ── Mock data ─────────────────────────────────────────────────────────────────
const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

const marginChartData = months.map((m, i) => ({
  month: m,
  id: `margin-${i}`,
  факт: [22.1, 23.5, 26.1, 24.8, 25.3, 27.0, 26.4, 27.8, 26.9, 25.1, 25.8, 27.2][i],
  план: [24.0, 25.0, 27.5, 26.0, 27.0, 28.5, 28.0, 29.0, 28.0, 27.0, 27.5, 28.5][i],
}));

const priceChartData = months.map((m, i) => ({
  month: m,
  id: `price-${i}`,
  факт: [146.3, 151.0, 153.4, 149.8, 152.1, 155.3, 153.8, 156.2, 154.7, 142.5, 145.8, 148.2][i],
  план: [148.0, 150.0, 152.0, 150.0, 151.0, 154.0, 153.0, 155.0, 153.0, 144.0, 147.0, 149.0][i],
}));

const volumeChartData = months.map((m, i) => ({
  month: m,
  id: `volume-${i}`,
  факт: [820, 870, 948, 910, 940, 980, 960, 990, 970, 920, 940, 980][i],
  план: [850, 880, 980, 930, 960, 1000, 980, 1010, 990, 950, 970, 1000][i],
  прошлыйГод: [795, 845, 920, 885, 915, 955, 935, 965, 945, 895, 915, 955][i], // Данные прошлого года
}));

const serviceChartData = months.map((m, i) => ({
  month: m,
  id: `service-${i}`,
  факт: [93.1, 94.2, 94.2, 95.1, 95.8, 96.2, 95.9, 96.5, 96.0, 94.8, 95.3, 96.1][i],
  план: [97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97][i],
}));

// Breakdown data for right bars
const breakdownByРазрез: Record<string, { name: string; значение: number; цвет: string }[]> = {
  "Территории": ТЕРРИТОРИИ.map((t, i) => ({
    name: t,
    значение: [310, 280, 142, 112, 104, 68, 55][i],
    цвет: ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D", "#A47DD4", "#E05A85"][i],
  })),
  "Подразделения": ПОДРАЗДЕЛЕНИЯ.map((p, i) => {
    const colors = ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D", "#A47DD4", "#E05A85", "#BA2447", "#9e233b", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
    return {
      name: p,
      значение: Math.floor(Math.random() * 250) + 50, // Random values between 50-300
      цвет: colors[i % colors.length],
    };
  }),
  "Вид бизнеса": ВИДЫ_БИЗНЕСА.map((v, i) => ({
    name: v,
    значение: [298, 195, 118, 162, 175][i],
    цвет: ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D"][i],
  })),
};

// ── Data for new charts ──────────────────────────────────────────────────────
const revenueMarginData = months.map((m, i) => ({
  month: m,
  id: `revmar-${i}`,
  выручка: [84.1, 95.0, 97.4, 91.2, 94.8, 99.1, 96.3, 101.2, 98.7, 81.2, 86.5, 92.3][i],
  маржа: [21.9, 25.3, 26.1, 23.5, 24.8, 27.0, 25.9, 28.1, 26.8, 22.4, 23.1, 24.8][i],
}));

const priceCostData = months.map((m, i) => ({
  month: m,
  id: `pricecost-${i}`,
  цена: [146.3, 151.0, 153.4, 149.8, 152.1, 155.3, 153.8, 156.2, 154.7, 142.5, 145.8, 148.2][i],
  себестоимость: [108.2, 111.4, 113.2, 110.5, 112.8, 113.4, 113.9, 112.5, 113.1, 105.8, 107.2, 109.4][i],
}));

// Mock data for Структура объёма — stacked bar format
// Each bar = product group, segments = подразделения shares
// Use top-N subdivisions for readability
const TOP_SUBDIVISIONS = ПОДРАЗДЕЛЕНИЯ.slice(0, 8);
const SUBDIVISION_COLORS: Record<string, string> = {};
const SUB_COLOR_PALETTE = ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D", "#A47DD4", "#E05A85", "#BA2447"];
TOP_SUBDIVISIONS.forEach((s, i) => { SUBDIVISION_COLORS[s] = SUB_COLOR_PALETTE[i]; });

function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return (Math.abs(h) % 1000) / 1000;
}

function generateStackedVolumeData(groups: string[]): Record<string, any>[] {
  return groups.map(group => {
    const row: Record<string, any> = { группа: group };
    let total = 0;
    TOP_SUBDIVISIONS.forEach(sub => {
      const vol = Math.round(20 + seededRandom(group + sub) * 200);
      row[sub] = vol;
      total += vol;
    });
    row._total = total;
    return row;
  });
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "59,130,246";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

// ── Dropdown component ────────────────────────────────────────────────────────
function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: T;
  options: readonly T[] | T[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
          color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <span style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{label}:</span>
        {value}
        <span style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>▾</span>
      </button>
      {open && !disabled && (
        <div
          className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-50 min-w-max"
          style={{
            background: isDark ? "rgba(10,15,20,0.9)" : "rgba(255,255,255,0.9)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            backdropFilter: "blur(80px)",
            WebkitBackdropFilter: "blur(80px)",
            boxShadow: isDark 
              ? "0 8px 32px rgba(0,0,0,0.6)" 
              : "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-xs transition-all"
              style={{
                color: opt === value
                  ? "#e57373"
                  : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                background: opt === value ? "rgba(204,0,0,0.15)" : "transparent",
              }}
              onMouseEnter={e => { if (opt !== value) (e.target as HTMLElement).style.background = "rgba(186,36,71,0.1)"; }}
              onMouseLeave={e => { if (opt !== value) (e.target as HTMLElement).style.background = "transparent"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Placeholder ────────────────────────────────────────────────────────────
function AIPlaceholder({ lines = 3, linkLabel }: { lines?: number; linkLabel?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <GlassCard 
      className="p-4 my-4"
      style={{
        background: "rgba(59,130,246,0.04)",
        border: "1px solid rgba(59,130,246,0.12)",
      }}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Bot size={16} style={{ color: "#60a5fa" }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold mb-2" style={{ color: "#93c5fd" }}>
            ИИ-аналитик
          </p>
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="h-2.5 rounded-full"
                style={{
                  background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                  width: i === lines - 1 ? "60%" : "100%",
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
              Текст ИИ-аналитика будет отображён здесь
            </p>
            {linkLabel && (
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ml-4"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60a5fa",
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={12} />
                {linkLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ── KPI Block ─────────────────────────────────────────────────────────────────
interface KpiBlockProps {
  title: string;
  fact: string;
  plan: string;
  pct: number;
  dynamic: number;
  accentColor: string;
  icon: React.ReactNode;
}

function KpiBlock({ title, fact, plan, pct, dynamic, accentColor, icon }: KpiBlockProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const planColor = pct >= 100 ? GREEN : pct >= 90 ? YELLOW : RED;
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden group transition-all duration-300"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      }}
    >
      <div
        className="absolute -top-5 -left-5 w-16 h-16 rounded-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`, filter: "blur(10px)" }}
      />
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          {title}
        </p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `rgba(${hexToRgb(accentColor)},0.15)`, color: accentColor }}
        >
          {icon}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 mb-2">
        {[
          ["Факт", fact, isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)"],
          ["План", plan, isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"],
        ].map(([lbl, val, col]) => (
          <div key={lbl} className="text-center">
            <p className="text-xs mb-0.5" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{lbl}</p>
            <p className="text-sm font-semibold" style={{ color: col as string }}>{val}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded-md"
          style={{ background: `rgba(${hexToRgb(planColor)},0.12)`, color: planColor, border: `1px solid rgba(${hexToRgb(planColor)},0.2)` }}
        >
          {pct}% от плана
        </span>
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded-md"
          style={{
            background: dynamic >= 0 ? "rgba(26,141,122,0.12)" : "rgba(186,36,71,0.12)",
            color: dynamic >= 0 ? GREEN : RED,
            border: `1px solid ${dynamic >= 0 ? "rgba(26,141,122,0.2)" : "rgba(186,36,71,0.2)"}`,
          }}
        >
          {dynamic >= 0 ? "▲" : "▼"} {Math.abs(dynamic)}%
        </span>
      </div>
    </div>
  );
}

// ── Task Block (spans 2 rows) ────────────────────────────────────────────────
function TaskBlock() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const total = 38;
  const overdue = 6;
  const priorityOverdue = 2;
  const completedPct = ((total - overdue) / total) * 100;

  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        gridRow: "span 2",
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
            Задачи
          </p>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)", color: RED }}>
            <ClipboardList size={14} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Всего задач</span>
            <span className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Просрочено</span>
            <span className="text-2xl font-semibold" style={{ color: RED, textShadow: `0 0 12px rgba(239,68,68,0.5)` }}>{overdue}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Просрочено приоритетных</span>
            <span className="text-xl font-semibold" style={{ color: RED }}>{priorityOverdue}</span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1 mt-4">
          <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Выполнение</span>
          <span className="text-xs font-bold" style={{ color: GREEN }}>{Math.round(completedPct)}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${completedPct}%`, background: `linear-gradient(90deg, ${GREEN}, #34d399)`, boxShadow: `0 0 6px ${GREEN}` }}
          />
        </div>
        <div className="h-1.5 rounded-full mt-2" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${(overdue / total) * 100}%`, background: RED, boxShadow: `0 0 6px ${RED}` }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>
          Просрочено {overdue} из {total}
        </p>
      </div>
    </div>
  );
}

// ── Bottom row KPI Block ─────────────────────────────────────────────────────
function KpiBlockBottom({ title, fact, planTarget, accentColor, icon }: {
  title: string; fact: string; planTarget: string; accentColor: string; icon: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden group transition-all"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      }}
    >
      <div
        className="absolute -top-5 -left-5 w-16 h-16 rounded-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`, filter: "blur(10px)" }}
      />
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{title}</p>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `rgba(${hexToRgb(accentColor)},0.15)`, color: accentColor }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold mb-1" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>{fact}</p>
      <p className="text-xs" style={{ color: accentColor }}>
        ▸ план: {planTarget}
      </p>
    </div>
  );
}

// ── Custom tooltip for Volume chart ──────────────────────────────────────────
function VolumeChartTooltip({ active, payload, label }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (!active || !payload?.length) return null;
  
  const data = payload[0]?.payload;
  if (!data) return null;
  
  const currentYear = data.факт;
  const lastYear = data.прошлыйГод;
  const plan = data.план;
  const changeVsLastYear = lastYear ? (((currentYear - lastYear) / lastYear) * 100).toFixed(1) : null;
  
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: isDark ? "rgba(15,20,25,0.98)" : "rgba(255,255,255,0.98)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
        boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.2)",
        minWidth: "200px",
      }}
    >
      <p className="font-bold mb-3" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
        {label}
      </p>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }} />
        <p style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
          <span className="font-semibold">Текущий год:</span> {currentYear} т
        </p>
      </div>
      
      {lastYear && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }} />
          <p style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>
            <span className="font-semibold">Прошлый год:</span> {lastYear} т
          </p>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(79, 112, 157, 0.6)" }} />
        <p style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
          <span className="font-semibold">План:</span> {plan} т
        </p>
      </div>
      
      {changeVsLastYear && (
        <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
          <p style={{ color: parseFloat(changeVsLastYear) >= 0 ? GREEN : RED, fontWeight: 600 }}>
            {parseFloat(changeVsLastYear) >= 0 ? "▲" : "▼"} {Math.abs(parseFloat(changeVsLastYear))}% к прошлому году
          </p>
        </div>
      )}
    </div>
  );
}

// ── Custom tooltip for stacked volume bars ──────────────────────────────────
function StackedVolumeTooltip({ active, payload, label, coordinate }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (!active || !payload?.length) return null;
  
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: isDark ? "rgba(15,20,25,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        color: isDark ? "white" : "black",
        boxShadow: isDark 
          ? "0 8px 32px rgba(0,0,0,0.5)" 
          : "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <p className="font-bold mb-2">{label}</p>
      {payload.map((p: any, idx: number) => {
        if (!p.value || p.value === 0) return null;
        return (
          <div key={idx} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: p.fill }} />
            <span className="font-semibold">{p.name}:</span>
            <span>{p.value} т ({total > 0 ? Math.round((p.value / total) * 100) : 0}%)</span>
          </div>
        );
      })}
      <p className="text-xs font-semibold mt-2 pt-2" style={{ 
        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`
      }}>
        Всего по группе: {total} т
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const cp = chartProps(isDark);

  const ПОКАЗАТЕЛИ_DASHBOARD = ["Маржа", "Цена", "Объём", "УС"] as const;
  type ПоказательDash = typeof ПОКАЗАТЕЛИ_DASHBOARD[number];
  const РАЗРЕЗЫ_DASHBOARD = ["Территории", "Подразделения", "Вид бизнеса"] as const;
  type РазрезDash = typeof РАЗРЕЗЫ_DASHBOARD[number];

  const [показатель, setПоказатель] = useState<ПоказательDash>("Маржа");
  const [разрез, setРазрез] = useState<РазрезDash>("Территории");
  const [видБизнеса, setВидБизнеса] = useState<string>("Основной бизнес");
  const [группаТоваров, setГруппаТоваров] = useState<string>("Все");

  const chartDataMap: Record<ПоказательDash, typeof marginChartData> = {
    "Маржа": marginChartData,
    "Цена": priceChartData,
    "Объём": volumeChartData,
    "УС": serviceChartData,
  };

  const chartColorMap: Record<ПоказательDash, string> = {
    "Маржа": "#1A8D7A",
    "Цена": "#a855f7",
    "Объём": "#3b82f6",
    "УС": "#f59e0b",
  };

  const chartData = chartDataMap[показатель];
  const chartColor = chartColorMap[показатель];
  const rightBars = breakdownByРазрез[разрез] || [];

  const productGroups = видБизнеса ? businessTypeToProductGroups[видБизнеса] || [] : [];
  const productGroupOptions = ["Все", ...productGroups];

  const stackedVolumeData = useMemo(() => {
    if (!видБизнеса) return [];
    const groups = группаТоваров === "Все" ? productGroups : [группаТоваров];
    return generateStackedVolumeData(groups);
  }, [видБизнеса, группаТоваров, productGroups]);


  return (
    <div>
      {/* Header */}
      <SectionHeader
        title="Командный центр"
        description="Сводный обзор ключевых метрик по всем направлениям бизнеса Ратимир."
        badge="Март 2026"
      />

      {/* Summary text block and Tasks - on one line, aligned with KPI grid */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "auto" }}>
        <div style={{ gridColumn: "span 3" }}>
          <AlertBlock 
            variant="green" 
            title="Выручка и цена — в норме" 
            description="Выручка превышает план на 5.2%. Цена 153.4 ₽/кг выше планового значения. Прогноз на конец месяца — 98.8 млн ₽."
          />
        </div>

        {/* Tasks Block - spans 3 rows */}
        <div 
          className="rounded-2xl relative overflow-hidden transition-all duration-300 hover-card p-5 flex flex-col justify-between h-full"
          style={{ 
            gridRow: "span 3",
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
                Задачи
              </p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)", color: RED }}>
                <ClipboardList size={14} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Всего задач</span>
                <span className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>38</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Просрочено</span>
                <span className="text-2xl font-semibold" style={{ color: RED, textShadow: `0 0 12px rgba(239,68,68,0.5)` }}>6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", maxWidth: "120px", lineHeight: "1.3" }}>Просрочено приоритетных</span>
                <span className="text-xl font-semibold" style={{ color: RED }}>2</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1 mt-4">
              <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Выполнение</span>
              <span className="text-xs font-bold" style={{ color: GREEN }}>84%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: "84%", background: `linear-gradient(90deg, ${GREEN}, ${YELLOW})`, boxShadow: `0 0 8px ${GREEN}50` }}
              />
            </div>
          </div>
        </div>

        <div style={{ gridColumn: "span 3" }}>
          <AlertBlock 
            variant="yellow" 
            title="Объём продаж — отставание" 
            description="Объём 948 т при плане 980 т (−3.1%). Критические блоки: Мясной проект −9.2%, Охлажденные ПФ −7.1%."
          />
        </div>

        <div style={{ gridColumn: "span 3" }}>
          <AlertBlock 
            variant="red" 
            title="Дебиторка превышает лимит" 
            description="+12.4% к лимиту. Взыскание: ООО «Ромашка» (4.2 млн), ИП Сидоров (2.8 млн). Срок просрочки 38–45 дней."
          />
        </div>
      </div>

      {/* KPI Grid: 8 blocks in 2 rows, 4 blocks each */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              Выручка
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>97.4 млн</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>План: 98.5 млн</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>
              ▲ +5.2%
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              Объём
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <ShoppingCart size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>948 т</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>План: 980 т</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(245,158,11,0.12)", color: YELLOW, border: "1px solid rgba(245,158,11,0.2)" }}>
              96.7%
            </span>
            <span className="text-xs font-bold" style={{ color: RED }}>▼ 3.1%</span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              Маржа
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <PercentSquare size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>26.1%</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>План: 27.5%</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(245,158,11,0.12)", color: YELLOW, border: "1px solid rgba(245,158,11,0.2)" }}>
              94.9%
            </span>
            <span className="text-xs font-bold" style={{ color: GREEN }}>▲ 0.8%</span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              Цена
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <BarChart2 size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>153.4 ₽</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>План: 152.0 ₽</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>
              ▲ +0.9%
            </span>
            <span className="text-xs font-bold" style={{ color: GREEN }}>▲ 2.3%</span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              УС
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <Activity size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>94.2%</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Цель: 97%</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(239,68,68,0.12)", color: RED, border: "1px solid rgba(239,68,68,0.2)" }}>
              Ниже цели
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              Долг
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>14.7 млн</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Лимит: ≤ 13.1 млн</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(239,68,68,0.12)", color: RED, border: "1px solid rgba(239,68,68,0.2)" }}>
              Выше лимита
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              Утилиз. ТС
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <Truck size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>87%</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Цель: ≥ 85%</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>
              ▲ +1.2%
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 relative overflow-hidden transition-all hover-card"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            minHeight: "140px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              Утилиз. обор.
            </p>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)" }}
            >
              <Layers size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>79%</p>
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Цель: ≥ 80%</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(245,158,11,0.12)", color: YELLOW, border: "1px solid rgba(245,158,11,0.2)" }}>
              Ниже цели
            </span>
          </div>
        </div>
      </div>

      {/* AI placeholder */}
      <AIPlaceholder lines={3} />

      {/* Charts section — single chart based on selected Показатель */}
      <GlassCard className="p-5 my-4">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <Dropdown label="Показатель" value={показатель} options={ПОКАЗАТЕЛИ_DASHBOARD} onChange={setПоказатель} />
          <Dropdown label="Разрез" value={разрез} options={РАЗРЕЗЫ_DASHBOARD} onChange={setРазрез} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left: single area chart */}
          <div className="col-span-2">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              {показатель}
            </p>
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={chartData} margin={{ right: 10 }}>
                <defs>
                  <linearGradient id="grad-dash-plan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.08} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grad-dash-fact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...cp.cartesianGrid} />
                <XAxis dataKey="month" {...cp.xAxis} />
                <YAxis {...cp.yAxis} width={45} />
                <Tooltip content={показатель === "Объём" ? <VolumeChartTooltip /> : <CustomChartTooltip />} />
                <Area key="area-plan" type="monotone" dataKey="план" name="План" stroke={`rgba(${hexToRgb(chartColor)},0.4)`} fill="url(#grad-dash-plan)" strokeWidth={1.5} strokeDasharray="5 5" />
                <Area key="area-fact" type="monotone" dataKey="факт" name="Факт" stroke={chartColor} fill="url(#grad-dash-fact)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Right: horizontal bars by breakdown */}
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
              {разрез}
            </p>
            <div className="space-y-2 overflow-y-auto pr-2" style={{ height: "290px" }}>
              {rightBars.map(item => {
                const maxVal = Math.max(...rightBars.map(b => b.значение));
                const pct = (item.значение / maxVal) * 100;
                return (
                  <div key={item.name}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{item.name}</span>
                      <span className="text-xs font-bold" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{item.значение}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: item.цвет, boxShadow: `0 0 5px ${item.цвет}40` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* AI Analyst block after first chart */}
      <AIPlaceholder lines={3} linkLabel="Все дашборды" />

      {/* Структура объёма */}
      <GlassCard className="p-5 my-4">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <Dropdown
            label="Вид бизнеса"
            value={видБизнеса || "—"}
            options={ВИДЫ_БИЗНЕСА as unknown as string[]}
            onChange={(v) => { setВидБизнеса(v); setГруппаТоваров("Все"); }}
          />
          <Dropdown
            label="Группа товаров"
            value={группаТоваров}
            options={productGroupOptions}
            onChange={setГруппаТоваров}
            disabled={!видБизнеса}
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          Структура объёма
        </p>

        {!видБизнеса && (
          <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
            Выберите вид бизнеса для отображения структуры объёма
          </p>
        )}

        {видБизнеса && stackedVolumeData.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={Math.max(stackedVolumeData.length * 45, 180)}>
              <BarChart data={stackedVolumeData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid {...cp.cartesianGrid} horizontal={false} vertical={false} />
                <XAxis type="number" {...cp.xAxis} />
                <YAxis
                  dataKey="группа"
                  type="category"
                  width={180}
                  tick={{ fill: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<StackedVolumeTooltip />} />
                {TOP_SUBDIVISIONS.map(sub => (
                  <Bar key={sub} dataKey={sub} name={sub} stackId="vol" fill={SUBDIVISION_COLORS[sub]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-3">
              {TOP_SUBDIVISIONS.map(sub => (
                <div key={sub} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: SUBDIVISION_COLORS[sub] }} />
                  <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{sub}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </GlassCard>

      {/* Важные события */}
      <GlassCard className="p-5 my-4">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
            Важные события
          </p>
          <div className="flex items-center gap-2">
            
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              }}
            >
              <AlertTriangle size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Event 1 */}
          <div
            className="p-4 rounded-xl transition-all"
            style={{
              background: isDark ? "rgba(186,36,71,0.06)" : "rgba(186,36,71,0.04)",
              border: "1px solid rgba(186,36,71,0.2)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} style={{ color: "#ba2447", flexShrink: 0, marginTop: 2 }} />
                <h4 className="text-sm font-semibold leading-snug" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                  Невыполнение плана по группе «Колбасные изделия»
                </h4>
              </div>
              <span
                className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                }}
              >
                продажи
              </span>
            </div>
            <p className="text-xs font-semibold ml-6" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              <span style={{ color: "#ba2447", fontSize: 16, fontWeight: 600 }}>440тн</span> / 980тн
            </p>
          </div>

          {/* Event 2 */}
          <div
            className="p-4 rounded-xl transition-all"
            style={{
              background: isDark ? "rgba(186,36,71,0.06)" : "rgba(186,36,71,0.04)",
              border: "1px solid rgba(186,36,71,0.2)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} style={{ color: "#ba2447", flexShrink: 0, marginTop: 2 }} />
                <h4 className="text-sm font-semibold leading-snug" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                  Низкий уровень сервиса по подразделению Реми
                </h4>
              </div>
              <span
                className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                }}
              >
                продажи
              </span>
            </div>
            <p className="text-xs font-semibold ml-6" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              <span style={{ color: "#ba2447", fontSize: 16, fontWeight: 600 }}>75%</span> / 93%
            </p>
          </div>

          {/* Event 3 */}
          <div
            className="p-4 rounded-xl transition-all"
            style={{
              background: isDark ? "rgba(186,36,71,0.06)" : "rgba(186,36,71,0.04)",
              border: "1px solid rgba(186,36,71,0.2)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} style={{ color: "#ba2447", flexShrink: 0, marginTop: 2 }} />
                <h4 className="text-sm font-semibold leading-snug" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                  Просрочка долга – контрагент «X5»
                </h4>
              </div>
              <span
                className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                }}
              >
                финансы
              </span>
            </div>
            <p className="text-xs font-semibold ml-6" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              <span style={{ color: "#ba2447", fontSize: 16, fontWeight: 600 }}>10 млн</span> – 90+ дней
            </p>
          </div>

          {/* Event 4 */}
          <div
            className="p-4 rounded-xl transition-all"
            style={{
              background: isDark ? "rgba(186,36,71,0.06)" : "rgba(186,36,71,0.04)",
              border: "1px solid rgba(186,36,71,0.2)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} style={{ color: "#ba2447", flexShrink: 0, marginTop: 2 }} />
                <h4 className="text-sm font-semibold leading-snug" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                  Невыполнение задач – Федоров Ф.Ф.
                </h4>
              </div>
              <span
                className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                }}
              >
                задачи
              </span>
            </div>
            <p className="text-xs font-semibold ml-6" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              <span style={{ color: "#ba2447", fontSize: 16, fontWeight: 600 }}>4 просроченных</span> / 4
            </p>
          </div>
        </div>
      </GlassCard>

      {/* AI placeholder 2 */}
      <AIPlaceholder lines={4} />

      {/* Links block */}
      <GlassCard className="p-5 my-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          Ресурсы и отчёты
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Power BI — Финансы", desc: "Дашборд финансовых показателей", color: "#f59e0b", href: "#" },
            { label: "Power BI — Продажи", desc: "Анализ продаж по Регионам и блокам", color: "#3b82f6", href: "#" },
            { label: "Power BI — Логистика", desc: "Утилизация ТС и маршруты", color: "#10b981", href: "#" },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-start gap-3 p-3 rounded-xl transition-all hover-card"
              style={{
                background: `rgba(${hexToRgb(link.color)},0.05)`,
                border: `1px solid rgba(${hexToRgb(link.color)},0.12)`,
                textDecoration: "none",
                backdropFilter: "blur(20px)",
                boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.05)",
              }}
            >
              <ExternalLink size={16} style={{ color: link.color, flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>{link.label}</p>
                <p className="text-xs mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}