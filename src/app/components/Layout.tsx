import ratimir_logo_official from "@/assets/ratimir-logo-official.png"; // логотип
import ratimir_logo from "@/assets/ratimir-logo.png"; // текст
import React, { useState, useRef, useEffect } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Truck,
  ClipboardList,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  Sun,
  Moon,
  FileText,
  BarChart2,
  Menu,
  X,
  MessageCircle,
  Binoculars,
  Home,
  Store,
  Warehouse,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { FeedbackPopup } from "./FeedbackWidget";

interface AuthProps {
  onLogout: () => void;
  userName?: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { to: "/home", label: "Главная", icon: Home },
  { to: "/overview", label: "Обзор", icon: Binoculars },
  { to: "/frs", label: "ФРС", icon: Store },
  { to: "/finance", label: "Финансы", icon: TrendingUp },
  { to: "/sales", label: "Продажи", icon: ShoppingCart },
  { to: "/delivery", label: "Логистика", icon: Truck },
  { to: "/stock", label: "Остатки", icon: Warehouse },
  { to: "/tasks", label: "Задачи", icon: ClipboardList },
  { to: "/instructions", label: "База знаний", icon: BookOpen },
  { to: "/assistant", label: "AI Ассистент", icon: Brain },
  { to: "/reports", label: "Отчёты", icon: FileText },
  {
    to: "/operative-report",
    label: "Оперативный отчёт",
    icon: BarChart2,
  },
];

const separatorAfter = "/tasks";

const sampleNotifications = [
  {
    id: 1,
    text: "Новый отчёт по продажам готов",
    time: "5 мин. назад",
  },
  {
    id: 2,
    text: "Дебиторка превысила лимит",
    time: "12 мин. назад",
  },
  {
    id: 3,
    text: "Задача просрочена: Согласование бюджета",
    time: "1 ч. назад",
  },
];

export function Layout({
  onLogout,
  userName = "Иванов Иван",
}: AuthProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Scroll position storage for each route
  const scrollPositions = useRef<Record<string, number>>({});
  const mainRef = useRef<HTMLElement>(null);

  const isDark = theme === "dark";

  const sidebarWidth = collapsed ? 80 : 240;

  // Save and restore scroll position per route
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    // Save current scroll position for previous location
    return () => {
      scrollPositions.current[location.pathname] =
        mainEl.scrollTop;
    };
  }, [location.pathname]);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    // Restore scroll position for current route, or scroll to top if new route
    const savedPosition =
      scrollPositions.current[location.pathname];
    if (savedPosition !== undefined) {
      mainEl.scrollTop = savedPosition;
    } else {
      mainEl.scrollTop = 0;
    }
  }, [location.pathname]);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen)
      document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, [notificationsOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const filteredNavItems = searchQuery.trim()
    ? navItems.filter((item) =>
        item.label
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : [];

  const bgBase = isDark ? "#0f1419" : "#f8f9fa";

  const sidebarBg = isDark
    ? "rgba(255,255,255,0.025)"
    : "rgba(255,255,255,0.97)";
  const sidebarBorder = isDark
    ? "1px solid rgba(255,255,255,0.07)"
    : "1px solid rgba(0,0,0,0.08)";
  const headerBg = isDark
    ? "#0f1419"
    : "rgba(255,255,255,0.98)";
  const headerBorder = isDark
    ? "1px solid rgba(255,255,255,0.05)"
    : "1px solid rgba(0,0,0,0.08)";

  const iconBtnStyle: React.CSSProperties = {
    background: isDark
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.05)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
    color: isDark
      ? "rgba(255,255,255,0.55)"
      : "rgba(0,0,0,0.55)",
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  };

  const navActiveStyle: React.CSSProperties = isDark
    ? {
        background: "rgba(186,36,71,0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(186,36,71,0.2)",
        color: "#ff6b6b",
      }
    : {
        background: "rgba(186,36,71,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(186,36,71,0.15)",
        color: "#ba2447",
      };

  const navInactiveStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid transparent",
    color: isDark
      ? "rgba(255,255,255,0.4)"
      : "rgba(0,0,0,0.45)",
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: bgBase }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 z-20 relative transition-all duration-300"
        style={{
          width: sidebarWidth,
          background: sidebarBg,
          backdropFilter: isDark ? "blur(24px)" : "none",
          WebkitBackdropFilter: isDark ? "blur(24px)" : "none",
          borderRight: sidebarBorder,
          fontSize: "16px",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-14 flex-shrink-0 px-4"
          style={{
            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <img
            src={ratimir_logo_official}
            alt="Ратимир"
            style={{ height: 34, minHeight: 33, flexShrink: 0 }}
          />
          {!collapsed && (
            <div className="ml-3 overflow-hidden flex-1">
              <p
                className="font-black text-sm tracking-widest"
                style={{
                  color: "#9e233b",
                  letterSpacing: "0.15em",
                }}
              >
                РАТИМИР
              </p>
              <p
                className="text-xs"
                style={{
                  color: isDark
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(0,0,0,0.4)",
                }}
              >
                Аналитика
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            if (item.disabled) {
              // Disabled item - не кликабельный
              return (
                <React.Fragment key={item.to}>
                  <div
                    className="flex items-center rounded-xl cursor-not-allowed"
                    style={{
                      background: "transparent",
                      border: "1px solid transparent",
                      opacity: 0.4,
                      minHeight: 40,
                      padding: collapsed ? "0" : "0 10px",
                      justifyContent: collapsed ? "center" : "flex-start",
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 17, height: 40 }}
                    >
                      <item.icon
                        size={17}
                        className="flex-shrink-0"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                    {!collapsed && (
                      <span
                        className="text-sm font-medium truncate ml-3"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.3)",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                  {item.to === separatorAfter && (
                    <div
                      className="my-2 mx-2"
                      style={{
                        height: 1,
                        background: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.08)",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl transition-all duration-200 group relative ${
                      isActive ? "" : "hover:opacity-90"
                    }`
                  }
                  style={({ isActive }) => ({
                    ...(isActive ? navActiveStyle : navInactiveStyle),
                    minHeight: 40,
                    padding: collapsed ? "0" : "0 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                  })}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(180deg, #ba2447, #8B0000)",
                          }}
                        />
                      )}
                      <div
                        className="flex items-center justify-center"
                        style={{ width: 17, height: 40 }}
                      >
                        <item.icon
                          size={17}
                          className="flex-shrink-0"
                          style={{
                            color: isActive
                              ? isDark
                                ? "#ff6b6b"
                                : "#ba2447"
                              : isDark
                                ? "rgba(255,255,255,0.4)"
                                : "rgba(0,0,0,0.45)",
                          }}
                        />
                      </div>
                      {!collapsed && (
                        <span
                          className="text-sm font-medium truncate ml-3"
                          style={{
                            color: isActive
                              ? isDark
                                ? "#ffcece"
                                : "#ba2447"
                              : isDark
                                ? "rgba(255,255,255,0.55)"
                                : "rgba(0,0,0,0.55)",
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
                {item.to === separatorAfter && (
                  <div
                    className="my-2 mx-2"
                    style={{
                      height: 1,
                      background: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.08)",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Bottom: Feedback button */}
        <div className="px-2 mb-3">
          <button
            onClick={() => setFeedbackOpen(!feedbackOpen)}
            className="flex items-center rounded-xl transition-all duration-200 w-full"
            style={{
              background: feedbackOpen
                ? isDark
                  ? "rgba(186,36,71,0.12)"
                  : "rgba(186,36,71,0.08)"
                : "transparent",
              border: feedbackOpen
                ? isDark
                  ? "1px solid rgba(186,36,71,0.2)"
                  : "1px solid rgba(186,36,71,0.15)"
                : "1px solid transparent",
              color: isDark
                ? "rgba(255,255,255,0.4)"
                : "rgba(0,0,0,0.45)",
              minHeight: 40,
              padding: collapsed ? "0" : "0 10px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            title={collapsed ? "Обратная связь" : undefined}
          >
            <div
              className="flex items-center justify-center"
              style={{ height: 40 }}
            >
              <MessageCircle
                size={17}
                className="flex-shrink-0"
                style={{
                  color: feedbackOpen
                    ? "#ba2447"
                    : isDark
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(0,0,0,0.45)",
                }}
              />
            </div>
            {!collapsed && (
              <span
                className="text-sm font-medium truncate ml-3"
                style={{
                  color: feedbackOpen
                    ? isDark
                      ? "#ffcece"
                      : "#ba2447"
                    : isDark
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(0,0,0,0.55)",
                }}
              >
                Обратная связь
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Feedback popup */}
      <FeedbackPopup
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="h-14 flex items-center gap-2 flex-shrink-0 relative px-4"
          style={{
            background: headerBg,
            backdropFilter: isDark ? "blur(20px)" : "none",
            WebkitBackdropFilter: isDark
              ? "blur(20px)"
              : "none",
            borderBottom: headerBorder,
            zIndex: 10000,
          }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={iconBtnStyle}
            title="Свернуть меню"
          >
            <Menu size={15} />
          </button>

          {/* Last update */}
          <span
            className="text-xs whitespace-nowrap hidden sm:block"
            style={{
              color: isDark
                ? "rgba(255,255,255,0.25)"
                : "rgba(0,0,0,0.35)",
            }}
          >
            Последнее обновление 24.03.2026
          </span>

          {/* Brand name — centered OR search input */}
          <div className="flex-1 flex justify-center">
            {searchOpen ? (
              <div className="relative w-full max-w-md">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Поиск по разделам..."
                  className="w-full px-4 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.05)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid rgba(0,0,0,0.12)",
                    color: isDark
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(0,0,0,0.85)",
                  }}
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(0,0,0,0.4)",
                  }}
                >
                  <X size={14} />
                </button>
                {/* Search dropdown */}
                {searchQuery.trim() &&
                  filteredNavItems.length > 0 && (
                    <div
                      className="absolute top-full mt-1 left-0 right-0 rounded-xl overflow-hidden z-50"
                      style={{
                        background: isDark
                          ? "rgba(10,15,20,0.92)"
                          : "rgba(250,250,252,0.92)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                        backdropFilter: "blur(80px)",
                        WebkitBackdropFilter: "blur(80px)",
                        boxShadow: isDark
                          ? "0 8px 32px rgba(0,0,0,0.6)"
                          : "0 8px 32px rgba(0,0,0,0.25)",
                      }}
                    >
                      {filteredNavItems.map((item) => (
                        <button
                          key={item.to}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors"
                          style={{
                            color: isDark
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(0,0,0,0.7)",
                            borderBottom: isDark
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "1px solid rgba(0,0,0,0.05)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              isDark
                                ? "rgba(186,36,71,0.1)"
                                : "rgba(186,36,71,0.06)";
                            e.currentTarget.style.color =
                              "#e57373";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "transparent";
                            e.currentTarget.style.color = isDark
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(0,0,0,0.7)";
                          }}
                          onClick={() => {
                            navigate(item.to);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <item.icon size={15} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ) : (
              <img
                src={
                  ratimir_logo
                }
                alt="РАТИМИР"
                className="select-none mx-[15px] my-[-16px]"
                style={{
                  maxHeight: "29px",
                  filter: isDark
                    ? "drop-shadow(0 0 20px rgba(186,36,71,0.4))"
                    : "none",
                }}
              />
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={iconBtnStyle}
            title={isDark ? "Светлая тема" : "Тёмная тема"}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications */}
          <div
            className="relative"
            ref={notifRef}
            style={{ zIndex: 9999 }}
          >
            <button
              className="relative"
              style={iconBtnStyle}
              title="Уведомления"
              onClick={() =>
                setNotificationsOpen(!notificationsOpen)
              }
            >
              <Bell size={15} />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                style={{
                  background: "#ba2447",
                  fontSize: 9,
                  boxShadow: "0 0 8px rgba(186,36,71,0.6)",
                }}
              >
                3
              </span>
            </button>

            {/* Notifications panel */}
            {notificationsOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden"
                style={{
                  background: isDark
                    ? "rgba(15,20,25,0.92)"
                    : "rgba(250,250,252,0.92)",
                  backdropFilter: "blur(80px)",
                  WebkitBackdropFilter: "blur(80px)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid rgba(0,0,0,0.1)",
                  boxShadow: isDark
                    ? "0 20px 60px rgba(0,0,0,0.5)"
                    : "0 20px 60px rgba(0,0,0,0.2)",
                  zIndex: 9999,
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderBottom: isDark
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "1px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: isDark
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(0,0,0,0.85)",
                    }}
                  >
                    Уведомления
                  </span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.06)",
                      color: isDark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.4)",
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {sampleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 transition-colors"
                      style={{
                        borderBottom: isDark
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "1px solid rgba(0,0,0,0.04)",
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.75)"
                            : "rgba(0,0,0,0.75)",
                        }}
                      >
                        {notif.text}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.35)",
                        }}
                      >
                        {notif.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <button
            style={iconBtnStyle}
            title="Поиск"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setSearchQuery("");
            }}
          >
            <Search size={15} />
          </button>

          {/* AI Agent */}
          <button
            style={{
              ...iconBtnStyle,
              background: isDark
                ? "rgba(186,36,71,0.12)"
                : "rgba(186,36,71,0.08)",
              border: "1px solid rgba(186,36,71,0.25)",
              color: "#ba2447",
            }}
            title="AI Агент"
            onClick={() => navigate("/assistant")}
          >
            <Brain size={15} />
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.1)",
            }}
            title="Профиль"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, #ba2447, #8B0000)",
              }}
            >
              {getInitials(userName)}
            </div>
            <span
              className="text-xs font-medium hidden md:block"
              style={{
                color: isDark
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(0,0,0,0.6)",
              }}
            >
              {userName.split(" ")[0]}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            style={{
              ...iconBtnStyle,
              color: isDark
                ? "rgba(255,100,100,0.6)"
                : "rgba(180,0,0,0.6)",
            }}
            title="Выйти"
          >
            <LogOut size={15} />
          </button>
        </header>

        {/* Page */}
        <main
          className="flex-1 overflow-y-auto p-5"
          style={{ background: "transparent" }}
          ref={mainRef}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name.slice(0, 2).toUpperCase();
}