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
  businessTypeToProductGroups,
  divisionGroupToDivisions,
} from "../filtersData";
import { ShoppingCart, TrendingUp, Star, Package, Users, Bot, ChevronDown, ChevronUp, ExternalLink, ArrowUp } from "lucide-react";

// ── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#10b981";
const YELLOW = "#f59e0b";
const RED = "#ef4444";

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return "59,130,246";
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
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
    id: "kolbasy", label: "Колбасы", color: "#3b82f6",
    plan: 320, fact: 298, price_plan: 195, price_fact: 192,
    margin_plan: 32, margin_fact: 29, service: 95, status: "yellow" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [85,88,90,82,86,90][i], факт: [82,87,89,79,85,88][i] })),
  },
  {
    id: "zamorozka", label: "Заморозка", color: "#22d3ee",
    plan: 180, fact: 175, price_plan: 142, price_fact: 145,
    margin_plan: 28, margin_fact: 29, service: 97, status: "green" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [46,48,50,44,47,50][i], факт: [45,47,49,43,47,49][i] })),
  },
  {
    id: "delikatesy", label: "Деликатесы", color: "#a855f7",
    plan: 150, fact: 162, price_plan: 380, price_fact: 395,
    margin_plan: 42, margin_fact: 45, service: 96, status: "green" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [38,40,42,37,40,42][i], факт: [39,41,44,39,43,46][i] })),
  },
  {
    id: "oxl_pf", label: "Охлажденные ПФ", color: "#f59e0b",
    plan: 210, fact: 195, price_plan: 128, price_fact: 124,
    margin_plan: 22, margin_fact: 19, service: 91, status: "red" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [54,56,58,52,55,58][i], факт: [50,53,55,48,51,54][i] })),
  },
  {
    id: "myasnoy", label: "Мясной проект", color: "#ef4444",
    plan: 130, fact: 118, price_plan: 165, price_fact: 158,
    margin_plan: 18, margin_fact: 15, service: 88, status: "red" as const,
    trend: [0,1,2,3,4,5].map(i => ({ month: ["Окт","Ноя","Дек","Янв","Фев","Мар"][i], план: [33,35,37,32,34,37][i], факт: [31,33,34,29,32,33][i] })),
  },
];

// LFL data
const lflMonths = ["Сен", "Окт", "Ноя", "Дек", "Янв", "Фев", "Мар"];
const lflValues = [-1.2, 2.3, 4.5, -0.8, 3.2, 6.1, 5.4];
const lflPrevYear = [-2.1, 1.8, 3.2, -1.5, 2.1, 4.8, 3.9];
const lflData = lflMonths.map((m, i) => ({ month: m, текущий: lflValues[i], прошлый: lflPrevYear[i] }));

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
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)" }}
    >
      <Bot size={16} style={{ color: "#60a5fa", flexShrink: 0, marginTop: 2 }} />
      <div className="flex-1">
        <p className="text-xs font-semibold mb-2" style={{ color: "#93c5fd" }}>ИИ-аналитик</p>
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
          border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
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
            background: isDark ? "rgba(10,18,40,0.97)" : "rgba(255,255,255,0.97)",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
            backdropFilter: "blur(20px)",
          }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-xs transition-all"
              style={{
                color: opt === value ? "#93c5fd" : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                background: opt === value ? "rgba(59,130,246,0.1)" : "transparent",
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
        background: isDark ? "rgba(15,20,41,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        color: isDark ? "white" : "black",
        boxShadow: isDark 
          ? "0 8px 32px rgba(0,0,0,0.4)" 
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

// ── Main ─────────────────────────────────────────────────────────────────────
export function Sales() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Category breakdown filters
  const [catBusiness, setCatBusiness] = useState<string>("");
  const [catProductGroup, setCatProductGroup] = useState<string>("Все");

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
    if (!catBusiness) return [];
    return businessTypeToProductGroups[catBusiness] || [];
  }, [catBusiness]);

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
    const vals = seededMock(analyticGroup + analyticBusiness, 50, 300, divs.length);
    return divs.map((d, i) => ({ name: d, value: vals[i] })).sort((a, b) => b.value - a.value);
  }, [analyticDivisions, analyticGroup, analyticBusiness]);

  // Generate mock data for product group chart
  const productGroupChartData = useMemo(() => {
    const groups = analyticProductGroups;
    const vals = seededMock(analyticBusiness + analyticGroup, 80, 400, groups.length);
    return groups.map((g, i) => ({ name: g, value: vals[i] })).sort((a, b) => b.value - a.value);
  }, [analyticProductGroups, analyticBusiness, analyticGroup]);

  // Determine which category to show based on filters
  const filteredCategory = useMemo(() => {
    if (!catBusiness && catProductGroup === "Все") return categories[0];
    // Simple mock: rotate categories based on filter selection
    const idx = (catBusiness.length + catProductGroup.length) % categories.length;
    return categories[idx];
  }, [catBusiness, catProductGroup]);

  return (
    <div>
      <SectionHeader
        title="Продажи"
        description="Объём, цена реализации, маржа и уровень сервиса по пяти категориям продуктов."
        badge="Март 2026"
      />

      {/* 5 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div
          className="rounded-2xl p-4 relative overflow-hidden group transition-all"
          style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}` }}
        >
          <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", filter: "blur(10px)" }} />
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: textSecondary }}>Объём продаж тн</p>
          <p className="text-2xl font-black mb-1" style={{ color: textPrimary }}>948 т</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div><p className="text-xs" style={{ color: textMuted }}>План</p><p className="text-xs font-bold" style={{ color: textMedium }}>980 т</p></div>
            <div><p className="text-xs" style={{ color: textMuted }}>% плана</p>
              <p className="text-xs font-bold" style={{ color: YELLOW }}>96.7%</p>
            </div>
          </div>
          <span className="inline-block mt-2 text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(239,68,68,0.12)", color: RED, border: "1px solid rgba(239,68,68,0.2)" }}>▼ 3.1%</span>
        </div>

        <div className="rounded-2xl p-4 relative overflow-hidden group transition-all"
          style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}` }}>
          <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", filter: "blur(10px)" }} />
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: textSecondary }}>Прогноз продаж</p>
          <p className="text-2xl font-black mb-1" style={{ color: "#60a5fa" }}>960 т</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div><p className="text-xs" style={{ color: textMuted }}>План</p><p className="text-xs font-bold" style={{ color: textMedium }}>980 т</p></div>
            <div><p className="text-xs" style={{ color: textMuted }}>% плана</p>
              <p className="text-xs font-bold" style={{ color: YELLOW }}>98.0%</p>
            </div>
          </div>
          <span className="inline-block mt-2 text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(16,185,129,0.12)", color: GREEN, border: "1px solid rgba(16,185,129,0.2)" }}>▲ 1.3%</span>
        </div>

        <div className="rounded-2xl p-4 relative overflow-hidden group transition-all"
          style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}` }}>
          <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)", filter: "blur(10px)" }} />
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: textSecondary }}>Кол-во SKU</p>
          <p className="text-2xl font-black mb-1" style={{ color: textPrimary }}>842</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div><p className="text-xs" style={{ color: textMuted }}>Пред. мес.</p><p className="text-xs font-bold" style={{ color: textMedium }}>821</p></div>
            <div><p className="text-xs" style={{ color: textMuted }}>Δ SKU</p>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ color: GREEN, border: `1px solid rgba(16,185,129,0.35)`, background: "rgba(16,185,129,0.08)" }}>
                <ArrowUp size={10} /> +21
              </span>
            </div>
          </div>
          <span className="inline-block mt-2 text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(16,185,129,0.12)", color: GREEN, border: "1px solid rgba(16,185,129,0.2)" }}>▲ 2.6%</span>
        </div>

        <div className="rounded-2xl p-4 relative overflow-hidden group transition-all"
          style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}` }}>
          <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(10px)" }} />
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: textSecondary }}>Кол-во клиентов</p>
          <p className="text-2xl font-black mb-1" style={{ color: textPrimary }}>1 248</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div><p className="text-xs" style={{ color: textMuted }}>Пред. мес.</p><p className="text-xs font-bold" style={{ color: textMedium }}>1 210</p></div>
            <div><p className="text-xs" style={{ color: textMuted }}>Δ</p>
              <p className="text-xs font-bold" style={{ color: GREEN }}>+38</p>
            </div>
          </div>
          <span className="inline-block mt-2 text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(16,185,129,0.12)", color: GREEN, border: "1px solid rgba(16,185,129,0.2)" }}>▲ 3.1%</span>
        </div>

        <div className="rounded-2xl p-4 relative overflow-hidden group transition-all"
          style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}` }}>
          <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", filter: "blur(10px)" }} />
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: textSecondary }}>Уровень сервиса</p>
          <div className="flex justify-center">
            <Gauge value={94} label="OTIF (цель ≥ 97%)" unit="%" size={130} />
          </div>
        </div>
      </div>

      {/* ── Analytical Dashboard Block ───────────────────────────────────── */}
      <GlassCard className="mb-6 p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
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
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  {...(chartProps(isDark).legend)}
                  formatter={(value: string) => value === "текущий" ? "Текущий год" : "Прошлый год"}
                />
                <ReferenceLine y={0} stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} />
                <Bar dataKey="прошлый" name="прошлый" fill={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} radius={[4, 4, 0, 0]} />
                <Bar dataKey="текущий" name="текущий" radius={[4, 4, 0, 0]}>
                  {lflData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.текущий >= 0 ? GREEN : RED} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CENTER: horizontal bar — divisions */}
          <div className="rounded-xl p-4" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>
              Объём продаж — {analyticGroup}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={divisionChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                <XAxis type="number" {...darkChartProps.xAxis} />
                <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={100} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {divisionChartData.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? RED : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RIGHT: horizontal bar — product groups */}
          <div className="rounded-xl p-4" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>
              Объём продаж — {analyticBusiness}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productGroupChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                <XAxis type="number" {...darkChartProps.xAxis} />
                <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={120} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {productGroupChartData.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? RED : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* AI placeholder with Power BI link */}
      <div className="mb-6">
        <AIPlaceholder lines={3} linkLabel="Power BI — Продажи" isDark={isDark} />
      </div>

      {/* Overall chart with % overlay */}
      <GlassCard className="p-5 mb-6" glow="#3b82f6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <ChartTitle>Общий объём продаж — план vs факт + % от плана</ChartTitle>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={overallData}>
            <CartesianGrid {...darkChartProps.cartesianGrid} />
            <XAxis dataKey="month" {...darkChartProps.xAxis} />
            <YAxis {...darkChartProps.yAxis} yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[90, 105]} {...darkChartProps.yAxis} unit="%" />
            <Tooltip content={<PctTooltip />} />
            <Legend {...darkChartProps.legend} />
            <Bar yAxisId="left" dataKey="план" name="План (т)" fill="rgba(59,130,246,0.2)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="факт" name="Факт (т)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="pct" name="% от плана" stroke={YELLOW} strokeWidth={2} dot={{ r: 3, fill: YELLOW, strokeWidth: 0 }} />
            <ReferenceLine yAxisId="right" y={100} stroke="rgba(16,185,129,0.4)" strokeDasharray="4 4" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Top SKU по выполнению плана ───────────────────────────────── */}
      <div
        className="rounded-2xl mb-6 overflow-hidden"
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
            label="Вид бизнеса"
            value={catBusiness || "Выберите"}
            options={ВИДЫ_БИЗНЕСА}
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
            disabled={!catBusiness}
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
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(m.pct, 100)}%`, background: filteredCategory.color, boxShadow: `0 0 8px ${filteredCategory.color}` }} />
                </div>
              </div>
            ))}
            <div className="p-3 rounded-xl flex items-center justify-between"
              style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
              <span className="text-xs" style={{ color: textSecondary }}>Уровень сервиса</span>
              <span className="text-sm font-bold" style={{
                color: filteredCategory.service >= 97 ? GREEN : filteredCategory.service >= 92 ? YELLOW : RED,
              }}>
                {filteredCategory.service}%
              </span>
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
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend {...darkChartProps.legend} />
                  <Line type="monotone" dataKey="план" name="План" stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="факт" name="Факт" stroke={filteredCategory.color} strokeWidth={2.5} dot={{ r: 4, fill: filteredCategory.color, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI inside last block */}
        <div className="mt-5">
          <AIPlaceholder lines={2} isDark={isDark} />
        </div>
      </GlassCard>
    </div>
  );
}
