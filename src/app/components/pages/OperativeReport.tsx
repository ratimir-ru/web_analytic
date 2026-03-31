import React from "react";
import { Download, FileText, FileSpreadsheet, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GlassCard, SectionHeader } from "../StatCard";
import { TrafficLight } from "../TrafficLight";
import { useTheme } from "../ThemeProvider";

interface KpiRow {
  indicator: string;
  plan: string;
  fact: string;
  pct: number;
  dynamics: number;
  status: "red" | "yellow" | "green";
}

interface SalesRow {
  category: string;
  plan: number;
  fact: number;
  pct: number;
  dynamics: number;
}

const kpiData: KpiRow[] = [
  { indicator: "Выручка, млн ₽", plan: "100,0", fact: "97,4", pct: 97.4, dynamics: 5.2, status: "yellow" },
  { indicator: "Объём продаж, тн", plan: "980", fact: "948", pct: 96.7, dynamics: -3.1, status: "yellow" },
  { indicator: "Маржа, %", plan: "22,0", fact: "21,3", pct: 96.8, dynamics: -0.7, status: "yellow" },
  { indicator: "Цена реализации, ₽/кг", plan: "102,0", fact: "102,7", pct: 100.7, dynamics: 0.7, status: "green" },
  { indicator: "Уровень сервиса (OTIF), %", plan: "97,0", fact: "94,2", pct: 97.1, dynamics: -2.8, status: "yellow" },
  { indicator: "Утилизация ТС, %", plan: "85,0", fact: "87,0", pct: 102.4, dynamics: 2.4, status: "green" },
  { indicator: "Дебиторская задолженность, млн ₽", plan: "45,0", fact: "50,6", pct: 112.4, dynamics: 12.4, status: "red" },
  { indicator: "Задач просрочено", plan: "0", fact: "3", pct: 0, dynamics: 0, status: "red" },
];

const salesData: SalesRow[] = [
  { category: "Колбасные изделия", plan: 320, fact: 298, pct: 93.1, dynamics: -2.1 },
  { category: "Заморозка", plan: 180, fact: 175, pct: 97.2, dynamics: 1.5 },
  { category: "Деликатесы", plan: 150, fact: 162, pct: 108.0, dynamics: 8.0 },
  { category: "Охлажденные ПФ", plan: 210, fact: 195, pct: 92.9, dynamics: -7.1 },
  { category: "Мясной проект", plan: 130, fact: 118, pct: 90.8, dynamics: -9.2 },
];

const logisticsData = [
  { territory: "Хабаровск", utilization: 89, service: 96.2, routes: 142 },
  { territory: "Владивосток", utilization: 85, service: 94.8, routes: 118 },
  { territory: "Находка", utilization: 87, service: 95.5, routes: 67 },
  { territory: "Комсомольск", utilization: 91, service: 97.1, routes: 54 },
  { territory: "Благовещенск", utilization: 82, service: 92.3, routes: 45 },
  { territory: "Спасск", utilization: 78, service: 90.1, routes: 28 },
];

function DynamicIcon({ value }: { value: number }) {
  if (value > 0) return <TrendingUp size={13} style={{ color: "#10b981" }} />;
  if (value < 0) return <TrendingDown size={13} style={{ color: "#ef4444" }} />;
  return <Minus size={13} style={{ color: "rgba(255,255,255,0.3)" }} />;
}

function PctBadge({ pct, target = 95 }: { pct: number; target?: number }) {
  const color = pct >= 100 ? "#10b981" : pct >= target ? "#f59e0b" : "#ef4444";
  const bg = pct >= 100 ? "rgba(16,185,129,0.12)" : pct >= target ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";
  return (
    <span
      className="px-2 py-0.5 rounded-md text-xs font-bold"
      style={{ background: bg, color }}
    >
      {pct.toFixed(1)}%
    </span>
  );
}

export function OperativeReport() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textPrimary = isDark ? "rgba(255,255,255,0.87)" : "rgba(0,0,0,0.85)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const borderSubtle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <SectionHeader
          title="Оперативный отчёт"
          description="Актуальный срез ключевых показателей бизнеса на 24.03.2026"
          badge="24.03.2026"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
            }}
          >
            <FileText size={15} />
            Скачать .pdf
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "#34d399",
            }}
          >
            <FileSpreadsheet size={15} />
            Скачать .xlsx
          </button>
        </div>
      </div>

      {/* Traffic light summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Финансы", sublabel: "Выручка 97.4%", status: "yellow" as const },
          { label: "Продажи", sublabel: "Объём 96.7%", status: "yellow" as const },
          { label: "Логистика", sublabel: "Утилизация 87%", status: "green" as const },
          { label: "Дебиторка", sublabel: "+12.4% к лимиту", status: "red" as const },
        ].map((item, i) => (
          <GlassCard key={i} className="p-4 my-4 flex items-center gap-3">
            <TrafficLight status={item.status} size="md" />
            <div>
              <p className="text-sm font-bold" style={{ color: textPrimary }}>{item.label}</p>
              <p className="text-xs" style={{ color: textSecondary }}>{item.sublabel}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main KPI table */}
      <GlassCard className="my-5">
        <div className="p-5 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: textMuted }}>
            Ключевые показатели
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderSubtle}` }}>
                {["Показатель", "Светофор", "План", "Факт", "% от плана", "Динамика"].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: textMuted }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpiData.map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${borderSubtle}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,36,71,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: textPrimary }}>
                    {row.indicator}
                  </td>
                  <td className="px-4 py-3">
                    <TrafficLight status={row.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: textSecondary }}>{row.plan}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: textPrimary }}>{row.fact}</td>
                  <td className="px-4 py-3">
                    {row.pct > 0 ? <PctBadge pct={row.pct} /> : <span style={{ color: textMuted }}>—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <DynamicIcon value={row.dynamics} />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: row.dynamics > 0 ? "#10b981" : row.dynamics < 0 ? "#ef4444" : textMuted }}
                      >
                        {row.dynamics > 0 ? "+" : ""}{row.dynamics}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Sales by category */}
        <GlassCard className="my-4">
          <div className="p-5 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: textMuted }}>
              Продажи по категориям, тн
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${borderSubtle}` }}>
                  {["Категория", "План", "Факт", "% плана", "Динамика"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ color: textMuted }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesData.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `1px solid ${borderSubtle}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,36,71,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-2.5 text-sm font-medium" style={{ color: textPrimary }}>{row.category}</td>
                    <td className="px-4 py-2.5 text-sm" style={{ color: textSecondary }}>{row.plan}</td>
                    <td className="px-4 py-2.5 text-sm font-bold" style={{ color: textPrimary }}>{row.fact}</td>
                    <td className="px-4 py-2.5"><PctBadge pct={row.pct} /></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <DynamicIcon value={row.dynamics} />
                        <span className="text-xs font-semibold" style={{ color: row.dynamics > 0 ? "#10b981" : "#ef4444" }}>
                          {row.dynamics > 0 ? "+" : ""}{row.dynamics}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: `1px solid ${isDark ? "rgba(204,0,0,0.2)" : "rgba(204,0,0,0.15)"}` }}>
                  <td className="px-4 py-2.5 text-sm font-bold" style={{ color: textPrimary }}>Итого</td>
                  <td className="px-4 py-2.5 text-sm font-bold" style={{ color: textSecondary }}>
                    {salesData.reduce((s, r) => s + r.plan, 0)}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-black" style={{ color: "#CC0000" }}>
                    {salesData.reduce((s, r) => s + r.fact, 0)}
                  </td>
                  <td className="px-4 py-2.5">
                    <PctBadge
                      pct={Math.round(salesData.reduce((s, r) => s + r.fact, 0) / salesData.reduce((s, r) => s + r.plan, 0) * 1000) / 10}
                    />
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </GlassCard>

        {/* Logistics by territory */}
        <GlassCard className="my-4">
          <div className="p-5 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: textMuted }}>
              Логистика по территориям
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${borderSubtle}` }}>
                  {["Территория", "Утилизация ТС", "Ур. сервиса", "Маршрутов"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ color: textMuted }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logisticsData.map((row, i) => {
                  const utilColor = row.utilization >= 85 ? "#10b981" : row.utilization >= 75 ? "#f59e0b" : "#ef4444";
                  const servColor = row.service >= 97 ? "#10b981" : row.service >= 94 ? "#f59e0b" : "#ef4444";
                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: `1px solid ${borderSubtle}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,36,71,0.08)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-2.5 text-sm font-medium" style={{ color: textPrimary }}>{row.territory}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-sm font-bold" style={{ color: utilColor }}>{row.utilization}%</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-sm font-bold" style={{ color: servColor }}>{row.service}%</span>
                      </td>
                      <td className="px-4 py-2.5 text-sm" style={{ color: textSecondary }}>{row.routes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Commentary block */}
      <GlassCard className="p-5 my-4">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: textMuted }}>
          AI-комментарий к отчёту
        </h3>
        <div className="space-y-2.5">
          <div
            className="flex gap-3 p-3 rounded-xl"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
          >
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#10b981" }} />
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
              Цена реализации превысила плановый показатель (+0.7%), что обеспечивает дополнительный вклад в маржу.
            </p>
          </div>
          <div
            className="flex gap-3 p-3 rounded-xl"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#f59e0b" }} />
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
              Отставание по объёму продаж составляет 3.1%. Критические блоки: «Мясной проект» (−9.2%) и «Охлажденные ПФ» (−7.1%).
            </p>
          </div>
          <div
            className="flex gap-3 p-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#ef4444" }} />
            <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
              Дебиторская задолженность превысила лимит на 12.4%. Требуется взыскание: ООО «Ромашка» (4.2 млн), ИП Сидоров (2.8 млн).
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
