import React, { useState } from "react";
import { SectionHeader, GlassCard } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import { ExternalLink, Download, Search, BookOpen, FileText, Video, Play } from "lucide-react";

type Category = "Все" | "Финансы" | "Продажи" | "Доставка" | "Система" | "HR";
type DocType = "web" | "pdf" | "video";

interface Instruction {
  id: number;
  title: string;
  description: string;
  category: Category;
  type: DocType;
  url: string;
  updated: string;
  size?: string;
}

const instructions: Instruction[] = [
  { id: 1, title: "Руководство по работе с дашбордом", description: "Навигация, фильтры, экспорт данных, настройка отображения виджетов и спидометров.", category: "Система", type: "web", url: "#", updated: "15.03.2026" },
  { id: 2, title: "Регламент закрытия финансового периода", description: "Пошаговый алгоритм закрытия месяца: сверка дебиторки, отчёт по марже, согласование с бухгалтерией.", category: "Финансы", type: "pdf", url: "#", updated: "01.03.2026", size: "1.4 МБ" },
  { id: 3, title: "Контроль дебиторской задолженности", description: "Порядок мониторинга, уведомления контрагентов и эскалации при превышении лимитов ДЗ.", category: "Финансы", type: "pdf", url: "#", updated: "10.03.2026", size: "0.8 МБ" },
  { id: 4, title: "Регламент планирования продаж (S&OP)", description: "Процесс согласования планов между коммерческим блоком и производством. Сроки, ответственные.", category: "Продажи", type: "pdf", url: "#", updated: "05.03.2026", size: "2.1 МБ" },
  { id: 5, title: "Ценовая политика и матрица скидок", description: "Порядок согласования нестандартных условий по категориям продуктов и каналам сбыта.", category: "Продажи", type: "web", url: "#", updated: "18.03.2026" },
  { id: 6, title: "Работа с TMS — видеоинструкция", description: "Создание маршрутов, контроль исполнения, работа с отклонениями. Для логистов и диспетчеров.", category: "Доставка", type: "video", url: "#", updated: "12.03.2026" },
  { id: 7, title: "Расчёт утилизации транспортных средств", description: "Методология расчёта KPI утилизации ТС. Нормативы по типам маршрутов, учёт простоев.", category: "Доставка", type: "pdf", url: "#", updated: "08.03.2026", size: "1.1 МБ" },
  { id: 8, title: "Положение о системе мотивации (KPI)", description: "KPI для коммерческого блока, логистики и поддерживающих функций. Порядок расчёта премий.", category: "HR", type: "pdf", url: "#", updated: "01.03.2026", size: "3.2 МБ" },
  { id: 9, title: "Постановка задач и контроль сроков", description: "Как создавать, назначать и закрывать задачи. Правила приоритетов и эскалации при просрочке.", category: "Система", type: "web", url: "#", updated: "20.03.2026" },
  { id: 10, title: "Стандарт уровня сервиса (SLA)", description: "Целевые показатели OTIF, критерии оценки качества доставки, порядок работы с претензиями.", category: "Доставка", type: "pdf", url: "#", updated: "14.03.2026", size: "0.6 МБ" },
];

const categories: Category[] = ["Все", "Финансы", "Продажи", "Доставка", "Система", "HR"];

const catStyle: Record<string, React.CSSProperties> = {
  Финансы: { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" },
  Продажи: { background: "rgba(26,141,122,0.1)", border: "1px solid rgba(26,141,122,0.2)", color: "#34d399" },
  Доставка: { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24" },
  Система: { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" },
  HR: { background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", color: "#f9a8d4" },
};

const typeConfig: Record<DocType, { icon: React.ReactNode; label: string; color: string }> = {
  web: { icon: <BookOpen size={18} />, label: "Веб", color: "#93c5fd" },
  pdf: { icon: <FileText size={18} />, label: "PDF", color: "#f87171" },
  video: { icon: <Video size={18} />, label: "Видео", color: "#c084fc" },
};

export function Instructions() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Все");

  const filtered = instructions.filter(ins =>
    (activeCategory === "Все" || ins.category === activeCategory) &&
    (search === "" || ins.title.toLowerCase().includes(search.toLowerCase()) || ins.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <SectionHeader
        title="База знаний"
        description="Регламенты, инструкции и видеоматериалы. Открывайте в браузере или скачивайте — всё в одном месте."
        badge={`${instructions.length} документов`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {(["web", "pdf", "video"] as DocType[]).map(t => {
          const count = instructions.filter(i => i.type === t).length;
          const tc = typeConfig[t];
          return (
            <GlassCard key={t} className="p-4 flex items-center gap-4 my-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(${tc.color === "#93c5fd" ? "59,130,246" : tc.color === "#f87171" ? "239,68,68" : "168,85,247"},0.15)`, color: tc.color }}
              >
                {tc.icon}
              </div>
              <div>
                <p className="text-xl font-black" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>{count}</p>
                <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>{tc.label}-{t === "web" ? "страниц" : t === "pdf" ? "документов" : "уроков"}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} />
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"}`,
              borderRadius: 12,
              color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
              fontSize: 13,
              padding: "9px 12px 9px 34px",
              outline: "none",
            }}
          />
        </div>
        <div
          className="flex gap-1 p-1 rounded-xl flex-wrap"
          style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={activeCategory === cat
                ? { background: "rgba(204,0,0,0.15)", color: "#e57373", border: "1px solid rgba(204,0,0,0.3)" }
                : { color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", border: "1px solid transparent" }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
          <BookOpen size={44} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Ничего не найдено</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(ins => {
          const tc = typeConfig[ins.type];
          const cs = catStyle[ins.category] || {};
          return (
            <GlassCard
              key={ins.id}
              className="p-5 my-4 transition-all duration-200"
              style={{}}>
              {/* Top row */}
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `rgba(${tc.color === "#93c5fd" ? "59,130,246" : tc.color === "#f87171" ? "239,68,68" : "168,85,247"},0.12)`,
                    border: `1px solid rgba(${tc.color === "#93c5fd" ? "59,130,246" : tc.color === "#f87171" ? "239,68,68" : "168,85,247"},0.2)`,
                    color: tc.color,
                  }}
                >
                  {tc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={cs}>{ins.category}</span>
                    <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>{tc.label}</span>
                    {ins.size && <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}>{ins.size}</span>}
                  </div>
                  <h4 className="text-sm font-semibold leading-snug mb-1" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    {ins.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)" }}>
                    {ins.description}
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              <div
                className="flex items-center justify-between mt-4 pt-3"
                style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
              >
                <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
                  Обновлено {ins.updated}
                </span>
                <div className="flex gap-3">
                  {ins.type === "web" && (
                    <a href={ins.url} className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                      style={{ color: "#93c5fd" }}>
                      Открыть <ExternalLink size={12} />
                    </a>
                  )}
                  {ins.type === "pdf" && (
                    <>
                      <a href={ins.url} className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: "#93c5fd" }}>
                        Открыть <ExternalLink size={12} />
                      </a>
                      <a href={ins.url} className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                        Скачать <Download size={12} />
                      </a>
                    </>
                  )}
                  {ins.type === "video" && (
                    <a href={ins.url} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg"
                      style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
                      <Play size={11} /> Смотреть
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}