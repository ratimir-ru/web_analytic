import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface DashboardData {
  cumRevenue: number;
  cumRevenueBase: number;
  cumVolume: number;
  cumVolumeBase: number;
  cumAvgCheck: number;
  cumAvgCheckBase: number;
  cumMarginRub: number;
  cumMarginRubBase: number;
  cumMarginPct: number;
  cumMarginPctBase: number;
  cumChecks: number;
  cumChecksBase: number;
  cumPositions: number;
  cumPositionsBase: number;
  cumPrice: number;
  cumPriceBase: number;
  cumMarjaTT: number;
  cumMarjaTTBase: number;
  d2dRevenue: number;
  d2dRevenueBase: number;
  d2dVolume: number;
  d2dVolumeBase: number;
  d2dAvgCheck: number;
  d2dAvgCheckBase: number;
  d2dMarginRub: number;
  d2dMarginRubBase: number;
  d2dMarginPct: number;
  d2dMarginPctBase: number;
  d2dChecks: number;
  d2dChecksBase: number;
  d2dPositions: number;
  d2dPositionsBase: number;
  d2dPrice: number;
  d2dPriceBase: number;
  d2dMarjaTT: number;
  d2dMarjaTTBase: number;
}

interface KPICardProps {
  title: string;
  current: number;
  previous: number;
  formatValue: (val: number) => string;
  isDark: boolean;
  isPct?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, current, previous, formatValue, isDark, isPct }) => {
  const change = isPct
    ? (current - previous)
    : ((current - previous) / previous * 100);
  const isPositive = change >= 0;

  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          {title}
        </p>
        <div
          className="px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{
            background: isPositive
              ? "rgba(26,141,122,0.15)"
              : "rgba(186,36,71,0.15)",
            border: isPositive
              ? "1px solid rgba(26,141,122,0.3)"
              : "1px solid rgba(186,36,71,0.3)",
          }}
        >
          {isPositive ? <TrendingUp size={10} color="#1A8D7A" /> : <TrendingDown size={10} color="#BA2447" />}
          <span
            className="text-xs font-bold"
            style={{ color: isPositive ? "#1A8D7A" : "#BA2447" }}
          >
            {isPositive ? "+" : ""}{isPct ? change.toFixed(1) : change.toFixed(1)}{isPct ? "пп" : "%"}
          </span>
        </div>
      </div>
      <p
        className="text-xl font-bold mb-1"
        style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}
      >
        {formatValue(current)}
      </p>
      <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
        {formatValue(previous)}
      </p>
    </div>
  );
};

export function ExecutiveDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Демо данные
  const data: DashboardData = {
    cumRevenue: 12500000,
    cumRevenueBase: 11200000,
    cumVolume: 45000,
    cumVolumeBase: 42000,
    cumAvgCheck: 2150,
    cumAvgCheckBase: 2050,
    cumMarginRub: 3750000,
    cumMarginRubBase: 3360000,
    cumMarginPct: 30.5,
    cumMarginPctBase: 28.8,
    cumChecks: 5814,
    cumChecksBase: 5463,
    cumPositions: 4.5,
    cumPositionsBase: 4.2,
    cumPrice: 285.50,
    cumPriceBase: 275.20,
    cumMarjaTT: 125000,
    cumMarjaTTBase: 118000,
    d2dRevenue: 2100000,
    d2dRevenueBase: 1950000,
    d2dVolume: 7500,
    d2dVolumeBase: 7200,
    d2dAvgCheck: 2200,
    d2dAvgCheckBase: 2100,
    d2dMarginRub: 630000,
    d2dMarginRubBase: 585000,
    d2dMarginPct: 30.8,
    d2dMarginPctBase: 29.5,
    d2dChecks: 955,
    d2dChecksBase: 929,
    d2dPositions: 4.8,
    d2dPositionsBase: 4.5,
    d2dPrice: 290.00,
    d2dPriceBase: 280.00,
    d2dMarjaTT: 21000,
    d2dMarjaTTBase: 19500,
  };

  const formatNumber = (num: number) => Math.round(num).toLocaleString('ru-RU');
  const formatCurrency = (num: number) => `${formatNumber(num)} ₽`;
  const formatKg = (num: number) => `${formatNumber(num)} кг`;
  const formatPct = (num: number) => `${num.toFixed(2)}%`;

  const sectionStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.95)",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 20,
  };

  return (
    <div className="space-y-6">
      {/* Раздел 1: Накопленные итоги */}
      <div style={sectionStyle}>
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-1" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            Накопленные итоги
          </h3>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            С понедельника по последний день (текущая неделя vs прошлая неделя)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Выручка"
            current={data.cumRevenue}
            previous={data.cumRevenueBase}
            formatValue={formatCurrency}
            isDark={isDark}
          />
          <KPICard
            title="Объем"
            current={data.cumVolume}
            previous={data.cumVolumeBase}
            formatValue={formatKg}
            isDark={isDark}
          />
          <KPICard
            title="Маржа"
            current={data.cumMarginRub}
            previous={data.cumMarginRubBase}
            formatValue={formatCurrency}
            isDark={isDark}
          />
          <KPICard
            title="Средний чек"
            current={data.cumAvgCheck}
            previous={data.cumAvgCheckBase}
            formatValue={formatCurrency}
            isDark={isDark}
          />
          <KPICard
            title="Маржинальность"
            current={data.cumMarginPct}
            previous={data.cumMarginPctBase}
            formatValue={formatPct}
            isDark={isDark}
            isPct={true}
          />
          <KPICard
            title="Кол-во чеков"
            current={data.cumChecks}
            previous={data.cumChecksBase}
            formatValue={formatNumber}
            isDark={isDark}
          />
        </div>

        {/* Дополнительные показатели */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <h4 className="text-sm font-bold mb-4" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            Дополнительные показатели
          </h4>
          <div className="space-y-3">
            {/* Headers */}
            <div className="flex items-center justify-between pb-2" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}>
              <span className="text-xs font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                Показатель
              </span>
              <div className="flex items-center gap-12">
                <span className="text-xs font-semibold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  Факт
                </span>
                <span className="text-xs font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", width: "80px", textAlign: "center" }}>
                  План
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                Ср. кол-во позиций в чеке
              </span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-bold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  {data.cumPositions.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", width: "80px", textAlign: "center" }}>
                  {data.cumPositionsBase.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                Базовая цена, руб./кг
              </span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-bold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  {data.cumPrice.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", width: "80px", textAlign: "center" }}>
                  {data.cumPriceBase.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                Маржа на ТТ, ₽
              </span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-bold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  {formatNumber(data.cumMarjaTT)} ₽
                </span>
                <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", width: "80px", textAlign: "center" }}>
                  {formatNumber(data.cumMarjaTTBase)} ₽
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Сравнение метрик */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <h4 className="text-sm font-bold mb-4" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            Сравнение ключевых метрик
          </h4>

          <div className="grid grid-cols-2 gap-6">
            {/* Выручка */}
            <div className="space-y-2">
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.cumRevenue / Math.max(data.cumRevenue, data.cumRevenueBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #BA2447, #D63161)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Тек.неделя: {(data.cumRevenue / 1000000).toFixed(2)}М
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.cumRevenueBase / Math.max(data.cumRevenue, data.cumRevenueBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #D63161, #E85882)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Прошл.неделя: {(data.cumRevenueBase / 1000000).toFixed(2)}М
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Объем */}
            <div className="space-y-2">
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.cumVolume / Math.max(data.cumVolume, data.cumVolumeBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #1A8D7A, #22A896)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Тек.неделя: {(data.cumVolume / 1000).toFixed(1)}т
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.cumVolumeBase / Math.max(data.cumVolume, data.cumVolumeBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #22A896, #35C4AF)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Прошл.неделя: {(data.cumVolumeBase / 1000).toFixed(1)}т
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Инсайты */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(186,36,71,0.08)" : "rgba(186,36,71,0.04)",
            border: isDark ? "1px solid rgba(186,36,71,0.2)" : "1px solid rgba(186,36,71,0.15)",
          }}
        >
          <h4 className="text-sm font-bold mb-3" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.9)" }}>
            Ключевые инсайты
          </h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              {
                label: "Выручка",
                change: ((data.cumRevenue - data.cumRevenueBase) / data.cumRevenueBase * 100).toFixed(1),
                diff: Math.abs(data.cumRevenue - data.cumRevenueBase),
                isPositive: data.cumRevenue >= data.cumRevenueBase,
                unit: "руб."
              },
              {
                label: "Объем",
                change: ((data.cumVolume - data.cumVolumeBase) / data.cumVolumeBase * 100).toFixed(1),
                diff: Math.abs(data.cumVolume - data.cumVolumeBase),
                isPositive: data.cumVolume >= data.cumVolumeBase,
                unit: "кг"
              },
              {
                label: "Маржа",
                change: ((data.cumMarginRub - data.cumMarginRubBase) / data.cumMarginRubBase * 100).toFixed(1),
                diff: Math.abs(data.cumMarginRub - data.cumMarginRubBase),
                isPositive: data.cumMarginRub >= data.cumMarginRubBase,
                unit: "руб."
              },
              {
                label: "Средний чек",
                change: ((data.cumAvgCheck - data.cumAvgCheckBase) / data.cumAvgCheckBase * 100).toFixed(1),
                diff: Math.abs(data.cumAvgCheck - data.cumAvgCheckBase),
                isPositive: data.cumAvgCheck >= data.cumAvgCheckBase,
                unit: "руб."
              },
              {
                label: "Кол-во чеков",
                change: ((data.cumChecks - data.cumChecksBase) / data.cumChecksBase * 100).toFixed(1),
                diff: Math.abs(data.cumChecks - data.cumChecksBase),
                isPositive: data.cumChecks >= data.cumChecksBase,
                unit: "шт."
              },
              {
                label: "Маржинальность",
                change: (data.cumMarginPct - data.cumMarginPctBase).toFixed(1),
                diff: Math.abs(data.cumMarginPct - data.cumMarginPctBase),
                isPositive: data.cumMarginPct >= data.cumMarginPctBase,
                unit: "п.п.",
                isPct: true
              },
            ].map((insight, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: insight.isPositive ? "#1A8D7A" : "#BA2447" }}
                />
                <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                  <strong>{insight.label}:</strong> {insight.isPositive ? "рост" : "снижение"} на{" "}
                  <span style={{ color: insight.isPositive ? "#1A8D7A" : "#BA2447", fontWeight: "bold" }}>
                    {Math.abs(parseFloat(insight.change))}{insight.isPct ? "" : "%"}
                  </span>{" "}
                  ({insight.isPct ? insight.diff.toFixed(1) : formatNumber(insight.diff)} {insight.unit})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Раздел 2: День ко дню */}
      <div style={sectionStyle}>
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-1" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            День ко дню
          </h3>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            Вчера vs тот же день недели на прошлой неделе
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Выручка"
            current={data.d2dRevenue}
            previous={data.d2dRevenueBase}
            formatValue={formatCurrency}
            isDark={isDark}
          />
          <KPICard
            title="Объем"
            current={data.d2dVolume}
            previous={data.d2dVolumeBase}
            formatValue={formatKg}
            isDark={isDark}
          />
          <KPICard
            title="Маржа"
            current={data.d2dMarginRub}
            previous={data.d2dMarginRubBase}
            formatValue={formatCurrency}
            isDark={isDark}
          />
          <KPICard
            title="Средний чек"
            current={data.d2dAvgCheck}
            previous={data.d2dAvgCheckBase}
            formatValue={formatCurrency}
            isDark={isDark}
          />
          <KPICard
            title="Маржинальность"
            current={data.d2dMarginPct}
            previous={data.d2dMarginPctBase}
            formatValue={formatPct}
            isDark={isDark}
            isPct={true}
          />
          <KPICard
            title="Кол-во чеков"
            current={data.d2dChecks}
            previous={data.d2dChecksBase}
            formatValue={formatNumber}
            isDark={isDark}
          />
        </div>

        {/* Дополнительные показатели */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <h4 className="text-sm font-bold mb-4" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            Дополнительные показатели
          </h4>
          <div className="space-y-3">
            {/* Headers */}
            <div className="flex items-center justify-between pb-2" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}>
              <span className="text-xs font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                Показатель
              </span>
              <div className="flex items-center gap-12">
                <span className="text-xs font-semibold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  Факт
                </span>
                <span className="text-xs font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", width: "80px", textAlign: "center" }}>
                  План
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                Ср. кол-во позиций в чеке
              </span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-bold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  {data.d2dPositions.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", width: "80px", textAlign: "center" }}>
                  {data.d2dPositionsBase.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                Базовая цена, руб./кг
              </span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-bold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  {data.d2dPrice.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", width: "80px", textAlign: "center" }}>
                  {data.d2dPriceBase.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                Маржа на ТТ, ₽
              </span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-bold" style={{ color: "#1A8D7A", width: "80px", textAlign: "center" }}>
                  {formatNumber(data.d2dMarjaTT)} ₽
                </span>
                <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", width: "80px", textAlign: "center" }}>
                  {formatNumber(data.d2dMarjaTTBase)} ₽
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Сравнение метрик */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <h4 className="text-sm font-bold mb-4" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
            Сравнение ключевых метрик
          </h4>

          <div className="grid grid-cols-2 gap-6">
            {/* Выручка */}
            <div className="space-y-2">
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.d2dRevenue / Math.max(data.d2dRevenue, data.d2dRevenueBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #BA2447, #D63161)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Вчера: {(data.d2dRevenue / 1000000).toFixed(2)}М
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.d2dRevenueBase / Math.max(data.d2dRevenue, data.d2dRevenueBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #D63161, #E85882)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Неделя назад: {(data.d2dRevenueBase / 1000000).toFixed(2)}М
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Объем */}
            <div className="space-y-2">
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.d2dVolume / Math.max(data.d2dVolume, data.d2dVolumeBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #1A8D7A, #22A896)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Вчера: {(data.d2dVolume / 1000).toFixed(1)}т
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="h-8 rounded-lg overflow-hidden"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="h-full flex items-center justify-center rounded-lg"
                    style={{
                      width: `${Math.min((data.d2dVolumeBase / Math.max(data.d2dVolume, data.d2dVolumeBase)) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #22A896, #35C4AF)",
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      Неделя назад: {(data.d2dVolumeBase / 1000).toFixed(1)}т
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Инсайты */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(26,141,122,0.08)" : "rgba(26,141,122,0.04)",
            border: isDark ? "1px solid rgba(26,141,122,0.2)" : "1px solid rgba(26,141,122,0.15)",
          }}
        >
          <h4 className="text-sm font-bold mb-3" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.9)" }}>
            Ключевые инсайты
          </h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              {
                label: "Выручка",
                change: ((data.d2dRevenue - data.d2dRevenueBase) / data.d2dRevenueBase * 100).toFixed(1),
                diff: Math.abs(data.d2dRevenue - data.d2dRevenueBase),
                isPositive: data.d2dRevenue >= data.d2dRevenueBase,
                unit: "руб."
              },
              {
                label: "Объем",
                change: ((data.d2dVolume - data.d2dVolumeBase) / data.d2dVolumeBase * 100).toFixed(1),
                diff: Math.abs(data.d2dVolume - data.d2dVolumeBase),
                isPositive: data.d2dVolume >= data.d2dVolumeBase,
                unit: "кг"
              },
              {
                label: "Маржа",
                change: ((data.d2dMarginRub - data.d2dMarginRubBase) / data.d2dMarginRubBase * 100).toFixed(1),
                diff: Math.abs(data.d2dMarginRub - data.d2dMarginRubBase),
                isPositive: data.d2dMarginRub >= data.d2dMarginRubBase,
                unit: "руб."
              },
              {
                label: "Средний чек",
                change: ((data.d2dAvgCheck - data.d2dAvgCheckBase) / data.d2dAvgCheckBase * 100).toFixed(1),
                diff: Math.abs(data.d2dAvgCheck - data.d2dAvgCheckBase),
                isPositive: data.d2dAvgCheck >= data.d2dAvgCheckBase,
                unit: "руб."
              },
              {
                label: "Кол-во чеков",
                change: ((data.d2dChecks - data.d2dChecksBase) / data.d2dChecksBase * 100).toFixed(1),
                diff: Math.abs(data.d2dChecks - data.d2dChecksBase),
                isPositive: data.d2dChecks >= data.d2dChecksBase,
                unit: "шт."
              },
              {
                label: "Маржинальность",
                change: (data.d2dMarginPct - data.d2dMarginPctBase).toFixed(1),
                diff: Math.abs(data.d2dMarginPct - data.d2dMarginPctBase),
                isPositive: data.d2dMarginPct >= data.d2dMarginPctBase,
                unit: "п.п.",
                isPct: true
              },
            ].map((insight, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: insight.isPositive ? "#1A8D7A" : "#BA2447" }}
                />
                <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                  <strong>{insight.label}:</strong> {insight.isPositive ? "рост" : "снижение"} на{" "}
                  <span style={{ color: insight.isPositive ? "#1A8D7A" : "#BA2447", fontWeight: "bold" }}>
                    {Math.abs(parseFloat(insight.change))}{insight.isPct ? "" : "%"}
                  </span>{" "}
                  ({insight.isPct ? insight.diff.toFixed(1) : formatNumber(insight.diff)} {insight.unit})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
