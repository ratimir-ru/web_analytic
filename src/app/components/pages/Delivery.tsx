import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";
import { SectionHeader, GlassCard, ChartTitle, darkChartProps, CustomChartTooltip } from "../StatCard";
import { Gauge } from "../Gauge";
import { useTheme } from "../ThemeProvider";
import {
  ВИДЫ_БИЗНЕСА,
  ГРУППЫ_ПОДРАЗДЕЛЕНИЙ,
  divisionGroupToDivisions,
  businessTypeToProductGroups,
} from "../filtersData";
import { Truck, Package, Star, Bot, ExternalLink } from "lucide-react";

// ── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#1A8D7A";
const YELLOW = "#f59e0b";
const RED = "#ba2447";

// ── Delivery KPI Card Component ──────────────────────────────────────────────
function DeliveryKpiCard({ 
  title, 
  fact, 
  plan, 
  bottomInfo, 
  icon
}: {
  title: React.ReactNode;
  fact: string;
  plan: string;
  bottomInfo: React.ReactNode;
  icon: React.ReactNode;
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
            background: isDark ? "rgba(100,100,100,0.5)" : "rgba(150,150,150,0.5)",
            color: "#ffffff"
          }}
        >
          {icon}
        </div>
      </div>
      <div className="mx-[0px] my-[5px]">
        <span className="text-xs block mx-[0px] mt-[28px] mb-[-22px]" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          {plan}
        </span>
        <div className="flex items-center justify-between mx-[0px] mt-[26px] mb-[-4px]">
          <span className="text-2xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            {fact}
          </span>
          {bottomInfo}
        </div>
      </div>
    </div>
  );
}

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

const utilMonthlyBase = [
  { month: "Янв", values: [88, 85, 82, 78] },
  { month: "Фев", values: [90, 87, 84, 80] },
  { month: "Мар", values: [92, 89, 86, 82] },
  { month: "Апр", values: [91, 88, 85, 81] },
  { month: "Май", values: [93, 90, 87, 83] },
  { month: "Июн", values: [89, 86, 83, 79] },
  { month: "Июл", values: [87, 84, 81, 77] },
  { month: "Авг", values: [90, 87, 84, 80] },
  { month: "Сен", values: [92, 89, 86, 82] },
  { month: "Окт", values: [91, 88, 85, 81] },
  { month: "Ноя", values: [89, 86, 83, 79] },
  { month: "Дек", values: [88, 85, 82, 78] },
];

const serviceWeekdayBase = [
  { day: "Пн", values: [93.5, 92.8, 94.2, 91.5] },
  { day: "Вт", values: [92.8, 91.5, 93.0, 90.2] },
  { day: "Ср", values: [94.2, 93.5, 95.1, 92.8] },
  { day: "Чт", values: [91.5, 90.8, 92.4, 89.5] },
  { day: "Пт", values: [90.8, 89.5, 91.2, 88.0] },
  { day: "Сб", values: [89.2, 88.0, 90.0, 86.5] },
  { day: "Вс", values: [87.5, 86.2, 88.8, 85.0] },
];

const serviceMonthlyBase = [
  { month: "Янв", values: [92.8, 91.5, 93.5, 90.2] },
  { month: "Фев", values: [93.2, 92.0, 94.0, 91.0] },
  { month: "Мар", values: [94.1, 93.0, 95.2, 92.5] },
  { month: "Апр", values: [93.5, 92.2, 94.5, 91.8] },
  { month: "Май", values: [94.8, 93.8, 95.9, 93.2] },
  { month: "Июн", values: [91.9, 90.5, 93.0, 89.8] },
  { month: "Июл", values: [90.5, 89.2, 91.8, 88.5] },
  { month: "Авг", values: [92.3, 91.0, 93.4, 90.5] },
  { month: "Сен", values: [93.8, 92.5, 94.8, 92.0] },
  { month: "Окт", values: [93.1, 91.8, 94.2, 91.2] },
  { month: "Ноя", values: [92.0, 90.8, 93.2, 90.0] },
  { month: "Дек", values: [91.2, 90.0, 92.5, 89.5] },
];

const tabKeys = ["service", "utilization", "powerbi"] as const;
const tabLabels = ["Уровень сервиса", "Утилизация ТС", "Power BI"];

// ── Components ────────────────────────────────────────────────────────────────
function AIPlaceholder({ lines = 3, linkLabel, isDark }: { lines?: number; linkLabel?: string; isDark: boolean }) {
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
    </GlassCard>
  );
}

function Dropdown<T extends string>({ label, value, options, onChange, isDark, disabled }: {
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
        }}
        disabled={disabled}
      >
        <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{label}:</span>
        <span>{value}</span>
        <span style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>▾</span>
      </button>
      {open && !disabled && (
        <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-50 min-w-max"
          style={{
            background: isDark ? "rgba(10,15,20,0.9)" : "rgba(255,255,255,0.9)",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
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

  const [activeTab, setActiveTab] = useState<typeof tabKeys[number]>("service");
  const [группаПодразделений, setГруппаПодразделений] = useState<string>(ГРУППЫ_ПОДРАЗДЕЛЕНИЙ[0]);
  const [видБизнеса, setВидБизнеса] = useState<string>(ВИДЫ_БИЗНЕСА[0]);
  const [группаТоваров, setГруппаТоваров] = useState<string>("Все");

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

  // Product group options based on business type
  const группаТоваровOptions = useMemo(() => {
    if (!видБизнеса) return ["Все"];
    const groups = businessTypeToProductGroups[видБизнеса];
    return groups ? ["Все", ...groups] : ["Все"];
  }, [видБизнеса]);

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

  // Monthly utilization data  slightly varied
  const utilMonthly = useMemo(() => {
    const offset = seededValue(filterSeed + "monthutil", -3, 6) - 3;
    const topDivs = divisions.slice(0, 4);
    if (topDivs.length === 0) return utilMonthlyBase.map(d => ({ month: d.month, "Линия 1": d.values[0] + offset, "Линия 2": d.values[1] + offset, "Линия 3": d.values[2] + offset }));
    const result = utilMonthlyBase.map(d => {
      const row: Record<string, any> = { month: d.month };
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
  // Base service levels for product groups by business type
  const productGroupServiceBase: Record<string, Record<string, number>> = {
    "Основной бизнес": {
      "ДЕЛИКАТЕСЫ": 96.5,
      "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ": 94.8,
      "КОЛБАСНЫЕ ИЗДЕЛИЯ": 95.2,
      "Мясной проект Ратимир": 93.1,
      "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ": 91.8,
    },
    "Агроптица": {
      "Птица замороженная": 97.2,
      "Птица хлажденная": 95.6,
    },
    "СТ": {
      "Проект Птица, Мясо": 94.3,
      "Проект СТ": 92.7,
      "Проект СТ, МП ПЛЮС": 93.5,
    },
    "МАП": {
      "МАП": 96.1,
    },
    "Трейдинг": {
      "Мясо": 89.4,
      "Прочие": 88.7,
    },
  };

  const productGroupsService = useMemo(() => {
    const groups = businessTypeToProductGroups[видБизнеса];
    const baseValues = productGroupServiceBase[видБизнеса];
    
    if (!groups || !baseValues) {
      return [
        { name: "КОЛБАСНЫЕ ИЗДЕЛИЯ", service: 95.2 },
        { name: "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ", service: 94.8 },
        { name: "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ", service: 91.8 },
        { name: "ДЕЛИКАТЕСЫ", service: 96.5 },
      ];
    }
    
    const offset = (seededValue(filterSeed + "pgserv", 0, 6) - 3) * 0.5;
    return groups.map(groupName => ({
      name: groupName,
      service: Math.min(99.9, Math.max(85, +(baseValues[groupName] + offset).toFixed(1))),
    }));
  }, [filterSeed, видБизнеса]);

  // Service data — subdivisions
  const subdivisionsService = useMemo(() => {
    if (divisions.length === 0) return [];
    const vals = seededValues(filterSeed + "subdivserv", 88, 10, divisions.length);
    return divisions.map((d, i) => ({
      name: d,
      service: Math.min(99.5, +(vals[i] * 0.1 + 88).toFixed(1)),
    }));
  }, [divisions, filterSeed]);

  // Service weekday data — show divisions instead of measures
  const serviceWeekday = useMemo(() => {
    const offset = (seededValue(filterSeed + "weekserv", 0, 4) - 2) * 0.3;
    const topDivs = divisions.slice(0, 4);
    if (topDivs.length === 0) return serviceWeekdayBase.map(d => ({ day: d.day, "Линия 1": d.values[0] + offset, "Линия 2": d.values[1] + offset, "Линия 3": d.values[2] + offset }));
    const result = serviceWeekdayBase.map(d => {
      const row: Record<string, any> = { day: d.day };
      topDivs.forEach((div, i) => {
        row[div] = Math.min(99.9, Math.max(85, +(d.values[i % 4] + offset).toFixed(1)));
      });
      return row;
    });
    return result;
  }, [divisions, filterSeed]);

  // Service monthly data — show divisions instead of measures
  const serviceMonthly = useMemo(() => {
    const offset = (seededValue(filterSeed + "monthserv", 0, 4) - 2) * 0.3;
    const topDivs = divisions.slice(0, 4);
    if (topDivs.length === 0) return serviceMonthlyBase.map(d => ({ month: d.month, "Линия 1": d.values[0] + offset, "Линия 2": d.values[1] + offset, "Линия 3": d.values[2] + offset }));
    const result = serviceMonthlyBase.map(d => {
      const row: Record<string, any> = { month: d.month };
      topDivs.forEach((div, i) => {
        row[div] = Math.min(99.9, Math.max(85, +(d.values[i % 4] + offset).toFixed(1)));
      });
      return row;
    });
    return result;
  }, [divisions, filterSeed]);

  const serviceLineKeys = useMemo(() => {
    const topDivs = divisions.slice(0, 4);
    if (topDivs.length === 0) return ["Линия 1", "Линия 2", "Линия 3"];
    return topDivs;
  }, [divisions]);

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Утилизация ТС */}
        <DeliveryKpiCard
          title="Утилизация ТС"
          fact={`${overallUtil}%`}
          plan="Цел: ≥ 85%"
          bottomInfo={
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>
              ▲ +2.4%
            </span>
          }
          icon={<Truck size={14} />}
        />

        {/* Объём доставки */}
        <DeliveryKpiCard
          title="Объём доставки"
          fact="948 т"
          plan="План: 950 т"
          bottomInfo={
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(186,36,71,0.12)", color: RED, border: "1px solid rgba(186,36,71,0.2)" }}>
              ▼ 0.2%
            </span>
          }
          icon={<Package size={14} />}
        />

        {/* Маршрутов за месяц */}
        <DeliveryKpiCard
          title="Маршрутов за месяц"
          fact="3 847"
          plan="Активных: 184"
          bottomInfo={
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(26,141,122,0.12)", color: GREEN, border: "1px solid rgba(26,141,122,0.2)" }}>
              ▲ +1.9%
            </span>
          }
          icon={<Package size={14} />}
        />

        {/* Уровень сервиса */}
        <DeliveryKpiCard
          title="Уровень сервиса"
          fact={`${overallService}%`}
          plan="Целевой: 97%"
          bottomInfo={
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: overallService >= 97 ? "rgba(26,141,122,0.12)" : "rgba(186,36,71,0.12)", color: overallService >= 97 ? GREEN : RED, border: `1px solid ${overallService >= 97 ? "rgba(26,141,122,0.2)" : "rgba(186,36,71,0.2)"}` }}>
              {overallService >= 97 ? '▲' : '▼'} {overallService >= 97 ? '+0.5%' : '-2.1%'}
            </span>
          }
          icon={<Star size={14} />}
        />
      </div>

      {/* Main Logistics Block - Unified Card */}
      <GlassCard className="p-5 my-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        {/* Tabs + shared filters on the same row */}
        <div className="flex items-center gap-3 mb-6 flex-wrap px-[10px] py-[8px]">
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
              <Dropdown 
                label="Вид бизнеса" 
                value={видБизнеса} 
                options={ВИДЫ_БИЗНЕСА} 
                onChange={(v) => { 
                  setВидБизнеса(v); 
                  setГруппаТоваров("Все"); 
                }} 
                isDark={isDark} 
              />
              <Dropdown label="Группа товаров" value={группаТоваров} options={группаТоваровOptions} onChange={setГруппаТоваров} isDark={isDark} disabled={!видБизнеса} />
            </div>
          )}
        </div>

        {/* ── UTILIZATION TAB ──────────────────────────────────────────────── */}
        {activeTab === "utilization" && (
          <>
            {/* Gauge + territories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl flex flex-col items-center" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Общая утилизация ТС</ChartTitle>
                <Gauge value={overallUtil} label={`Средняя (цель ≥ 85%) · ${группаПодразделений}`} unit="%" size={200} />
                <div className="w-full mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Минимум", `${Math.min(...territoriesUtil.map(t => t.utilization))}%`, RED],
                    ["Среднее", `${overallUtil}%`, YELLOW],
                    ["Максимум", `${Math.max(...territoriesUtil.map(t => t.utilization))}%`, GREEN],
                  ].map(([lbl, val, col]) => (
                    <div key={lbl as string} className="rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: textSecondary }}>{lbl}</p>
                      <p className="text-lg font-bold" style={{ color: col as string }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Утилизация по территориям</ChartTitle>
                <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                  <BarRows
                    items={territoriesUtil.map(t => ({ name: t.name, value: t.utilization }))}
                    colorFn={utilColor}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>

            {/* Subdivisions */}
            {subdivisionsUtil.length > 0 && (
              <div className="p-4 mb-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Утилизация по подразделениям — {группаПодразделений}</ChartTitle>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {subdivisionsUtil.map(s => (
                    <div key={s.name} className="rounded-xl p-3 text-center"
                      style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
                      <p className="text-xs mb-1.5" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{s.name}</p>
                      <p className="text-xl font-bold" style={{ color: GREEN }}>{s.utilization}%</p>
                      <div className="mt-1.5 h-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
                        <div className="h-full rounded-full" style={{ width: `${s.utilization}%`, background: GREEN }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekday and Monthly charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Утилизация по дням недели (%)</ChartTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={utilWeekday}>
                    <CartesianGrid {...darkChartProps.cartesianGrid} />
                    <XAxis dataKey="day" {...darkChartProps.xAxis} />
                    <YAxis domain={[40, 100]} {...darkChartProps.yAxis} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend {...darkChartProps.legend} />
                    {weekdayLineKeys.map((key, i) => {
                      const chartLineColors = ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D", "#A47DD4", "#E05A85", "#E05A85", "#BA2447"];
                      // Назначаем фирменные цвета для конкретных подразделений
                      let lineColor = chartLineColors[i % chartLineColors.length];
                      if (key === "Восточная Сибирь") {
                        lineColor = "#E05A85";
                      } else if (key === "Магадан") {
                        lineColor = "#BA2447";
                      }
                      return <Line key={`weekday-${key}-${i}`} type="monotone" dataKey={key} stroke={lineColor} strokeWidth={2} dot={{ r: 3, strokeWidth: 0 }} />;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Утилизация по месяцам (%)</ChartTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={utilMonthly}>
                    <CartesianGrid {...darkChartProps.cartesianGrid} />
                    <XAxis dataKey="month" {...darkChartProps.xAxis} />
                    <YAxis domain={[40, 100]} {...darkChartProps.yAxis} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend {...darkChartProps.legend} />
                    {weekdayLineKeys.map((key, i) => {
                      const chartLineColors = ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D", "#A47DD4", "#E05A85", "#E05A85", "#BA2447"];
                      // Назначаем фирменные цвета для конкретных подразделений
                      let lineColor = chartLineColors[i % chartLineColors.length];
                      if (key === "Восточная Сибирь") {
                        lineColor = "#E05A85";
                      } else if (key === "Магадан") {
                        lineColor = "#BA2447";
                      }
                      return <Line key={`month-${key}-${i}`} type="monotone" dataKey={key} stroke={lineColor} strokeWidth={2} dot={{ r: 3, strokeWidth: 0 }} />;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            
          </>
        )}

        {/* ── SERVICE TAB ───────────────────────────────────────────────────── */}
        {activeTab === "service" && (
          <>
            {/* Gauge + groups + subdivisions - 3 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl flex flex-col items-center" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Общий уровень сервиса</ChartTitle>
                <Gauge value={overallService} label={`Факт: ${overallService}% · Цель: 97%`} unit="%" size={185} />
                <div className="w-full mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Минимум", `${Math.min(...subdivisionsService.map(s => s.service))}%`, RED],
                    ["Среднее", `${overallService}%`, YELLOW],
                    ["Максимум", `${Math.max(...subdivisionsService.map(s => s.service))}%`, GREEN],
                  ].map(([lbl, val, col]) => (
                    <div key={lbl as string} className="rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: textSecondary }}>{lbl}</p>
                      <p className="text-lg font-bold" style={{ color: col as string }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Уровень сервиса по группам товаров</ChartTitle>
                <BarRows
                  items={productGroupsService.map(p => ({ name: p.name, value: p.service }))}
                  colorFn={servColor}
                  isDark={isDark}
                />
              </div>

              <div className="p-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Уровень сервиса по подразделениям</ChartTitle>
                {subdivisionsService.length > 0 ? (
                  <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                    <BarRows
                      items={subdivisionsService.map(s => ({ name: s.name, value: s.service }))}
                      colorFn={servColor}
                      isDark={isDark}
                    />
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: textMuted }}>Нет подразделений для выбранной группы</p>
                )}
              </div>
            </div>

            {/* Weekday and Monthly service charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Уровень сервиса по дням недели (%)</ChartTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={serviceWeekday}>
                    <CartesianGrid {...darkChartProps.cartesianGrid} />
                    <XAxis dataKey="day" {...darkChartProps.xAxis} />
                    <YAxis domain={[88, 100]} {...darkChartProps.yAxis} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend {...darkChartProps.legend} />
                    {serviceLineKeys.map((key, i) => {
                      const chartLineColors = ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D", "#A47DD4", "#E05A85", "#E05A85", "#BA2447"];
                      // Назначаем фирменные цвета для конкретных подразделений
                      let lineColor = chartLineColors[i % chartLineColors.length];
                      if (key === "Восточная Сибирь") {
                        lineColor = "#E05A85";
                      } else if (key === "Магадан") {
                        lineColor = "#BA2447";
                      }
                      return <Line key={`weekday-${key}-${i}`} type="monotone" dataKey={key} stroke={lineColor} strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: isDark ? lineColor : "#000000" }} />;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <ChartTitle>Уровень сервиса по месяцам (%)</ChartTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={serviceMonthly}>
                    <CartesianGrid {...darkChartProps.cartesianGrid} />
                    <XAxis dataKey="month" {...darkChartProps.xAxis} />
                    <YAxis domain={[88, 100]} {...darkChartProps.yAxis} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend {...darkChartProps.legend} />
                    {serviceLineKeys.map((key, i) => {
                      const chartLineColors = ["#008183", "#00B19F", "#6BF0AE", "#E0DCD0", "#4F709D", "#A47DD4", "#E05A85", "#E05A85", "#BA2447"];
                      // Назначаем фирменные цвета для конкретных подразделений
                      let lineColor = chartLineColors[i % chartLineColors.length];
                      if (key === "Восточная Сибирь") {
                        lineColor = "#E05A85";
                      } else if (key === "Магадан") {
                        lineColor = "#BA2447";
                      }
                      return <Line key={`month-${key}-${i}`} type="monotone" dataKey={key} stroke={lineColor} strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: isDark ? lineColor : "#000000" }} />;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            
          </>
        )}

        {/* ── POWER BI TAB ─────────────────────────────────────────────────── */}
        {activeTab === "powerbi" && (
          <div className="p-8 text-center rounded-xl" style={{ background: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
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
                    style={{ 
                      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", 
                      border: `1px solid ${innerCardBorder}`, 
                      textDecoration: "none",
                      minWidth: "fit-content"
                    }}
                  >
                    <ExternalLink size={14} style={{ color: link.color, flexShrink: 0 }} />
                    <span className="text-xs font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>{link.label}</span>
                  </a>
                ))}
              </div>
              
            </div>
          </div>
        )}
      </GlassCard>

      {/* AI Analyst block at the end - only for non-PowerBI tabs */}
      {activeTab !== "powerbi" && (
        <AIPlaceholder lines={3} linkLabel="Power BI — Логистика" isDark={isDark} />
      )}
    </div>
  );
}