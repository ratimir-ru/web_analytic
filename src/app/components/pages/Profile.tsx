import React, { useState } from "react";
import { Camera, Mail, Phone, Building2, Briefcase, ChevronUp, ChevronDown, X, Pencil } from "lucide-react";
import { GlassCard, SectionHeader } from "../StatCard";
import { useTheme } from "../ThemeProvider";

type Priority = "Высокий" | "Средний" | "Низкий";
type TaskStatus = "В работе" | "Выполнено" | "Просрочено" | "Отложено" | "Новая";
type Block = "Финансы" | "Продажи" | "Доставка" | "HR" | "Операции" | "IT";

interface Task {
  id: number;
  executor: string;
  block: Block;
  task: string;
  priority: Priority;
  dateSet: string;
  deadline: string;
  daysOverdue: number;
  status: TaskStatus;
  transfers: number;
}

const myTasks: Task[] = [
  { id: 1, executor: "Иванов И.И.", block: "Финансы", task: "Провести сверку дебиторской задолженности по ООО «Ромашка»", priority: "Высокий", dateSet: "2026-03-01", deadline: "2026-03-15", daysOverdue: 7, status: "Просрочено", transfers: 2 },
  { id: 6, executor: "Иванов И.И.", block: "Финансы", task: "Подготовить отчёт по марже за Q1 2026", priority: "Средний", dateSet: "2026-03-15", deadline: "2026-03-25", daysOverdue: 0, status: "В работе", transfers: 0 },
  { id: 11, executor: "Иванов И.И.", block: "Продажи", task: "Согласовать квартальные KPI с отделом продаж", priority: "Высокий", dateSet: "2026-03-18", deadline: "2026-03-28", daysOverdue: 0, status: "В работе", transfers: 1 },
  { id: 12, executor: "Иванов И.И.", block: "Операции", task: "Утвердить бюджет на закупку оборудования Q2", priority: "Средний", dateSet: "2026-03-20", deadline: "2026-04-05", daysOverdue: 0, status: "Новая", transfers: 0 },
];

const priorityStyle: Record<Priority, React.CSSProperties> = {
  Высокий: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" },
  Средний: { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" },
  Низкий: { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" },
};

const statusStyle: Record<TaskStatus, React.CSSProperties> = {
  "В работе": { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" },
  "Выполнено": { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" },
  "Просрочено": { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" },
  "Отложено": { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" },
  "Новая": { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" },
};

const blocks: Block[] = ["Финансы", "Продажи", "Доставка", "HR", "Операции", "IT"];
const priorities: Priority[] = ["Высокий", "Средний", "Низкий"];
const statuses: TaskStatus[] = ["Новая", "В работе", "Выполнено", "Просрочено", "Отложено"];

export function Profile() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState<Task[]>(myTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortKey, setSortKey] = useState<keyof Task>("deadline");
  const [sortAsc, setSortAsc] = useState(true);
  const profile = {
    name: "Иванов Иван Иванович",
    email: "i.ivanov@ratimir.ru",
    phoneMobile: "+7 (924) 123-45-67",
    phoneWork: "+7 (4212) 55-23-10",
    department: "Дирекция по стратегии",
    position: "Генеральный директор",
  };

  const handleSort = (key: keyof Task) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...tasks].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
    return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const SortIcon = ({ k }: { k: keyof Task }) => (
    <span className="inline-flex flex-col ml-1 opacity-50">
      <ChevronUp size={9} style={{ color: sortKey === k && sortAsc ? "#ff6b6b" : "rgba(255,255,255,0.3)" }} />
      <ChevronDown size={9} style={{ color: sortKey === k && !sortAsc ? "#ff6b6b" : "rgba(255,255,255,0.3)" }} />
    </span>
  );

  const openEditModal = (task: Task) => {
    setEditingTask(task);
  };

  const saveEditedTask = () => {
    if (!editingTask || !editingTask.task || !editingTask.executor || !editingTask.deadline) return;
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
  };

  const inputStyle: React.CSSProperties = {
    background: isDark ? "rgba(10,15,20,0.7)" : "rgba(255,255,255,0.9)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
    borderRadius: 10,
    color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    fontSize: 13,
    padding: "8px 12px",
    outline: "none",
    backdropFilter: "blur(80px)",
    WebkitBackdropFilter: "blur(80px)",
  };

  const fieldStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 10,
    color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    fontSize: 14,
    padding: "10px 14px",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)",
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div>
      <SectionHeader
        title="Профиль пользователя"
        description="Личная информация, контактные данные и текущие задачи."
        badge="Мой аккаунт"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Photo + quick info */}
        <GlassCard className="p-6 my-4 flex flex-col items-center text-center">
          {/* Photo placeholder */}
          <div className="relative mb-4">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #CC0000, #8B0000)",
                boxShadow: "0 0 30px rgba(204,0,0,0.4)",
              }}
            >
              ИИ
            </div>
            <button
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #CC0000, #8B0000)",
                border: "2px solid " + (isDark ? "#050b18" : "#f0f2f5"),
                boxShadow: "0 0 10px rgba(204,0,0,0.5)",
              }}
              title="Изменить фото"
            >
              <Camera size={14} />
            </button>
          </div>
          <h3
            className="font-black text-lg mb-1"
            style={{ color: isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)" }}
          >
            {profile.name}
          </h3>
          <p className="text-sm mb-1" style={{ color: "#CC0000", fontWeight: 600 }}>
            {profile.position}
          </p>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>
            {profile.department}
          </p>

          <div
            className="mt-4 pt-4 w-full space-y-2"
            style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)" }}
          >
            <div className="flex items-center gap-2">
              <Mail size={13} style={{ color: "#CC0000", flexShrink: 0 }} />
              <span className="text-xs truncate" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)" }}>
                {profile.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={13} style={{ color: "#CC0000", flexShrink: 0 }} />
              <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)" }}>
                {profile.phoneMobile}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={13} style={{ color: "#CC0000", flexShrink: 0 }} />
              <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)" }}>
                {profile.department}
              </span>
            </div>
          </div>

          {/* Task summary */}
          <div className="mt-4 grid grid-cols-2 gap-2 w-full">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              <p className="text-xl font-black" style={{ color: "#93c5fd" }}>
                {tasks.filter(t => t.status === "В работе").length}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>В работе</p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <p className="text-xl font-black" style={{ color: "#f87171" }}>
                {tasks.filter(t => t.status === "Просрочено").length}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Просрочено</p>
            </div>
          </div>
        </GlassCard>

        {/* Info display (read-only) */}
        <GlassCard className="lg:col-span-2 p-6 my-4">
          <h4
            className="font-bold text-sm uppercase tracking-wider mb-5"
            style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
          >
            Личные данные
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label style={labelStyle}>ФИО</label>
              <div style={fieldStyle}>{profile.name}</div>
            </div>
            <div>
              <label style={labelStyle}>
                <span className="flex items-center gap-1"><Mail size={11} /> Почта</span>
              </label>
              <div style={fieldStyle}>{profile.email}</div>
            </div>
            <div>
              <label style={labelStyle}>
                <span className="flex items-center gap-1"><Phone size={11} /> Телефон личный</span>
              </label>
              <div style={fieldStyle}>{profile.phoneMobile}</div>
            </div>
            <div>
              <label style={labelStyle}>
                <span className="flex items-center gap-1"><Phone size={11} /> Телефон рабочий</span>
              </label>
              <div style={fieldStyle}>{profile.phoneWork}</div>
            </div>
            <div>
              <label style={labelStyle}>
                <span className="flex items-center gap-1"><Building2 size={11} /> Подразделение</span>
              </label>
              <div style={fieldStyle}>{profile.department}</div>
            </div>
            <div className="md:col-span-2">
              <label style={labelStyle}>
                <span className="flex items-center gap-1"><Briefcase size={11} /> Должность</span>
              </label>
              <div style={fieldStyle}>{profile.position}</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* My tasks table */}
      <GlassCard className="my-4">
        <div className="p-5 pb-3">
          <h4
            className="font-bold text-sm uppercase tracking-wider"
            style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
          >
            Мои задачи
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)" }}>
                {[
                  { k: "block", l: "Блок" },
                  { k: "task", l: "Задача" },
                  { k: "priority", l: "Приоритет" },
                  { k: "dateSet", l: "Поставлена" },
                  { k: "deadline", l: "Срок" },
                  { k: "daysOverdue", l: "Просрочка" },
                  { k: "status", l: "Статус" },
                  { k: "transfers", l: "Переносов" },
                ].map(col => (
                  <th
                    key={col.k}
                    onClick={() => handleSort(col.k as keyof Task)}
                    className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                    style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}
                  >
                    {col.l}<SortIcon k={col.k as keyof Task} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(t => (
                <tr
                  key={t.id}
                  className="group"
                  style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,36,71,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
                        title="Редактировать задачу"
                      >
                        <Pencil size={14} />
                      </button>
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium"
                        style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.2)", color: "#ff6b6b" }}>
                        {t.block}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>
                    <span className="line-clamp-2">{t.task}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold" style={priorityStyle[t.priority]}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>{t.dateSet}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)" }}>{t.deadline}</td>
                  <td className="px-4 py-3 text-center">
                    {t.daysOverdue > 0 ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                        +{t.daysOverdue} дн.
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold" style={statusStyle[t.status]}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                    {t.transfers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="px-4 py-2"
          style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }}
        >
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
            Показано {sorted.length} задач
          </p>
        </div>
      </GlassCard>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
          <div
            className="w-full max-w-lg rounded-2xl p-6"
            style={{
              background: isDark ? "#0f1419" : "#f8f9fa",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>Редактирование задачи</h3>
                <p className="text-xs mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>Измените параметры задачи</p>
              </div>
              <button onClick={() => setEditingTask(null)} style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Задача *</label>
                <textarea
                  value={editingTask.task}
                  onChange={e => setEditingTask({ ...editingTask, task: e.target.value })}
                  style={{ ...inputStyle, width: "100%", resize: "none" }}
                  rows={2}
                  placeholder="Описание задачи..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Блок</label>
                  <select value={editingTask.block} onChange={e => setEditingTask({ ...editingTask, block: e.target.value as Block })} style={{ ...inputStyle, width: "100%" }}>
                    {blocks.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Приоритет</label>
                  <select value={editingTask.priority} onChange={e => setEditingTask({ ...editingTask, priority: e.target.value as Priority })} style={{ ...inputStyle, width: "100%" }}>
                    {priorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Статус</label>
                  <select value={editingTask.status} onChange={e => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })} style={{ ...inputStyle, width: "100%" }}>
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Срок выполнения *</label>
                  <input
                    type="date"
                    value={editingTask.deadline}
                    onChange={e => setEditingTask({ ...editingTask, deadline: e.target.value })}
                    style={{ ...inputStyle, width: "100%", colorScheme: isDark ? "dark" : "light" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Дата постановки</label>
                  <input
                    type="date"
                    value={editingTask.dateSet}
                    onChange={e => setEditingTask({ ...editingTask, dateSet: e.target.value })}
                    style={{ ...inputStyle, width: "100%", colorScheme: isDark ? "dark" : "light" }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Переносов</label>
                  <input
                    type="number"
                    value={editingTask.transfers}
                    onChange={e => setEditingTask({ ...editingTask, transfers: parseInt(e.target.value) || 0 })}
                    style={{ ...inputStyle, width: "100%" }}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                Отмена
              </button>
              <button
                onClick={saveEditedTask}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #1A8D7A, #156b5f)",
                  boxShadow: "0 0 20px rgba(26,141,122,0.4)",
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}