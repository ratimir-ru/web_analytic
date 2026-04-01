import React, { useState } from "react";
import { FileText, FileSpreadsheet, TrendingUp, Package, DollarSign, PieChart } from "lucide-react";
import { GlassCard, SectionHeader } from "../StatCard";
import { useTheme } from "../ThemeProvider";

const RED = "#ba2447";
const GREEN = "#1A8D7A";
const YELLOW = "#fbbf24";

interface TableData {
  volume: { plan: number; fact: number; pct: number; month: number; year: number };
  price: { plan: number; fact: number; pct: number; month: number; year: number };
  margin: { plan: number; fact: number; pct: number; month: number; year: number };
  sl: { plan: number; fact: number; pct: number; month: number; year: number };
}

const tablesData: Record<string, TableData> = {
  "Ратимир": {
    volume: { plan: 1412, fact: 1510, pct: 105, month: 4.3, year: 14 },
    price: { plan: 389.44, fact: 386.58, pct: 99, month: -2.9, year: 0 },
    margin: { plan: 194.3, fact: 193.1, pct: 99, month: -0.1, year: -19.6 },
    sl: { plan: 97.0, fact: 96.6, pct: 99, month: -1.0, year: 0 }
  },
  "Колбасные изделия": {
    volume: { plan: 826, fact: 853, pct: 103, month: 0.3, year: -24 },
    price: { plan: 402.68, fact: 401.42, pct: 100, month: -1.3, year: 0 },
    margin: { plan: 128.4, fact: 128.4, pct: 100, month: -0.1, year: 0 },
    sl: { plan: 97.0, fact: 96.4, pct: 99, month: -0.7, year: 0 }
  },
  "Проект СТ": {
    volume: { plan: 181, fact: 160, pct: 89, month: -2.1, year: 31 },
    price: { plan: 526.87, fact: 521.12, pct: 99, month: -5.8, year: 0 },
    margin: { plan: 14.1, fact: 11.1, pct: 79, month: 0, year: 0 },
    sl: { plan: 97.0, fact: 92.6, pct: 95, month: -4.4, year: 0 }
  },
  "Замороженные полуфабрикаты": {
    volume: { plan: 195, fact: 220, pct: 113, month: -2.6, year: 26 },
    price: { plan: 330.03, fact: 327.94, pct: 99, month: -2.1, year: 0 },
    margin: { plan: 28.8, fact: 30.2, pct: 105, month: -1.4, year: 0 },
    sl: { plan: 97.0, fact: 97.6, pct: 101, month: -0.6, year: 0 }
  },
  "Трейдинг": {
    volume: { plan: 22, fact: 66, pct: 301, month: -4.4, year: -44 },
    price: { plan: 505.81, fact: 355.34, pct: 70, month: +50.3, year: 0 },
    margin: { plan: 1.9, fact: 5.3, pct: 302, month: 0, year: 0 },
    sl: { plan: 100.0, fact: 100.0, pct: 100, month: +0.0, year: 0 }
  },
  "Деликатесы": {
    volume: { plan: 142, fact: 149, pct: 105, month: -7, year: -7 },
    price: { plan: 510.22, fact: 501.11, pct: 98, month: -9.1, year: 0 },
    margin: { plan: 21.9, fact: 20.8, pct: 95, month: 0, year: 0 },
    sl: { plan: 97.0, fact: 93.0, pct: 96, month: -3.8, year: 0 }
  },
  "Продукция МАП": {
    volume: { plan: 124, fact: 206, pct: 117, month: +79, year: 0 },
    price: { plan: 209.09, fact: 218.66, pct: 105, month: +9.6, year: 0 },
    margin: { plan: 0.7, fact: 1.2, pct: 117, month: +0.2, year: 0 },
    sl: { plan: 97.0, fact: 94.7, pct: 98, month: -2.3, year: 0 }
  },
  "Охлаждённые полуфабрикаты": {
    volume: { plan: 166, fact: 172, pct: 104, month: +6, year: 0 },
    price: { plan: 392.38, fact: 392.15, pct: 100, month: -0.2, year: 0 },
    margin: { plan: 11.8, fact: 12.2, pct: 103, month: +0.4, year: 0 },
    sl: { plan: 97.0, fact: 92.8, pct: 96, month: -4.2, year: 0 }
  },
  "Проект Агроптица": {
    volume: { plan: 533, fact: 565, pct: 104, month: +22, year: 0 },
    price: { plan: 247.58, fact: 256.31, pct: 104, month: +8.7, year: 0 },
    margin: { plan: 1.5, fact: 5.7, pct: 104, month: +0.2, year: 0 },
    sl: { plan: 97.0, fact: 90.6, pct: 93, month: -6.4, year: 0 }
  },
  "Мясной проект Ратимир": {
    volume: { plan: 105, fact: 116, pct: 111, month: +11, year: 0 },
    price: { plan: 226.15, fact: 233.18, pct: 103, month: +7.0, year: 0 },
    margin: { plan: 3.3, fact: 1.5, pct: 46, month: -1.8, year: 0 },
    sl: { plan: 97.0, fact: 94.1, pct: 97, month: -2.9, year: 0 }
  }
};

// Speedometer component
function Speedometer({ value, label }: { value: number; label: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const color = value >= 97 ? GREEN : value >= 90 ? YELLOW : RED;
  const pct = Math.min(Math.max(value / 100, 0), 1);
  
  const size = 180;
  const cx = size / 2;
  const cy = size / 2 + 5;
  const r = size / 2 - 22;

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
    <div className="flex flex-col items-center justify-center h-full p-6">
      <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
        {label}
      </p>
      <svg width={size} height={size / 2 + 35} viewBox={`${size * 0.0833} ${(size / 2 + 40) * 0.0833} ${size / 1.2} ${(size / 2 + 40) / 1.2}`}>
        <defs>
          <filter id={`glow-sl-${value}`} x="-50%" y="-50%" width="200%" height="200%">
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
            stroke={color}
            strokeWidth={6.5} 
            strokeLinecap="round"
            filter={`url(#glow-sl-${value})`}
            opacity="0.9"
          />
        )}
        
        {/* Dot at end */}
        {pct > 0.01 && (
          <circle 
            cx={cx + r * Math.cos(toRad(endAngle))} 
            cy={cy + r * Math.sin(toRad(endAngle))} 
            r={4.6} 
            fill={color}
          />
        )}
        
        {/* Percentage text */}
        <text 
          x={cx} 
          y={cy - 8} 
          textAnchor="middle" 
          fontSize={22} 
          fontWeight="bold" 
          fill={isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.92)"} 
          fontFamily="Montserrat, system-ui"
        >
          {value}%
        </text>
      </svg>
    </div>
  );
}

// KPI Block component
function KPIBlock({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  percentMain, 
  percentSecondary, 
  plan, 
  diff,
  isDark 
}: { 
  icon: any; 
  title: string; 
  value: string; 
  unit: string; 
  percentMain: number; 
  percentSecondary: number; 
  plan: string; 
  diff: string;
  isDark: boolean;
}) {
  const mainColor = percentMain >= 100 ? GREEN : RED;
  const mainBg = percentMain >= 100 ? "rgba(26,141,122,0.12)" : "rgba(186,36,71,0.12)";
  const mainBorder = percentMain >= 100 ? "rgba(26,141,122,0.25)" : "rgba(186,36,71,0.25)";
  
  return (
    <div className="rounded-2xl p-5 h-full flex flex-col" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }} />
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          {title}
        </p>
      </div>
      
      <div className="flex items-baseline gap-3 mb-1">
        <p className="text-3xl font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.92)" }}>
          {value}
        </p>
        <div className="rounded-lg px-3 py-1.5" style={{ background: mainBg, border: `1px solid ${mainBorder}` }}>
          <p className="text-sm font-bold leading-tight" style={{ color: mainColor }}>
            {percentMain}%/{percentSecondary}%
          </p>
        </div>
      </div>
      
      <p className="text-xs mt-auto" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
        План: {plan} <span style={{ color: diff.startsWith("+") ? GREEN : RED }}>({diff})</span>
      </p>
      <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>{unit}</p>
    </div>
  );
}

// Table component
function DataTable({ data, title, isDark }: { data: TableData; title: string; isDark: boolean }) {
  const rows = [
    { label: "Объём, тн", data: data.volume },
    { label: "Цена, руб/кг", data: data.price },
    { label: "Маржа, млн. руб", data: data.margin },
    { label: "SL %", data: data.sl }
  ];
  
  const getColor = (pct: number) => {
    if (pct >= 100) return GREEN;
    if (pct >= 95) return YELLOW;
    return RED;
  };
  
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
      <div className="px-4 py-3" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
        <p className="text-sm font-bold" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>{title}</p>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
            <th className="text-left px-3 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Показатель</th>
            <th className="text-center px-2 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>План</th>
            <th className="text-center px-2 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Факт</th>
            <th className="text-center px-2 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>%</th>
            <th className="text-center px-2 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>+МЕС%</th>
            <th className="text-center px-2 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>+ГОД</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={{ borderBottom: idx < rows.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` : "none" }}>
              <td className="px-3 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{row.label}</td>
              <td className="text-center px-2 py-2 text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{row.data.plan.toLocaleString()}</td>
              <td className="text-center px-2 py-2 text-xs font-bold" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>{row.data.fact.toLocaleString()}</td>
              <td className="text-center px-2 py-2">
                <span className="text-xs font-bold" style={{ color: getColor(row.data.pct) }}>{row.data.pct}%</span>
              </td>
              <td className="text-center px-2 py-2 text-xs" style={{ color: row.data.month >= 0 ? GREEN : RED }}>{row.data.month > 0 ? "+" : ""}{row.data.month}</td>
              <td className="text-center px-2 py-2 text-xs" style={{ color: row.data.year >= 0 ? GREEN : RED }}>{row.data.year > 0 ? "+" : ""}{row.data.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Combined Table component for 5 categories
function CombinedCategoriesTable({ categories, data, isDark }: { categories: string[]; data: Record<string, TableData>; isDark: boolean }) {
  const rows = [
    { label: "Объём, тн", key: "volume" as const },
    { label: "Цена, руб/кг", key: "price" as const },
    { label: "Маржа, млн. руб", key: "margin" as const },
    { label: "SL %", key: "sl" as const }
  ];
  
  const getColor = (pct: number) => {
    if (pct >= 100) return GREEN;
    if (pct >= 95) return YELLOW;
    return RED;
  };
  
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
              <th className="text-left px-3 py-3 text-xs font-medium sticky left-0" style={{ 
                color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                background: isDark ? "rgba(15,20,25,0.95)" : "rgba(248,249,250,0.95)",
                minWidth: "140px"
              }}>
                Показатель
              </th>
              {categories.map(category => (
                <th key={category} colSpan={5} className="text-center px-2 py-3 text-xs font-bold" style={{ 
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                  borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`
                }}>
                  {category}
                </th>
              ))}
            </tr>
            <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
              <th className="sticky left-0" style={{ 
                background: isDark ? "rgba(15,20,25,0.95)" : "rgba(248,249,250,0.95)"
              }}></th>
              {categories.map((category, idx) => (
                <React.Fragment key={category}>
                  <th className="text-center px-1 py-2 text-xs font-medium" style={{ 
                    color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    borderLeft: idx > 0 || true ? `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` : "none"
                  }}>План</th>
                  <th className="text-center px-1 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Факт</th>
                  <th className="text-center px-1 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>%</th>
                  <th className="text-center px-1 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>+МЕС%</th>
                  <th className="text-center px-1 py-2 text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>+ГОД</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={row.key} style={{ borderBottom: rowIdx < rows.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` : "none" }}>
                <td className="px-3 py-2 text-xs font-medium sticky left-0" style={{ 
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                  background: isDark ? "rgba(15,20,25,0.95)" : "rgba(248,249,250,0.95)"
                }}>
                  {row.label}
                </td>
                {categories.map((category, catIdx) => {
                  const cellData = data[category][row.key];
                  return (
                    <React.Fragment key={category}>
                      <td className="text-center px-1 py-2 text-xs" style={{ 
                        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                        borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`
                      }}>
                        {cellData.plan.toLocaleString()}
                      </td>
                      <td className="text-center px-1 py-2 text-xs font-bold" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                        {cellData.fact.toLocaleString()}
                      </td>
                      <td className="text-center px-1 py-2">
                        <span className="text-xs font-bold" style={{ color: getColor(cellData.pct) }}>{cellData.pct}%</span>
                      </td>
                      <td className="text-center px-1 py-2 text-xs" style={{ color: cellData.month >= 0 ? GREEN : RED }}>
                        {cellData.month > 0 ? "+" : ""}{cellData.month}
                      </td>
                      <td className="text-center px-1 py-2 text-xs" style={{ color: cellData.year >= 0 ? GREEN : RED }}>
                        {cellData.year > 0 ? "+" : ""}{cellData.year}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OperativeReport() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTable, setActiveTable] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString("ru-RU", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  });

  const tableCategories = [
    "Ратимир",
    "Проект СТ",
    "Трейдинг",
    "Продукция МАП",
    "Проект Агроптица",
    "Колбасные изделия",
    "Замороженные полуфабрикаты",
    "Деликатесы",
    "Охлаждённые полуфабрикаты",
    "Мясной проект Ратимир"
  ];

  const scrollToTable = (category: string) => {
    setActiveTable(category);
    const element = document.getElementById(`table-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black" style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.92)" }}>
              Оперативный отчёт
            </h1>
            <span 
              className="px-3 py-1 rounded-lg text-xs font-medium"
              style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
            >
              {currentDate}
            </span>
          </div>
          <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            Актуальный срез ключевых показателей бизнеса
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{
              background: "rgba(186,36,71,0.12)",
              border: "1px solid rgba(186,36,71,0.25)",
              color: RED,
            }}
          >
            <FileText size={15} />
            Скачать .pdf
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{
              background: "rgba(26,141,122,0.12)",
              border: "1px solid rgba(26,141,122,0.25)",
              color: GREEN,
            }}
          >
            <FileSpreadsheet size={15} />
            Скачать .xlsx
          </button>
        </div>
      </div>

      {/* KPI Grid: Speedometer + 3 KPI blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
          <Speedometer value={95} label="SL" />
        </div>
        
        <KPIBlock
          icon={Package}
          title="Объём, тн / прогноз"
          value="2531"
          unit="тонн"
          percentMain={106}
          percentSecondary={102}
          plan="2 379"
          diff="+152"
          isDark={isDark}
        />
        
        <KPIBlock
          icon={DollarSign}
          title="Цена, руб/кг"
          value="348,24"
          unit="руб/кг"
          percentMain={95}
          percentSecondary={0}
          plan="351,74"
          diff="-3,50"
          isDark={isDark}
        />
        
        <KPIBlock
          icon={PieChart}
          title="Маржа, млн. руб"
          value="216,6"
          unit="млн. руб"
          percentMain={100}
          percentSecondary={0}
          plan="216,7"
          diff="-0,1"
          isDark={isDark}
        />
      </div>

      {/* Table navigation */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
          Таблицы оперативного отчёта
        </h2>
        <div className="flex flex-wrap gap-2">
          {tableCategories.map(category => (
            <button
              key={category}
              onClick={() => scrollToTable(category)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTable === category 
                  ? "rgba(26,141,122,0.15)" 
                  : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: activeTable === category 
                  ? "1px solid rgba(26,141,122,0.3)" 
                  : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                color: activeTable === category 
                  ? GREEN 
                  : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-6">
        {/* Ратимир - full width */}
        <div id="table-Ратимир">
          <DataTable data={tablesData["Ратимир"]} title="Ратимир" isDark={isDark} />
        </div>

        {/* Combined 5 categories table */}
        <div id="table-combined-categories">
          <CombinedCategoriesTable 
            categories={["Колбасные изделия", "Замороженные полуфабрикаты", "Деликатесы", "Охлаждённые полуфабрикаты", "Мясной проект Ратимир"]}
            data={tablesData}
            isDark={isDark}
          />
        </div>

        {/* Full width tables */}
        {["Проект СТ", "Трейдинг", "Продукция МАП", "Проект Агроптица"].map(category => (
          <div key={category} id={`table-${category}`}>
            <DataTable data={tablesData[category]} title={category} isDark={isDark} />
          </div>
        ))}
      </div>
    </div>
  );
}