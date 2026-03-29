import React, { useState } from "react";
import { X, Send, MessageCircle, CheckCircle } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackPopup({ isOpen, onClose }: FeedbackPopupProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  const panelBg = isDark
    ? "rgba(8,16,36,0.97)"
    : "rgba(255,255,255,0.99)";
  const panelBorder = isDark
    ? "1px solid rgba(255,255,255,0.1)"
    : "1px solid rgba(0,0,0,0.12)";
  const textareaBg = isDark
    ? "rgba(255,255,255,0.05)"
    : "rgba(0,0,0,0.04)";
  const textareaBorder = isDark
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.12)";
  const textColor = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed bottom-16 w-80 rounded-2xl z-[70]"
        style={{
          right: 24,
          background: panelBg,
          border: panelBorder,
          backdropFilter: isDark ? "blur(24px)" : "none",
          WebkitBackdropFilter: isDark ? "blur(24px)" : "none",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(204,0,0,0.15)", color: "#CC0000" }}
            >
              <MessageCircle size={14} />
            </div>
            <span className="text-sm font-bold" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
              Обратная связь
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {sent ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <CheckCircle size={32} style={{ color: "#10b981" }} />
              <p className="text-sm font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>
                Сообщение отправлено!
              </p>
              <p className="text-xs text-center" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                Спасибо за обратную связь
              </p>
            </div>
          ) : (
            <>
              <p
                className="text-xs mb-3"
                style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}
              >
                Сообщите об ошибке или предложите улучшение:
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Напишите ваше сообщение..."
                rows={4}
                style={{
                  width: "100%",
                  background: textareaBg,
                  border: `1px solid ${textareaBorder}`,
                  borderRadius: 10,
                  color: textColor,
                  fontSize: 13,
                  padding: "10px 12px",
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.5,
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(204,0,0,0.4)")}
                onBlur={e => (e.target.style.borderColor = textareaBorder)}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: message.trim()
                    ? "linear-gradient(135deg, #CC0000, #8B0000)"
                    : isDark ? "rgba(100,0,0,0.3)" : "rgba(180,0,0,0.2)",
                  boxShadow: message.trim() ? "0 0 16px rgba(204,0,0,0.35)" : "none",
                  cursor: message.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Send size={14} />
                Отправить
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
