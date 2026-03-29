import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import ratimirLogoOfficial from "../../../assets/ratimir-logo-official.svg";

interface LoginProps {
  onLogin: (username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Введите имя пользователя и пароль");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate brief auth
    setTimeout(() => {
      setLoading(false);
      onLogin(username);
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 20% 20%, rgba(204,0,0,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(100,0,0,0.05) 0%, transparent 50%), #050b18",
      }}
    >
      {/* Background decorations */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute top-10 left-10 w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(204,0,0,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139,0,0,0.05) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="w-full max-w-md relative" style={{ zIndex: 1 }}>
        {/* Logo block */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img
              src={ratimirLogoOfficial}
              alt="Ратимир"
              style={{ height: 80 }}
            />
          </div>
          <h1
            className="text-4xl font-black tracking-widest"
            style={{
              color: "#CC0000",
              letterSpacing: "0.25em",
              textShadow: "0 0 30px rgba(204,0,0,0.35)",
            }}
          >
            РАТИМИР
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            Система корпоративной аналитики
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          <p
            className="text-sm leading-relaxed mb-8 text-center"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Добро пожаловать. Для входа в систему корпоративной отчётности Ратимир введите системный логин и пароль.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="text-xs font-medium mb-2 block uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
                autoComplete="username"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 14,
                  padding: "12px 16px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(204,0,0,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <div>
              <label
                className="text-xs font-medium mb-2 block uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 14,
                    padding: "12px 44px 12px 16px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(204,0,0,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(204,0,0,0.1)",
                  border: "1px solid rgba(204,0,0,0.25)",
                  color: "#ff8080",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all mt-6"
              style={{
                background: loading
                  ? "rgba(100,0,0,0.6)"
                  : "linear-gradient(135deg, #CC0000, #8B0000)",
                boxShadow: loading ? "none" : "0 0 24px rgba(204,0,0,0.4)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span>Вход...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  Войти в систему
                </>
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          © 2026 ООО «Ратимир». Все права защищены.
        </p>
      </div>
    </div>
  );
}
