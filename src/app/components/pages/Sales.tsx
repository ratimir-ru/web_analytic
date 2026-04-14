import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
  Cell,
} from "recharts";
import { SectionHeader, GlassCard, ChartTitle, chartProps, darkChartProps, CustomChartTooltip } from "../StatCard";
import { Gauge } from "../Gauge";
import { useTheme } from "../ThemeProvider";
import {
  ВИДЫ_БИЗНЕСА,
  ГРУППЫ_ПОДРАЗДЕЛЕНИЙ,
  ТЕРРИТОРИИ,
  businessTypeToProductGroups,
  divisionGroupToDivisions,
} from "../filtersData";
import { ShoppingCart, TrendingUp, Star, Package, Users, Bot, ChevronDown, ChevronUp, ExternalLink, ArrowUp } from "lucide-react";

// ── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#1A8D7A";
const YELLOW = "#f59e0b";
const RED = "#BA2447";
const BLUE = "#1A8D7A";

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  if (!r) return "59,130,246";
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
}

// ── Custom Tooltip with AKB ───────────────────────────────────────────────────
function CategoryTrendTooltipWithAKB({
  active,
  payload,
  label,
}: any) {
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
      <div className="flex items-center gap-1.5 mb-0.5 mt-1.5 pt-1.5" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#3b82f6",
          }}
        />
        <span
          style={{
            color: isDark
              ? "rgba(255,255,255,0.9)"
              : "rgba(0,0,0,0.9)",
          }}
        >
          АКБ:{" "}
          <span className="font-semibold">244</span>
        </span>
      </div>
    </div>
  );
}

// ── Sales KPI Card Component ──────────────────────────────────────────────────
function SalesKpiCard({ 
  title, 
  fact, 
  plan, 
  bottomInfo, 
  icon, 
  color,
  customContent
}: {
  title: React.ReactNode;
  fact: string;
  plan: string;
  bottomInfo: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  customContent?: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className="rounded-2xl relative overflow-hidden transition-all hover-card px-[20px] py-[21px]"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest mx-[0px] my-[-2px]" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          {title}
        </p>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ 
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
          }}
        >
          {icon}
        </div>
      </div>
      {customContent ? (
        customContent
      ) : (
        <>
          <div className="mx-[0px] my-[5px]">
            <span className="text-xs block mx-[0px] mt-[28px] mb-[-22px]" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              план: {plan}
            </span>
            <div className="flex items-center justify-between mx-[0px] mt-[26px] mb-[-4px]">
              <span className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
                {fact}
              </span>
              {bottomInfo}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const overallData = [
  { month: "Янв", план: 900, факт: 878, pct: 97.6 },
  { month: "Фев", план: 950, факт: 942, pct: 99.2 },
  { month: "Мар", план: 980, факт: 948, pct: 96.7 },
  { month: "Апр", план: 930, факт: 910, pct: 97.8 },
  { month: "Май", план: 960, факт: 950, pct: 99.0 },
  { month: "Июн", план: 1000, факт: 985, pct: 98.5 },
  { month: "Июл", план: 980, факт: 962, pct: 98.2 },
  { month: "Авг", план: 1010, факт: 998, pct: 98.8 },
  { month: "Сен", план: 990, факт: 975, pct: 98.5 },
  { month: "Окт", план: 920, факт: 892, pct: 96.9 },
  { month: "Ноя", план: 940, факт: 928, pct: 98.7 },
  { month: "Дек", план: 980, факт: 965, pct: 98.5 },
];

const categories = [
  {
    id: "kolbasy", label: "Колбасы", color: "#BA2447",
    plan: 320, fact: 298, price_plan: 195, price_fact: 192,
    margin_plan: 32, margin_fact: 29, service: 95, akb: 312, status: "yellow" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [85,88,90,82,86,90][i], факт: [82,87,89,79,85,88][i] })),
  },
  {
    id: "zamorozka", label: "Заморозка", color: "#A47DD4",
    plan: 180, fact: 175, price_plan: 142, price_fact: 145,
    margin_plan: 28, margin_fact: 29, service: 97, akb: 245, status: "green" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [46,48,50,44,47,50][i], факт: [45,47,49,43,47,49][i] })),
  },
  {
    id: "delikatesy", label: "Деликатесы", color: "#4F709D",
    plan: 150, fact: 162, price_plan: 380, price_fact: 395,
    margin_plan: 42, margin_fact: 45, service: 96, akb: 187, status: "green" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [38,40,42,37,40,42][i], факт: [39,41,44,39,43,46][i] })),
  },
  {
    id: "oxl_pf", label: "Охлажденные ПФ", color: "#6BF0AE",
    plan: 210, fact: 195, price_plan: 128, price_fact: 124,
    margin_plan: 22, margin_fact: 19, service: 91, akb: 278, status: "red" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [54,56,58,52,55,58][i], факт: [50,53,55,48,51,54][i] })),
  },
  {
    id: "myasnoy", label: "Мясной проект", color: "#008183",
    plan: 130, fact: 118, price_plan: 165, price_fact: 158,
    margin_plan: 18, margin_fact: 15, service: 88, akb: 153, status: "red" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [33,35,37,32,34,37][i], факт: [31,33,34,29,32,33][i] })),
  },
];

// LFL data
const lflMonths = ["Сен", "Окт", "Ноя", "Дек", "Янв", "Фев", "Мар"];
const lflValues = [-1.2, 2.3, 4.5, -0.8, 3.2, 6.1, 5.4];
const lflPrevYear = [-2.1, 1.8, 3.2, -1.5, 2.1, 4.8, 3.9];
const lflCurrentVolumes = [845, 892, 935, 880, 910, 965, 948];
const lflPrevVolumes = [853, 873, 895, 887, 882, 910, 899];
const lflData = lflMonths.map((m, i) => ({ 
  month: m, 
  текущий: lflValues[i], 
  прошлый: lflPrevYear[i],
  текущийОбъем: lflCurrentVolumes[i],
  прошлыйОбъем: lflPrevVolumes[i]
}));

// SKU data for Top SKU block
const bestSKU = [
  { name: "Колбаса Докторская 500г", fact: 42.5, plan: 35.2, pct: 20.7 },
  { name: "Сосиски Молочные 400г", fact: 38.1, plan: 32.2, pct: 18.3 },
  { name: "Ветчина Классическая 300г", fact: 29.8, plan: 25.9, pct: 15.1 },
  { name: "Сардельки Говяжьи 500г", fact: 34.2, plan: 30.3, pct: 12.8 },
  { name: "Колбаса Краковская 350г", fact: 27.6, plan: 25.0, pct: 10.2 },
];

const worstSKU = [
  { name: "Пельмени Домашние 900г", fact: 18.4, plan: 23.7, pct: -22.4 },
  { name: "Купаты Охотничьи 600г", fact: 21.3, plan: 26.3, pct: -18.9 },
  { name: "Фарш Свиной 500г", fact: 24.1, plan: 28.6, pct: -15.6 },
  { name: "Шпикачки Дачные 400г", fact: 26.8, plan: 30.5, pct: -12.1 },
  { name: "Колбаса Салями 250г", fact: 22.9, plan: 25.4, pct: -9.8 },
];

// Simple seed-based mock value generator
function seededMock(seed: string, min: number, max: number, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    h = ((h << 5) - h + i * 7 + 13) | 0;
    const v = min + (Math.abs(h) % (max - min));
    result.push(v);
  }
  return result;
}

// ── Components ────────────────────────────────────────────────────────────────
function AIPlaceholder({ lines = 3, linkLabel, isDark }: { lines?: number; linkLabel?: string; isDark: boolean }) {
  return (
    <GlassCard 
      className="p-4 mb-4"
      style={{
        background: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.15)",
        border: isDark ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(59,130,246,0.3)",
      }}
    >
      <div className="flex gap-3">
        <Bot size={16} style={{ color: "#60a5fa", flexShrink: 0, marginTop: 2 }} />
        <div className="flex-1">
          <p className="text-xs font-semibold mb-2" style={{ color: "#60a5fa" }}>ИИ-аналитик</p>
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="h-2.5 rounded-full"
                style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", width: i === lines - 1 ? "55%" : "100%" }} />
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
    </GlassCard>
  );
}

function Dropdown<T extends string>({ label, value, options, onChange, disabled, isDark }: {
  label: string; value: T; options: readonly T[]; onChange: (v: T) => void; disabled?: boolean; isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
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
        <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-50 min-w-max"
          style={{
            background: isDark ? "rgba(10,15,20,0.9)" : "rgba(255,255,255,0.9)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            backdropFilter: "blur(80px)",
            WebkitBackdropFilter: "blur(80px)",
            boxShadow: isDark 
              ? "0 8px 32px rgba(0,0,0,0.6)" 
              : "0 8px 32px rgba(0,0,0,0.25)",
          }}>
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

// Custom tooltip for pct overlay
function PctTooltip({ active, payload, label }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  if (!active || !payload) return null;
  const planItem = payload.find((p: any) => p.dataKey === "план");
  const factItem = payload.find((p: any) => p.dataKey === "факт");
  const pctItem = payload.find((p: any) => p.dataKey === "pct");
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
      <p className="font-bold mb-1">{label}</p>
      {planItem && <p style={{ color: planItem.color }}>План: {planItem.value} т</p>}
      {factItem && <p style={{ color: factItem.color }}>Факт: {factItem.value} т</p>}
      {pctItem && <p style={{ color: pctItem.color }}>% от плана: {pctItem.value}%</p>}
      {factItem && planItem && (
        <p style={{ color: YELLOW }}>Факт/План: {((factItem.value / planItem.value) * 100).toFixed(1)}%</p>
      )}
    </div>
  );
}

// Custom tooltip for LFL chart
function LflTooltip({ active, payload, label }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  if (!active || !payload || !payload[0]) return null;
  const data = payload[0].payload;
  const currentVolume = data.текущийОбъем;
  const prevVolume = data.прошлыйОбъем;
  const volumeRatio = ((prevVolume / currentVolume) * 100).toFixed(1);
  
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
      <p className="font-bold mb-1">{label}</p>
      <p style={{ color: "#1A8D7A" }}>Текущий объем: {currentVolume} т</p>
      <p style={{ color: "#4F709D" }}>Прошлый объем: {prevVolume} т</p>
      <p style={{ color: YELLOW }}>Прошлый/Текуий объем: {volumeRatio}%</p>
    </div>
  );
}

// Custom tooltip for analytical charts (divisions & product groups)
function AnalyticalTooltip({ active, payload, label }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  if (!active || !payload || !payload[0]) return null;
  const data = payload[0].payload;
  const currentYear = data.текущийГод || data.value;
  const prevYear = data.прошлыйГод;
  const ratio = prevYear ? ((currentYear / prevYear) * 100).toFixed(1) : "—";
  
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
      <p className="font-bold mb-1">{label || data.name}</p>
      <p style={{ color: "#1A8D7A" }}>Текущий год: {currentYear} т</p>
      <p style={{ color: "#4F709D" }}>Прошлый год: {prevYear} т</p>
      <p style={{ color: YELLOW }}>Текущий/Прошлый год: {ratio}%</p>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function Sales() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Category breakdown filters
  const [catTerritory, setCatTerritory] = useState<string>("Все");
  const [catBusiness, setCatBusiness] = useState<string>("Все");
  const [catProductGroup, setCatProductGroup] = useState<string>("Все");
  const [catDivisionGroup, setCatDivisionGroup] = useState<string>("Все");
  const [catDivision, setCatDivision] = useState<string>("Все");

  // Analytical dashboard filters
  const [analyticBusiness, setAnalyticBusiness] = useState<string>(ВИДЫ_БИЗНЕСА[0]);
  const [analyticGroup, setAnalyticGroup] = useState<string>(ГРУППЫ_ПОДРАЗДЕЛЕНИЙ[0]);

  // Top SKU expanded
  const [skuExpanded, setSkuExpanded] = useState(true);

  const textPrimary = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)";
  const textSecondary = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const textMedium = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)";
  const textStrong = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const cardBg = isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const innerCardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const innerCardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const barBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  // Available product groups for category breakdown
  const catProductGroups = useMemo(() => {
    if (!catBusiness || catBusiness === "Все") return [];
    return businessTypeToProductGroups[catBusiness] || [];
  }, [catBusiness]);

  // Available divisions for category breakdown
  const catDivisions = useMemo(() => {
    if (!catDivisionGroup || catDivisionGroup === "Все") return [];
    return divisionGroupToDivisions[catDivisionGroup] || [];
  }, [catDivisionGroup]);

  // Analytical: divisions from selected group
  const analyticDivisions = useMemo(() => {
    return divisionGroupToDivisions[analyticGroup] || [];
  }, [analyticGroup]);

  // Analytical: product groups from selected business
  const analyticProductGroups = useMemo(() => {
    return businessTypeToProductGroups[analyticBusiness] || [];
  }, [analyticBusiness]);

  // Generate mock data for division chart
  const divisionChartData = useMemo(() => {
    const divs = analyticDivisions;
    const currentYearVals = seededMock(analyticGroup + analyticBusiness, 50, 300, divs.length);
    const prevYearVals = seededMock(analyticGroup + analyticBusiness + "prev", 45, 280, divs.length);
    return divs.map((d, i) => ({ 
      name: d, 
      value: currentYearVals[i],
      текущийГод: currentYearVals[i],
      прошлыйГод: prevYearVals[i]
    })).sort((a, b) => b.value - a.value);
  }, [analyticDivisions, analyticGroup, analyticBusiness]);

  // Generate mock data for product group chart
  const productGroupChartData = useMemo(() => {
    const groups = analyticProductGroups;
    const currentYearVals = seededMock(analyticBusiness + analyticGroup, 80, 400, groups.length);
    const prevYearVals = seededMock(analyticBusiness + analyticGroup + "prev", 75, 380, groups.length);
    return groups.map((g, i) => ({ 
      name: g, 
      value: currentYearVals[i],
      текущийГод: currentYearVals[i],
      прошлыйГод: prevYearVals[i]
    })).sort((a, b) => b.value - a.value);
  }, [analyticProductGroups, analyticBusiness, analyticGroup]);

  // Determine which category to show based on filters
  const filteredCategory = useMemo(() => {
    // Generate seed from all filter values
    const seed = `${catTerritory}${catBusiness}${catProductGroup}${catDivisionGroup}${catDivision}`;
    
    // Generate random values based on seed
    const baseIdx = Math.abs(seed.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)) % categories.length;
    const baseCat = categories[baseIdx];
    
    // Generate modified values based on filters
    const planOffset = seededMock(seed + "plan", -20, 20, 1)[0];
    const factOffset = seededMock(seed + "fact", -25, 25, 1)[0];
    const priceOffset = seededMock(seed + "price", -10, 15, 1)[0];
    const marginOffset = seededMock(seed + "margin", -5, 5, 1)[0];
    const serviceOffset = seededMock(seed + "service", -8, 5, 1)[0];
    
    const newPlan = Math.max(80, baseCat.plan + planOffset);
    const newFact = Math.max(70, baseCat.fact + factOffset);
    const newPricePlan = Math.max(100, baseCat.price_plan + priceOffset);
    const newPriceFact = Math.max(95, baseCat.price_fact + priceOffset);
    const newMarginPlan = Math.max(10, Math.min(50, baseCat.margin_plan + marginOffset));
    const newMarginFact = Math.max(8, Math.min(48, baseCat.margin_fact + marginOffset));
    const newService = Math.max(85, Math.min(99, baseCat.service + serviceOffset));
    
    // Generate trend data
    const trendVals = seededMock(seed + "trend", 70, 95, 6);
    const trendPlan = seededMock(seed + "trendPlan", 75, 100, 6);
    const trend = [0,1,2,3,4,5].map(i => ({
      month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i],
      план: trendPlan[i],
      факт: trendVals[i],
    }));
    
    return {
      ...baseCat,
      plan: newPlan,
      fact: newFact,
      price_plan: newPricePlan,
      price_fact: newPriceFact,
      margin_plan: newMarginPlan,
      margin_fact: newMarginFact,
      service: newService,
      akb: Math.round(Math.max(100, baseCat.akb + (seededMock(seed + "akb", -20, 20, 1)[0]))),
      trend,
      status: (newService >= 97 ? "green" : newService >= 92 ? "yellow" : "red") as const,
    };
  }, [catTerritory, catBusiness, catProductGroup, catDivisionGroup, catDivision]);

  return (
    <div>
      <SectionHeader
        title="Продажи"
        description="Объём, цена реализации, маржа и уровень сервиса по пяти категориям продуктов."
        badge="Март 2026"
      />

      {/* 5 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <SalesKpiCard
          title={<>Объём<br />продаж</>}
          fact="948 т"
          plan="980 т"
          bottomInfo={<span className="inline-block text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(186,36,71,0.12)", color: RED, border: "1px solid rgba(186,36,71,0.2)" }}>▼ 3.1%</span>}
          icon={<ShoppingCart size={16} />}
          color="#f59e0b"
        />

        <SalesKpiCard
          title="Прогноз продаж"
          fact="960 т"
          plan="980 т"
          bottomInfo={<span className="inline-block text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>▲ 1.3%</span>}
          icon={<TrendingUp size={16} />}
          color="#3b82f6"
        />

        <SalesKpiCard
          title="Кол-во SKU"
          fact="842"
          plan="821"
          bottomInfo={<span className="inline-block text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ color: GREEN, border: "1px solid rgba(26,141,122,0.2)", background: "rgba(26,141,122,0.12)" }}>▲ +21</span>}
          icon={<Package size={16} />}
          color="#a855f7"
        />

        <SalesKpiCard
          title="Кол-во клиентов"
          fact="1 248"
          plan="1 210"
          bottomInfo={<span className="inline-block text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>▲ +38</span>}
          icon={<Users size={16} />}
          color="#1A8D7A"
        />

        <SalesKpiCard
          title="Уровень сервиса"
          fact=""
          plan=""
          bottomInfo={null}
          icon={<Star size={16} />}
          color="#f59e0b"
          customContent={
            <div className="flex justify-center -mt-2">
              <Gauge value={94} label="OTIF (цель ≥ 97%)" unit="%" size={100} />
            </div>
          }
        />
      </div>

      {/* ── Analytical Dashboard Block ───────────────────────────────────── */}
      <GlassCard className="mb-4 p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <Dropdown label="Группа подразделений" value={analyticGroup} options={ГРУППЫ_ПОДРАЗДЕЛЕНИЙ} onChange={setAnalyticGroup} isDark={isDark} />
          <Dropdown label="Вид бизнеса" value={analyticBusiness} options={ВИДЫ_БИЗНЕСА} onChange={setAnalyticBusiness} isDark={isDark} />
        </div>

        {/* Three charts in a row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT: LFL vertical bar chart — grouped with previous year */}
          <div className="rounded-xl p-4" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>LFL — Продажи по месяцам, %</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={lflData}>
                <CartesianGrid {...(chartProps(isDark).cartesianGrid)} />
                <XAxis dataKey="month" {...(chartProps(isDark).xAxis)} />
                <YAxis {...(chartProps(isDark).yAxis)} domain={[-3, 8]} unit="%" />
                <Tooltip content={<LflTooltip />} />
                <ReferenceLine y={0} stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} />
                <Bar dataKey="текущий" radius={[4, 4, 0, 0]}>
                  {lflData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.текущий >= 0 ? "#1A8D7A" : "#ba2447"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CENTER: horizontal bar — divisions */}
          <div className="rounded-xl p-4" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
            <p className="text-sm font-semibold mb-3" style={{ color: textSecondary }}>
              Объём продаж — {analyticGroup}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={divisionChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                <XAxis type="number" {...darkChartProps.xAxis} />
                <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={100} tick={{ fontSize: 12, fill: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.6)' }} />
                <Tooltip content={<AnalyticalTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {divisionChartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.value >= 0 ? "#1A8D7A" : "#ba2447"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RIGHT: horizontal bar — product groups */}
          <div className="rounded-xl p-4" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
            <p className="text-sm font-semibold mb-3" style={{ color: textSecondary }}>
              Объём продаж — {analyticBusiness}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productGroupChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                <XAxis type="number" {...darkChartProps.xAxis} />
                <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={120} tick={{ fontSize: 12, fill: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.6)' }} />
                <Tooltip content={<AnalyticalTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {productGroupChartData.map((_, idx) => (
                    <Cell key={idx} fill="#1A8D7A" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── АКБ Section ──────────────────────────────────────────────── */}
        {(() => {
          const akbCurr = seededMock(analyticGroup + analyticBusiness + "akbc", 220, 420, 7);
          const akbPrev = seededMock(analyticGroup + analyticBusiness + "akbp", 190, 380, 7);
          const akbMonthData = lflMonths.map((m, i) => ({
            month: m,
            "Текущий год": akbCurr[i],
            "Прошлый год": akbPrev[i],
          }));
          const currentAkb = akbCurr[6];
          const prevAkb = akbPrev[6];
          const akbLfl = +(((currentAkb - prevAkb) / prevAkb) * 100).toFixed(1);

          const akbDivData = analyticDivisions.map((d) => {
            const curr = seededMock(d + analyticGroup + "ac", 30, 130, 1)[0];
            const prev = seededMock(d + analyticGroup + "ap", 28, 120, 1)[0];
            const lfl = +(((curr - prev) / prev) * 100).toFixed(1);
            const revenue = seededMock(d + analyticGroup + "rev", 800, 4200, 1)[0];
            const revPrev = seededMock(d + analyticGroup + "revp", 750, 3900, 1)[0];
            const реализациянаТочку = Math.round(revenue / curr);
            const реализациянаТочкуПрошлый = Math.round(revPrev / prev);
            const реализацияLfl = +(((реализациянаТочку - реализациянаТочкуПрошлый) / реализациянаТочкуПрошлый) * 100).toFixed(1);
            return { name: d, lfl, текущий: curr, прошлый: prev, реализациянаТочку, реализациянаТочкуПрошлый, реализацияLfl };
          }).sort((a, b) => b.lfl - a.lfl);

          const AkbTrendTooltip = ({ active, payload, label }: any) => {
            if (!active || !payload) return null;
            const curr = payload.find((p: any) => p.dataKey === "Текущий год");
            const prev = payload.find((p: any) => p.dataKey === "Прошлый год");
            const lflVal = curr && prev ? +(((curr.value - prev.value) / prev.value) * 100).toFixed(1) : null;
            return (
              <div className="rounded-xl p-3 text-xs" style={{
                background: isDark ? "rgba(15,20,25,0.95)" : "rgba(255,255,255,0.95)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                backdropFilter: "blur(20px)",
                boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.15)",
                color: isDark ? "white" : "black",
              }}>
                <p className="font-bold mb-1">{label}</p>
                {curr && <p style={{ color: "#1A8D7A" }}>Текущий год: {curr.value} точек</p>}
                {prev && <p style={{ color: "#4F709D" }}>Прошлый год: {prev.value} точек</p>}
                {lflVal !== null && (
                  <p style={{ color: lflVal >= 0 ? GREEN : RED }}>LFL: {lflVal >= 0 ? "+" : ""}{lflVal}%</p>
                )}
              </div>
            );
          };

          const AkbDivTooltip = ({ active, payload }: any) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="rounded-xl p-3 text-xs" style={{
                background: isDark ? "rgba(15,20,25,0.95)" : "rgba(255,255,255,0.95)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                backdropFilter: "blur(20px)",
                boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.15)",
                color: isDark ? "white" : "black",
                minWidth: 210,
              }}>
                <p className="font-bold mb-1.5">{d.name}</p>
                <p style={{ color: "#1A8D7A" }}>АКБ тек.: {d.текущий} точек</p>
                <p style={{ color: "#4F709D" }}>АКБ пред.: {d.прошлый} точек</p>
                <p style={{ color: d.lfl >= 0 ? GREEN : RED }}>АКБ LFL: {d.lfl >= 0 ? "+" : ""}{d.lfl}%</p>
                <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <p className="mb-1" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Реализация на точку:</p>
                  <p style={{ color: "#1A8D7A" }}>Тек.: {d.реализациянаТочку?.toLocaleString("ru-RU")} тыс. ₽</p>
                  <p style={{ color: "#4F709D" }}>Пред.: {d.реализациянаТочкуПрошлый?.toLocaleString("ru-RU")} тыс. ₽</p>
                  <p style={{ color: d.реализацияLfl >= 0 ? GREEN : RED }}>LFL: {d.реализацияLfl >= 0 ? "+" : ""}{d.реализацияLfl}%</p>
                </div>
              </div>
            );
          };

          const divChartHeight = Math.max(180, akbDivData.length * 38);

          return (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                {/* LEFT: AKB dynamics line chart */}
                <div className="rounded-xl p-4" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold" style={{ color: textSecondary }}>АКБ — Динамика по месяцам</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: textStrong }}>{currentAkb} точек</span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{
                        color: akbLfl >= 0 ? GREEN : RED,
                        background: akbLfl >= 0 ? "rgba(26,141,122,0.12)" : "rgba(186,36,71,0.12)",
                        border: `1px solid ${akbLfl >= 0 ? "rgba(26,141,122,0.2)" : "rgba(186,36,71,0.2)"}`,
                      }}>
                        {akbLfl >= 0 ? "▲" : "▼"} {Math.abs(akbLfl)}% vs пр.год
                      </span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={divChartHeight}>
                    <LineChart data={akbMonthData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid {...chartProps(isDark).cartesianGrid} />
                      <XAxis dataKey="month" {...chartProps(isDark).xAxis} />
                      <YAxis {...chartProps(isDark).yAxis} />
                      <Tooltip content={<AkbTrendTooltip />} />
                      <Legend {...darkChartProps.legend} />
                      <Line type="monotone" dataKey="Текущий год" stroke="#1A8D7A" strokeWidth={2.5} dot={{ r: 3, fill: "#1A8D7A", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Прошлый год" stroke="#4F709D" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* RIGHT: AKB LFL by divisions */}
                <div className="rounded-xl p-4" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>
                    АКБ LFL по подразделениям — {analyticGroup}, %
                  </p>
                  <ResponsiveContainer width="100%" height={divChartHeight}>
                    <BarChart data={akbDivData} layout="vertical" margin={{ left: 10, right: 36, top: 4, bottom: 0 }}>
                      <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                      <XAxis type="number" {...darkChartProps.xAxis} unit="%" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        {...darkChartProps.yAxis}
                        width={105}
                        tick={{ fontSize: 12, fill: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.6)" }}
                      />
                      <ReferenceLine x={0} stroke={isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"} />
                      <Tooltip content={<AkbDivTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                      <Bar
                        dataKey="lfl"
                        radius={[0, 4, 4, 0]}
                        label={{
                          position: "right",
                          fontSize: 11,
                          fill: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
                          formatter: (v: number) => `${v > 0 ? "+" : ""}${v}%`,
                        }}
                      >
                        {akbDivData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.lfl >= 0 ? "#1A8D7A" : "#ba2447"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          );
        })()}
      </GlassCard>

      {/* AI placeholder with Power BI link */}
      <div className="mb-4">
        <AIPlaceholder lines={3} linkLabel="Power BI — Продажи" isDark={isDark} />
      </div>

      {/* Overall chart with % overlay - New separate block */}
      <GlassCard className="p-5 mb-4" glow={BLUE} style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <ChartTitle>Общий объём продаж — план vs факт + % от плана</ChartTitle>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={overallData}>
            <CartesianGrid {...darkChartProps.cartesianGrid} />
            <XAxis dataKey="month" {...darkChartProps.xAxis} />
            <YAxis {...darkChartProps.yAxis} yAxisId="left" domain={[0, 1200]} />
            <YAxis yAxisId="right" orientation="right" domain={[90, 105]} {...darkChartProps.yAxis} unit="%" />
            <Tooltip content={<PctTooltip />} />
            <Legend {...darkChartProps.legend} />
            <Bar key="bar-plan" yAxisId="left" dataKey="план" name="План (т)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            <Bar key="bar-fact" yAxisId="left" dataKey="факт" name="Факт (т)" fill="#1A8D7A" radius={[4, 4, 0, 0]} />
            <ReferenceLine yAxisId="right" y={100} stroke="rgba(16,185,129,0.4)" strokeDasharray="4 4" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Top SKU по выполнению плана ───────────────────────────────── */}
      <div
        className="rounded-2xl mb-4 mt-4 overflow-hidden"
        style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${cardBorder}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>
            Топ SKU по выполнению плана
          </p>
          <button
            onClick={() => setSkuExpanded(e => !e)}
            className="p-1 rounded-lg transition-all"
            style={{ color: textMuted, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          >
            {skuExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {skuExpanded && (
          <div className="px-5 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Лучшие */}
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: GREEN }}>Лучшие</p>
                <div className="space-y-2">
                  {bestSKU.map((sku, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}`, minHeight: 52 }}>
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-xs font-medium truncate" style={{ color: textStrong }}>{sku.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: GREEN }}>+{sku.pct}%</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold" style={{ color: textPrimary }}>{sku.fact} / {sku.plan} тн</p>
                        <p className="text-xs" style={{ color: textMuted }}>факт / план</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Худшие */}
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: RED }}>Худшие</p>
                <div className="space-y-2">
                  {worstSKU.map((sku, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}`, minHeight: 52 }}>
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-xs font-medium truncate" style={{ color: textStrong }}>{sku.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: RED }}>{sku.pct}%</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold" style={{ color: textPrimary }}>{sku.fact} / {sku.plan} тн</p>
                        <p className="text-xs" style={{ color: textMuted }}>факт / план</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Category Breakdown ────────────────────────────────────────── */}
      <GlassCard className="p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        {/* Filter dropdowns instead of buttons */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <Dropdown
            label="Территория"
            value={catTerritory}
            options={["Все", ...ТЕРРИТОРИИ] as readonly string[]}
            onChange={setCatTerritory}
            isDark={isDark}
          />
          <Dropdown
            label="Вид бизнеса"
            value={catBusiness || "Все"}
            options={["Все", ...ВИДЫ_БИЗНЕСА] as readonly string[]}
            onChange={(v) => {
              setCatBusiness(v);
              setCatProductGroup("Все");
            }}
            isDark={isDark}
          />
          <Dropdown
            label="Группа товаров"
            value={catProductGroup}
            options={["Все" as string, ...catProductGroups] as readonly string[]}
            onChange={setCatProductGroup}
            disabled={!catBusiness || catBusiness === "Все"}
            isDark={isDark}
          />
          <Dropdown
            label="Группа подразделений"
            value={catDivisionGroup || "Все"}
            options={["Все", ...ГРУППЫ_ПОДРАЗДЕЛЕНИЙ] as readonly string[]}
            onChange={(v) => {
              setCatDivisionGroup(v);
              setCatDivision("Все");
            }}
            isDark={isDark}
          />
          <Dropdown
            label="Подразделение"
            value={catDivision || "Все"}
            options={catDivisions.length > 0 ? ["Все", ...catDivisions] as readonly string[] : ["Все"] as readonly string[]}
            onChange={setCatDivision}
            disabled={!catDivisionGroup || catDivisionGroup === "Все"}
            isDark={isDark}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ alignItems: "stretch" }}>
          {/* Metrics */}
          <div className="flex flex-col justify-between space-y-3">
            {[
              { label: "Объём (тонн)", fact: `${filteredCategory.fact} т`, plan: `${filteredCategory.plan} т`, pct: (filteredCategory.fact / filteredCategory.plan) * 100 },
              { label: "Цена (₽/кг)", fact: `${filteredCategory.price_fact} ₽`, plan: `${filteredCategory.price_plan} ₽`, pct: (filteredCategory.price_fact / filteredCategory.price_plan) * 100 },
              { label: "Маржа (%)", fact: `${filteredCategory.margin_fact}%`, plan: `${filteredCategory.margin_plan}%`, pct: (filteredCategory.margin_fact / filteredCategory.margin_plan) * 100 },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl flex-1" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <p className="text-xs mb-2" style={{ color: textSecondary }}>{m.label}</p>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold" style={{ color: textStrong }}>{m.fact}</span>
                  <span className="text-xs" style={{ color: textMuted }}>план: {m.plan}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: barBg }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(m.pct, 100)}%`, background: filteredCategory.color }} />
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <div className="flex-1 p-3 rounded-xl flex items-center justify-between"
                style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <span className="text-xs" style={{ color: textSecondary }}>Уровень сервиса</span>
                <span className="text-sm font-bold" style={{
                  color: filteredCategory.service >= 97 ? GREEN : filteredCategory.service >= 92 ? YELLOW : RED,
                }}>
                  {filteredCategory.service}%
                </span>
              </div>
              <div className="flex-1 p-3 rounded-xl flex items-center justify-between"
                style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <span className="text-xs" style={{ color: textSecondary }}>АКБ</span>
                <span className="text-sm font-bold" style={{ color: textStrong }}>
                  {filteredCategory.akb} точек
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex flex-col">
            <p className="text-xs mb-3" style={{ color: textMuted }}>Динамика объёма — план vs факт</p>
            <div className="flex-1 min-h-0" style={{ minHeight: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredCategory.trend}>
                  <CartesianGrid {...darkChartProps.cartesianGrid} />
                  <XAxis dataKey="month" {...darkChartProps.xAxis} />
                  <YAxis {...darkChartProps.yAxis} />
                  <Tooltip content={<CategoryTrendTooltipWithAKB />} />
                  <Legend {...darkChartProps.legend} />
                  <Line key="line-plan" type="monotone" dataKey="план" name="План" stroke="#4F709D" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line key="line-fact" type="monotone" dataKey="факт" name="Факт" stroke="#1A8D7A" strokeWidth={2.5} dot={{ r: 4, fill: "#1A8D7A", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI inside last block - REMOVE THIS SECTION */}
      </GlassCard>

      {/* AI Analyst blocks - separate cards */}
      <div className="mb-4">
        <AIPlaceholder lines={3} isDark={isDark} linkLabel="Power BI — Продажи" />
      </div>
    </div>
  );
}