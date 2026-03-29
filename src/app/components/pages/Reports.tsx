import React, { useState } from "react";
import { Download, FileText, BarChart2, TrendingUp, Package, Truck, ClipboardList, FileSpreadsheet } from "lucide-react";
import { GlassCard, SectionHeader } from "../StatCard";
import { useTheme } from "../ThemeProvider";

type Tab = "custom" | "auto";

type ReportType = "" | "plan-fact" | "lfl";
type Period = "" | "Январь" | "Февраль" | "Март" | "Q1 2026" | "2025" | "2026";
type Division = "" | "ОБП Хабаровск" | "ОБП Владивосток" | "Дистрибьюторы" | "X5" | "Близкий" | "Самбери";
type ProductGroup = "" | "Колбасные изделия" | "Заморозка" | "Деликатесы" | "Охлажденные ПФ" | "Мясной проект";

interface AutoReport {
  id: number;
  title: string;
  description: string;
  updated: string;
  icon: React.ReactNode;
  color: string;
}

const autoReports: AutoReport[] = [
  { id: 1, title: "Оперативный отчёт март 2026", description: "Ежедневный срез ключевых показателей: выручка, объём, уровень сервиса", updated: "24.03.2026", icon: <BarChart2 size={20} />, color: "#CC0000" },
  { id: 2, title: "Финансовый отчёт Q1 2026", description: "Выручка, маржинальность, дебиторская задолженность за 1 квартал", updated: "22.03.2026", icon: <TrendingUp size={20} />, color: "#3b82f6" },
  { id: 3, title: "Отчёт по продажам март", description: "Объём, цена, уровень сервиса по всем категориям и подразделениям", updated: "23.03.2026", icon: <Package size={20} />, color: "#10b981" },
  { id: 4, title: "Логистика — утилизация март", description: "Утилизация ТС по территориям, OTIF, динамика по дням недели", updated: "23.03.2026", icon: <Truck size={20} />, color: "#f59e0b" },
  { id: 5, title: "Реестр задач март 2026", description: "Полный список задач, просрочки, распределение по блокам и исполнителям", updated: "24.03.2026", icon: <ClipboardList size={20} />, color: "#a855f7" },
  { id: 6, title: "Plan-Fact годовой 2026", description: "Сравнение плановых и фактических показателей нарастающим итогом", updated: "20.03.2026", icon: <FileSpreadsheet size={20} />, color: "#ec4899" },
];

const PERIODS: Period[] = ["Январь", "Февраль", "Март", "Q1 2026", "2025", "2026"];
const DIVISIONS: Division[] = ["ОБП Хабаровск", "ОБП Владивосток", "Дистрибьюторы", "X5", "Близкий", "Самбери"];
const PRODUCT_GROUPS: ProductGroup[] = ["Колбасные изделия", "Заморозка", "Деликатесы", "Охлажденные ПФ", "Мясной проект"];

const REPORT_TYPE_LABELS: Record<string, string> = {
  "plan-fact": "План-факт анализ",
  "lfl": "Like-For-Like анализ 2026 к 2025",
};

export function Reports() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<Tab>("custom");
  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState<ReportType>("");
  const [period, setPeriod] = useState<Period>("");
  const [division, setDivision] = useState<Division>("");
  const [productGroup, setProductGroup] = useState<ProductGroup>("");
  const [showPreview, setShowPreview] = useState(false);

  const cardStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
    backdropFilter: isDark ? "blur(20px)" : "none",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
  };

  const optionBtnBase: React.CSSProperties = {
    padding: "10px 18px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.12)",
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
  };

  const optionBtnActive: React.CSSProperties = {
    ...optionBtnBase,
    background: "rgba(204,0,0,0.15)",
    border: "1px solid rgba(204,0,0,0.35)",
    color: isDark ? "#ff8080" : "#CC0000",
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else setShowPreview(true);
  };

  const canProceed = () => {
    if (step === 1) return !!reportType;
    if (step === 2) return !!period;
    if (step === 3) return !!division;
    if (step === 4) return !!productGroup;
    return true;
  };

  const resetWizard = () => {
    setStep(1);
    setReportType("");
    setPeriod("");
    setDivision("");
    setProductGroup("");
    setShowPreview(false);
  };

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    padding: "8px 24px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: activeTab === tab
      ? (isDark ? "rgba(204,0,0,0.2)" : "rgba(204,0,0,0.12)")
      : "transparent",
    border: activeTab === tab
      ? "1px solid rgba(204,0,0,0.3)"
      : "1px solid transparent",
    color: activeTab === tab
      ? (isDark ? "#ff8080" : "#CC0000")
      : (isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"),
  });

  return (
    <div>
      <SectionHeader
        title="Отчёты"
        description="Скачайте или сформируйте преднастроенный или существующий отчёт"
        badge="Март 2026"
      />

      {/* Tab switcher */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6 w-fit"
        style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <button style={tabStyle("custom")} onClick={() => setActiveTab("custom")}>
          Кастомизация отчётов
        </button>
        <button style={tabStyle("auto")} onClick={() => setActiveTab("auto")}>
          Авто отчёты
        </button>
      </div>

      {/* Custom report wizard */}
      {activeTab === "custom" && (
        <div>
          {!showPreview ? (
            <GlassCard className="p-6 max-w-2xl">
              {/* Steps indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3, 4].map(s => (
                  <React.Fragment key={s}>
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: s <= step ? "linear-gradient(135deg, #CC0000, #8B0000)" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        color: s <= step ? "white" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                        boxShadow: s === step ? "0 0 14px rgba(204,0,0,0.4)" : "none",
                      }}
                    >
                      {s}
                    </div>
                    {s < 4 && (
                      <div
                        className="flex-1 h-0.5 rounded-full"
                        style={{
                          background: s < step ? "#CC0000" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Report type */}
              {step === 1 && (
                <div>
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите тип отчёта
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {(["plan-fact", "lfl"] as ReportType[]).filter(Boolean).map(type => (
                      <button
                        key={type}
                        style={reportType === type ? optionBtnActive : optionBtnBase}
                        onClick={() => setReportType(type)}
                      >
                        {type === "plan-fact" ? "📊 План-факт" : "📈 LFL (Like-For-Like)"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Period */}
              {step === 2 && (
                <div>
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите временной период
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {PERIODS.map(p => (
                      <button
                        key={p}
                        style={period === p ? optionBtnActive : optionBtnBase}
                        onClick={() => setPeriod(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Division */}
              {step === 3 && (
                <div>
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите подразделение
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {DIVISIONS.map(d => (
                      <button
                        key={d}
                        style={division === d ? optionBtnActive : optionBtnBase}
                        onClick={() => setDivision(d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Product group */}
              {step === 4 && (
                <div>
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите группу товаров
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {PRODUCT_GROUPS.map(g => (
                      <button
                        key={g}
                        style={productGroup === g ? optionBtnActive : optionBtnBase}
                        onClick={() => setProductGroup(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                      color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                    }}
                  >
                    ← Назад
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    background: canProceed() ? "linear-gradient(135deg, #CC0000, #8B0000)" : "rgba(100,0,0,0.3)",
                    boxShadow: canProceed() ? "0 0 18px rgba(204,0,0,0.35)" : "none",
                    cursor: canProceed() ? "pointer" : "not-allowed",
                  }}
                >
                  {step < 4 ? "Далее →" : "Показать фильтры"}
                </button>
              </div>
            </GlassCard>
          ) : (
            /* Preview */
            <GlassCard className="p-6 max-w-2xl">
              <div
                className="rounded-xl p-4 mb-6 text-sm leading-relaxed"
                style={{
                  background: isDark ? "rgba(204,0,0,0.06)" : "rgba(204,0,0,0.04)",
                  border: "1px solid rgba(204,0,0,0.2)",
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                }}
              >
                <p className="font-bold mb-3" style={{ color: isDark ? "#ff8080" : "#CC0000" }}>
                  Для создания отчёта будут применены фильтры:
                </p>
                <ul className="space-y-1.5">
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Временной период:</span> <strong>{period}</strong></li>
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Подразделение:</span> <strong>{division}</strong></li>
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Группа товаров:</span> <strong>{productGroup?.toUpperCase()}</strong></li>
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Выбранный отчёт:</span> <strong>{REPORT_TYPE_LABELS[reportType] || reportType}</strong></li>
                </ul>
                <p className="mt-4 text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>
                  Если хотите сохранить отчёт с выбранными фильтрами, нажмите «Сформировать»
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetWizard}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                    color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                  }}
                >
                  ✏️ Изменить
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #CC0000, #8B0000)",
                    boxShadow: "0 0 18px rgba(204,0,0,0.35)",
                  }}
                >
                  <FileText size={15} />
                  Сформировать
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Auto reports */}
      {activeTab === "auto" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {autoReports.map(report => (
            <GlassCard key={report.id} className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${report.color}20`,
                    border: `1px solid ${report.color}30`,
                    color: report.color,
                  }}
                >
                  {report.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-bold leading-snug mb-1"
                    style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}
                  >
                    {report.title}
                  </h4>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)" }}
                  >
                    {report.description}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }}
              >
                <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
                  Обновлено {report.updated}
                </span>
                <button
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: `${report.color}18`,
                    border: `1px solid ${report.color}30`,
                    color: report.color,
                  }}
                >
                  <Download size={12} />
                  Скачать
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
