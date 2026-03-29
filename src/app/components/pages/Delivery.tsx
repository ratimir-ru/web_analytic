import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";
import { SectionHeader, StatCard, GlassCard, ChartTitle, darkChartProps, CustomChartTooltip } from "../StatCard";
import { Gauge } from "../Gauge";
import { useTheme } from "../ThemeProvider";
import {
  ВИДЫ_БИЗНЕСА,
  ГРУППЫ_ПОДРАЗДЕЛЕНИЙ,
  divisionGroupToDivisions,
} from "../filtersData";
import { Truck, Package, Star, Bot, ExternalLink } from "lucide-react";

// ── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#10b981";
const YELLOW = "#f59e0b";
const RED = "#ef4444";

// ── Seed-based mock ──────────────────────────────────────────────────────────
function seededValue(seed: string, base: number, range: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return base + (Math.abs(h) % range);
}

function seededValues(seed: string, base: number, range: number, count: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    result.push(seededValue(seed + i, base, range));
  }
  return result;
}

// ── Static data ──────────────────────────────────────────────────────────────
const utilWeekdayBase = [
  { day: "Пн", values: [92, 88, 84, 78] },
  { day: "Вт", values: [90, 91, 85, 80] },
  { day: "Ср", values: [94, 87, 82, 76] },
  { day: "Чт", values: [91, 90, 86, 79] },
  { day: "Пт", values: [96, 93, 88, 83] },
  { day: "Сб", values: [85, 82, 79, 71] },
  { day: "Вс", values: [62, 58, 55, 48] },
];

const serviceWeekdayBase = [
  { day: "Пн", OTIF: 95.2, "Доставка в срок": 96.1, "Полнота заказа": 98.2 },
  { day: "Вт", OTIF: 94.8, "Доставка в срок": 95.8, "Полнота заказа": 97.9 },
  { day: "Ср", OTIF: 95.5, "Доставка в срок": 96.4, "Полнота заказа": 98.5 },
  { day: "Чт", OTIF: 94.1, "Доставка в срок": 95.2, "Полнота заказа": 97.6 },
  { day: "Пт", OTIF: 93.8, "Доставка в срок": 94.9, "Полнота заказа": 97.2 },
  { day: "Сб", OTIF: 92.4, "Доставка в срок": 93.5, "Полнота заказа": 96.8 },
  { day: "Вс", OTIF: 90.1, "Доставка в срок": 91.2, "Полнота заказа": 95.4 },
];

const tabKeys = ["utilization", "service", "powerbi"] as const;
const tabLabels = ["Утилизация ТС", "Уровень сервиса", "Power BI"];

// ── Components ────────────────────────────────────────────────────────────────
function AIPlaceholder({ lines = 3, linkLabel, isDark }: { lines?: number; linkLabel?: string; isDark: boolean }) {
  return (
    <div className="rounded-2xl p-4 flex gap-3" style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)" }}>
      <Bot size={16} style={{ color: "#60a5fa", flexShrink: 0, marginTop: 2 }} />
      <div className="flex-1">
        <p className="text-xs font-semibold mb-2" style={{ color: "#93c5fd" }}>ИИ-аналитик</p>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-2.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", width: i === lines - 1 ? "55%" : "100%" }} />
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

function Dropdown<T extends string>({ label, value, options, onChange, isDark }: {
  label: string; value: T; options: readonly T[]; onChange: (v: T) => void; isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
  const labelColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const bgColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 pl-3 pr-2.5 pt-4 pb-1.5 rounded-lg text-xs font-semibold transition-all relative"
        style={{
          background: bgColor,
          border: `1.5px solid ${borderColor}`,
          color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
          minWidth: 120,
        }}
      >
        <span
          className="absolute left-2.5 -top-2 px-1 text-[10px] font-medium"
          style={{
            color: labelColor,
            background: isDark ? "#0d1117" : "#ffffff",
            lineHeight: "1",
          }}
        >
          {label}
        </span>
        <span className="flex-1 text-left">{value}</span>
        <span style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>▾</span>
      </button>
      {open && (
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
                color: opt === value ? "#e57373" : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
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

function BarRows({ items, colorFn, isDark }: {
  items: { name: string; value: number }[];
  colorFn: (v: number) => string;
  isDark: boolean;
}) {
  const textMedium = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)";
  const textStrong = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const barBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: textMedium }}>{item.name}</span>
            <span className="text-xs font-bold" style={{ color: textStrong }}>{item.value}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: barBg }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${item.value}%`, background: colorFn(item.value), boxShadow: `0 0 8px ${colorFn(item.value)}60` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function Delivery() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<typeof tabKeys[number]>("utilization");
  const [группаПодразделений, setГруппаПодразделений] = useState<string>(ГРУППЫ_ПОДРАЗДЕЛЕНИЙ[0]);
  const [видБизнеса, setВидБизнеса] = useState<string>(ВИДЫ_БИЗНЕСА[0]);

  const utilColor = (v: number) => v >= 85 ? GREEN : v >= 70 ? YELLOW : RED;
  const servColor = (v: number) => v >= 95 ? GREEN : v >= 90 ? YELLOW : RED;

  const textPrimary = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)";
  const textSecondary = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const cardBg = isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const innerCardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const innerCardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const filterSeed = группаПодразделений + видБизнеса;

  // Get divisions for selected group
  const divisions = useMemo(() => {
    return divisionGroupToDivisions[группаПодразделений] || [];
  }, [группаПодразделений]);

  // Territory utilization data — varies by filter
  const territoriesUtil = useMemo(() => {
    const base = [91, 88, 84, 79, 76, 72, 68];
    const names = ["Владивосток", "Хабаровск", "Находка", "Комсомольск", "Спасск", "Благовещенск", "Кавалерово"];
    const offsets = seededValues(filterSeed + "terr", -5, 10, names.length);
    return names.map((n, i) => ({
      name: n,
      utilization: Math.min(99, Math.max(50, base[i] + offsets[i] - 5)),
    }));
  }, [filterSeed]);

  // Subdivisions utilization — use divisions from filter
  const subdivisionsUtil = useMemo(() => {
    if (divisions.length === 0) return [];
    const vals = seededValues(filterSeed + "subdiv", 65, 30, divisions.length);
    return divisions.map((d, i) => ({
      name: d,
      utilization: Math.min(98, vals[i]),
    }));
  }, [divisions, filterSeed]);

  // Weekday utilization data — slightly varied
  const utilWeekday = useMemo(() => {
    const offset = seededValue(filterSeed + "weekutil", -3, 6) - 3;
    const topDivs = divisions.slice(0, 4);
    if (topDivs.length === 0) return utilWeekdayBase.map(d => ({ day: d.day, "Линия 1": d.values[0] + offset, "Линия 2": d.values[1] + offset, "Линия 3": d.values[2] + offset }));
    const result = utilWeekdayBase.map(d => {
      const row: Record<string, any> = { day: d.day };
      topDivs.forEach((div, i) => {
        row[div] = Math.min(99, Math.max(40, (d.values[i % 4] || 70) + offset));
      });
      return row;
    });
    return result;
  }, [divisions, filterSeed]);

  const weekdayLineKeys = useMemo(() => {
    const topDivs = divisions.slice(0, 4);
    if (topDivs.length === 0) return ["Линия 1", "Линия 2", "Линия 3"];
    return topDivs;
  }, [divisions]);

  const lineColors = ["#3b82f6", GREEN, YELLOW, RED];

  // Gauge overall value
  const overallUtil = useMemo(() => seededValue(filterSeed + "gauge", 82, 14), [filterSeed]);
  const overallService = useMemo(() => seededValue(filterSeed + "serv", 90, 8), [filterSeed]);

  // Service data — product groups
  const productGroupsService = useMemo(() => {
    const groups = [
      { name: "Колбасы", base: 95.2 },
      { name: "Заморозка", base: 97.4 },
      { name: "Охл. ПФ", base: 91.8 },
      { name: "Мясной", base: 88.3 },
    ];
    const offset = (seededValue(filterSeed + "pgserv", 0, 6) - 3) * 0.5;
    return groups.map(g => ({
      name: g.name,
      service: Math.min(99.9, Math.max(80, +(g.base + offset).toFixed(1))),
    }));
  }, [filterSeed]);

  // Service data — subdivisions
  const subdivisionsService = useMemo(() => {
    if (divisions.length === 0) return [];
    const vals = seededValues(filterSeed + "subdivserv", 88, 10, divisions.length);
    return divisions.map((d, i) => ({
      name: d,
      service: Math.min(99.5, +(vals[i] * 0.1 + 88).toFixed(1)),
    }));
  }, [divisions, filterSeed]);

  // Service weekday data — slightly varied
  const serviceWeekday = useMemo(() => {
    const offset = (seededValue(filterSeed + "weekserv", 0, 4) - 2) * 0.3;
    return serviceWeekdayBase.map(d => ({
      day: d.day,
      OTIF: +(d.OTIF + offset).toFixed(1),
      "Доставка в срок": +(d["Доставка в срок"] + offset).toFixed(1),
      "Полнота заказа": +(d["Полнота заказа"] + offset).toFixed(1),
    }));
  }, [filterSeed]);

  const activeTabStyle = {
    background: "rgba(204,0,0,0.15)",
    color: "#e57373",
    border: "1px solid rgba(204,0,0,0.25)",
  };
  const inactiveTabStyle = {
    color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    border: "1px solid transparent",
  };

  return (
    <div>
      <SectionHeader
        title="Логистика и доставка"
        description="Мониторинг утилизации транспортного парка, объёма перевозок и качества сервиса в разрезе территорий. Целевые значения: утилизация ≥ 85%, OTIF ≥ 97%."
        badge="Март 2026"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard title="Утилизация ТС" value={`${overallUtil}%`} change={2.4} changeLabel="к прошл. мес." icon={<Truck size={15} />} accentColor={GREEN} />
        <StatCard title="Объём доставки" value="948 т" change={-0.2} changeLabel="к плану" icon={<Package size={15} />} accentColor="#3b82f6" />
        <div className="rounded-2xl p-4 relative overflow-hidden" style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}` }}>
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)", filter: "blur(12px)" }} />
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: textSecondary }}>Маршрутов за месяц</p>
          <p className="text-2xl font-black" style={{ color: textPrimary }}>3 847</p>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>активных на сегодня: 184</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(16,185,129,0.12)", color: GREEN, border: "1px solid rgba(16,185,129,0.2)" }}>
              ▲ 4.2% к прош. мес.
            </span>
          </div>
        </div>
        <StatCard title="Уровень сервиса" value={`${overallService}%`} change={-2.8} changeLabel="к целевому" icon={<Star size={15} />} accentColor={YELLOW} />
      </div>

      {/* Tabs + shared filters on the same row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
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
        {activeTab !== "powerbi" && (
          <div className="flex gap-2 flex-wrap">
            <Dropdown label="Группа подразделений" value={группаПодразделений} options={ГРУППЫ_ПОДРАЗДЕЛЕНИЙ} onChange={setГруппаПодразделений} isDark={isDark} />
            <Dropdown label="Вид бизнеса" value={видБизнеса} options={ВИДЫ_БИЗНЕСА} onChange={setВидБизнеса} isDark={isDark} />
          </div>
        )}
      </div>

      {/* ── UTILIZATION TAB ──────────────────────────────────────────────── */}
      {activeTab === "utilization" && (
        <>
          {/* Gauge + territories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <GlassCard className="p-4 flex flex-col items-center" glow={GREEN} style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <ChartTitle>Общая утилизация ТС</ChartTitle>
              <Gauge value={overallUtil} label={`Средняя (цель ≥ 85%) · ${группаПодразделений}`} unit="%" size={190} />
              <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Мин.", `${Math.min(...territoriesUtil.map(t => t.utilization))}%`, RED],
                  ["Ср.", `${overallUtil}%`, YELLOW],
                  ["Макс.", `${Math.max(...territoriesUtil.map(t => t.utilization))}%`, GREEN],
                ].map(([lbl, val, col]) => (
                  <div key={lbl as string} className="rounded-lg p-2" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                    <p className="text-xs" style={{ color: textSecondary }}>{lbl}</p>
                    <p className="text-sm font-black" style={{ color: col as string }}>{val}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <ChartTitle>Утилизация по территориям</ChartTitle>
              <BarRows
                items={territoriesUtil.map(t => ({ name: t.name, value: t.utilization }))}
                colorFn={utilColor}
                isDark={isDark}
              />
            </GlassCard>
          </div>

          {/* Subdivisions */}
          {subdivisionsUtil.length > 0 && (
            <GlassCard className="p-4 mb-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <ChartTitle>Утилизация по подразделениям — {группаПодразделений}</ChartTitle>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {subdivisionsUtil.map(s => (
                  <div key={s.name} className="rounded-xl p-3 text-center"
                    style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                    <p className="text-xs mb-1.5" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{s.name}</p>
                    <p className="text-xl font-black" style={{ color: utilColor(s.utilization) }}>{s.utilization}%</p>
                    <div className="mt-1.5 h-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.utilization}%`, background: utilColor(s.utilization) }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Weekday chart */}
          <GlassCard className="p-4 mb-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <ChartTitle>Утилизация по дням недели (%)</ChartTitle>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={utilWeekday}>
                <CartesianGrid {...darkChartProps.cartesianGrid} />
                <XAxis dataKey="day" {...darkChartProps.xAxis} />
                <YAxis domain={[40, 100]} {...darkChartProps.yAxis} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend {...darkChartProps.legend} />
                {weekdayLineKeys.map((key, i) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={lineColors[i % lineColors.length]} strokeWidth={2} dot={{ r: 3, strokeWidth: 0 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <div className="flex gap-4 items-stretch">
            <div className="flex-1">
              <AIPlaceholder lines={3} isDark={isDark} />
            </div>
            <a
              href="#"
              className="flex flex-col items-center justify-center gap-2 px-5 rounded-2xl transition-all shrink-0"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.2)",
                textDecoration: "none",
                minWidth: 160,
              }}
            >
              <ExternalLink size={20} style={{ color: YELLOW }} />
              <span className="text-xs font-semibold text-center" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>
                Power BI — Логистика
              </span>
            </a>
          </div>
        </>
      )}

      {/* ── SERVICE TAB ───────────────────────────────────────────────────── */}
      {activeTab === "service" && (
        <>
          {/* Gauge + groups + subdivisions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <GlassCard className="p-4 flex flex-col items-center" glow="#a855f7" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <ChartTitle>Общий уровень сервиса (OTIF)</ChartTitle>
              <Gauge value={overallService} label={`Факт: ${overallService}% · Цель: 97%`} unit="%" size={185} />
            </GlassCard>

            <GlassCard className="p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <ChartTitle>Уровень сервиса по группам товаров</ChartTitle>
              <BarRows
                items={productGroupsService.map(p => ({ name: p.name, value: p.service }))}
                colorFn={servColor}
                isDark={isDark}
              />
            </GlassCard>

            <GlassCard className="p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <ChartTitle>Уровень сервиса по подразделениям</ChartTitle>
              {subdivisionsService.length > 0 ? (
                <BarRows
                  items={subdivisionsService.map(s => ({ name: s.name, value: s.service }))}
                  colorFn={servColor}
                  isDark={isDark}
                />
              ) : (
                <p className="text-xs" style={{ color: textMuted }}>Нет подразделений для выбранной группы</p>
              )}
            </GlassCard>
          </div>

          {/* Weekday service chart */}
          <GlassCard className="p-4 mb-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <ChartTitle>Уровень сервиса по дням недели (%)</ChartTitle>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={serviceWeekday}>
                <CartesianGrid {...darkChartProps.cartesianGrid} />
                <XAxis dataKey="day" {...darkChartProps.xAxis} />
                <YAxis domain={[88, 100]} {...darkChartProps.yAxis} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend {...darkChartProps.legend} />
                <Line type="monotone" dataKey="OTIF" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 4, fill: "#a855f7", strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Доставка в срок" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Полнота заказа" stroke={GREEN} strokeWidth={2} dot={{ r: 3, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <div className="flex gap-4 items-stretch">
            <div className="flex-1">
              <AIPlaceholder lines={3} isDark={isDark} />
            </div>
            <a
              href="#"
              className="flex flex-col items-center justify-center gap-2 px-5 rounded-2xl transition-all shrink-0"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.2)",
                textDecoration: "none",
                minWidth: 160,
              }}
            >
              <ExternalLink size={20} style={{ color: YELLOW }} />
              <span className="text-xs font-semibold text-center" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>
                Power BI — Логистика
              </span>
            </a>
          </div>
        </>
      )}

      {/* ── POWER BI TAB ─────────────────────────────────────────────────── */}
      {activeTab === "powerbi" && (
        <GlassCard className="p-8 text-center" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <ExternalLink size={28} style={{ color: YELLOW }} />
            </div>
            <div>
              <p className="text-lg font-black mb-2" style={{ color: textPrimary }}>Power BI — Логистика</p>
              <p className="text-sm mb-4" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                Интерактивный дашборд в Power BI с детализацией маршрутов, водителей и транспортных средств.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { label: "Power BI — Утилизация ТС", color: YELLOW },
                { label: "Power BI — Маршруты", color: "#3b82f6" },
                { label: "Power BI — OTIF", color: GREEN },
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