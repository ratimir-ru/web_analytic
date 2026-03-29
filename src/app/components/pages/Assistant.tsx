import React, { useState, useRef, useEffect } from "react";
import { SectionHeader, GlassCard } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import { Send, Bot, User, Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown, Zap } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const suggestions = [
  "Какие показатели ниже плана?",
  "Дебиторская задолженность",
  "Утилизация транспорта",
  "Просроченные задачи",
  "Где хуже всего маржа?",
  "Как улучшить уровень сервиса?",
];

const botResponses: Record<string, string> = {
  default: "Я анализирую данные вашего дашборда в реальном времени. Задайте вопрос — отвечу с цифрами и рекомендациями.",
  план: "По итогам марта 2026 следующие показатели ниже плана:\n\n**Объём продаж** — 948 т при плане 980 т (−3.1%)\n**Мясной проект** — 118 т при плане 130 т (−9.2%)\n**Охлажденные ПФ** — 195 т при плане 210 т (−7.1%)\n\nРекомендация: сфокусироваться на двух отстающих категориях — провести разбор с коммерческим отделом до конца недели.",
  дебитор: "Текущая дебиторская задолженность — **14.7 млн ₽**, что превышает лимит (13.1 млн ₽) на **+12.4%**.\n\nКритические кейсы:\n• ООО «Ромашка» — 4.2 млн ₽, 45 дней просрочки\n• ИП Сидоров А.В. — 2.8 млн ₽, 38 дней просрочки\n\nПо обоим контрагентам рекомендую инициировать претензионную процедуру не позднее 25.03.",
  транспорт: "Утилизация ТС за неделю:\n\n• **Москва** — 91% ✅\n• **Санкт-Петербург** — 88% ✅\n• **МО (север)** — 84% 🟡 (чуть ниже цели 85%)\n• **МО (юг)** — 79% 🟡\n• **Регионы ЦФО** — 72% 🔴\n\nГлавная точка роста — ЦФО. Рекомендую пересмотреть маршрутизацию и объединить редкие развозки.",
  задач: "Статус задач:\n\n• Всего: **10**\n• Просрочено: **3** (критично!)\n• В работе: **4**\n• Выполнено: **1**\n\nСамые горящие:\n1. Сверка ДЗ по ООО «Ромашка» — +7 дней (Иванов И.И.)\n2. Акция «Мясной проект» — +2 дня (Петрова М.С.)\n3. Температурный контроль ТС — +2 дня (Новиков А.П.)",
  маржа: "Маржинальность по категориям:\n\n• **Деликатесы** — 45% ✅ (план 42%, перевыполнение)\n• **Заморозка** — 29% ✅ (план 28%)\n• **Колбасы** — 29% 🟡 (план 32%, −3 п.п.)\n• **Охлажденные ПФ** — 19% 🔴 (план 22%)\n• **Мясной проект** — 15% 🔴 (план 18%)\n\nОтставание ПФ и Мясного обусловлено ростом себестоимости сырья. Нужен пересмотр отпускных цен.",
  сервис: "Для выхода на целевой уровень сервиса (97%):\n\n1. **Доставка в срок (95.4%)** — оптимизировать маршруты ЦФО, сократить «длинные хвосты» развозки\n2. **OTIF (93.2%)** — внедрить ежедневный дашборд отклонений для диспетчеров\n3. **Отказы (1.2% vs 0.5%)** — провести разбор причин с водителями\n\nПервый шаг: встреча логистической команды в пятницу.",
};

function getResponse(text: string): string {
  const l = text.toLowerCase();
  if (l.includes("план") || l.includes("ниже") || l.includes("отклонен")) return botResponses["план"];
  if (l.includes("дебитор") || l.includes("задолженност") || l.includes("контрагент")) return botResponses["дебитор"];
  if (l.includes("транспорт") || l.includes("утилиза") || l.includes("тс")) return botResponses["транспорт"];
  if (l.includes("задач") || l.includes("просроч")) return botResponses["задач"];
  if (l.includes("маржа") || l.includes("маржин")) return botResponses["маржа"];
  if (l.includes("сервис") || l.includes("otif") || l.includes("доставк")) return botResponses["сервис"];
  return botResponses["default"] + "\n\nПопробуйте один из быстрых запросов выше.";
}

export function Assistant() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formatMessage = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.95)" }}>{part.slice(2, -2)}</strong>;
      }
      return part.split("\n").map((line, j, arr) => (
        <span key={`${i}-${j}`}>{line}{j < arr.length - 1 ? <br /> : null}</span>
      ));
    });
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: "assistant", time: "09:00",
      text: "Привет! Я AI-ассистент, подключённый к данным вашего дашборда.\n\nЗадайте вопрос на естественном языке — отвечу с цифрами, трендами и конкретными рекомендациями.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const now = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  const send = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: text.trim(), time: now() }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", text: getResponse(text), time: now() }]);
      setIsTyping(false);
    }, 900 + Math.random() * 700);
  };

  const clear = () => {
    setMessages([{ id: Date.now(), role: "assistant", text: "Чат сброшен. Чем могу помочь?", time: now() }]);
  };

  const copy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex flex-col" style={{ maxHeight: "calc(100vh - 7rem)" }}>
      <SectionHeader
        title="AI Ассистент"
        description="Задавайте вопросы о показателях дашборда на естественном языке. Ассистент знает текущие данные по финансам, продажам, доставке и задачам."
      />

      <div
        className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
        style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          backdropFilter: isDark ? "blur(20px)" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.15))",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #a855f7)",
              boxShadow: "0 0 20px rgba(59,130,246,0.4)",
            }}
          >
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>Аналитик AI</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                Онлайн · Данные актуальны на 23.03.2026
              </p>
            </div>
          </div>
          <button
            onClick={clear}
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={
                  msg.role === "assistant"
                    ? { background: "linear-gradient(135deg, #3b82f6, #a855f7)", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }
                    : { background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}` }
                }
              >
                {msg.role === "assistant" ? (
                  <Bot size={15} className="text-white" />
                ) : (
                  <User size={15} style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }} />
                )}
              </div>

              <div className={`max-w-[76%] flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "assistant"
                      ? {
                          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"}`,
                          color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)",
                          borderTopLeftRadius: 4,
                        }
                      : {
                          background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(168,85,247,0.2))",
                          border: "1px solid rgba(59,130,246,0.3)",
                          color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.88)",
                          borderTopRightRadius: 4,
                        }
                  }
                >
                  {msg.role === "assistant" ? formatMessage(msg.text) : msg.text}
                </div>

                <div className={`flex items-center gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}>{msg.time}</span>
                  {msg.role === "assistant" && (
                    <div className="flex gap-1.5">
                      <button onClick={() => copy(msg.id, msg.text)} className="transition-colors" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}>
                        <Copy size={11} />
                      </button>
                      <button className="transition-colors hover:text-emerald-400" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}>
                        <ThumbsUp size={11} />
                      </button>
                      <button className="transition-colors hover:text-red-400" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}>
                        <ThumbsDown size={11} />
                      </button>
                      {copied === msg.id && (
                        <span className="text-xs" style={{ color: "#34d399" }}>Скопировано</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #a855f7)" }}>
                <Bot size={15} className="text-white" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl"
                style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderTopLeftRadius: 4 }}
              >
                <div className="flex gap-1 items-center h-4">
                  {[0, 150, 300].map(delay => (
                    <div
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick suggestions */}
        <div
          className="px-4 py-2.5 overflow-x-auto flex-shrink-0"
          style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
        >
          <div className="flex gap-2 min-w-max items-center">
            <Sparkles size={13} style={{ color: "rgba(168,85,247,0.7)", flexShrink: 0 }} />
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap disabled:opacity-40"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.2)",
                  color: "#c084fc",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div
          className="p-4 flex-shrink-0"
          style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Задайте вопрос о данных дашборда..."
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
              style={{
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"}`,
                color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
                outline: "none",
              }}
              onFocus={e => (e.target.style.border = "1px solid rgba(59,130,246,0.4)")}
              onBlur={e => (e.target.style.border = `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"}`)}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #a855f7)",
                boxShadow: input.trim() ? "0 0 16px rgba(59,130,246,0.4)" : "none",
              }}
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
