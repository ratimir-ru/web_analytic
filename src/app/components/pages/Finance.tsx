import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { SectionHeader, StatCard, GlassCard, ChartTitle, chartProps, darkChartProps, CustomChartTooltip, CustomPieTooltip } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import { DollarSign, TrendingUp, AlertCircle, ArrowUpDown, Bot, ShoppingBag, ExternalLink } from "lucide-react";
import {
  ТЕРРИТОРИИ,
  ПОДРАЗДЕЛЕНИЯ,
  ВИДЫ_БИЗНЕСА,
  businessTypeToProductGroups,
} from "../filtersData";

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#10b981";
const YELLOW = "#f59e0b";
const RED = "#ef4444";

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "59,130,246";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

// ─── Seed-based filter factor ────────────────────────────────────────────────
function filterFactor(filterValue: string): number {
  if (!filterValue || filterValue === "Все") return 1.0;
  let h = 0;
  for (let i = 0; i < filterValue.length; i++) h = ((h << 5) - h + filterValue.charCodeAt(i)) | 0;
  return 0.75 + (Math.abs(h) % 50) / 100; // 0.75–1.25
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const revenueMonthlyBase = [
  { month: "Янв", выручка: 84.1, маржа: 21.9 },
  { month: "Фев", выручка: 95.0, маржа: 25.3 },
  { month: "Мар", выручка: 97.4, маржа: 26.1 },
  { month: "Апр", выручка: 91.2, маржа: 23.5 },
  { month: "Май", выручка: 94.8, маржа: 24.8 },
  { month: "Июн", выручка: 99.1, маржа: 27.0 },
  { month: "Июл", выручка: 96.3, маржа: 25.9 },
  { month: "Авг", выручка: 101.2, маржа: 28.1 },
  { month: "Сен", выручка: 98.7, маржа: 26.8 },
  { month: "Окт", выручка: 81.2, маржа: 22.4 },
  { month: "Ноя", выручка: 86.5, маржа: 23.1 },
  { month: "Дек", выручка: 92.3, маржа: 24.8 },
];

const priceDataBase = [
  { month: "Янв", цена: 146.3, себестоимость: 108.2 },
  { month: "Фев", цена: 151.0, себестоимость: 111.4 },
  { month: "Мар", цена: 153.4, себестоимость: 113.2 },
  { month: "Апр", цена: 149.8, себестоимость: 110.5 },
  { month: "Май", цена: 152.1, себестоимость: 112.8 },
  { month: "Июн", цена: 155.3, себестоимость: 113.4 },
  { month: "Июл", цена: 153.8, себестоимость: 113.9 },
  { month: "Авг", цена: 156.2, себестоимость: 112.5 },
  { month: "Сен", цена: 154.7, себестоимость: 113.1 },
  { month: "Окт", цена: 142.5, себестоимость: 105.8 },
  { month: "Ноя", цена: 145.8, себестоимость: 107.2 },
  { month: "Дек", цена: 148.2, себестоимость: 109.4 },
];

const receivables = [
  { контрагент: "ООО Ромашка", сумма: 4.2, срок: 45, статус: "red" as const, доля: "28.6%" },
  { контрагент: "ИП Сидоров А.В.", сумма: 2.8, срок: 38, статус: "red" as const, доля: "19.0%" },
  { контрагент: "ЗАО Продторг", сумма: 1.5, срок: 22, статус: "yellow" as const, доля: "10.2%" },
  { контрагент: "ООО МегаМаркет", сумма: 3.1, срок: 14, статус: "yellow" as const, доля: "21.1%" },
  { контрагент: "ИП Петрова М.С.", сумма: 0.9, срок: 7, статус: "green" as const, доля: "6.1%" },
  { контрагент: "ООО Альфа-Торг", сумма: 2.2, срок: 30, статус: "yellow" as const, доля: "15.0%" },
];

const receivablesChart = [
  { month: "Окт", сумма: 9.2 },
  { month: "Ноя", сумма: 10.8 },
  { month: "Дек", сумма: 12.4 },
  { month: "Янв", сумма: 11.9 },
  { month: "Фев", сумма: 13.2 },
  { month: "Мар", сумма: 14.7 },
];

const agingData = [
  { period: "До 30 дн.", сумма: 11.8, доля: 80.3 },
  { period: "30-60 дн.", сумма: 1.6, доля: 10.9 },
  { period: "60-90 дн.", сумма: 0.8, доля: 5.4 },
  { period: "90+ дн.", сумма: 0.5, доля: 3.4 },
];

// Stacked aging: single row with all periods as keys
const agingStackedData = [
  {
    label: "Задолженность",
    "До 30 дн.": agingData[0].доля,
    "30-60 дн.": agingData[1].доля,
    "60-90 дн.": agingData[2].доля,
    "90+ дн.": agingData[3].доля,
    // Raw amounts for tooltip
    _amt0: agingData[0].сумма,
    _amt1: agingData[1].сумма,
    _amt2: agingData[2].сумма,
    _amt3: agingData[3].сумма,
  },
];

const statusBadge = {
  red: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: RED, label: "Просрочена" },
  yellow: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: YELLOW, label: "Внимание" },
  green: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", text: GREEN, label: "В норме" },
};

// Pie chart data
const revenuePieData = [
  { name: "Основной бизнес", value: 42.5, color: "#3b82f6" },
  { name: "Агроптица", value: 24.8, color: "#10b981" },
  { name: "СТ", value: 14.2, color: "#f59e0b" },
  { name: "МАП", value: 9.8, color: "#a855f7" },
  { name: "Трейдинг", value: 6.1, color: "#ef4444" },
];

const marginPieData = [
  { name: "Основной бизнес", value: 28.4, color: "#3b82f6" },
  { name: "Агроптица", value: 22.1, color: "#10b981" },
  { name: "СТ", value: 31.2, color: "#f59e0b" },
  { name: "МАП", value: 18.5, color: "#a855f7" },
  { name: "Трейдинг", value: 12.8, color: "#ef4444" },
];

// Detail table by business type
const businessDetailTable = [
  { вид: "Основной бизнес", группа: "КОЛБАСНЫЕ ИЗДЕЛИЯ", выручка: 18.2, маржа: 28.4 },
  { вид: "Основной бизнес", группа: "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ", выручка: 12.1, маржа: 26.8 },
  { вид: "Основной бизнес", группа: "ДЕЛИКАТЕСЫ", выручка: 7.5, маржа: 31.2 },
  { вид: "Основной бизнес", группа: "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ", выручка: 4.7, маржа: 24.5 },
  { вид: "Агроптица", группа: "Птица охлажденная", выручка: 15.2, маржа: 22.1 },
  { вид: "Агроптица", группа: "Птица замороженная", выручка: 9.6, маржа: 19.8 },
  { вид: "СТ", группа: "Проект СТ", выручка: 8.3, маржа: 31.2 },
  { вид: "СТ", группа: "Проект Птица, Мясо", выручка: 5.9, маржа: 29.5 },
  { вид: "МАП", группа: "МАП", Выручка: 9.8, маржа: 18.5 },
  { вид: "Трейдинг", группа: "Мясо", выручка: 4.2, маржа: 12.8 },
  { вид: "Трейдинг", группа: "Прочие", выручка: 1.9, маржа: 14.2 },
];

// ─── Dropdown ────────────────────────────────────────────────────────────
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
            background: isDark ? "rgba(10,18,40,0.97)" : "rgba(255,255,255,0.97)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            backdropFilter: "blur(20px)",
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

// ─── AI Placeholder with optional Power BI link ──────────────────────────────
function AIPlaceholder({ lines = 4, linkLabel }: { lines?: number; linkLabel?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)" }}
    >
      <Bot size={16} style={{ color: "#60a5fa", flexShrink: 0, marginTop: 2 }} />
      <div className="flex-1">
        <p className="text-xs font-semibold mb-2" style={{ color: "#93c5fd" }}>ИИ-аналитик</p>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full"
              style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", width: i === lines - 1 ? "55%" : "100%" }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}>
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
  );
}

// ─── Half-circle gauge (спидометр) ────────────────────────────────────────────
function HalfGauge({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pct = Math.min(Math.max(value / 100, 0), 1);
  const color = pct >= 0.9 ? GREEN : pct >= 0.7 ? YELLOW : RED;
  const glow = pct >= 0.9 ? "rgba(16,185,129,0.5)" : pct >= 0.7 ? "rgba(245,158,11,0.5)" : "rgba(239,68,68,0.5)";

  const size = 160;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = size / 2 - 18;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (sa: number, ea: number) => {
    const x1 = cx + r * Math.cos(toRad(sa));
    const y1 = cy + r * Math.sin(toRad(sa));
    const x2 = cx + r * Math.cos(toRad(ea));
    const y2 = cy + r * Math.sin(toRad(ea));
    const large = ea - sa > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const endAngle = -180 + 180 * pct;
  const dotX = cx + r * Math.cos(toRad(endAngle));
  const dotY = cy + r * Math.sin(toRad(endAngle));

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 38}`}>
        <defs>
          <filter id={`hglow-${value}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={arcPath(-180, 0)} fill="none" stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"} strokeWidth={8} strokeLinecap="round" />
        <path d={arcPath(-180, -180 + 180 * 0.7)} fill="none" stroke="rgba(239,68,68,0.12)" strokeWidth={8} strokeLinecap="round" />
        <path d={arcPath(-180 + 180 * 0.7, -180 + 180 * 0.9)} fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth={8} strokeLinecap="round" />
        <path d={arcPath(-180 + 180 * 0.9, 0)} fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth={8} strokeLinecap="round" />
        {/* Деления спидометра */}
        {Array.from({ length: 11 }).map((_, i) => {
          const angle = -180 + i * 18;
          const innerRadius = r - 15;
          const outerRadius = r - 5;
          const angleRad = (angle * Math.PI) / 180;
          const x1 = cx + innerRadius * Math.cos(angleRad);
          const y1 = cy + innerRadius * Math.sin(angleRad);
          const x2 = cx + outerRadius * Math.cos(angleRad);
          const y2 = cy + outerRadius * Math.sin(angleRad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
              strokeWidth={i % 5 === 0 ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}
        {pct > 0.01 && (
          <path d={arcPath(-180, endAngle)} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" filter={`url(#hglow-${value})`} />
        )}
        {pct > 0.01 && (
          <circle cx={dotX} cy={dotY} r={5} fill={color} style={{ filter: `drop-shadow(0 0 6px ${glow})` }} />
        )}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize={22} fontWeight="900" fill={isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.92)"} fontFamily="system-ui">
          {value}%
        </text>
      </svg>
      <p className="text-xs font-semibold text-center" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{label}</p>
      <p className="text-xs text-center mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{sublabel}</p>
    </div>
  );
}

// ── Enhanced KPI card ───────────────────────────────────────
function FinKpiCard({ title, fact, plan, forecast, icon, color }: {
  title: string; fact: string; plan: string; forecast: string; icon: React.ReactNode; color: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
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
          {title}
        </p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `rgba(${hexToRgb(color)},0.15)`, color }}
        >
          {icon}
        </div>
      </div>
      <div className="mb-1">
        <span className="text-xs block mb-0.5" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          план: {plan}
        </span>
        <span className="text-2xl font-bold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
          {fact}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          прогноз: {forecast}
        </span>
      </div>
    </div>
  );
}

// ─── Receivables sidebar block ────────────────────────────────────────────────
function ReceivablesSidebar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const limitPct = 112;
  const limitColor = limitPct > 110 ? RED : limitPct > 100 ? YELLOW : GREEN;
  return (
    <div
      className="rounded-2xl p-4 h-full flex flex-col"
      style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={16} style={{ color: RED }} />
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          Дебиторская задолженность
        </p>
      </div>
      <p className="text-2xl font-black mb-1" style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.92)" }}>14.7 млн ₽</p>
      <p className="text-xs mb-4" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Март 2026</p>

      <div className="rounded-xl overflow-hidden mb-4" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
              {["Период", "Сумма", "Доля"].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agingData.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < agingData.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` : "none" }}>
                <td className="px-3 py-2" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>{row.period}</td>
                <td className="px-3 py-2 font-bold" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>{row.сумма} млн</td>
                <td className="px-3 py-2 font-semibold" style={{ color: row.доля > 50 ? YELLOW : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>{row.доля}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="rounded-xl p-3 flex items-center justify-between"
        style={{ background: `rgba(${limitPct > 100 ? "239,68,68" : "16,185,129"},0.08)`, border: `1px solid rgba(${limitPct > 100 ? "239,68,68" : "16,185,129"},0.2)` }}
      >
        <div>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>% к лимиту</p>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Лимит: 13.1 млн ₽</p>
        </div>
        <p className="text-2xl font-black" style={{ color: limitColor }}>{limitPct}%</p>
      </div>

      <div className="mt-auto pt-3">
        <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
          Текст ИИ-аналитика по дебиторке будет здесь
        </p>
      </div>
    </div>
  );
}

// ─── Stacked aging bar tooltip ───────────────────────────────────────────────
function StackedAgingTooltip({ active, payload, label }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const periods = [
    { key: "До 30 дн.", amt: row._amt0, pct: row["До 30 дн."], color: GREEN },
    { key: "30-60 дн.", amt: row._amt1, pct: row["30-60 дн."], color: YELLOW },
    { key: "60-90 дн.", amt: row._amt2, pct: row["60-90 дн."], color: "#f97316" },
    { key: "90+ дн.", amt: row._amt3, pct: row["90+ дн."], color: "#991b1b" },
  ];
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: isDark ? "rgba(15,20,41,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        color: isDark ? "white" : "black",
        boxShadow: isDark 
          ? "0 8px 32px rgba(0,0,0,0.4)" 
          : "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      {periods.map(p => (
        <p key={p.key} style={{ color: p.color }}>
          {p.key}: {p.amt} млн руб. ({p.pct}%)
        </p>
      ))}
    </div>
  );
}

// ─── Pie tooltip ─────────────────────────────────────────
function PieTooltipContent({ active, payload }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: isDark ? "rgba(15,20,41,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        color: isDark ? "white" : "black",
        boxShadow: isDark 
          ? "0 8px 32px rgba(0,0,0,0.4)" 
          : "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <p className="font-bold">{d.name}: {d.value}%</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function Finance() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const cp = chartProps(isDark);

  // Tab state: 3 tabs
  const [activeTab, setActiveTab] = useState<"overview" | "receivables" | "powerbi">("overview");

  // Chart filters
  const [chartTerritory, setChartTerritory] = useState<string>("Все");
  const [chartDivision, setChartDivision] = useState<string>("Все");
  const [chartBusinessType, setChartBusinessType] = useState<string>("Все");
  const [chartProductGroup, setChartProductGroup] = useState<string>("Все");

  // Pie filters
  const [pieBusinessType, setPieBusinessType] = useState<string>("Все");
  const [pieDivision, setPieDivision] = useState<string>("Все");

  const chartProductGroups = chartBusinessType !== "Все" ? businessTypeToProductGroups[chartBusinessType] || [] : [];
  const chartProductGroupOptions = ["Все", ...chartProductGroups];
  const territoryOptions = ["Все", ...ТЕРРИТОРИИ];
  const divisionOptions = ["Все", ...ПОДРАЗДЕЛЕНИЯ];
  const businessTypeOptions = ["Все", ...ВИДЫ_БИЗНЕСА];

  // 4c: Compute combined filter factor for charts
  const combinedFactor = useMemo(() => {
    return filterFactor(chartTerritory) * filterFactor(chartDivision) * filterFactor(chartBusinessType) * filterFactor(chartProductGroup);
  }, [chartTerritory, chartDivision, chartBusinessType, chartProductGroup]);

  const filtersApplied = chartTerritory !== "Все" || chartDivision !== "Все" || chartBusinessType !== "Все" || chartProductGroup !== "Все";

  // Filtered chart data
  const revenueMonthly = useMemo(() => {
    return revenueMonthlyBase.map(d => ({
      ...d,
      выручка: Math.round(d.выручка * combinedFactor * 10) / 10,
      маржа: Math.round(d.маржа * combinedFactor * 10) / 10,
    }));
  }, [combinedFactor]);

  const priceData = useMemo(() => {
    return priceDataBase.map(d => ({
      ...d,
      цена: Math.round(d.цена * combinedFactor * 10) / 10,
      себестоимость: Math.round(d.себестоимость * combinedFactor * 10) / 10,
    }));
  }, [combinedFactor]);

  // Tab styles (matching Delivery.tsx)
  const activeTabStyle = {
    background: "rgba(204,0,0,0.15)",
    color: "#e57373",
    border: "1px solid rgba(204,0,0,0.25)",
  };
  const inactiveTabStyle = {
    color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    border: "1px solid transparent",
  };

  const cardBg = isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const innerCardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const textPrimary = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)";

  const tabKeys = ["overview", "receivables", "powerbi"] as const;
  const tabLabels = ["Обзор", "Дебиторка", "Power BI"];

  return (
    <div>
      <SectionHeader
        title="Финансовая аналитика"
        description="Выручка, цена реализации, маржинальность и дебиторская задолженность."
        badge="Март 2026"
      />

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit mb-6"
        style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}
      >
        {tabKeys.map((key, i) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={activeTab === key ? activeTabStyle : inactiveTabStyle}
          >
            {key === "powerbi" ? (
              <span className="flex items-center gap-1.5">
                <ExternalLink size={12} />
                {tabLabels[i]}
              </span>
            ) : tabLabels[i]}
          </button>
        ))}
      </div>

      {/* ── ОБЗОР TAB ─────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <>
          {/* Main layout: left (KPIs + gauges) + right (receivables) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="grid grid-cols-4 gap-4">
                <FinKpiCard title="Выручка" fact="97.4 млн" plan="98.5 млн" forecast="98.8 млн" icon={<DollarSign size={14} />} color="#3b82f6" />
                <FinKpiCard title="Маржа" fact="26.1%" plan="27.5%" forecast="26.8%" icon={<ArrowUpDown size={14} />} color="#a855f7" />
                <FinKpiCard title="Цена" fact="153.4 ₽/кг" plan="152.0 ₽/кг" forecast="153.8 ₽/кг" icon={<TrendingUp size={14} />} color="#10b981" />
                <FinKpiCard title="СЕБЕС" fact="113.2 ₽/кг" plan="112.0 ₽/кг" forecast="113.5 ₽/кг" icon={<ShoppingBag size={14} />} color="#f59e0b" />
              </div>
              <GlassCard className="p-5">
                <ChartTitle>Прогноз исполнения плана — спидометры</ChartTitle>
                <div className="grid grid-cols-3 gap-4">
                  <HalfGauge value={99} label="Прогноз выручки" sublabel="98.8 из 98.5 млн ₽" />
                  <HalfGauge value={97} label="Прогноз маржи" sublabel="26.8% → цель 27.5%" />
                  <HalfGauge value={101} label="Прогноз цены" sublabel="153.8 из 152.0 ₽/кг" />
                </div>
              </GlassCard>
            </div>
            <ReceivablesSidebar />
          </div>

          {/* AI placeholder with Power BI link */}
          <div className="mb-6">
            <AIPlaceholder lines={4} linkLabel="Power BI — Финансы" />
          </div>

          {/* Charts with filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Dropdown label="Территории" value={chartTerritory} options={territoryOptions} onChange={setChartTerritory} />
            <Dropdown label="Подразделения" value={chartDivision} options={divisionOptions} onChange={setChartDivision} />
            <Dropdown label="Вид бизнеса" value={chartBusinessType} options={businessTypeOptions} onChange={(v) => { setChartBusinessType(v); setChartProductGroup("Все"); }} />
            <Dropdown label="Группа товаров" value={chartProductGroup} options={chartProductGroupOptions} onChange={setChartProductGroup} disabled={chartBusinessType === "Все"} />
            {filtersApplied && (
              <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: "rgba(204,0,0,0.1)", color: "#e57373", border: "1px solid rgba(204,0,0,0.2)" }}>
                Фильтры применены
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <GlassCard className="p-5" glow="#3b82f6">
              <ChartTitle>Выручка и маржа (млн ₽)</ChartTitle>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueMonthly}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="marGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...cp.cartesianGrid} />
                  <XAxis dataKey="month" {...cp.xAxis} />
                  <YAxis {...cp.yAxis} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend {...cp.legend} />
                  <Area type="monotone" dataKey="выручка" name="Выручка" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="маржа" name="Маржа" stroke="#a855f7" fill="url(#marGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="p-5" glow="#10b981">
              <ChartTitle>Цена реализации и себестоимость (₽/кг)</ChartTitle>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={priceData}>
                  <CartesianGrid {...cp.cartesianGrid} />
                  <XAxis dataKey="month" {...cp.xAxis} />
                  <YAxis domain={[100, 165]} {...cp.yAxis} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend {...cp.legend} />
                  <Line type="monotone" dataKey="цена" name="Цена" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="себестоимость" name="Себестоимость" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* AI below charts */}
          <div className="mb-6">
            <AIPlaceholder lines={3} linkLabel="Power BI — Финансы" />
          </div>

          {/* Pie charts */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Dropdown label="Вид бизнеса" value={pieBusinessType} options={businessTypeOptions} onChange={setPieBusinessType} />
            <Dropdown label="Подразделения" value={pieDivision} options={divisionOptions} onChange={setPieDivision} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <GlassCard className="p-5">
              <ChartTitle>Выручка по виду бизнеса</ChartTitle>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <defs>
                    <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie 
                    data={revenuePieData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={90} 
                    innerRadius={45} 
                    dataKey="value" 
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={{ stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", strokeWidth: 1 }}
                    strokeWidth={0}
                  >
                    {revenuePieData.map((entry, index) => (
                      <Cell 
                        key={`cell-rev-${index}`} 
                        fill={entry.color} 
                        stroke="none"
                        fillOpacity={0.85}
                        style={{ filter: "url(#pieGlow)" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {revenuePieData.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color, opacity: 0.85 }} />
                    <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <ChartTitle>Маржа по виду бизнеса</ChartTitle>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <defs>
                    <filter id="pieGlow2" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie 
                    data={marginPieData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={90} 
                    innerRadius={45} 
                    dataKey="value" 
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={{ stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", strokeWidth: 1 }}
                    strokeWidth={0}
                  >
                    {marginPieData.map((entry, index) => (
                      <Cell 
                        key={`cell-mar-${index}`} 
                        fill={entry.color} 
                        stroke="none"
                        fillOpacity={0.85}
                        style={{ filter: "url(#pieGlow2)" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {marginPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color, opacity: 0.85 }} />
                    <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Detail table */}
          <GlassCard className="overflow-hidden mb-6">
            <div className="px-5 py-3" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
              <ChartTitle>Детализация по виду бизнеса и группам товаров</ChartTitle>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                    {["Вид бизнеса", "Группа товаров", "Выручка (млн ₽)", "Маржа (%)"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {businessDetailTable.map((row, i) => (
                    <tr key={i} className="transition-colors" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,36,71,0.08)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td className="px-5 py-3 font-medium" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{row.вид}</td>
                      <td className="px-5 py-3" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>{row.группа}</td>
                      <td className="px-5 py-3 font-bold" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>{row.выручка}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: row.маржа >= 25 ? GREEN : row.маржа >= 18 ? YELLOW : RED }}>{row.маржа}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* AI + Power BI link */}
          <div className="mb-6">
            <AIPlaceholder lines={3} linkLabel="Power BI — Финансы" />
          </div>
        </>
      )}

      {/* ── ДЕБИТОРКА TAB ──────────────────────────────────────────── */}
      {activeTab === "receivables" && (
        <>
          {/* 3 stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <StatCard title="Общая дебиторка" value="14.7 млн ₽" subtitle="Лимит: 13.1 млн ₽" icon={<AlertCircle size={15} />} accentColor={RED} />
            <StatCard title="Просроченная" value="7.0 млн ₽" subtitle="47.6% от общей" icon={<AlertCircle size={15} />} accentColor={RED} />
            <StatCard title="Контрагентов" value="6" subtitle="из них критических: 2" icon={<DollarSign size={15} />} accentColor={YELLOW} />
          </div>

          {/* Dynamics chart */}
          <GlassCard className="p-5 mb-5" glow={RED}>
            <ChartTitle>Динамика дебиторской задолженности (млн ₽)</ChartTitle>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={receivablesChart}>
                <defs>
                  <linearGradient id="debGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RED} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={RED} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...cp.cartesianGrid} />
                <XAxis dataKey="month" {...cp.xAxis} />
                <YAxis {...cp.yAxis} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="сумма" name="Дебиторка" stroke={RED} fill="url(#debGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Aging analysis — stacked horizontal bar chart */}
          <GlassCard className="p-5 mb-5">
            <ChartTitle>Анализ по срокам задолженности</ChartTitle>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={agingStackedData} layout="vertical" margin={{ left: 0, right: 20 }} stackOffset="expand" barSize={28}>
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" hide />
                <Tooltip content={<StackedAgingTooltip />} />
                <Bar dataKey="До 30 дн." stackId="aging" fill={GREEN} radius={[6, 0, 0, 6]} />
                <Bar dataKey="30-60 дн." stackId="aging" fill={YELLOW} />
                <Bar dataKey="60-90 дн." stackId="aging" fill="#f97316" />
                <Bar dataKey="90+ дн." stackId="aging" fill="#991b1b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* Legend with percentages */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {[
                { label: "До 30 дн.", color: GREEN, pct: "80.3%", amt: "11.8 млн" },
                { label: "30-60 дн.", color: YELLOW, pct: "10.9%", amt: "1.6 млн" },
                { label: "60-90 дн.", color: "#f97316", pct: "5.4%", amt: "0.8 млн" },
                { label: "90+ дн.", color: "#991b1b", pct: "3.4%", amt: "0.5 млн" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                    {item.label}: <span className="font-bold">{item.pct}</span> ({item.amt})
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between px-2">
              <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                Всего контрагентов: <span className="font-bold" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>6</span>
              </p>
              <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                Текущий долг: <span className="font-bold" style={{ color: RED }}>14.7 млн ₽</span>
              </p>
            </div>
          </GlassCard>

          {/* Detailed counterparty table */}
          <GlassCard className="overflow-hidden mb-5">
            <div className="px-5 py-3" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
              <ChartTitle>Детализация по контрагентам</ChartTitle>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                    {["Контрагент", "Сумма (млн ₽)", "Срок (дн.)", "Доля", "Статус"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {receivables.map((row, i) => {
                    const s = statusBadge[row.статус];
                    return (
                      <tr key={i} className="transition-colors" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,36,71,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <td className="px-5 py-3 font-medium" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>{row.контрагент}</td>
                        <td className="px-5 py-3 font-bold" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{row.сумма}</td>
                        <td className="px-5 py-3" style={{ color: row.срок > 30 ? RED : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                          {row.срок}
                          {row.срок > 30 && <span className="ml-1 text-xs">⚠</span>}
                        </td>
                        <td className="px-5 py-3" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{row.доля}</td>
                        <td className="px-5 py-3">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <AIPlaceholder lines={3} linkLabel="Power BI — Финансы" />
        </>
      )}

      {/* ── POWER BI TAB ──────────────────────────────────────────── */}
      {activeTab === "powerbi" && (
        <GlassCard className="p-8 text-center" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <ExternalLink size={28} style={{ color: YELLOW }} />
            </div>
            <div>
              <p className="text-lg font-black mb-2" style={{ color: textPrimary }}>Power BI — Финансы</p>
              <p className="text-sm mb-4" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                Интерактивный дашборд в Power BI с детализацией выручки, маржинальности и дебиторской задолженности.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { label: "Power BI — Выручка", color: "#3b82f6" },
                { label: "Power BI — Маржа", color: GREEN },
                { label: "Power BI — Дебиторка", color: RED },
              ].map(link => (
                <a
                  key={link.label}
                  href="#"
                  className="flex items-center gap-2 p-3 rounded-xl transition-all"
                  style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${cardBorder}`, textDecoration: "none" }}
                >
                  <ExternalLink size={14} style={{ color: link.color }} />
                  <span className="text-xs font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{link.label}</span>
                </a>
              ))}
            </div>
            <div className="w-full rounded-xl mt-2" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${innerCardBorder}`, padding: "2rem" }}>
              <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
                Iframe с Power BI отчётом будет встроен здесь после настройки embed-ссылки
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}