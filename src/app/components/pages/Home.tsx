import React from "react";
import { useNavigate } from "react-router";
import {
  Binoculars, TrendingUp, ShoppingCart, Truck,
  ClipboardList, Bot, MessageSquare, HelpCircle,
  Package, LayoutDashboard, Store, BookOpen, FileBarChart,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

interface NavCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function NavCard({ title, description, icon, onClick, disabled }: NavCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-start gap-2.5 p-3.5 rounded-xl transition-all text-left"
      style={{
        width: "275px",
        minHeight: "96px",
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.20)" : "0 2px 12px rgba(0,0,0,0.06)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = isDark
            ? "0 8px 24px rgba(0,0,0,0.35)"
            : "0 8px 24px rgba(0,0,0,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isDark
            ? "0 2px 12px rgba(0,0,0,0.20)"
            : "0 2px 12px rgba(0,0,0,0.06)";
        }
      }}
    >
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
          color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          className="text-sm font-semibold mb-0.5 leading-tight"
          style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)" }}
        >
          {title}
        </div>
        <div
          className="text-xs leading-snug"
          style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
        >
          {description}
        </div>
      </div>
    </button>
  );
}

export function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const textPrimary   = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.48)";
  const sectionLabel  = isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.38)";
  const divider       = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const iconSize      = 14;

  const navItems = [
    { title: "Обзор",     description: "Сводная панель показателей",        icon: <Binoculars size={iconSize} />,    route: "/overview" },
    { title: "ФРС",       description: "Финансовая отчётность сети",        icon: <Store size={iconSize} />,         route: "/frs" },
    { title: "Финансы",   description: "Бюджет, расходы, прогнозы",         icon: <TrendingUp size={iconSize} />,    route: "/finance" },
    { title: "Продажи",   description: "Выручка, воронка, KPI",             icon: <ShoppingCart size={iconSize} />,  route: "/sales" },
    { title: "Логистика", description: "Поставки, склады, маршруты",        icon: <Truck size={iconSize} />,         route: "/delivery" },
    { title: "Остатки",   description: "Запасы ГП, ОСГ, возвраты",          icon: <Package size={iconSize} />,       route: "/stock" },
    { title: "Задачи",    description: "Проекты, сроки, исполнители",       icon: <ClipboardList size={iconSize} />, route: "/tasks" },
  ];

  const toolItems = [
    { title: "База знаний",        description: "Документы, регламенты, FAQ",      icon: <BookOpen size={iconSize} />,      route: "/instructions" },
    { title: "AI Ассистент",       description: "Чат с корпоративным ИИ",          icon: <Bot size={iconSize} />,           route: "/assistant" },
    { title: "Отчёты",             description: "Формирование, загрузка, анализ",  icon: <FileBarChart size={iconSize} />,  route: "/reports" },
    { title: "Оперативный отчёт",  description: "Актуальный срез данных",          icon: <LayoutDashboard size={iconSize}/>, route: "/operative-report" },
  ];

  const serviceItems = [
    { title: "CorpGPT",      description: "Корпоративная языковая модель",           icon: <Bot size={iconSize} />,         route: "https://corpgpt.ratimir.ru" },
    { title: "Telegram-бот", description: "Аналитика в телефоне",                    icon: <MessageSquare size={iconSize}/>, route: "https://t.me/ratimir_bot" },
    { title: "Helpdesk",     description: "Задачи, справочник, база знаний",         icon: <HelpCircle size={iconSize} />,  route: "/helpdesk" },
    { title: "ФРС",          description: "Финансовая отчётность сети",              icon: <Store size={iconSize} />,        route: "/frs" },
  ];

  return (
    <div className="max-w-9xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary, letterSpacing: "-0.01em" }}>
          Главная
        </h1>
        <p className="text-sm" style={{ color: textSecondary, maxWidth: 1000 }}>
          Аналитическая платформа Ратимир — единое рабочее пространство для управления данными компании
        </p>
      </div>

      {/* Разделы */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: sectionLabel }}>
          Разделы
        </div>
        <div className="flex flex-wrap gap-3">
          {navItems.map((item) => (
            <NavCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => navigate(item.route)}
            />
          ))}
        </div>
      </div>

      {/* Инструменты */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: sectionLabel }}>
          Инструменты
        </div>
        <div className="flex flex-wrap gap-3">
          {toolItems.map((item) => (
            <NavCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => navigate(item.route)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4" style={{ height: 1, background: divider }} />

      {/* Сервисы */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: sectionLabel }}>
          Сервисы
        </div>
        <div className="flex flex-wrap gap-3">
          {serviceItems.map((item) => (
            <NavCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => {
                if (item.route.startsWith("http")) {
                  window.open(item.route, "_blank");
                } else {
                  navigate(item.route);
                }
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}