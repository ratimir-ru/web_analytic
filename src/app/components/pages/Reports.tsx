import React, { useState } from "react";
import { Download, FileText, BarChart2, TrendingUp, Package, Truck, ClipboardList, FileSpreadsheet, Calendar, ChevronDown } from "lucide-react";
import { GlassCard, SectionHeader } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "../../../styles/calendar.css";

type Tab = "custom" | "auto";

type ReportType = "" | "plan-fact" | "lfl";
type Period = "" | "Январь" | "Февраль" | "Март" | "Апрель" | "Май" | "Июнь" | "Июль" | "Август" | "Сентябрь" | "Октябрь" | "Ноябрь" | "Декабрь" | "Q1 2026" | "Q2 2026" | "Q3 2026" | "Q4 2026" | "2025" | "2026";
type ProductGroup = 
  | "ДЕЛИКАТЕСЫ" | "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ" | "КОЛБАСНЫЕ ИЗДЕЛИЯ" | "Мясной проект Ратимир" | "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ"
  | "Птица замороженная" | "Птица охлажденная"
  | "Проект Птица, Мясо" | "Проект СТ" | "Проект СТ, МП ПЛЮС"
  | "МАП"
  | "Мясо" | "Прочие";
type Subdivision = 
  | "Восточная Сибирь Улан-Удэ" | "Восточная Сибирь Чита" | "Камчатка" | "Магадан" | "Сахалин"
  | "ОБП Кавалерово" | "ОБП Благовещенск" | "ОБП Комсомольск" | "ОБП Находка" | "ОБП Спасск" | "ОБП Хабаровск" | "Владивосток"
  | "Светофор"
  | "X5 Retail" | "Близкий" | "Реми" | "Самбери"
  | "Фирменная розничная сеть";
type Territory = "Владивосток" | "Хабаровск" | "Находка" | "Комсомольск" | "Благовещенск" | "Кавалерово" | "Спасск";

interface AutoReport {
  id: number;
  title: string;
  description: string;
  updated: string;
  icon: React.ReactNode;
  color: string;
}

const autoReports: AutoReport[] = [
  { id: 1, title: "Оперативный отчёт март 2026", description: "Ежедневный срез ключевых показателей: выручка, объём, уровень сервиса", updated: "24.03.2026", icon: <BarChart2 size={20} />, color: "#BA2447" },
  { id: 2, title: "Финансовый отчёт Q1 2026", description: "Выручка, маржинальность, дебиторская задолженность за 1 квартал", updated: "22.03.2026", icon: <TrendingUp size={20} />, color: "#3b82f6" },
  { id: 3, title: "Отчёт по продажам март", description: "Объём, цена, уровень сервиса по всем категориям и подразделениям", updated: "23.03.2026", icon: <Package size={20} />, color: "#ba2447" },
  { id: 4, title: "Логистика — утилизация март", description: "Утилизация ТС по территориям, OTIF, динамика по дням недели", updated: "23.03.2026", icon: <Truck size={20} />, color: "#f59e0b" },
  { id: 5, title: "Реестр задач март 2026", description: "Полный список задач, просрочки, распределение по блокам и исполнителям", updated: "24.03.2026", icon: <ClipboardList size={20} />, color: "#a855f7" },
  { id: 6, title: "Plan-Fact годовой 2026", description: "Сравнение плановых и фактических показателей нарастающим итогом", updated: "20.03.2026", icon: <FileSpreadsheet size={20} />, color: "#ec4899" },
];

const PERIODS: Period[] = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "2025", "2026"];
const PRODUCT_GROUPS: ProductGroup[] = [
  "ДЕЛИКАТЕСЫ", "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ", "КОЛБАСНЫЕ ИЗДЕЛИЯ", "Мясной проект Ратимир", "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ",
  "Птица замороженная", "Птица охлажденная",
  "Проект Птица, Мясо", "Проект СТ", "Проект СТ, МП ПЛЮС",
  "МАП",
  "Мясо", "Прочие"
];
const SUBDIVISIONS: Subdivision[] = [
  "Восточная Сибирь Улан-Удэ", "Восточная Сибирь Чита", "Камчатка", "Магадан", "Сахалин",
  "ОБП Кавалерово", "ОБП Благовещенск", "ОБП Комсомольск", "ОБП Находка", "ОБП Спасск", "ОБП Хабаровск", "Владивосток",
  "Светофор",
  "X5 Retail", "Близкий", "Реми", "Самбери",
  "Фирменная розничная сеть"
];
const TERRITORIES: Territory[] = ["Владивосток", "Хабаровск", "Находка", "Комсомольск", "Благовещенск", "Кавалерово", "Спасск"];

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
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<Date>(new Date());
  const [endMonth, setEndMonth] = useState<Date>(new Date());

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
    background: "rgba(186,36,71,0.15)",
    border: "1px solid rgba(186,36,71,0.35)",
    color: isDark ? "#ff6b8a" : "#BA2447",
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else setShowPreview(true);
  };

  const canProceed = () => {
    if (step === 1) return !!reportType;
    if (step === 2) return !!period || (startDate && endDate);
    if (step === 3) return productGroups.length > 0;
    if (step === 4) return subdivisions.length > 0;
    if (step === 5) return territories.length > 0;
    return true;
  };

  const resetWizard = () => {
    setStep(1);
    setReportType("");
    setPeriod("");
    setProductGroups([]);
    setSubdivisions([]);
    setTerritories([]);
    setShowPreview(false);
    setStartDate(undefined);
    setEndDate(undefined);
    setStartMonth(new Date());
    setEndMonth(new Date());
  };

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    padding: "8px 24px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: activeTab === tab
      ? (isDark ? "rgba(186,36,71,0.2)" : "rgba(186,36,71,0.12)")
      : "transparent",
    border: activeTab === tab
      ? "1px solid rgba(186,36,71,0.3)"
      : "1px solid transparent",
    color: activeTab === tab
      ? (isDark ? "#ff6b8a" : "#BA2447")
      : (isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"),
  });

  // Custom caption component with dropdowns
  const CustomCaption = ({ 
    displayMonth, 
    onMonthChange 
  }: { 
    displayMonth: Date; 
    onMonthChange: (month: Date) => void;
  }) => {
    const months = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    const years = Array.from({ length: 7 }, (_, i) => 2020 + i); // 2020-2026

    const currentMonth = displayMonth.getMonth();
    const currentYear = displayMonth.getFullYear();
    const [openMonthDropdown, setOpenMonthDropdown] = useState(false);
    const [openYearDropdown, setOpenYearDropdown] = useState(false);

    const handleMonthChange = (newMonth: number) => {
      const newDate = new Date(currentYear, newMonth, 1);
      onMonthChange(newDate);
      setOpenMonthDropdown(false);
    };

    const handleYearChange = (newYear: number) => {
      const newDate = new Date(newYear, currentMonth, 1);
      onMonthChange(newDate);
      setOpenYearDropdown(false);
    };

    const buttonStyle: React.CSSProperties = {
      padding: "6px 10px",
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
      color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
      transition: "all 0.2s ease",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    };

    const dropdownStyle: React.CSSProperties = {
      position: "absolute",
      top: "100%",
      left: 0,
      marginTop: 4,
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 1000,
      width: "100%",
      maxHeight: 240,
      overflowY: "auto",
      background: isDark ? "rgba(10,15,20,0.9)" : "rgba(255,255,255,0.9)",
      border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
      backdropFilter: "blur(80px)",
      WebkitBackdropFilter: "blur(80px)",
      boxShadow: isDark 
        ? "0 8px 32px rgba(0,0,0,0.6)" 
        : "0 8px 32px rgba(0,0,0,0.25)",
    };

    const optionStyle = (isSelected: boolean): React.CSSProperties => ({
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "8px 14px",
      fontSize: 12,
      fontWeight: 500,
      border: "none",
      background: isSelected ? "rgba(26,141,122,0.15)" : "transparent",
      color: isSelected 
        ? "#1A8D7A" 
        : isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
      cursor: "pointer",
      transition: "all 0.15s ease",
    });

    return (
      <div className="flex items-center gap-2 mb-2 w-full">
        <div className="relative flex-1">
          <button 
            onClick={() => {
              setOpenMonthDropdown(!openMonthDropdown);
              setOpenYearDropdown(false);
            }}
            style={buttonStyle}
          >
            {months[currentMonth]}
            <span style={{ marginLeft: 6, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>▾</span>
          </button>
          {openMonthDropdown && (
            <div style={dropdownStyle}>
              {months.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthChange(index)}
                  style={optionStyle(index === currentMonth)}
                  onMouseEnter={(e) => {
                    if (index !== currentMonth) {
                      (e.target as HTMLElement).style.background = isDark ? "rgba(26,141,122,0.08)" : "rgba(26,141,122,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentMonth) {
                      (e.target as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative flex-1">
          <button 
            onClick={() => {
              setOpenYearDropdown(!openYearDropdown);
              setOpenMonthDropdown(false);
            }}
            style={buttonStyle}
          >
            {currentYear}
            <span style={{ marginLeft: 6, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>▾</span>
          </button>
          {openYearDropdown && (
            <div style={dropdownStyle}>
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  style={optionStyle(year === currentYear)}
                  onMouseEnter={(e) => {
                    if (year !== currentYear) {
                      (e.target as HTMLElement).style.background = isDark ? "rgba(26,141,122,0.08)" : "rgba(26,141,122,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (year !== currentYear) {
                      (e.target as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

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
            <GlassCard className="p-6 my-4 transition-all duration-300">
              {/* Steps indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map(s => (
                  <React.Fragment key={s}>
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: s <= step ? "linear-gradient(135deg, #BA2447, #8B1A35)" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        color: s <= step ? "white" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                        boxShadow: s === step ? "0 0 14px rgba(186,36,71,0.4)" : "none",
                      }}
                    >
                      {s}
                    </div>
                    {s < 5 && (
                      <div
                        className="flex-1 h-0.5 rounded-full"
                        style={{
                          background: s < step ? "#BA2447" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Report type */}
              {step === 1 && (
                <div className="animate-fadeIn">
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
                <div className="animate-fadeIn">
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите временной период
                  </h3>
                  
                  {/* Row 1: Years and Quarters */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    {["2025", "2026", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"].map(p => (
                      <button
                        key={p}
                        style={period === p ? optionBtnActive : optionBtnBase}
                        onClick={() => {
                          setPeriod(p as Period);
                          setStartDate(undefined);
                          setEndDate(undefined);
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  
                  {/* Row 2: January-June */}
                  <div className="flex gap-2 mb-3">
                    {["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"].map(p => (
                      <button
                        key={p}
                        style={period === p ? optionBtnActive : optionBtnBase}
                        onClick={() => {
                          setPeriod(p as Period);
                          setStartDate(undefined);
                          setEndDate(undefined);
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  
                  {/* Row 3: July-December */}
                  <div className="flex gap-2 mb-6">
                    {["Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].map(p => (
                      <button
                        key={p}
                        style={period === p ? optionBtnActive : optionBtnBase}
                        onClick={() => {
                          setPeriod(p as Period);
                          setStartDate(undefined);
                          setEndDate(undefined);
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  
                  {/* Calendar section */}
                  <div 
                    className="rounded-xl p-4 mb-4"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar size={16} style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }} />
                      <span className="text-sm font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                        Или выберите период вручную:
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 lg:gap-[100px]">
                      {/* Start date */}
                      <div className="flex-shrink-0">
                        <label className="block text-xs font-medium mb-2" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                          Дата начала
                        </label>
                        <div
                          className="rdp-container"
                          style={{
                            "--rdp-accent-color": "#1A8D7A",
                            "--rdp-background-color": isDark ? "rgba(26,141,122,0.15)" : "rgba(26,141,122,0.1)",
                          } as React.CSSProperties}
                        >
                          <DayPicker
                            mode="single"
                            selected={startDate}
                            month={startMonth}
                            onMonthChange={setStartMonth}
                            onSelect={(date) => {
                              setStartDate(date);
                              setPeriod("");
                              if (date && endDate && date > endDate) {
                                setEndDate(undefined);
                              }
                            }}
                            locale={ru}
                            disabled={{ after: endDate || new Date() }}
                            className="custom-calendar"
                            components={{
                              Caption: ({ displayMonth }) => (
                                <CustomCaption 
                                  displayMonth={displayMonth} 
                                  onMonthChange={setStartMonth}
                                />
                              ),
                            }}
                            styles={{
                              head_cell: { color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" },
                              cell: { color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" },
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* End date */}
                      <div className="flex-shrink-0">
                        <label className="block text-xs font-medium mb-2" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                          Дата окончания
                        </label>
                        <div
                          className="rdp-container"
                          style={{
                            "--rdp-accent-color": "#1A8D7A",
                            "--rdp-background-color": isDark ? "rgba(26,141,122,0.15)" : "rgba(26,141,122,0.1)",
                          } as React.CSSProperties}
                        >
                          <DayPicker
                            mode="single"
                            selected={endDate}
                            month={endMonth}
                            onMonthChange={setEndMonth}
                            onSelect={(date) => {
                              setEndDate(date);
                              setPeriod("");
                            }}
                            locale={ru}
                            disabled={{ before: startDate || new Date(2024, 0, 1), after: new Date() }}
                            className="custom-calendar"
                            components={{
                              Caption: ({ displayMonth }) => (
                                <CustomCaption 
                                  displayMonth={displayMonth} 
                                  onMonthChange={setEndMonth}
                                />
                              ),
                            }}
                            styles={{
                              head_cell: { color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" },
                              cell: { color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected dates display */}
                    {(startDate || endDate) && (
                      <div 
                        className="mt-4 p-3 rounded-lg text-xs animate-fadeIn"
                        style={{
                          background: isDark ? "rgba(186,36,71,0.08)" : "rgba(186,36,71,0.06)",
                          border: "1px solid rgba(186,36,71,0.2)",
                          color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                        }}
                      >
                        <span className="font-semibold" style={{ color: isDark ? "#ff6b8a" : "#BA2447" }}>Выбранный период: </span>
                        {startDate && format(startDate, "dd.MM.yyyy", { locale: ru })}
                        {startDate && endDate && " — "}
                        {endDate && format(endDate, "dd.MM.yyyy", { locale: ru })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Product group */}
              {step === 3 && (
                <div className="animate-fadeIn">
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите группу товаров <span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontWeight: 400, fontSize: 13 }}>(можно выбрать несколько)</span>
                  </h3>
                  
                  {/* Кнопка "Все" */}
                  <div className="mb-4">
                    <button
                      style={productGroups.length === PRODUCT_GROUPS.length ? optionBtnActive : optionBtnBase}
                      onClick={() => {
                        if (productGroups.length === PRODUCT_GROUPS.length) {
                          setProductGroups([]);
                        } else {
                          setProductGroups([...PRODUCT_GROUPS]);
                        }
                      }}
                    >
                      Все
                    </button>
                  </div>

                  {/* Основной бизнес */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      Основной бизнес
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["ДЕЛИКАТЕСЫ", "ЗАМОРОЖЕННЫЕ ПОЛУФАБРИКАТЫ", "КОЛБАСНЫЕ ИЗДЕЛИЯ", "Мясной проект Ратимир", "ОХЛАЖДЕННЫЕ ПОЛУФАБРИКАТЫ"] as ProductGroup[]).map(g => (
                        <button
                          key={g}
                          style={productGroups.includes(g) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (productGroups.includes(g)) {
                              setProductGroups(productGroups.filter(pg => pg !== g));
                            } else {
                              setProductGroups([...productGroups, g]);
                            }
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Агроптица */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      Агроптица
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Птица замороженная", "Птица охлажденная"] as ProductGroup[]).map(g => (
                        <button
                          key={g}
                          style={productGroups.includes(g) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (productGroups.includes(g)) {
                              setProductGroups(productGroups.filter(pg => pg !== g));
                            } else {
                              setProductGroups([...productGroups, g]);
                            }
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* СТ */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      СТ
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Проект Птица, Мясо", "Проект СТ", "Проект СТ, МП ПЛЮС"] as ProductGroup[]).map(g => (
                        <button
                          key={g}
                          style={productGroups.includes(g) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (productGroups.includes(g)) {
                              setProductGroups(productGroups.filter(pg => pg !== g));
                            } else {
                              setProductGroups([...productGroups, g]);
                            }
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* МАП */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      МАП
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["МАП"] as ProductGroup[]).map(g => (
                        <button
                          key={g}
                          style={productGroups.includes(g) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (productGroups.includes(g)) {
                              setProductGroups(productGroups.filter(pg => pg !== g));
                            } else {
                              setProductGroups([...productGroups, g]);
                            }
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Трейдинг */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      Трейдинг
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Мясо", "Прочие"] as ProductGroup[]).map(g => (
                        <button
                          key={g}
                          style={productGroups.includes(g) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (productGroups.includes(g)) {
                              setProductGroups(productGroups.filter(pg => pg !== g));
                            } else {
                              setProductGroups([...productGroups, g]);
                            }
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Subdivision */}
              {step === 4 && (
                <div className="animate-fadeIn">
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите подразделение <span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontWeight: 400, fontSize: 13 }}>(можно выбрать несколько)</span>
                  </h3>
                  
                  {/* Кнопка "Все" */}
                  <div className="mb-4">
                    <button
                      style={subdivisions.length === SUBDIVISIONS.length ? optionBtnActive : optionBtnBase}
                      onClick={() => {
                        if (subdivisions.length === SUBDIVISIONS.length) {
                          setSubdivisions([]);
                        } else {
                          setSubdivisions([...SUBDIVISIONS]);
                        }
                      }}
                    >
                      Все
                    </button>
                  </div>

                  {/* Дистрибьюторы */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      Дистрибьюторы
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Восточная Сибирь Улан-Удэ", "Восточная Сибирь Чита", "Камчатка", "Магадан", "Сахалин"] as Subdivision[]).map(d => (
                        <button
                          key={d}
                          style={subdivisions.includes(d) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (subdivisions.includes(d)) {
                              setSubdivisions(subdivisions.filter(div => div !== d));
                            } else {
                              setSubdivisions([...subdivisions, d]);
                            }
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ОБП */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      ОБП
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["ОБП Кавалерово", "ОБП Благовещенск", "ОБП Комсомольск", "ОБП Находка", "ОБП Спасск", "ОБП Хабаровск", "Владивосток"] as Subdivision[]).map(d => (
                        <button
                          key={d}
                          style={subdivisions.includes(d) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (subdivisions.includes(d)) {
                              setSubdivisions(subdivisions.filter(div => div !== d));
                            } else {
                              setSubdivisions([...subdivisions, d]);
                            }
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Светофор */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      Светофор
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Светофор"] as Subdivision[]).map(d => (
                        <button
                          key={d}
                          style={subdivisions.includes(d) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (subdivisions.includes(d)) {
                              setSubdivisions(subdivisions.filter(div => div !== d));
                            } else {
                              setSubdivisions([...subdivisions, d]);
                            }
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Сети */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      Сети
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["X5 Retail", "Близкий", "Реми", "Самбери"] as Subdivision[]).map(d => (
                        <button
                          key={d}
                          style={subdivisions.includes(d) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (subdivisions.includes(d)) {
                              setSubdivisions(subdivisions.filter(div => div !== d));
                            } else {
                              setSubdivisions([...subdivisions, d]);
                            }
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ФРС */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                      ФРС
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Фирменная розничная сеть"] as Subdivision[]).map(d => (
                        <button
                          key={d}
                          style={subdivisions.includes(d) ? optionBtnActive : optionBtnBase}
                          onClick={() => {
                            if (subdivisions.includes(d)) {
                              setSubdivisions(subdivisions.filter(div => div !== d));
                            } else {
                              setSubdivisions([...subdivisions, d]);
                            }
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Territory */}
              {step === 5 && (
                <div className="animate-fadeIn">
                  <h3 className="font-bold text-base mb-5" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    Выберите территорию <span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontWeight: 400, fontSize: 13 }}>(можно выбрать несколько)</span>
                  </h3>
                  
                  {/* Кнопка "Все" */}
                  <div className="mb-4">
                    <button
                      style={territories.length === TERRITORIES.length ? optionBtnActive : optionBtnBase}
                      onClick={() => {
                        if (territories.length === TERRITORIES.length) {
                          setTerritories([]);
                        } else {
                          setTerritories([...TERRITORIES]);
                        }
                      }}
                    >
                      Все
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {TERRITORIES.map(t => (
                      <button
                        key={t}
                        style={territories.includes(t) ? optionBtnActive : optionBtnBase}
                        onClick={() => {
                          if (territories.includes(t)) {
                            setTerritories(territories.filter(tr => tr !== t));
                          } else {
                            setTerritories([...territories, t]);
                          }
                        }}
                      >
                        {t}
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
                    className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
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
                    background: canProceed() ? "linear-gradient(135deg, #BA2447, #8B1A35)" : "rgba(186,36,71,0.3)",
                    boxShadow: canProceed() ? "0 0 18px rgba(186,36,71,0.35)" : "none",
                    cursor: canProceed() ? "pointer" : "not-allowed",
                  }}
                >
                  {step < 5 ? "Далее →" : "Показать фильтры"}
                </button>
              </div>
            </GlassCard>
          ) : (
            /* Preview */
            <GlassCard className="p-6 max-w-2xl">
              <div
                className="rounded-xl p-4 mb-6 text-sm leading-relaxed"
                style={{
                  background: isDark ? "rgba(186,36,71,0.06)" : "rgba(186,36,71,0.04)",
                  border: "1px solid rgba(186,36,71,0.2)",
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                }}
              >
                <p className="font-bold mb-3" style={{ color: isDark ? "#ff6b8a" : "#BA2447" }}>
                  Для создания отчёта будут применены фильтры:
                </p>
                <ul className="space-y-1.5">
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Временной период:</span> <strong>{period || (startDate && endDate ? `${format(startDate, "dd.MM.yyyy", { locale: ru })} — ${format(endDate, "dd.MM.yyyy", { locale: ru })}` : "Не выбран")}</strong></li>
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Группа товаров:</span> <strong>{productGroups.map(pg => pg.toUpperCase()).join(", ")}</strong></li>
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Подразделение:</span> <strong>{subdivisions.join(", ")}</strong></li>
                  <li><span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>Территория:</span> <strong>{territories.join(", ")}</strong></li>
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
                    background: "linear-gradient(135deg, #BA2447, #8B1A35)",
                    boxShadow: "0 0 18px rgba(186,36,71,0.35)",
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
                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                    color: "white",
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
                    background: "linear-gradient(135deg, #1A8D7A, #157A6A)",
                    border: "1px solid rgba(26,141,122,0.3)",
                    color: "white",
                    boxShadow: "0 0 12px rgba(26,141,122,0.25)",
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