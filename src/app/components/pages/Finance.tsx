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
import { DollarSign, TrendingUp, AlertCircle, ArrowUpDown, Bot, ShoppingBag, ExternalLink, ChevronUp, ChevronDown, Download, Search } from "lucide-react";
import {
  ТЕРРИТОРИИ,
  ПОДРАЗДЕЛЕНИЯ,
  ВИДЫ_БИЗНЕСА,
  businessTypeToProductGroups,
  ГРУППЫ_ПОДРАЗДЕЛЕНИЙ,
  divisionGroupToDivisions,
} from "../filtersData";

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#1A8D7A";
const YELLOW = "#f59e0b";
const RED = "#ba2447";

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

// Data for Dashboard charts (from Dashboard.tsx)
const revenueMarginDataBase = [
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

const priceCostDataBase = [
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


// Stacked aging: single row with all periods as keys - using absolute values
const agingStackedData = [
  {
    label: "Задолженность",
    "До 30 дн.": 11.8,
    "30-60 дн.": 1.6,
    "60-90 дн.": 0.8,
    "90+ дн.": 0.5,
    // Percentages for tooltip
    _pct0: 80.3,
    _pct1: 10.9,
    _pct2: 5.4,
    _pct3: 3.4,
  },
];

const statusBadge = {
  red: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: RED, label: "Просрочена" },
  yellow: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: YELLOW, label: "Внимание" },
  green: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", text: GREEN, label: "В норме" },
};

// Pie chart data by business type
const PIE_DATA_BY_BUSINESS = {
  "Все": {
    revenue: [
      { name: "Основной бизнес", value: 42.5, rawValue: 42.5, color: "#008183" },
      { name: "Агроптица", value: 24.8, rawValue: 24.8, color: "#00B19F" },
      { name: "СТ", value: 14.2, rawValue: 14.2, color: "#6BF0AE" },
      { name: "МАП", value: 9.8, rawValue: 9.8, color: "#4F709D" },
      { name: "Трейдинг", value: 6.1, rawValue: 6.1, color: "#BA2447" },
    ],
    margin: [
      { name: "Основной бизнес", value: 28.4, rawValue: 28.4, color: "#008183" },
      { name: "Агроптица", value: 22.1, rawValue: 22.1, color: "#00B19F" },
      { name: "СТ", value: 31.2, rawValue: 31.2, color: "#6BF0AE" },
      { name: "МАП", value: 18.5, rawValue: 18.5, color: "#4F709D" },
      { name: "Трейдинг", value: 12.8, rawValue: 12.8, color: "#BA2447" },
    ],
  },
  "Основной бизнес": {
    revenue: [
      { name: "КОЛБАСНЫЕ ИЗДЕЛИЯ", value: 42.8, rawValue: 18.2, color: "#008183" },
      { name: "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ", value: 28.5, rawValue: 12.1, color: "#00B19F" },
      { name: "ДЕЛИКАТЕСЫ", value: 17.6, rawValue: 7.5, color: "#6BF0AE" },
      { name: "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ", value: 11.1, rawValue: 4.7, color: "#E0DCD0" },
    ],
    margin: [
      { name: "КОЛБАСНЫЕ ИЗДЕЛИЯ", value: 25.6, rawValue: 28.4, color: "#008183" },
      { name: "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ", value: 24.2, rawValue: 26.8, color: "#00B19F" },
      { name: "ДЕЛИКАТЕСЫ", value: 28.1, rawValue: 31.2, color: "#6BF0AE" },
      { name: "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ", value: 22.1, rawValue: 24.5, color: "#E0DCD0" },
    ],
  },
  "Агроптица": {
    revenue: [
      { name: "Птица охлажденная", value: 61.3, rawValue: 15.2, color: "#008183" },
      { name: "Птица замороженная", value: 38.7, rawValue: 9.6, color: "#00B19F" },
    ],
    margin: [
      { name: "Птица охлажденная", value: 52.7, rawValue: 22.1, color: "#008183" },
      { name: "Птица замороженная", value: 47.3, rawValue: 19.8, color: "#00B19F" },
    ],
  },
  "СТ": {
    revenue: [
      { name: "Проект СТ", value: 58.5, rawValue: 8.3, color: "#6BF0AE" },
      { name: "Проект Птица, Мясо", value: 41.5, rawValue: 5.9, color: "#4F709D" },
    ],
    margin: [
      { name: "Проект СТ", value: 51.4, rawValue: 31.2, color: "#6BF0AE" },
      { name: "Проект Птица, Мясо", value: 48.6, rawValue: 29.5, color: "#4F709D" },
    ],
  },
  "МАП": {
    revenue: [
      { name: "МАП", value: 100, rawValue: 9.8, color: "#4F709D" },
    ],
    margin: [
      { name: "МАП", value: 100, rawValue: 18.5, color: "#4F709D" },
    ],
  },
  "Трейдинг": {
    revenue: [
      { name: "Мясо", value: 68.9, rawValue: 4.2, color: "#A47DD4" },
      { name: "Прочие", value: 31.1, rawValue: 1.9, color: "#E05A85" },
    ],
    margin: [
      { name: "Мясо", value: 47.4, rawValue: 12.8, color: "#A47DD4" },
      { name: "Прочие", value: 52.6, rawValue: 14.2, color: "#E05A85" },
    ],
  },
};

// Detail table by business type
const businessDetailTable = [
  { вид: "Основной бизнес", группа: "КОЛБАСНЫЕ ИЗДЕЛИЯ", выручка: 18.2, маржа: 28.4, цена: 152.4, себестоимость: 109.1 },
  { вид: "Основной бизнес", группа: "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ", выручка: 12.1, маржа: 26.8, цена: 148.7, себестоимость: 108.8 },
  { вид: "Основной бизнес", группа: "ДЕЛИКАТЕСЫ", выручка: 7.5, маржа: 31.2, цена: 165.3, себестоимость: 113.7 },
  { вид: "Основной бизнес", группа: "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ", выручка: 4.7, маржа: 24.5, цена: 145.2, себестоимость: 109.6 },
  { вид: "Агроптица", группа: "Птица охлажденная", выручка: 15.2, маржа: 22.1, цена: 138.5, себестоимость: 107.9 },
  { вид: "Агроптица", группа: "Птица замороженная", выручка: 9.6, маржа: 19.8, цена: 132.8, себестоимость: 106.5 },
  { вид: "СТ", группа: "Проект СТ", выручка: 8.3, маржа: 31.2, цена: 168.4, себестоимость: 115.8 },
  { вид: "СТ", группа: "Проект Птица, Мясо", выручка: 5.9, маржа: 29.5, цена: 162.7, себестоимость: 114.7 },
  { вид: "МАП", группа: "МАП", выручка: 9.8, маржа: 18.5, цена: 128.9, себестоимость: 105.1 },
  { вид: "Трейдинг", группа: "Мясо", выручка: 4.2, маржа: 12.8, цена: 118.3, себестоимость: 103.2 },
  { вид: "Трейдинг", группа: "Прочие", выручка: 1.9, маржа: 14.2, цена: 121.6, себестоимость: 104.3 },
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
          className="absolute left-0 rounded-xl overflow-hidden min-w-max"
          style={{
            top: "100%",
            marginTop: "0.25rem",
            zIndex: 9999,
            background: isDark ? "rgba(10,15,20,0.9)" : "rgba(255,255,255,0.9)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            backdropFilter: "blur(80px)",
            WebkitBackdropFilter: "blur(80px)",
            boxShadow: isDark 
              ? "0 8px 32px rgba(0,0,0,0.6)" 
              : "0 8px 32px rgba(0,0,0,0.25)",
            maxHeight: "13.5rem",
            overflowY: "auto",
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
    <GlassCard 
      className="p-4 my-4"
      style={{
        background: "rgba(59,130,246,0.04)",
        border: "1px solid rgba(59,130,246,0.12)",
      }}
    >
      <div className="flex gap-3">
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
              Текст ИИ-аналитика будет отображен здесь
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

// ─── Half-circle gauge (спидометр) ───────────────────────────────────────────────────────
function HalfGauge({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pct = Math.min(Math.max(value / 100, 0), 1);

  // Адаптивный размер спидометра для широких экранов
  const [size, setSize] = React.useState(180);

  React.useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth > 1600) {
        setSize(240);
      } else {
        setSize(180);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cx = size / 2;
  const cy = size / 2 + 5;
  const r = size / 2 - 22;
  const strokeWidth = 16;

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

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 35} viewBox={`${size * 0.0833} ${(size / 2 + 40) * 0.0833} ${size / 1.2} ${(size / 2 + 40) / 1.2}`}>
        <defs>
          <filter id={`glow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.77" result="blur" />
            <feBlend in="SourceGraphic" in2="blur" mode="normal" result="shape" />
          </filter>
        </defs>
        
        {/* Background arc */}
        <path 
          d={arcPath(-180, 0)} 
          fill="none" 
          stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"} 
          strokeWidth={6.5} 
          strokeLinecap="round" 
        />
        
        {/* Red zone */}
        <path 
          d={arcPath(-180, -180 + 180 * 0.7)} 
          fill="none" 
          stroke="rgba(239,68,68,0.18)" 
          strokeWidth={6.5} 
          strokeLinecap="round" 
        />
        
        {/* Yellow zone */}
        <path 
          d={arcPath(-180 + 180 * 0.7, -180 + 180 * 0.9)} 
          fill="none" 
          stroke="rgba(245,158,11,0.15)" 
          strokeWidth={6.5} 
          strokeLinecap="round" 
        />
        
        {/* Green zone */}
        <path 
          d={arcPath(-180 + 180 * 0.9, 0)} 
          fill="none" 
          stroke="rgba(16,185,129,0.15)" 
          strokeWidth={6.5} 
          strokeLinecap="round" 
        />
        
        {/* Tick marks */}
        {Array.from({ length: 7 }, (_, i) => {
          const angle = -180 + (i * 30);
          const tickLength = 5.5;
          const innerR = r + 8;
          const outerR = innerR + tickLength;
          const x1 = cx + innerR * Math.cos(toRad(angle));
          const y1 = cy + innerR * Math.sin(toRad(angle));
          const x2 = cx + outerR * Math.cos(toRad(angle));
          const y2 = cy + outerR * Math.sin(toRad(angle));
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
          );
        })}
        
        {/* Progress arc with glow */}
        {pct > 0.01 && (
          <path 
            d={arcPath(-180, endAngle)} 
            fill="none" 
            stroke="#10B981"
            strokeWidth={6.5} 
            strokeLinecap="round"
            filter={`url(#glow-${value})`}
            opacity="0.9"
          />
        )}
        
        {/* Dot at end */}
        {pct > 0.01 && (
          <>
            <circle 
              cx={cx + r * Math.cos(toRad(endAngle))} 
              cy={cy + r * Math.sin(toRad(endAngle))} 
              r={4.6} 
              fill="#10B981"
            />
          </>
        )}
        
        {/* Percentage text */}
        <text 
          x={cx} 
          y={cy + (size > 200 ? -12 : -8)} 
          textAnchor="middle" 
          fontSize={size > 200 ? 28 : 22} 
          fontWeight="bold" 
          fill={isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.92)"} 
          fontFamily="Montserrat, system-ui"
        >
          {value}%
        </text>
      </svg>
      <p className="font-semibold text-center mx-[0px] mb-[0px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontSize: size > 200 ? '15px' : '12px', marginTop: size > 200 ? '-28px' : '-22px' }}>{label}</p>
      <p className="text-center mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", fontSize: size > 200 ? '14px' : '12px' }}>{sublabel}</p>
    </div>
  );
}

// ── Enhanced KPI card ───────────────────────────────────────
function FinKpiCard({ title, fact, plan, forecast, icon, color, change }: {
  title: string; fact: string; plan: string; forecast: string; icon: React.ReactNode; color: string; change?: number;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className="rounded-2xl relative overflow-hidden transition-all hover-card px-[20px] py-[21px] mx-[0px] my-[-11px]"
      style={{
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
        minHeight: "160px",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          {title}
        </p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ 
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
          }}
        >
          {icon}
        </div>
      </div>
      <div className="mb-2">
        <span className="text-xs block mb-1" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          план: {plan}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            {fact}
          </span>
          {change !== undefined && (
            <span 
              className="inline-block text-xs font-bold px-1.5 py-0.5 rounded-md" 
              style={{ 
                background: change >= 0 ? "rgba(26,141,122,0.12)" : "rgba(186,36,71,0.12)", 
                color: change >= 0 ? "#1A8D7A" : "#ba2447",
                border: change >= 0 ? "1px solid rgba(26,141,122,0.2)" : "1px solid rgba(186,36,71,0.2)"
              }}
            >
              {change >= 0 ? "+" : ""}{change}%
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          прогноз: {forecast}
        </span>
      </div>
    </div>
  );
}

// ─── Receivables sidebar block ─────────��──────────────────────────────────────
function ReceivablesSidebar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const limitPct = 112;
  const limitColor = limitPct > 110 ? RED : limitPct > 100 ? YELLOW : GREEN;
  return (
    <div
      className="rounded-2xl h-full flex flex-col px-5 py-5 mx-[0px] mt-[-9px] mb-[0px]"
      style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={16} style={{ color: RED }} />
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          Дебиторская задолженность
        </p>
      </div>
      <p className="text-2xl font-black mb-1" style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.92)" }}>14.7 млн ₽</p>
      <p className="text-xs mb-5" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>Март 2026</p>

      <div className="rounded-xl overflow-hidden mb-5" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
              {["Период", "Сумма", "Доля"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agingData.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < agingData.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` : "none" }}>
                <td className="px-4 py-3" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>{row.period}</td>
                <td className="px-4 py-3 font-bold" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>{row.сумма} млн</td>
                <td className="px-4 py-3 font-semibold" style={{ color: row.доля > 50 ? YELLOW : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>{row.доля}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: `rgba(${limitPct > 100 ? "239,68,68" : "16,185,129"},0.08)`, border: `1px solid rgba(${limitPct > 100 ? "239,68,68" : "16,185,129"},0.2)` }}
      >
        <div>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>% к лимиту</p>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Лимит: 13.1 млн ₽</p>
        </div>
        <p className="text-2xl font-black" style={{ color: limitColor }}>{limitPct}%</p>
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
    { key: "30-60 дн.", amt: row._amt1, pct: row["30-60 дн."], color: "#6BF0AE" },
    { key: "60-90 дн.", amt: row._amt2, pct: row["60-90 дн."], color: "#E05A85" },
    { key: "90+ дн.", amt: row._amt3, pct: row["90+ дн."], color: "#BA2447" },
  ];
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
  const rawValue = d.payload.rawValue;
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
      <p className="font-bold">{d.name}</p>
      <p className="mt-1">Доля: {d.value.toFixed(1)}%</p>
      {rawValue !== undefined && (
        <p className="opacity-70">{rawValue} {rawValue < 100 ? 'млн ₽' : '%'}</p>
      )}
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

  // Pie filters
  const [pieTerritory, setPieTerritory] = useState<string>("Все");
  const [pieBusinessType, setPieBusinessType] = useState<string>("Все");
  const [pieProductGroup, setPieProductGroup] = useState<string>("Все");
  const [pieDivisionGroup, setPieDivisionGroup] = useState<string>("—");
  const [pieDivision, setPieDivision] = useState<string>("Все");

  // Collapse state for detail table
  const [detailTableCollapsed, setDetailTableCollapsed] = useState(false);

  // Counterparty search and collapse states
  const [counterpartySearch, setCounterpartySearch] = useState("");
  const [counterpartyListCollapsed, setCounterpartyListCollapsed] = useState(false);
  
  // Sort state for counterparty table
  type CounterpartySortKey = "сумма" | "срок" | "доля" | "статус";
  const [sortKey, setSortKey] = useState<CounterpartySortKey>("сумма");
  const [sortAsc, setSortAsc] = useState(false);

  // Dashboard charts filters
  const [territoriyaDash, setTeritoriyaDash] = useState<string>("Все");
  const [vidBiznesaDash, setVidBiznesaDash] = useState<string>("");
  const [gruppaTovarovDash, setGruppaTovarovDash] = useState<string>("");
  const [gruppaPodrazdeleniyDash, setGruppaPodrazdeleniyDash] = useState<string>("");
  const [podrazdelenieDash, setPodrazdelenieDash] = useState<string>("");

  // Dashboard chart options
  const territoriiOptionsDash = ТЕРРИТОРИИ;
  const produkt2OptionsDash = vidBiznesaDash ? ["Все", ...(businessTypeToProductGroups[vidBiznesaDash] || [])] : ["Все"];
  const podrazdeleniya1OptionsDash = gruppaPodrazdeleniyDash ? ["Все", ...(divisionGroupToDivisions[gruppaPodrazdeleniyDash] || [])] : ["Все"];

  // Options for Pie charts and counterparty filters
  const pieTerritoryOptions = ТЕРРИТОРИИ;
  const pieProductGroupOptions = pieBusinessType && pieBusinessType !== "Все" 
    ? ["Все", ...(businessTypeToProductGroups[pieBusinessType] || [])] 
    : ["Все"];
  const pieDivisionOptions = pieDivisionGroup && pieDivisionGroup !== "—" 
    ? ["Все", ...(divisionGroupToDivisions[pieDivisionGroup] || [])] 
    : ["Все"];
  const territoryOptions = ТЕРРИТОРИИ;
  const divisionOptions = ["Все", ...ПОДРАЗДЕЛЕНИЯ];
  const businessTypeOptions = ["Все", ...ВИДЫ_БИЗНЕСА];

  // Handle sort for counterparty table
  const handleSort = (key: CounterpartySortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  // Dashboard charts data (no filtering, just raw data)
  const revenueMarginData = revenueMarginDataBase;
  const priceCostData = priceCostDataBase;

  // Pie chart data based on selected filters with random variations
  const revenuePieData = useMemo(() => {
    const data = PIE_DATA_BY_BUSINESS[pieBusinessType as keyof typeof PIE_DATA_BY_BUSINESS];
    if (!data) return PIE_DATA_BY_BUSINESS["Все"].revenue;
    
    // Apply filter factors for random variations
    const territoryFactor = filterFactor(pieTerritory);
    const productGroupFactor = filterFactor(pieProductGroup);
    const divisionGroupFactor = filterFactor(pieDivisionGroup);
    const divisionFactor = filterFactor(pieDivision);
    
    const combinedFactor = territoryFactor * productGroupFactor * divisionGroupFactor * divisionFactor;
    
    // Apply random variation to values
    return data.revenue.map(item => ({
      ...item,
      value: Number((item.rawValue * combinedFactor).toFixed(1)),
    }));
  }, [pieBusinessType, pieTerritory, pieProductGroup, pieDivisionGroup, pieDivision]);

  const marginPieData = useMemo(() => {
    const data = PIE_DATA_BY_BUSINESS[pieBusinessType as keyof typeof PIE_DATA_BY_BUSINESS];
    if (!data) return PIE_DATA_BY_BUSINESS["Все"].margin;
    
    // Apply filter factors for random variations
    const territoryFactor = filterFactor(pieTerritory);
    const productGroupFactor = filterFactor(pieProductGroup);
    const divisionGroupFactor = filterFactor(pieDivisionGroup);
    const divisionFactor = filterFactor(pieDivision);
    
    const combinedFactor = territoryFactor * productGroupFactor * divisionGroupFactor * divisionFactor;
    
    // Apply random variation to values
    return data.margin.map(item => ({
      ...item,
      value: Number((item.rawValue * combinedFactor).toFixed(1)),
    }));
  }, [pieBusinessType, pieTerritory, pieProductGroup, pieDivisionGroup, pieDivision]);

  // Filtered counterparty list
  const filteredCounterparties = useMemo(() => {
    let result = [...receivables];
    
    // Apply search filter
    if (counterpartySearch.trim()) {
      const searchLower = counterpartySearch.toLowerCase();
      result = result.filter(r => r.контрагент.toLowerCase().includes(searchLower));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aVal: any, bVal: any;
      
      if (sortKey === "сумма" || sortKey === "срок") {
        aVal = a[sortKey];
        bVal = b[sortKey];
      } else if (sortKey === "доля") {
        // Parse percentage strings
        aVal = parseFloat(a.доля.replace("%", ""));
        bVal = parseFloat(b.доля.replace("%", ""));
      } else if (sortKey === "статус") {
        // Status priority: red > yellow > green
        const priority = { red: 3, yellow: 2, green: 1 };
        aVal = priority[a.статус];
        bVal = priority[b.статус];
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    
    return result;
  }, [counterpartySearch, sortKey, sortAsc]);

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

  // Sort icon component for counterparty table
  const SortIcon = ({ k }: { k: CounterpartySortKey }) => (
    <span className="inline-flex flex-col ml-1 opacity-50">
      <ChevronUp size={9} style={{ color: sortKey === k && sortAsc ? "#93c5fd" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} />
      <ChevronDown size={9} style={{ color: sortKey === k && !sortAsc ? "#93c5fd" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} />
    </span>
  );

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
        className="flex gap-1 p-1 rounded-xl w-fit mb-4"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
            <div className="lg:col-span-2 flex flex-col gap-3 h-full">
              <div className="grid grid-cols-4 gap-3">
                <FinKpiCard title="Выручка" fact="97.4 млн" plan="98.5 млн" forecast="98.8 млн" icon={<DollarSign size={14} />} color="#008183" change={2.5} />
                <FinKpiCard title="Маржа" fact="26.1%" plan="27.5%" forecast="26.8%" icon={<ArrowUpDown size={14} />} color="#A47DD4" change={-1.4} />
                <FinKpiCard title="Цена" fact="153.4 ₽/кг" plan="152.0 ₽/кг" forecast="153.8 ₽/кг" icon={<TrendingUp size={14} />} color="#00B19F" change={1.6} />
                <FinKpiCard title="СЕБЕС" fact="113.2 ₽/кг" plan="112.0 ₽/кг" forecast="113.5 ₽/кг" icon={<ShoppingBag size={14} />} color="#6BF0AE" change={1.1} />
              </div>
              <GlassCard className="p-5 my-4 flex-1">
                <ChartTitle>Прогноз исполнения плана — спидометры</ChartTitle>
                <div className="grid grid-cols-3 gap-3">
                  <HalfGauge value={99} label="Прогноз выручки" sublabel="98.8 из 98.5 млн ₽" />
                  <HalfGauge value={97} label="Прогноз маржи" sublabel="26.8% → цель 27.5%" />
                  <HalfGauge value={101} label="Прогноз цены" sublabel="153.8 из 152.0 ₽/кг" />
                </div>
              </GlassCard>
            </div>
            <ReceivablesSidebar />
          </div>

          {/* AI placeholder with Power BI link */}
          <div className="mb-4">
            <AIPlaceholder lines={4} linkLabel="Power BI — Финансы" />
          </div>

          {/* Combined Charts from Dashboard: Выручка и маржа + Цена реализации и себестоимость */}
          <GlassCard className="my-4 p-5">
            {/* Common filters for both charts */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
              <Dropdown label="Территории" value={territoriyaDash} options={territoriiOptionsDash as any} onChange={setTeritoriyaDash} />
              <Dropdown label="Вид бизнеса" value={vidBiznesaDash || "—"} options={ВИДЫ_БИЗНЕСА as unknown as string[]} onChange={(v) => { setVidBiznesaDash(v); setGruppaTovarovDash("Все"); }} />
              <Dropdown label="Группа товаров" value={gruppaTovarovDash || "Все"} options={produkt2OptionsDash as any} onChange={setGruppaTovarovDash} disabled={!vidBiznesaDash} />
              <Dropdown label="Группа подразделений" value={gruppaPodrazdeleniyDash || "—"} options={["—", ...ГРУППЫ_ПОДРАЗДЕЛЕНИЙ] as unknown as string[]} onChange={(v) => { setGruppaPodrazdeleniyDash(v); setPodrazdelenieDash("Все"); }} />
              <Dropdown label="Подразделения" value={podrazdelenieDash || "Все"} options={podrazdeleniya1OptionsDash as any} onChange={setPodrazdelenieDash} disabled={!gruppaPodrazdeleniyDash || gruppaPodrazdeleniyDash === "—"} />
            </div>

            {/* Two charts in grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Chart 1: Выручка и маржа */}
              <GlassCard className="p-5 my-4" glow="#008183">
                <ChartTitle>Выручка и маржа (млн ₽)</ChartTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueMarginData} margin={{ right: 10 }}>
                    <defs>
                      <linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#008183" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#008183" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dashMarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#BA2447" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#BA2447" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...cp.cartesianGrid} />
                    <XAxis dataKey="month" {...cp.xAxis} />
                    <YAxis {...cp.yAxis} width={45} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend {...cp.legend} />
                    <Area key="area-revenue" type="monotone" dataKey="выручка" name="Выручка" stroke="#008183" fill="url(#dashRevGrad)" strokeWidth={2.5} />
                    <Area key="area-margin" type="monotone" dataKey="маржа" name="Маржа" stroke="#BA2447" fill="url(#dashMarGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Chart 2: Цена реализации и себестоимость */}
              <GlassCard className="p-5 my-4" glow="#1A8D7A">
                <ChartTitle>Цена реализации и себестоимость (₽/кг)</ChartTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={priceCostData} margin={{ right: 10 }}>
                    <defs>
                      <linearGradient id="dashPriceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A8D7A" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#1A8D7A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dashCostGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ba2447" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#ba2447" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...cp.cartesianGrid} />
                    <XAxis dataKey="month" {...cp.xAxis} />
                    <YAxis {...cp.yAxis} width={45} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend {...cp.legend} />
                    <Area key="area-price" type="monotone" dataKey="цена" name="Цена" stroke="#1A8D7A" fill="url(#dashPriceGrad)" strokeWidth={2.5} />
                    <Area key="area-cost" type="monotone" dataKey="себестоимость" name="Себестоимость" stroke="#ba2447" fill="url(#dashCostGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </GlassCard>

          {/* AI below charts */}
          <div className="mb-4">
            <AIPlaceholder lines={3} linkLabel="Power BI — Финансы" />
          </div>

          {/* Pie charts */}
          <GlassCard className="my-4 p-5">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
              <Dropdown label="Территории" value={pieTerritory} options={pieTerritoryOptions} onChange={setPieTerritory} />
              <Dropdown 
                label="Вид бизнеса" 
                value={pieBusinessType} 
                options={businessTypeOptions} 
                onChange={setPieBusinessType}
              />
              <Dropdown 
                label="Группа подразделений" 
                value={pieDivisionGroup || "—"} 
                options={["—", ...ГРУППЫ_ПОДРАЗДЕЛЕНИЙ] as unknown as string[]} 
                onChange={(v) => { 
                  setPieDivisionGroup(v); 
                  setPieDivision("Все"); 
                }} 
              />
              <Dropdown 
                label="Подразделения" 
                value={pieDivision || "Все"} 
                options={pieDivisionOptions} 
                onChange={setPieDivision} 
                disabled={!pieDivisionGroup || pieDivisionGroup === "—"} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <GlassCard className="p-5 my-4">
              <ChartTitle>Выручка по виду бизнеса</ChartTitle>
              <div 
                className="rounded-xl p-3"
                style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
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
                      animationDuration={300}
                      animationBegin={0}
                      label={(props: any) => {
                        const { cx, cy, midAngle, outerRadius, name, value } = props;
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 25;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="#ffffff" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {`${name}: ${value.toFixed(1)}%`}
                          </text>
                        );
                      }}
                      labelLine={{ stroke: "rgba(255,255,255,0.3)", strokeWidth: 1 }}
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
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {revenuePieData.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color, opacity: 0.85 }} />
                    <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5 my-4">
              <ChartTitle>Маржа по виду бизнеса</ChartTitle>
              <div 
                className="rounded-xl p-3"
                style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
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
                      animationDuration={300}
                      animationBegin={0}
                      label={(props: any) => {
                        const { cx, cy, midAngle, outerRadius, name, value } = props;
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 25;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="#ffffff" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {`${name}: ${value.toFixed(1)}%`}
                          </text>
                        );
                      }}
                      labelLine={{ stroke: "rgba(255,255,255,0.3)", strokeWidth: 1 }}
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
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {marginPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color, opacity: 0.85 }} />
                    <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </GlassCard>

        {/* Detail table */}
        <GlassCard className="overflow-hidden my-4">
            <div 
              className="flex items-center justify-between transition-all"
              style={{ 
                padding: detailTableCollapsed ? "12px 20px" : "12px 20px",
                borderBottom: detailTableCollapsed ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` 
              }}
            >
              <ChartTitle>Детализация по виду бизнеса и группам товаров</ChartTitle>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement download logic
                    console.log("Скачать отчет");
                  }}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.07)")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                >
                  <Download size={12} />
                  Скачать отчет
                </button>
                <div 
                  className="flex items-center justify-center rounded-full transition-all cursor-pointer"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
                  }}
                  onClick={() => setDetailTableCollapsed(!detailTableCollapsed)}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.07)")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                >
                  <ChevronUp 
                    size={16} 
                    style={{ 
                      color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                      transform: detailTableCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease"
                    }}
                  />
                </div>
              </div>
            </div>
            {!detailTableCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                      {["Вид бизнеса", "Группа товаров", "Выручка (млн ₽)", "Цена (₽)", "Себестоимость (₽)", "Маржа (%)"].map(h => (
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
                        <td className="px-5 py-3 font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>{row.цена.toFixed(1)}</td>
                        <td className="px-5 py-3 font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>{row.себестоимость.toFixed(1)}</td>
                        <td className="px-5 py-3 font-semibold" style={{ color: row.маржа >= 25 ? GREEN : row.маржа >= 18 ? YELLOW : RED }}>{row.маржа}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            <FinKpiCard 
              title="Общая дебиторка" 
              fact="14.7 млн ₽" 
              plan="13.1 млн ₽" 
              forecast="15.2 млн ₽" 
              icon={<AlertCircle size={14} />} 
              color="#ef4444" 
            />
            <FinKpiCard 
              title="Просроченная" 
              fact="7.0 млн ₽" 
              plan="5.8 млн ₽" 
              forecast="6.5 млн ₽" 
              icon={<AlertCircle size={14} />} 
              color="#ef4444" 
            />
            <FinKpiCard 
              title="Контрагентов" 
              fact="6" 
              plan="6" 
              forecast="6" 
              icon={<DollarSign size={14} />} 
              color="#f59e0b" 
            />
          </div>

          {/* Dynamics chart */}
          <GlassCard className="p-5 my-4" glow={RED}>
            <ChartTitle>Динамика дебиторской задолженности (млн ₽)</ChartTitle>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={receivablesChart} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="debGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ba2447" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ba2447" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...cp.cartesianGrid} />
                <XAxis dataKey="month" {...cp.xAxis} />
                <YAxis {...cp.yAxis} />
                <Tooltip content={<CustomChartTooltip />} cursor={false} />
                <Area key="area-receivables" type="monotone" dataKey="сумма" name="Дебиторка" stroke="#ba2447" fill="url(#debGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Aging analysis — stacked horizontal bar chart */}
          <GlassCard className="p-5 my-5">
            <ChartTitle>Анализ по срокам задолженности</ChartTitle>
            <div className="relative" style={{ height: '40px', marginTop: '16px' }}>
              <div className="absolute inset-0 flex rounded-lg overflow-hidden">
                <div 
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer flex items-center justify-center"
                  style={{ 
                    width: '80.3%', 
                    backgroundColor: '#1A8D7A',
                  }}
                  title="До 30 дн.: 80.3% (11.8 млн)"
                />
                <div 
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer flex items-center justify-center"
                  style={{ 
                    width: '10.9%', 
                    backgroundColor: '#f59e0b',
                  }}
                  title="30-60 дн.: 10.9% (1.6 млн)"
                />
                <div 
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer flex items-center justify-center"
                  style={{ 
                    width: '5.4%', 
                    backgroundColor: '#f97316',
                  }}
                  title="60-90 дн.: 5.4% (0.8 млн)"
                />
                <div 
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer flex items-center justify-center"
                  style={{ 
                    width: '3.4%', 
                    backgroundColor: '#ba2447',
                  }}
                  title="90+ дн.: 3.4% (0.5 млн)"
                />
              </div>
            </div>
            {/* Legend with percentages */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {[
                { label: "До 30 дн.", color: "#1A8D7A", pct: "80.3%", amt: "11.8 млн", count: 2 },
                { label: "30-60 дн.", color: "#f59e0b", pct: "10.9%", amt: "1.6 млн", count: 2 },
                { label: "60-90 дн.", color: "#f97316", pct: "5.4%", amt: "0.8 млн", count: 1 },
                { label: "90+ дн.", color: "#ba2447", pct: "3.4%", amt: "0.5 млн", count: 1 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                    {item.label}: <span className="font-bold">{item.pct}</span> ({item.amt}, {item.count} контр.)
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
          <GlassCard className="overflow-hidden my-4">
            <div className="px-5 py-3 flex items-center justify-between gap-4" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
              <div className="flex items-center gap-2">
                <ChartTitle>Детализация по контрагентам</ChartTitle>
                {counterpartySearch && (
                  <span className="text-xs px-2 py-0.5 rounded" style={{ 
                    background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                  }}>
                    {filteredCounterparties.length} из {receivables.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Search input */}
                <div className="relative">
                  <Search 
                    size={16} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                    style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} 
                  />
                  <input
                    type="text"
                    placeholder="Поиск по контрагентам"
                    value={counterpartySearch}
                    onChange={(e) => setCounterpartySearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-sm rounded-lg border outline-none transition-all"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
                    }}
                  />
                </div>
                {/* Collapse button */}
                <button
                  onClick={() => setCounterpartyListCollapsed(!counterpartyListCollapsed)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                >
                  <ChevronUp
                    size={16}
                    style={{
                      transform: counterpartyListCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>
              </div>
            </div>
            {!counterpartyListCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                      <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                        Контрагент
                      </th>
                      {[
                        { label: "Сумма (млн ₽)", key: "сумма" as CounterpartySortKey },
                        { label: "Срок (дн.)", key: "срок" as CounterpartySortKey },
                        { label: "Доля", key: "доля" as CounterpartySortKey },
                        { label: "Статус", key: "статус" as CounterpartySortKey },
                      ].map(col => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors"
                          style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
                        >
                          {col.label}<SortIcon k={col.key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCounterparties.length > 0 ? (
                      filteredCounterparties.map((row, i) => {
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
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                          Контрагенты не найдены
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            )}
          </GlassCard>

          <AIPlaceholder lines={3} linkLabel="Power BI — Финансы" />
        </>
      )}

      {/* ── POWER BI TAB ──────────────────────────────────────────── */}
      {activeTab === "powerbi" && (
        <GlassCard className="p-8 my-4 text-center" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
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
                { label: "Power BI — Выручка", color: "#008183" },
                { label: "Power BI — Маржа", color: "#A47DD4" },
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
            
          </div>
        </GlassCard>
      )}
    </div>
  );
}