import React, { useState } from "react";
import { GlassCard, SectionHeader } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import { Bot, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

// ── Palette ────────────────────────────────────────────────────────────────────
const GREEN = "#1A8D7A";
const RED = "#ba2447";

// ── Data (из ExecutiveDashboard) ───────────────────────────────────────────────
interface DashboardData {
  cumRevenue: number; cumRevenueBase: number;
  cumVolume: number; cumVolumeBase: number;
  cumAvgCheck: number; cumAvgCheckBase: number;
  cumMarginRub: number; cumMarginRubBase: number;
  cumMarginPct: number; cumMarginPctBase: number;
  cumChecks: number; cumChecksBase: number;
  cumPositions: number; cumPositionsBase: number;
  cumPrice: number; cumPriceBase: number;
  cumMarjaTT: number; cumMarjaTTBase: number;
  d2dRevenue: number; d2dRevenueBase: number;
  d2dVolume: number; d2dVolumeBase: number;
  d2dAvgCheck: number; d2dAvgCheckBase: number;
  d2dMarginRub: number; d2dMarginRubBase: number;
  d2dMarginPct: number; d2dMarginPctBase: number;
  d2dChecks: number; d2dChecksBase: number;
  d2dPositions: number; d2dPositionsBase: number;
  d2dPrice: number; d2dPriceBase: number;
  d2dMarjaTT: number; d2dMarjaTTBase: number;
}

const data: DashboardData = {
  cumRevenue: 12500000, cumRevenueBase: 11200000,
  cumVolume: 45000, cumVolumeBase: 42000,
  cumAvgCheck: 2150, cumAvgCheckBase: 2050,
  cumMarginRub: 3750000, cumMarginRubBase: 3360000,
  cumMarginPct: 30.5, cumMarginPctBase: 28.8,
  cumChecks: 5814, cumChecksBase: 5463,
  cumPositions: 4.5, cumPositionsBase: 4.2,
  cumPrice: 285.50, cumPriceBase: 275.20,
  cumMarjaTT: 125000, cumMarjaTTBase: 118000,
  d2dRevenue: 2100000, d2dRevenueBase: 1950000,
  d2dVolume: 7500, d2dVolumeBase: 7200,
  d2dAvgCheck: 2200, d2dAvgCheckBase: 2100,
  d2dMarginRub: 630000, d2dMarginRubBase: 585000,
  d2dMarginPct: 30.8, d2dMarginPctBase: 29.5,
  d2dChecks: 955, d2dChecksBase: 929,
  d2dPositions: 4.8, d2dPositionsBase: 4.5,
  d2dPrice: 290.00, d2dPriceBase: 280.00,
  d2dMarjaTT: 21000, d2dMarjaTTBase: 19500,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatNumber = (num: number) => Math.round(num).toLocaleString("ru-RU");
const formatCurrency = (num: number) => formatNumber(num);
const formatKg = (num: number) => formatNumber(num);
const formatPct = (num: number) => num.toFixed(2);

// ── KPI Card ───────────────────────────────────────────────────────────────────
interface KPICardProps {
  title: string;
  current: number;
  previous: number;
  formatValue: (val: number) => string;
  isDark: boolean;
  isPct?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, current, previous, formatValue, isDark, isPct }) => {
  const change = isPct ? (current - previous) : ((current - previous) / previous * 100);
  const isPositive = change > 0;
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <p className=" text-xs font-semibold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{title}</p>
        <div
          className="px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{
            background: isPositive ? "rgba(26,141,122,0.15)" : "rgba(186,36,71,0.15)",
            border: `1px solid ${isPositive ? "rgba(26,141,122,0.3)" : "rgba(186,36,71,0.3)"}`,
          }}
        >
          {isPositive
            ? <TrendingUp size={10} color="#1A8D7A" />
            : <TrendingDown size={10} color="#BA2447" />
          }
          <span className="text-xs font-bold" style={{ color: isPositive ? "#1A8D7A" : "#BA2447" }}>
            {isPositive ? "+" : ""}{change.toFixed(1)}%
          </span>
        </div>
      </div>
      <p className="text-xl font-bold mb-1" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
        {formatValue(current)}
      </p>
      <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
        {formatValue(previous)}
      </p>
    </div>
  );
};

// ── Secondary metrics table ────────────────────────────────────────────────────
function MetricsTable({ isDark, mode }: { isDark: boolean; mode: "week" | "day" }) {
  const rows = [
    {
      label: "Ср. чек, ₽",
      current: mode === "week" ? data.cumAvgCheck : data.d2dAvgCheck,
      base: mode === "week" ? data.cumAvgCheckBase : data.d2dAvgCheckBase,
      fmt: (v: number) => `${formatNumber(v)} ₽`,
    },
    {
      label: "Поз. в чеке",
      current: mode === "week" ? data.cumPositions : data.d2dPositions,
      base: mode === "week" ? data.cumPositionsBase : data.d2dPositionsBase,
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Ср. цена, ₽",
      current: mode === "week" ? data.cumPrice : data.d2dPrice,
      base: mode === "week" ? data.cumPriceBase : data.d2dPriceBase,
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Маржа ТТ, ₽",
      current: mode === "week" ? data.cumMarjaTT : data.d2dMarjaTT,
      base: mode === "week" ? data.cumMarjaTTBase : data.d2dMarjaTTBase,
      fmt: formatNumber,
    },
  ];

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      }}
    >
      {/* Одна строка: заголовок блока + колонки Текущий/База */}
      <div
        className="flex items-center justify-between mb-3 pb-2"
        style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}
      >
        <span className="text-xs font-bold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
          Дополнительные показатели
        </span>
        <div className="flex items-center gap-12">
          <span className="text-xs font-semibold" style={{ color: GREEN, width: 80, textAlign: "center" }}>
            Текущий
          </span>
          <span className="text-xs font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", width: 80, textAlign: "center" }}>
            База
          </span>
        </div>
      </div>

      {/* Строки данных */}
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
              {row.label}
            </span>
            <div className="flex items-center gap-12">
              <span className="text-sm font-bold" style={{ color: GREEN, width: 80, textAlign: "center" }}>
                {row.fmt(row.current)}
              </span>
              <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", width: 80, textAlign: "center" }}>
                {row.fmt(row.base)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bar comparison ─────────────────────────────────────────────────────────────
function BarComparison({ isDark, mode }: { isDark: boolean; mode: "week" | "day" }) {
  const revenue  = mode === "week" ? data.cumRevenue     : data.d2dRevenue;
  const revenueB = mode === "week" ? data.cumRevenueBase : data.d2dRevenueBase;
  const volume   = mode === "week" ? data.cumVolume      : data.d2dVolume;
  const volumeB  = mode === "week" ? data.cumVolumeBase  : data.d2dVolumeBase;
  const maxRev   = Math.max(revenue, revenueB);
  const maxVol   = Math.max(volume, volumeB);
  const rowStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      }}
    >
      <h4 className="text-sm font-bold mb-4" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
        Выручка и объём — визуальное сравнение
      </h4>
      <div className="grid grid-cols-2 gap-6">
        {/* Выручка */}
        <div className="space-y-2">
          <p className="text-xs mb-2 font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Выручка, ₽</p>
          <div className="h-8 rounded-lg overflow-hidden" style={rowStyle}>
            <div className="h-full flex items-center justify-center rounded-lg"
              style={{ width: `${Math.min(revenue / maxRev * 100, 100)}%`, background: "linear-gradient(90deg, #BA2447, #D63161)" }}>
              <span className="text-xs font-semibold text-white">{(revenue / 1000000).toFixed(2)} млн</span>
            </div>
          </div>
          <div className="h-8 rounded-lg overflow-hidden" style={rowStyle}>
            <div className="h-full flex items-center justify-center rounded-lg"
              style={{ width: `${Math.min(revenueB / maxRev * 100, 100)}%`, background: "linear-gradient(90deg, #D63161, #E85882)" }}>
              <span className="text-xs font-semibold text-white">{(revenueB / 1000000).toFixed(2)} млн</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Текущий</span>
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>База</span>
          </div>
        </div>
        {/* Объём */}
        <div className="space-y-2">
          <p className="text-xs mb-2 font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Объём, кг</p>
          <div className="h-8 rounded-lg overflow-hidden" style={rowStyle}>
            <div className="h-full flex items-center justify-center rounded-lg"
              style={{ width: `${Math.min(volume / maxVol * 100, 100)}%`, background: "linear-gradient(90deg, #1A8D7A, #22A896)" }}>
              <span className="text-xs font-semibold text-white">{(volume / 1000).toFixed(1)} т</span>
            </div>
          </div>
          <div className="h-8 rounded-lg overflow-hidden" style={rowStyle}>
            <div className="h-full flex items-center justify-center rounded-lg"
              style={{ width: `${Math.min(volumeB / maxVol * 100, 100)}%`, background: "linear-gradient(90deg, #22A896, #35C4AF)" }}>
              <span className="text-xs font-semibold text-white">{(volumeB / 1000).toFixed(1)} т</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Текущий</span>
            <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>База</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Insights ───────────────────────────────────────────────────────────────────
function InsightsBlock({ isDark, mode }: { isDark: boolean; mode: "week" | "day" }) {
  const isWeek = mode === "week";
  const bgColor = isWeek ? "rgba(186,36,71,0.08)" : "rgba(26,141,122,0.08)";
  const borderColor = isWeek ? "rgba(186,36,71,0.2)" : "rgba(26,141,122,0.2)";

  const insights = isWeek ? [
    { label: "Выручка",      change: ((data.cumRevenue    - data.cumRevenueBase)    / data.cumRevenueBase    * 100).toFixed(1), diff: Math.abs(data.cumRevenue    - data.cumRevenueBase),    isPositive: data.cumRevenue    > data.cumRevenueBase,    unit: "₽",   isPct: false },
    { label: "Объём",        change: ((data.cumVolume     - data.cumVolumeBase)     / data.cumVolumeBase     * 100).toFixed(1), diff: Math.abs(data.cumVolume     - data.cumVolumeBase),     isPositive: data.cumVolume     > data.cumVolumeBase,     unit: "кг",  isPct: false },
    { label: "Маржа, ₽",    change: ((data.cumMarginRub  - data.cumMarginRubBase)  / data.cumMarginRubBase  * 100).toFixed(1), diff: Math.abs(data.cumMarginRub  - data.cumMarginRubBase),  isPositive: data.cumMarginRub  > data.cumMarginRubBase,  unit: "₽",   isPct: false },
    { label: "Ср. чек",     change: ((data.cumAvgCheck   - data.cumAvgCheckBase)   / data.cumAvgCheckBase   * 100).toFixed(1), diff: Math.abs(data.cumAvgCheck   - data.cumAvgCheckBase),   isPositive: data.cumAvgCheck   > data.cumAvgCheckBase,   unit: "₽",   isPct: false },
    { label: "Кол-во чеков",change: ((data.cumChecks     - data.cumChecksBase)     / data.cumChecksBase     * 100).toFixed(1), diff: Math.abs(data.cumChecks     - data.cumChecksBase),     isPositive: data.cumChecks     > data.cumChecksBase,     unit: "шт.", isPct: false },
    { label: "Маржа, %",    change: (data.cumMarginPct   - data.cumMarginPctBase).toFixed(1),                                  diff: Math.abs(data.cumMarginPct  - data.cumMarginPctBase),  isPositive: data.cumMarginPct  > data.cumMarginPctBase,  unit: "п.п.",isPct: true  },
  ] : [
    { label: "Выручка",      change: ((data.d2dRevenue    - data.d2dRevenueBase)    / data.d2dRevenueBase    * 100).toFixed(1), diff: Math.abs(data.d2dRevenue    - data.d2dRevenueBase),    isPositive: data.d2dRevenue    > data.d2dRevenueBase,    unit: "₽",   isPct: false },
    { label: "Объём",        change: ((data.d2dVolume     - data.d2dVolumeBase)     / data.d2dVolumeBase     * 100).toFixed(1), diff: Math.abs(data.d2dVolume     - data.d2dVolumeBase),     isPositive: data.d2dVolume     > data.d2dVolumeBase,     unit: "кг",  isPct: false },
    { label: "Маржа, ₽",    change: ((data.d2dMarginRub  - data.d2dMarginRubBase)  / data.d2dMarginRubBase  * 100).toFixed(1), diff: Math.abs(data.d2dMarginRub  - data.d2dMarginRubBase),  isPositive: data.d2dMarginRub  > data.d2dMarginRubBase,  unit: "₽",   isPct: false },
    { label: "Ср. чек",     change: ((data.d2dAvgCheck   - data.d2dAvgCheckBase)   / data.d2dAvgCheckBase   * 100).toFixed(1), diff: Math.abs(data.d2dAvgCheck   - data.d2dAvgCheckBase),   isPositive: data.d2dAvgCheck   > data.d2dAvgCheckBase,   unit: "₽",   isPct: false },
    { label: "Кол-во чеков",change: ((data.d2dChecks     - data.d2dChecksBase)     / data.d2dChecksBase     * 100).toFixed(1), diff: Math.abs(data.d2dChecks     - data.d2dChecksBase),     isPositive: data.d2dChecks     > data.d2dChecksBase,     unit: "шт.", isPct: false },
    { label: "Маржа, %",    change: (data.d2dMarginPct   - data.d2dMarginPctBase).toFixed(1),                                  diff: Math.abs(data.d2dMarginPct  - data.d2dMarginPctBase),  isPositive: data.d2dMarginPct  > data.d2dMarginPctBase,  unit: "п.п.",isPct: true  },
  ];

  return (
    <div className="mt-6 p-4 rounded-xl" style={{ background: bgColor, border: `1px solid ${borderColor}` }}>
      <h4 className="text-sm font-bold mb-3" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
        {isWeek ? "Выводы: неделя vs прошлая неделя" : "Выводы: день vs тот же день прошлой недели"}
      </h4>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: insight.isPositive ? GREEN : RED }} />
            <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
              <strong>{insight.label}:</strong>{" "}
              {insight.isPositive ? "рост" : "снижение"} на{" "}
              <span style={{ color: insight.isPositive ? GREEN : RED, fontWeight: "bold" }}>
                {Math.abs(parseFloat(insight.change))}{insight.isPct ? "" : "%"}
              </span>{" "}
              ({insight.isPct ? insight.diff.toFixed(1) : formatNumber(insight.diff)} {insight.unit})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI block ───────────────────────────────────────────────────────────────────
function AIAnalyticsBlock({ isDark }: { isDark: boolean }) {
  return (
    <GlassCard
      className="p-4 my-4"
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
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-2.5 rounded-full"
                style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", width: i === 2 ? "55%" : "100%" }} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}>
              Текст ИИ-аналитика будет отображён здесь
            </p>
            <a href="#"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ml-4"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", textDecoration: "none" }}>
              <ExternalLink size={12} />Power BI
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function Frs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"Неделя" | "День">("Неделя");
  const isWeek = activeTab === "Неделя";
  const mode: "week" | "day" = isWeek ? "week" : "day";

  const sectionStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
    borderRadius: 16,
    padding: 20,
  };

  return (
    <div>
      {/* Header */}
      <SectionHeader
        title="Фирменная розничная сеть"
        description="Фирменная розничная сеть — оперативный мониторинг выручки, объёма, маржинальности и ключевых показателей эффективности магазинов"
        badge="Март 2026"
      />

      {/* Tab switcher */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit mb-3"
        style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        }}
      >
        {(["Неделя", "День"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={
              activeTab === tab
                ? { background: "rgba(186,36,71,0.15)", color: "#e57373", border: "1px solid rgba(186,36,71,0.25)" }
                : { color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", border: "1px solid transparent" }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main block */}
      <div style={sectionStyle}>
        {/* Section title */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-1" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            {isWeek ? "Накопленные итоги" : "День ко дню"}
          </h3>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            {isWeek
              ? "С понедельника по последний день (текущая неделя vs прошлая неделя)"
              : "Вчера vs тот же день недели на прошлой неделе"}
          </p>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-6 gap-3">
          <KPICard title="Выручка, ₽"   current={isWeek ? data.cumRevenue   : data.d2dRevenue}   previous={isWeek ? data.cumRevenueBase   : data.d2dRevenueBase}   formatValue={formatCurrency} isDark={isDark} />
          <KPICard title="Объём, кг"    current={isWeek ? data.cumVolume    : data.d2dVolume}    previous={isWeek ? data.cumVolumeBase    : data.d2dVolumeBase}    formatValue={formatKg}       isDark={isDark} />
          <KPICard title="Маржа, ₽"     current={isWeek ? data.cumMarginRub : data.d2dMarginRub} previous={isWeek ? data.cumMarginRubBase : data.d2dMarginRubBase} formatValue={formatCurrency} isDark={isDark} />
          <KPICard title="Ср. чек, ₽"   current={isWeek ? data.cumAvgCheck  : data.d2dAvgCheck}  previous={isWeek ? data.cumAvgCheckBase  : data.d2dAvgCheckBase}  formatValue={formatCurrency} isDark={isDark} />
          <KPICard title="Маржа, %"     current={isWeek ? data.cumMarginPct : data.d2dMarginPct} previous={isWeek ? data.cumMarginPctBase : data.d2dMarginPctBase} formatValue={formatPct}      isDark={isDark} isPct />
          <KPICard title="Кол-во чеков" current={isWeek ? data.cumChecks    : data.d2dChecks}    previous={isWeek ? data.cumChecksBase    : data.d2dChecksBase}    formatValue={formatNumber}   isDark={isDark} />
        </div>

        {/* Secondary metrics + Bar comparison — в один ряд */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetricsTable isDark={isDark} mode={mode} />
            <BarComparison isDark={isDark} mode={mode} />
          </div>

        {/* Insights */}
        <InsightsBlock isDark={isDark} mode={mode} />
      </div>

      {/* AI block */}
      <AIAnalyticsBlock isDark={isDark} />
    </div>
  );
}