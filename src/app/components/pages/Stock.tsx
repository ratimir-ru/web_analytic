import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { GlassCard, SectionHeader, darkChartProps } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import { ВИДЫ_БИЗНЕСА, ТЕРРИТОРИИ, businessTypeToProductGroups } from "../filtersData";
import {
  Package, Warehouse, AlertTriangle, RotateCcw,
  ChevronDown, ChevronUp, Bot, ExternalLink, TrendingDown, PercentCircle 
} from "lucide-react";

// ── Palette ───────────────────────────────────────────────────────────────────
const TEAL_DARK = "#008183";
const TEAL = "#00B19F";
const MINT_GREEN = "#6BF0AE";
const BEIGE = "#E0DCD0";
const BLUE = "#4F709D";
const PURPLE = "#A47DD4";
const PINK = "#E05A85";
const RED = "#BA2447";

// Legacy aliases for compatibility
const GREEN = MINT_GREEN;
const YELLOW = BEIGE;
const ORANGE = PINK;

// ── OSG Segments ─────────────────────────────────────────────────────────────
const OSG_SEGMENTS = [
  { label: "≥ 75% срока", shortLabel: "≥75%", color: TEAL_DARK },
  { label: "50–74% срока", shortLabel: "50-74%", color: TEAL },
  { label: "25–49% срока", shortLabel: "25-49%", color: MINT_GREEN },
  { label: "< 25% срока", shortLabel: "<25%", color: PINK },
  { label: "Просроченные", shortLabel: "Просрочено", color: RED },
];

function osgColor(pct: number): string {
  if (pct >= 75) return TEAL_DARK;
  if (pct >= 50) return TEAL;
  if (pct >= 25) return MINT_GREEN;
  if (pct > 0) return PINK;
  return RED;
}

// ── Warehouses ────────────────────────────────────────────────────────────────
export const ALL_WAREHOUSES = [
  { name: "Инкотек верхняя площадка", territory: "Владивосток" },
  { name: "Склад ГП (Благовещенск)", territory: "Благовещенск" },
  { name: "Склад ГП (Кавалерово)", territory: "Кавалерово" },
  { name: "Склад ГП (Комсомольск)", territory: "Комсомольск" },
  { name: "Склад ГП (Находка)", territory: "Находка" },
  { name: "Склад ГП (Спасск)", territory: "Спасск" },
  { name: "Склад ГП (Хабаровск)", territory: "Хабаровск" },
  { name: "Склад ДВХК (Актированный)", territory: "Хабаровск" },
  { name: "Склад Инкотек ДВХК", territory: "Владивосток" },
  { name: "Склад контейнер (Благовещенск)", territory: "Благовещенск" },
  { name: "Склад ПФ (Благовещенск)", territory: "Благовещенск" },
  { name: "Склад ПФ (Находка)", territory: "Находка" },
  { name: "Склад ПФ (Спасск)", territory: "Спасск" },
  { name: "Склад ПФ (Хабаровск)", territory: "Хабаровск" },
] as const;

// ── Return cause groups ───────────────────────────────────────────────────────
const RETURN_CAUSES = [
  { name: "Истёкший срок годности", category: "Возврат", value: 1240, color: TEAL_DARK },
  { name: "Механическое повреждение", category: "Возврат", value: 890, color: TEAL },
  { name: "Ненадлежащее хранение", category: "Возврат", value: 720, color: MINT_GREEN },
  { name: "Пересортица", category: "Возврат", value: 560, color: PINK },
  { name: "Производственный брак", category: "Возврат", value: 480, color: RED },
  { name: "Прочие причины", category: "Возврат", value: 340, color: PURPLE },
];

const WRITEOFF_CAUSES = [
  { name: "Плановые потери", category: "Списание", value: 580, color: TEAL_DARK },
  { name: "Бой при транспортировке", category: "Списание", value: 320, color: TEAL },
  { name: "Технологические потери", category: "Списание", value: 260, color: MINT_GREEN },
  { name: "Недостача", category: "Списание", value: 140, color: PINK },
  { name: "Истёкший срок (хранение)", category: "Списание", value: 190, color: RED },
  { name: "Прочие списания", category: "Списание", value: 90, color: PURPLE },
];

// ── Seed-based helpers ────────────────────────────────────────────────────────
function seeded(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return min + (Math.abs(h) % (max - min + 1));
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown<T extends string>({
  label, value, options, onChange, isDark, disabled,
}: {
  label: string; value: T; options: readonly T[]; onChange: (v: T) => void; isDark: boolean; disabled?: boolean;
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
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          backdropFilter: "blur(20px)",
        }}
      >
        <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{label}:</span>
        <span>{value}</span>
        <span style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>▾</span>
      </button>
      {open && !disabled && (
        <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-50 min-w-max"
          style={{
            background: isDark ? "rgba(10,15,20,0.95)" : "rgba(255,255,255,0.95)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            backdropFilter: "blur(80px)",
            WebkitBackdropFilter: "blur(80px)",
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 32px rgba(0,0,0,0.25)",
          }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-xs transition-all"
              style={{
                color: opt === value ? "#BA2447" : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                background: opt === value ? "rgba(186,36,71,0.15)" : "transparent",
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

// ── KPI Card (site-standard style) ───────────────────────────────────────────
function StockKpiCard({
  title, fact, plan, bottomInfo, icon, accentColor: _accentColor,
}: {
  title: React.ReactNode;
  fact: string;
  plan: string;
  bottomInfo: React.ReactNode;
  icon: React.ReactNode;
  accentColor?: string;
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
        <p className="text-xs font-semibold uppercase tracking-widest mx-[0px] my-[-2px]"
          style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          {title}
        </p>
        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          }}>
          {icon}
        </div>
      </div>
      <div className="mx-[0px] my-[5px]">
        <span className="text-xs block mx-[0px] mt-[28px] mb-[-22px]"
          style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          {plan}
        </span>
        <div className="flex items-center justify-between mx-[0px] mt-[26px] mb-[-4px]">
          <span className="text-2xl font-semibold"
            style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            {fact}
          </span>
          {bottomInfo}
        </div>
      </div>
    </div>
  );
}

// ── Combined OSG Card (≥50% + <50% in one block) ──────────────────────────────
function OsgCombinedCard({
  above50Kg, below50Kg, totalKg, showBar = true,
}: {
  above50Kg: number; below50Kg: number; totalKg: number; showBar?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const above50Pct = ((above50Kg / totalKg) * 100).toFixed(0);
  const below50Pct = ((below50Kg / totalKg) * 100).toFixed(0);
  const belowRatio = below50Kg / totalKg;
  const belowColor = belowRatio > 0.2 ? RED : GREEN;

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
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
          ОСГ по срокам годности
        </p>
        <div className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          }}>
          <PercentCircle size={14} />
        </div>
      </div>

      <div className="flex gap-0">
        {/* ≥50% side */}
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)" }}>≥ 50% ОСГ</span>
          </div>
          <span className="text-xl font-semibold block"
            style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)" }}>
            {(above50Kg / 1000).toFixed(1)} т
          </span>
          {showBar && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md inline-block mt-1.5"
              style={{ background: "rgba(26,141,122,0.14)", color: GREEN, border: "1px solid rgba(26,141,122,0.25)" }}>
              {above50Pct}%
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px self-stretch mx-1 rounded-full"
          style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)" }} />

        {/* <50% side */}
        <div className="flex-1 pl-3">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: belowColor }} />
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)" }}>&lt; 50% ОСГ</span>
          </div>
          <span className="text-xl font-semibold block"
            style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)" }}>
            {(below50Kg / 1000).toFixed(1)} т
          </span>
          {showBar && (
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-md inline-block mt-1.5"
            style={{
              background: belowRatio > 0.2 ? "rgba(186,36,71,0.14)" : "rgba(26,141,122,0.14)",
              color: belowColor,
              border: `1px solid ${belowRatio > 0.2 ? "rgba(186,36,71,0.25)" : "rgba(26,141,122,0.25)"}`,
            }}>
            {below50Pct}%
          </span>
          )}
        </div>
      </div>

      {/* Mini progress bar — только если showBar=true */}
      {showBar && (
        <div className="mt-4 h-1 rounded-full overflow-hidden"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
          <div className="h-full rounded-full"
            style={{
              width: `${above50Pct}%`,
              background: `linear-gradient(90deg, ${GREEN}, ${GREEN}77)`,
            }} />
        </div>
      )}
    </div>
  );
}

// ── Mini KPI (inside content block) ──────────────────────────────────────────
function StockMiniKpi({
  label, value, sub, color, icon,
}: {
  label: string; value: string; sub?: string; color: string; icon: React.ReactNode;
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
          {label}
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
      <div className="mx-[0px] my-[5px]">
        <div className="flex items-center justify-between mx-[0px] mt-[0px] mb-[-4px]">
          <span className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            {value}
          </span>
        </div>
        {sub && (
          <span className="text-xs block mx-[0px] mt-[8px] mb-[0px]" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Glass Inner Card ──────────────────────────────────────────────────────────
function InnerCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`rounded-2xl p-4 transition-all ${className}`}
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: isDark ? "0 2px 16px rgba(0,0,0,0.18)" : "0 2px 16px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.04)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}
    >
      {children}
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function StockTooltip({ active, payload, label }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs" style={{
      background: isDark ? "rgba(15,20,25,0.97)" : "rgba(255,255,255,0.97)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
      backdropFilter: "blur(20px)",
      boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.15)",
      color: isDark ? "white" : "black",
      minWidth: 160,
    }}>
      <p className="font-bold mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill || p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString("ru-RU") : p.value} {p.unit || ""}
        </p>
      ))}
    </div>
  );
}

// ── AI Analytics Block (Dashboard-style placeholder) ─────────────────────────
function AIAnalyticsBlock({ isDark, linkLabel = "Power BI" }: { isDark: boolean; linkLabel?: string }) {
  return (
    <GlassCard
      className="p-4 my-4"
      style={{
        background: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.15)",
        border: isDark ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(59,130,246,0.3)",
      }}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Bot size={16} style={{ color: "#00B19F" }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold mb-2" style={{ color: "#00B19F" }}>
            ИИ-аналитик
          </p>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-2.5 rounded-full"
                style={{
                  background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                  width: i === 2 ? "60%" : "100%",
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
              Текст ИИ-аналитика будет отображён здесь
            </p>
            <a
              href="https://powerbi.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ml-4"
              style={{
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#00B19F",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={12} />
              {linkLabel}
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ── Main StockBlock ───────────────────────────────────────────────────────────
export function StockBlock() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"stock" | "returns">("stock");
  const [territory, setTerritory] = useState<string>("Все");
  const [business, setBusiness] = useState<string>("Все");
  const [productGroup, setProductGroup] = useState<string>("Все");
  const [returnsCollapsed, setReturnsCollapsed] = useState(false);
  const [writeoffsCollapsed, setWriteoffsCollapsed] = useState(false);

  const textSecondary = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";
  const textStrong = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const divider = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

  // Product group options
  const productGroupOptions = useMemo(() => {
    if (!business || business === "Все") return ["Все"];
    return ["Все", ...(businessTypeToProductGroups[business] || [])];
  }, [business]);

  const seed = territory + business + productGroup;
  const seedAll = ""; // фиксированный seed — всегда "все"

  const handleBusinessChange = (v: string) => {
    setBusiness(v);
    setProductGroup("Все");
  };

  // Active warehouses based on territory filter only
  const activeWarehouses = useMemo(() => {
    let ws = [...ALL_WAREHOUSES];
    if (territory !== "Все") ws = ws.filter(w => w.territory === territory);
    return ws;
  }, [territory]);

  // OSG distribution for pie chart
  const osgPieData = useMemo(() => {
    const bases = [38, 28, 18, 10, 6];
    const total = seeded(seed + "total", 85000, 180000);
    return OSG_SEGMENTS.map((seg, i) => {
      const pct = bases[i] + seeded(seed + seg.label, -3, 3);
      return {
        name: seg.label,
        shortLabel: seg.shortLabel,
        color: seg.color,
        pct,
        value: Math.round((total * pct) / 100),
      };
    });
  }, [seed]);

  // Данные для верхних KPI-карточек (не зависят от фильтров)
  const osgPieDataAll = useMemo(() => {
    const bases = [38, 28, 18, 10, 6];
    const total = seeded(seed + "total", 85000, 180000);
    return OSG_SEGMENTS.map((seg, i) => {
      const pct = bases[i] + seeded(seed + seg.label, -3, 3);
      return {
        name: seg.label,
        shortLabel: seg.shortLabel,
        color: seg.color,
        pct,
        value: Math.round((total * pct) / 100),
      };
    });
  }, []); // пустые deps — никогда не пересчитывается

  const totalKg = osgPieData.reduce((s, d) => s + d.value, 0);
  const totalKgAll = osgPieDataAll.reduce((s, d) => s + d.value, 0);

  const totalRub = Math.round(totalKg * (seeded(seed + "rub", 180, 320)));
  const totalBatches = seeded(seed + "batch", 820, 1850);
  const criticalPct = osgPieData.filter(d => d.shortLabel === "<25%" || d.shortLabel === "Просрочено")
    .reduce((s, d) => s + d.pct, 0);

  // OSG ≥ 50% and < 50% breakdown
  const osgAbove50kg = osgPieData.filter(d => d.shortLabel === "≥75%" || d.shortLabel === "50-74%")
    .reduce((s, d) => s + d.value, 0);
  const osgBelow50kg = osgPieData.filter(d => d.shortLabel === "25-49%" || d.shortLabel === "<25%" || d.shortLabel === "Просрочено")
    .reduce((s, d) => s + d.value, 0);

  const osgAbove50kgAll = osgPieDataAll.filter(d => d.shortLabel === "≥75%" || d.shortLabel === "50-74%")
    .reduce((s, d) => s + d.value, 0);
  const osgBelow50kgAll = osgPieDataAll.filter(d => d.shortLabel === "25-49%" || d.shortLabel === "<25%" || d.shortLabel === "Просрочено")
    .reduce((s, d) => s + d.value, 0);

  // Stock by product group (stacked by OSG)
  const PRODUCT_CATS = ["Колбасные изделия", "Деликатесы", "Заморозка", "Охл. полуфабрикаты", "Мясной проект"];
  const stockByProduct = useMemo(() => {
    return PRODUCT_CATS.map((cat) => {
      const base = seeded(seed + cat, 8000, 35000);
      const segs = OSG_SEGMENTS.map((seg, i) => {
        const bases = [40, 27, 18, 10, 5];
        const v = Math.round(base * (bases[i] / 100) * (1 + (seeded(seed + cat + seg.label, -5, 5) / 100)));
        return { key: seg.shortLabel, value: v, color: seg.color };
      });
      const row: Record<string, any> = { name: cat };
      segs.forEach(s => { row[s.key] = s.value; });
      return row;
    });
  }, [seed]);

  // Stock by warehouse (total kg)
  const stockByWarehouse = useMemo(() => {
    return activeWarehouses.map(w => {
      const kg = seeded(seed + w.name, 2000, 28000);
      const osgPct = seeded(seed + w.name + "osg", 45, 88);
      return { name: w.name.replace("Склад ", ""), 
        fullName: w.name, 
        kg, osgPct, 
        territory: w.territory 
      };
    }).sort((a, b) => b.kg - a.kg);
  }, [activeWarehouses, seed]);

  // Timeline dates (6 weekly snapshots)
  const TIMELINE_DATES = ["27.02", "05.03", "10.03", "17.03", "24.03", "31.03"];

  // Timeline data per warehouse per date, grouped by territory
  const timelineData = useMemo(() => {
    return activeWarehouses.map(w => {
      const dates = TIMELINE_DATES.map((d, di) => {
        const base = seeded(seed + w.name + d, 800, 9000);
        const batches = seeded(seed + w.name + d + "b", 15, 180);
        const osgPct = Math.min(95, Math.max(5, seeded(seed + w.name + d + "osg", 30, 90) - di * 3));
        return { date: d, kg: base, batches, osgPct };
      });
      return { warehouse: w.name, territory: w.territory, dates };
    });
  }, [activeWarehouses, seed]);

  // Group timeline data by territory
  const timelineByTerritory = useMemo(() => {
    const map: Record<string, typeof timelineData> = {};
    timelineData.forEach(row => {
      if (!map[row.territory]) map[row.territory] = [];
      map[row.territory].push(row);
    });
    return Object.entries(map);
  }, [timelineData]);

  // Returns data
  const returnsData = useMemo(() => {
    return RETURN_CAUSES.map(r => ({
      ...r,
      value: Math.round(r.value * (0.8 + seeded(seed + r.name, 0, 40) / 100)),
    }));
  }, [seed]);

  const returnsDataAll = useMemo(() => 
    RETURN_CAUSES.map(r => ({ 
      ...r,
      value: Math.round(r.value * (0.8 + seeded(seedAll + r.name, 0, 40) / 100)) }))
  , []);

  const writeoffsData = useMemo(() => {
    return WRITEOFF_CAUSES.map(r => ({
      ...r,
      value: Math.round(r.value * (0.8 + seeded(seed + r.name, 0, 40) / 100)),
    }));
  }, [seed]);

  const totalReturns = returnsData.reduce((s, r) => s + r.value, 0);
  const totalReturnsAll = returnsDataAll.reduce((s, r) => s + r.value, 0);

  const totalWriteoffs = writeoffsData.reduce((s, r) => s + r.value, 0);

  const tabStyle = (active: boolean) => ({
    background: active ? "rgba(186,36,71,0.15)" : "transparent",
    color: active ? "#BA2447" : (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"),
    border: `1px solid ${active ? "rgba(186,36,71,0.3)" : "transparent"}`,
  });

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (pct < 5) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 10, fontWeight: 700 }}>
        {pct}%
      </text>
    );
  };

  return (
    <div className="space-y-4">

      {/* ── PAGE HEADER (Delivery-style) ─────────────────────────────────── */}
      <SectionHeader
        title="Остатки ГП и Возвраты"
        description="Мониторинг запасов готовой продукции на складах, структуры ОСГ и показателей возвратов в разрезе территорий. Целевые значения: ОСГ ≥ 50% — не менее 80% остатков, критический порог — менее 25% ОСГ."
        badge="Март 2026"
      />

      {/* KPI cards — 3 blocks (ОСГ объединён в один) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StockKpiCard
          title="Остаток на складах"
          fact={`${(totalKgAll / 1000).toFixed(1)} т`}
          plan={`${totalKgAll.toLocaleString("ru-RU")} кг · ${activeWarehouses.length} складов`}
          bottomInfo={
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(26,141,122,0.14)", color: GREEN, border: "1px solid rgba(26,141,122,0.25)" }}>
              ▲ +3.2%
            </span>
          }
          icon={<Warehouse size={14} />}
          accentColor={GREEN}
        />
        <OsgCombinedCard
          above50Kg={osgAbove50kgAll}
          below50Kg={osgBelow50kgAll}
          totalKg={totalKgAll}
        />
        <StockKpiCard
          title="Возвраты"
          fact={`${(totalReturnsAll / 1000).toFixed(1)} т`}
          plan={`${totalReturns.toLocaleString("ru-RU")} кг`}
          bottomInfo={
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(26,141,122,0.14)", color: GREEN, border: "1px solid rgba(26,141,122,0.25)" }}>
              ▼ −4.3%
            </span>
          }
          icon={<RotateCcw size={14} />}
          accentColor={RED}
        />
      </div>

      {/* ── MAIN CONTENT CARD ─────────────────────────────────────────────── */}
      <GlassCard className="p-5">

        {/* Tab switcher + filters row */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          {/* Tab switcher (top-left) */}
          <div className="flex gap-1 p-1 rounded-xl"
            style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            }}>
            {([["stock", "Остатки"], ["returns", "Возвраты и списания"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={tabStyle(activeTab === key)}>
                {label}
              </button>
            ))}
          </div>

          {/* Shared filters — only territory */}
          <div className="flex gap-2 flex-wrap">
            <Dropdown label="Территория" value={territory as any} options={["Все", ...ТЕРРИТОРИИ] as any} onChange={(v) => setTerritory(v)} isDark={isDark} />
            <Dropdown label="Вид бизнеса" value={business as any} options={["Все", ...ВИДЫ_БИЗНЕСА] as any} onChange={handleBusinessChange as any} isDark={isDark} />
            <Dropdown label="Группа товаров" value={productGroup as any} options={productGroupOptions as any} onChange={setProductGroup as any} isDark={isDark} disabled={business === "Все"} />
          </div>
        </div>

        {/* ── ОСТАТКИ TAB ────────────────────────────────────────────────── */}
        {activeTab === "stock" && (
          <>
            {/* ── 4 мини-KPI внутри блока остатков ──────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <StockMiniKpi
                label="Остаток на складах"
                value={`${(totalKg / 1000).toFixed(1)} т`}
                sub={`${activeWarehouses.length} складов · ${totalBatches.toLocaleString("ru-RU")} партий`}
                color={TEAL_DARK}
                icon={<Warehouse size={15} />}
              />
              <StockMiniKpi
                label="Сумма остатков"
                value={`${(totalRub / 1_000_000).toFixed(1)} млн ₽`}
                sub={`≈ ${Math.round(totalRub / totalKg)} ₽/кг`}
                color={MINT_GREEN}
                icon={<TrendingDown size={15} />}
              />
                {/* 3 — ОСГ по срокам годности (чувствителен к фильтрам) */}
              <OsgCombinedCard
                above50Kg={osgAbove50kg}
                below50Kg={osgBelow50kg}
                totalKg={totalKg}
                showBar={false}
              />
              <StockMiniKpi
                label="Критических (< 25% ОСГ)"

                // value={`${criticalPct.toFixed(1)}%`}
                // sub={`${((totalKg * criticalPct) / 100 / 1000).toFixed(1)} т в зоне риска`}

                value={`${((totalKg * criticalPct) / 100 / 1000).toFixed(1)} т`}
                sub={`${criticalPct.toFixed(0)}% в зоне риска`}


                color={PINK}
                icon={<AlertTriangle size={15} />}
              />
            </div>

            {/* Row 1: Pie + OSG per warehouse mini table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Pie chart: OSG structure */}
              <InnerCard>
                <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>
                  Остатки ГП по ОСГ — {territory === "Все" ? "все территории" : territory}
                </p>
                <div className="flex items-center gap-4">
                  <div style={{ flex: "0 0 200px", height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={osgPieData}
                          cx="50%" cy="50%"
                          innerRadius={52} outerRadius={90}
                          dataKey="value"
                          labelLine={false}
                          label={renderPieLabel}
                          stroke="none"
                        >
                          {osgPieData.map((entry, i) => (
                            <Cell key={`pie-${i}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.[0]) return null;
                            const d = payload[0].payload;
                            return (
                              <div className="rounded-xl p-3 text-xs" style={{
                                background: isDark ? "rgba(15,20,25,0.97)" : "rgba(255,255,255,0.97)",
                                border: `1px solid ${d.color}44`,
                                backdropFilter: "blur(20px)",
                                color: isDark ? "white" : "black",
                              }}>
                                <p className="font-bold mb-1" style={{ color: d.color }}>{d.name}</p>
                                <p>{d.value.toLocaleString("ru-RU")} кг · {d.pct}%</p>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-semibold mb-2" style={{ color: textMuted }}>Структура ОСГ</p>
                    {osgPieData.map((seg, i) => (
                      <div key={`seg-${i}`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                            <span className="text-xs" style={{ color: textSecondary }}>{seg.shortLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: textMuted }}>{(seg.value / 1000).toFixed(1)}т</span>
                            <span className="text-xs font-bold" style={{ color: seg.color }}>{seg.pct}%</span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, background: seg.color, opacity: 0.85 }} />
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${divider}` }}>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: textMuted }}>Итого:</span>
                        <span className="text-xs font-bold" style={{ color: textStrong }}>{(totalKg / 1000).toFixed(1)} т · {(totalRub / 1_000_000).toFixed(1)} млн ₽</span>
                      </div>
                    </div>
                  </div>
                </div>
              </InnerCard>

              {/* OSG per warehouse compact table */}
              <InnerCard>
                <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>ОСГ по складам</p>
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  <table className="w-full" style={{ borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr>
                        <th className="text-left pb-2" style={{ color: textMuted, fontWeight: 600 }}>Склад / Территория</th>
                        <th className="text-right pb-2" style={{ color: textMuted, fontWeight: 600 }}>кг</th>
                        <th className="text-right pb-2" style={{ color: textMuted, fontWeight: 600 }}>Партий</th>
                        {OSG_SEGMENTS.slice(2).map(s => (
                          <th key={s.shortLabel} className="text-right pb-2 pl-2" style={{ color: s.color, fontWeight: 600 }}>{s.shortLabel}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeWarehouses.map((w, idx) => {
                        const kg = seeded(seed + w.name, 2000, 28000);
                        const batches = seeded(seed + w.name + "b", 15, 180);
                        const pct25_49 = seeded(seed + w.name + "25", 8, 22);
                        const pctLt25 = seeded(seed + w.name + "lt25", 3, 15);
                        const pctExp = seeded(seed + w.name + "exp", 0, 6);
                        return (
                          <tr key={w.name} style={{ borderTop: idx > 0 ? `1px solid ${divider}` : undefined }}>
                            <td className="py-1.5 pr-2">
                              <span className="block" style={{ color: textStrong, fontSize: 11 }}>
                                {w.name.replace("Склад ", "").split("(")[0].trim()}
                              </span>
                              <span style={{ color: textMuted, fontSize: 10 }}>{w.territory}</span>
                            </td>
                            <td className="text-right py-1.5" style={{ color: textSecondary }}>{kg.toLocaleString("ru-RU")}</td>
                            <td className="text-right py-1.5" style={{ color: textSecondary }}>{batches}</td>
                            <td className="text-right py-1.5 pl-2">
                              <span className="px-1 py-0.5 rounded text-xs font-bold" style={{ background: pct25_49 > 15 ? "rgba(245,158,11,0.2)" : "transparent", color: YELLOW }}>{pct25_49}%</span>
                            </td>
                            <td className="text-right py-1.5 pl-2">
                              <span className="px-1 py-0.5 rounded text-xs font-bold" style={{ background: pctLt25 > 8 ? "rgba(239,108,0,0.2)" : "transparent", color: ORANGE }}>{pctLt25}%</span>
                            </td>
                            <td className="text-right py-1.5 pl-2">
                              <span className="px-1 py-0.5 rounded text-xs font-bold" style={{ background: pctExp > 2 ? "rgba(186,36,71,0.2)" : "transparent", color: RED }}>{pctExp}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </InnerCard>
            </div>

            {/* Row 2: Stock by product group + by warehouse */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <InnerCard>
                <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>Остатки по группам товаров (кг, ОСГ)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stockByProduct} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                    <XAxis type="number" {...darkChartProps.xAxis} tickFormatter={v => `${(v / 1000).toFixed(0)}т`} />
                    <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={130}
                      tick={{ fontSize: 11, fill: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.6)" }} />
                    <Tooltip content={<StockTooltip />} />
                    <Legend {...darkChartProps.legend} />
                    {OSG_SEGMENTS.map(seg => (
                      <Bar key={seg.shortLabel} dataKey={seg.shortLabel} name={seg.label} stackId="osg"
                        fill={seg.color} radius={seg.shortLabel === "Просрочено" ? [0, 3, 3, 0] : [0, 0, 0, 0]}>
                        {stockByProduct.map((_, index) => (
                          <Cell key={`${seg.shortLabel}-${index}`} fill={seg.color} />
                        ))}
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </InnerCard>

              <InnerCard>
                <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>Остатки по складам (кг)</p>
                <div style={{ height: 220, overflowY: "auto", overflowX: "hidden" }}>
                  <ResponsiveContainer width="100%" height={Math.max(220, stockByWarehouse.length * 36)}>
                    <BarChart data={stockByWarehouse} layout="vertical" margin={{ left: 10, right: 40 }}>
                      <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                      <XAxis type="number" {...darkChartProps.xAxis} tickFormatter={v => `${(v / 1000).toFixed(0)}т`} />
                      <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={130}
                        tick={{ fontSize: 10, fill: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.6)" }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.[0]) return null;
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-xl p-3 text-xs" style={{
                              background: isDark ? "rgba(15,20,25,0.97)" : "rgba(255,255,255,0.97)",
                              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                              backdropFilter: "blur(20px)",
                              color: isDark ? "white" : "black",
                            }}>
                              <p className="font-bold mb-1">{d.fullName}</p>
                              <p style={{ color: "#4F709D" }}>Остаток: {d.kg.toLocaleString("ru-RU")} кг</p>
                              <p style={{ color: osgColor(d.osgPct) }}>Средний ОСГ: {d.osgPct}%</p>
                              <p style={{ color: textMuted }}>Территория: {d.territory}</p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="kg" radius={[0, 4, 4, 0]} fill="#4F709D"
                        label={{ position: "right", fontSize: 10, fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", formatter: (v: number) => `${(v / 1000).toFixed(1)}т` }}>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </InnerCard>
            </div>

            {/* ── AI Analytics Block ─────────────────────────────────────── */}
            <AIAnalyticsBlock isDark={isDark} />

            {/* Row 3: OSG Timeline table — grouped by territory */}
            <InnerCard>
              <p className="text-xs font-semibold mb-1" style={{ color: textSecondary }}>
                Динамика ОСГ по складам — еженедельные срезы (партии / кг / % ОСГ)
              </p>
              <p className="text-xs mb-3" style={{ color: textMuted }}>Сгруппировано по территориям</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11, minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th className="text-left" style={{ color: textMuted, fontWeight: 600, padding: "4px 8px 8px 0", minWidth: 180, borderBottom: `1px solid ${divider}` }}>
                        Территория / Склад
                      </th>
                      {TIMELINE_DATES.map(d => (
                        <th key={d} colSpan={3} className="text-center" style={{ color: textSecondary, fontWeight: 700, padding: "4px 4px 8px", borderBottom: `1px solid ${divider}`, borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
                          {d}.26
                        </th>
                      ))}
                    </tr>
                    <tr>
                      <th style={{ padding: "2px 8px 6px 0", borderBottom: `1px solid ${divider}` }} />
                      {TIMELINE_DATES.map(d => (
                        <React.Fragment key={d}>
                          <th style={{ color: textMuted, fontWeight: 500, padding: "2px 4px 6px", textAlign: "right", borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`, borderBottom: `1px solid ${divider}` }}>Парт.</th>
                          <th style={{ color: textMuted, fontWeight: 500, padding: "2px 4px 6px", textAlign: "right", borderBottom: `1px solid ${divider}` }}>кг</th>
                          <th style={{ color: textMuted, fontWeight: 500, padding: "2px 4px 6px", textAlign: "center", borderBottom: `1px solid ${divider}` }}>ОСГ</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timelineByTerritory.map(([terr, rows]) => (
                      <React.Fragment key={terr}>
                        {/* Territory group header */}
                        <tr>
                          <td colSpan={1 + TIMELINE_DATES.length * 3}
                            style={{
                              padding: "8px 8px 4px 0",
                              background: isDark ? "rgba(26,141,122,0.07)" : "rgba(26,141,122,0.05)",
                            }}>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-4 rounded-full" style={{ background: GREEN, opacity: 0.7 }} />
                              <span style={{ color: GREEN, fontWeight: 700, fontSize: 11, letterSpacing: "0.03em" }}>
                                {terr}
                              </span>
                              <span style={{ color: textMuted, fontSize: 10 }}>
                                · {rows.length} {rows.length === 1 ? "склад" : rows.length < 5 ? "склада" : "складов"}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {rows.map((row, ri) => (
                          <tr key={row.warehouse} style={{ borderTop: `1px solid ${divider}` }}>
                            <td style={{ padding: "5px 8px 5px 12px", minWidth: 180 }}>
                              <span style={{ display: "block", color: textStrong, fontSize: 11 }}>
                                {row.warehouse.replace("Склад ", "").split("(")[0].trim()}
                              </span>
                              <span style={{ color: textMuted, fontSize: 10 }}>
                                {row.warehouse.includes("(") ? "(" + row.warehouse.split("(")[1] : ""}
                              </span>
                            </td>
                            {row.dates.map((d, di) => {
                              const color = osgColor(d.osgPct);
                              const bgOpacity = d.osgPct < 25 ? 0.18 : d.osgPct < 50 ? 0.1 : 0;
                              return (
                                <React.Fragment key={di}>
                                  <td style={{ padding: "5px 4px", textAlign: "right", color: textSecondary, borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
                                    {d.batches}
                                  </td>
                                  <td style={{ padding: "5px 4px", textAlign: "right", color: textSecondary }}>
                                    {d.kg.toLocaleString("ru-RU")}
                                  </td>
                                  <td style={{ padding: "5px 4px", textAlign: "center" }}>
                                    <span style={{
                                      display: "inline-block",
                                      padding: "1px 6px",
                                      borderRadius: 4,
                                      background: `${color}${Math.round(bgOpacity * 255).toString(16).padStart(2, "0")}`,
                                      color: color,
                                      fontWeight: 700,
                                      fontSize: 11,
                                      border: d.osgPct < 25 ? `1px solid ${color}44` : undefined,
                                    }}>
                                      {d.osgPct}%
                                    </span>
                                  </td>
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* OSG legend */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-xs" style={{ color: textMuted }}>ОСГ:</span>
                {OSG_SEGMENTS.map(s => (
                  <div key={s.label} className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                    <span className="text-xs" style={{ color: textMuted }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </InnerCard>
          </>
        )}

        {/* ── ВОЗВРАТЫ TAB ───────────────────────────────────────────────── */}
        {activeTab === "returns" && (
          <>
            {/* Summary KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <StockKpiCard
                title="Возвраты (кг)"
                fact={totalReturns.toLocaleString("ru-RU")}
                plan={`${((totalReturns / totalKg) * 100).toFixed(1)}% от остатков`}
                bottomInfo={
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>
                    ▼ −4.3%
                  </span>
                }
                icon={<RotateCcw size={14} />}
              />
              <StockKpiCard
                title="Возвраты (₽)"
                fact={`${(totalReturns * 0.22 / 1000).toFixed(0)} тыс. ₽`}
                plan="оценочная стоимость"
                bottomInfo={
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(186,36,71,0.12)", color: RED, border: "1px solid rgba(186,36,71,0.2)" }}>
                    <TrendingDown size={10} style={{ display: "inline" }} />
                  </span>
                }
                icon={<TrendingDown size={14} />}
              />
              <StockKpiCard
                title="Списания (кг)"
                fact={totalWriteoffs.toLocaleString("ru-RU")}
                plan={`${((totalWriteoffs / totalKg) * 100).toFixed(1)}% от остатков`}
                bottomInfo={
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(186,36,71,0.12)", color: RED, border: "1px solid rgba(186,36,71,0.2)" }}>
                    ▲ +1.2%
                  </span>
                }
                icon={<AlertTriangle size={14} />}
              />
              <StockKpiCard
                title="Списания (₽)"
                fact={`${(totalWriteoffs * 0.22 / 1000).toFixed(0)} тыс. ₽`}
                plan="оценочная стоимость"
                bottomInfo={
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(186,36,71,0.12)", color: RED, border: "1px solid rgba(186,36,71,0.2)" }}>
                    —
                  </span>
                }
                icon={<AlertTriangle size={14} />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Returns by cause */}
              <InnerCard>
                <button className="flex items-center justify-between w-full mb-3"
                  onClick={() => setReturnsCollapsed(c => !c)}>
                  <p className="text-xs font-semibold" style={{ color: textSecondary }}>Возвраты по причинам (кг)</p>
                  {returnsCollapsed
                    ? <ChevronDown size={14} style={{ color: textMuted }} />
                    : <ChevronUp size={14} style={{ color: textMuted }} />}
                </button>
                {!returnsCollapsed && (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={returnsData} layout="vertical" margin={{ left: 10, right: 36 }}>
                        <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                        <XAxis type="number" {...darkChartProps.xAxis} />
                        <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={155}
                          tick={{ fontSize: 11, fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.55)" }} />
                        <Tooltip content={<StockTooltip />} />
                        <Bar dataKey="value" name="кг" radius={[0, 4, 4, 0]}
                          label={{ position: "right", fontSize: 10, fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", formatter: (v: number) => v.toLocaleString("ru-RU") }}>
                          {returnsData.map((entry, idx) => (
                            <Cell key={`ret-${idx}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <table className="w-full mt-3" style={{ borderCollapse: "collapse", fontSize: 11 }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${divider}` }}>
                          <th className="text-left pb-1.5" style={{ color: textMuted, fontWeight: 600 }}>Причина</th>
                          <th className="text-right pb-1.5" style={{ color: textMuted, fontWeight: 600 }}>кг</th>
                          <th className="text-right pb-1.5" style={{ color: textMuted, fontWeight: 600 }}>Доля</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnsData.map((r, i) => (
                          <tr key={`ret-row-${i}`} style={{ borderTop: `1px solid ${divider}` }}>
                            <td className="py-1.5" style={{ color: textStrong }}>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: r.color }} />
                                {r.name}
                              </div>
                            </td>
                            <td className="text-right py-1.5" style={{ color: textSecondary }}>{r.value.toLocaleString("ru-RU")}</td>
                            <td className="text-right py-1.5">
                              <span className="font-bold" style={{ color: r.color }}>
                                {((r.value / totalReturns) * 100).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                          <td className="py-1.5 font-semibold" style={{ color: textStrong }}>Итого</td>
                          <td className="text-right py-1.5 font-bold" style={{ color: textStrong }}>{totalReturns.toLocaleString("ru-RU")}</td>
                          <td className="text-right py-1.5 font-bold" style={{ color: textSecondary }}>100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
              </InnerCard>

              {/* Writeoffs by cause */}
              <InnerCard>
                <button className="flex items-center justify-between w-full mb-3"
                  onClick={() => setWriteoffsCollapsed(c => !c)}>
                  <p className="text-xs font-semibold" style={{ color: textSecondary }}>Списания по причинам (кг)</p>
                  {writeoffsCollapsed
                    ? <ChevronDown size={14} style={{ color: textMuted }} />
                    : <ChevronUp size={14} style={{ color: textMuted }} />}
                </button>
                {!writeoffsCollapsed && (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={writeoffsData} layout="vertical" margin={{ left: 10, right: 36 }}>
                        <CartesianGrid {...darkChartProps.cartesianGrid} horizontal={false} />
                        <XAxis type="number" {...darkChartProps.xAxis} />
                        <YAxis dataKey="name" type="category" {...darkChartProps.yAxis} width={155}
                          tick={{ fontSize: 11, fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.55)" }} />
                        <Tooltip content={<StockTooltip />} />
                        <Bar dataKey="value" name="кг" radius={[0, 4, 4, 0]}
                          label={{ position: "right", fontSize: 10, fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", formatter: (v: number) => v.toLocaleString("ru-RU") }}>
                          {writeoffsData.map((entry, idx) => (
                            <Cell key={`wrt-${idx}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <table className="w-full mt-3" style={{ borderCollapse: "collapse", fontSize: 11 }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${divider}` }}>
                          <th className="text-left pb-1.5" style={{ color: textMuted, fontWeight: 600 }}>Причина</th>
                          <th className="text-right pb-1.5" style={{ color: textMuted, fontWeight: 600 }}>кг</th>
                          <th className="text-right pb-1.5" style={{ color: textMuted, fontWeight: 600 }}>Доля</th>
                        </tr>
                      </thead>
                      <tbody>
                        {writeoffsData.map((r, i) => (
                          <tr key={`wrt-row-${i}`} style={{ borderTop: `1px solid ${divider}` }}>
                            <td className="py-1.5" style={{ color: textStrong }}>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: r.color }} />
                                {r.name}
                              </div>
                            </td>
                            <td className="text-right py-1.5" style={{ color: textSecondary }}>{r.value.toLocaleString("ru-RU")}</td>
                            <td className="text-right py-1.5">
                              <span className="font-bold" style={{ color: r.color }}>
                                {((r.value / totalWriteoffs) * 100).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                          <td className="py-1.5 font-semibold" style={{ color: textStrong }}>Итого</td>
                          <td className="text-right py-1.5 font-bold" style={{ color: textStrong }}>{totalWriteoffs.toLocaleString("ru-RU")}</td>
                          <td className="text-right py-1.5 font-bold" style={{ color: textSecondary }}>100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
              </InnerCard>
            </div>

            {/* Dynamic by month */}
            <InnerCard className="mt-4">
              <p className="text-xs font-semibold mb-3" style={{ color: textSecondary }}>Динамика возвратов и списаний по месяцам (кг)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"].map((m, i) => ({
                  month: m,
                  "Возвраты": Math.round((seeded(seed + m + "ret" + i, 900, 1800))),
                  "Списания": Math.round((seeded(seed + m + "wrt" + i, 400, 900))),
                }))} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid {...darkChartProps.cartesianGrid} />
                  <XAxis dataKey="month" {...darkChartProps.xAxis} />
                  <YAxis {...darkChartProps.yAxis} />
                  <Tooltip content={<StockTooltip />} />
                  <Legend {...darkChartProps.legend} />
                  <Bar dataKey="Возвраты" fill={RED} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Списания" fill={ORANGE} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </InnerCard>

            {/* AI Analytics for returns */}
            <AIAnalyticsBlock isDark={isDark} />
          </>
        )}
      </GlassCard>
    </div>
  );
}