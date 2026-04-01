import React from "react";
import { useNavigate } from "react-router";
import {
  Binoculars,
  TrendingUp,
  ShoppingCart,
  Truck,
  ClipboardList,
  BookOpen,
  Brain,
  FileText,
  BarChart2,
  Bot,
  MessageSquare,
  HelpCircle,
  Store,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

interface NavCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  onClick: () => void;
  disabled?: boolean;
}

function NavCard({ title, description, icon, iconColor, iconBg, onClick, disabled }: NavCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.97)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textPrimary = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-start gap-2.5 p-3.5 rounded-xl transition-all text-left h-full"
      style={{
        background: disabled ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)") : cardBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.06)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
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
            ? "0 4px 16px rgba(0,0,0,0.2)" 
            : "0 4px 16px rgba(0,0,0,0.06)";
        }
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div
          className="text-sm font-semibold mb-1 leading-tight"
          style={{ color: textPrimary }}
        >
          {title}
        </div>
        <div
          className="text-xs leading-snug line-clamp-2"
          style={{ color: textSecondary }}
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

  const textPrimary = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const sectionLabel = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";

  const navItems = [
    {
      title: "Обзор",
      description: "Сводная панель показателей",
      icon: <Binoculars size={16} />,
      iconColor: "#6b84ff",
      iconBg: "rgba(79, 110, 247, 0.15)",
      route: "/overview",
    },
    {
      title: "Финансы",
      description: "Бюджет, расходы, прогнозы",
      icon: <TrendingUp size={16} />,
      iconColor: "#1A8D7A",
      iconBg: "rgba(26, 141, 122, 0.15)",
      route: "/finance",
    },
    {
      title: "Продажи",
      description: "Выручка, воронка, KPI",
      icon: <ShoppingCart size={16} />,
      iconColor: "#6b84ff",
      iconBg: "rgba(79, 110, 247, 0.15)",
      route: "/sales",
    },
    {
      title: "Логистика",
      description: "Поставки, склады, маршруты",
      icon: <Truck size={16} />,
      iconColor: "#ff9500",
      iconBg: "rgba(255, 149, 0, 0.15)",
      route: "/delivery",
    },
    {
      title: "Задачи",
      description: "Проекты, сроки, исполнители",
      icon: <ClipboardList size={16} />,
      iconColor: "#bf5af2",
      iconBg: "rgba(175, 82, 222, 0.15)",
      route: "/tasks",
    },
    // Second row
    {
      title: "База знаний",
      description: "Документы, регламенты, FAQ",
      icon: <BookOpen size={16} />,
      iconColor: "#32ade6",
      iconBg: "rgba(50, 173, 230, 0.15)",
      route: "/instructions",
    },
    {
      title: "AI Ассистент",
      description: "Чат с корпоративным ИИ",
      icon: <Brain size={16} />,
      iconColor: "#5e5ce6",
      iconBg: "rgba(94, 92, 230, 0.15)",
      route: "/assistant",
    },
    {
      title: "Отчёты",
      description: "Аналитика и сводки",
      icon: <FileText size={16} />,
      iconColor: "#ffd60a",
      iconBg: "rgba(255, 214, 10, 0.15)",
      route: "/reports",
    },
    {
      title: "Оперативный отчёт",
      description: "Текущее состояние дел",
      icon: <BarChart2 size={16} />,
      iconColor: "#ba2447",
      iconBg: "rgba(186, 36, 71, 0.15)",
      route: "/operative-report",
    },
    {
      title: "ФРС",
      description: "Фирменная розничная сеть",
      icon: <Store size={16} />,
      iconColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
      iconBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      route: "/frs",
      disabled: true,
    },
  ];

  const serviceItems = [
    {
      title: "CorpGPT",
      description: "Корпоративная языковая модель",
      icon: <Bot size={16} />,
      iconColor: "#30d158",
      iconBg: "rgba(48, 209, 88, 0.12)",
      route: "https://corpgpt.ratimir.ru",
      badge: "AI",
    },
    {
      title: "Telegram-бот",
      description: "Уведомления и быстрые команды",
      icon: <MessageSquare size={16} />,
      iconColor: "#6b84ff",
      iconBg: "rgba(79, 110, 247, 0.15)",
      route: "https://t.me/ratimir_bot",
      badge: "Bot",
    },
    {
      title: "Helpdesk",
      description: "Постановка задач, справочник, база знаний",
      icon: <HelpCircle size={16} />,
      iconColor: "#ff6482",
      iconBg: "rgba(255, 100, 130, 0.15)",
      route: "/helpdesk",
      badge: "Help",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-4xl font-bold mb-3"
          style={{ color: textPrimary, letterSpacing: "normal" }}
        >
          Главная
        </h1>
        <p
          className="text-base"
          style={{ color: textSecondary }}
        >
          Аналитическая платформа Ратимир — единое рабочее пространство для управления данными компании
        </p>
      </div>

      {/* Main sections */}
      <div className="mb-8">
        <div
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: sectionLabel, letterSpacing: "0.08em" }}
        >
          Разделы
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {navItems.slice(0, 5).map((item) => (
            <NavCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              iconColor={item.iconColor}
              iconBg={item.iconBg}
              onClick={() => navigate(item.route)}
              disabled={item.disabled}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {navItems.slice(5).map((item) => (
            <NavCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              iconColor={item.iconColor}
              iconBg={item.iconBg}
              onClick={() => navigate(item.route)}
              disabled={item.disabled}
            />
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="mb-10">
        <div
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: sectionLabel, letterSpacing: "0.08em" }}
        >
          Сервисы
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {serviceItems.map((item) => (
            <NavCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              iconColor={item.iconColor}
              iconBg={item.iconBg}
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