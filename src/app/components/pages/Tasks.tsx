import React, { useState } from "react";
import { SectionHeader, GlassCard } from "../StatCard";
import { useTheme } from "../ThemeProvider";
import { Plus, Search, ChevronUp, ChevronDown, X } from "lucide-react";

type Priority = "Высокий" | "Средний" | "Низкий";
type Status = "В работе" | "Выполнено" | "Просрочено" | "Отложено" | "Новая";
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
  status: Status;
  transfers: number;
}

const initialTasks: Task[] = [
  { id: 1, executor: "Иванов И.И.", block: "Финансы", task: "Провести сверку дебиторской задолженности по ООО «Ромашка»", priority: "Высокий", dateSet: "2026-03-01", deadline: "2026-03-15", daysOverdue: 7, status: "Просрочено", transfers: 2 },
  { id: 2, executor: "Петрова М.С.", block: "Продажи", task: "Разработать акционное предложение для блока «Мясной проект»", priority: "Высокий", dateSet: "2026-03-05", deadline: "2026-03-20", daysOverdue: 2, status: "Просрочено", transfers: 1 },
  { id: 3, executor: "Сидоров К.А.", block: "Доставка", task: "Оптимизировать маршруты для регионов ЦФО", priority: "Средний", dateSet: "2026-03-10", deadline: "2026-03-31", daysOverdue: 0, status: "В работе", transfers: 0 },
  { id: 4, executor: "Козлова Е.В.", block: "HR", task: "Провести подбор 3 водителей для расширения парка в МО", priority: "Средний", dateSet: "2026-03-08", deadline: "2026-04-01", daysOverdue: 0, status: "В работе", transfers: 0 },
  { id: 5, executor: "Новиков А.П.", block: "Операции", task: "Внедрить систему контроля температурного режима в новых ТС", priority: "Высокий", dateSet: "2026-02-20", deadline: "2026-03-20", daysOverdue: 2, status: "Просрочено", transfers: 3 },
  { id: 6, executor: "Иванов И.И.", block: "Финансы", task: "Подготовить отчёт по марже за Q1 2026", priority: "Средний", dateSet: "2026-03-15", deadline: "2026-03-25", daysOverdue: 0, status: "В работе", transfers: 0 },
  { id: 7, executor: "Захарова Т.Н.", block: "Продажи", task: "Согласовать ценовую политику по блоку «Деликатесы»", priority: "Низкий", dateSet: "2026-03-18", deadline: "2026-04-10", daysOverdue: 0, status: "Новая", transfers: 0 },
  { id: 8, executor: "Сидоров К.А.", block: "IT", task: "Настроить интеграцию TMS с 1С", priority: "Высокий", dateSet: "2026-03-01", deadline: "2026-03-22", daysOverdue: 0, status: "Выполнено", transfers: 1 },
  { id: 9, executor: "Петрова М.С.", block: "Продажи", task: "Провести переговоры с сетью «АТБ» по условиям Q2", priority: "Средний", dateSet: "2026-03-12", deadline: "2026-03-28", daysOverdue: 0, status: "В работе", transfers: 0 },
  { id: 10, executor: "Новиков А.П.", block: "Операции", task: "Обновить регламент погрузо-разгрузочных работ", priority: "Низкий", dateSet: "2026-03-10", deadline: "2026-04-15", daysOverdue: 0, status: "Отложено", transfers: 1 },
];

const priorityStyle: Record<Priority, React.CSSProperties> = {
  Высокий: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" },
  Средний: { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" },
  Низкий: { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" },
};

const statusCounts: { key: Status; glow: string }[] = [
  { key: "В работе", glow: "#3b82f6" },
  { key: "Просрочено", glow: "#ef4444" },
  { key: "Выполнено", glow: "#10b981" },
  { key: "Новая", glow: "#a855f7" },
  { key: "Отложено", glow: "rgba(255,255,255,0.3)" },
];

const blocks: Block[] = ["Финансы", "Продажи", "Доставка", "HR", "Операции", "IT"];
const priorities: Priority[] = ["Высокий", "Средний", "Низкий"];
const statuses: Status[] = ["Новая", "В работе", "Выполнено", "Просрочено", "Отложено"];

const emptyTask: Omit<Task, "id"> = {
  executor: "", block: "Операции", task: "", priority: "Средний",
  dateSet: new Date().toISOString().slice(0, 10), deadline: "",
  daysOverdue: 0, status: "Новая", transfers: 0,
};

export function Tasks() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [filterBlock, setFilterBlock] = useState("Все");
  const [filterStatus, setFilterStatus] = useState("Все");
  const [filterPriority, setFilterPriority] = useState("Все");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>(emptyTask);
  const [sortKey, setSortKey] = useState<keyof Task>("deadline");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: keyof Task) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = tasks
    .filter(t =>
      (filterBlock === "Все" || t.block === filterBlock) &&
      (filterStatus === "Все" || t.status === filterStatus) &&
      (filterPriority === "Все" || t.priority === filterPriority) &&
      (search === "" || t.task.toLowerCase().includes(search.toLowerCase()) || t.executor.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const addTask = () => {
    if (!newTask.task || !newTask.executor || !newTask.deadline) return;
    setTasks([...tasks, { ...newTask, id: Math.max(...tasks.map(t => t.id)) + 1 }]);
    setNewTask(emptyTask);
    setShowModal(false);
  };

  const statusStyle: Record<Status, React.CSSProperties> = {
    "В работе": { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" },
    "Выполнено": { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" },
    "Просрочено": { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" },
    "Отложено": { background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" },
    "Новая": { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" },
  };

  const SortIcon = ({ k }: { k: keyof Task }) => (
    <span className="inline-flex flex-col ml-1 opacity-50">
      <ChevronUp size={9} style={{ color: sortKey === k && sortAsc ? "#93c5fd" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} />
      <ChevronDown size={9} style={{ color: sortKey === k && !sortAsc ? "#93c5fd" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} />
    </span>
  );

  const inputStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 10,
    color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    fontSize: 13,
    padding: "8px 12px",
    outline: "none",
  };

  return (
    <div>
      <SectionHeader
        title="Реестр задач"
        description="Контроль исполнения: назначайте, отслеживайте сроки и анализируйте просрочки. Сортировка по любому столбцу."
        badge={`${tasks.length} задач`}
      />

      {/* Status counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {statusCounts.map(s => {
          const count = tasks.filter(t => t.status === s.key).length;
          const style = statusStyle[s.key];
          return (
            <div
              key={s.key}
              className="rounded-2xl p-4 text-center cursor-pointer transition-all"
              style={{
                background: filterStatus === s.key ? (style.background as string).replace("0.1)", "0.15)") : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: filterStatus === s.key ? style.border as string : `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              }}
              onClick={() => setFilterStatus(filterStatus === s.key ? "Все" : s.key)}
            >
              <p className="text-2xl font-black" style={{ color: style.color as string }}>{count}</p>
              <p className="text-xs mt-1" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>{s.key}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }} />
            <input
              type="text"
              placeholder="Поиск по задаче или исполнителю..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 32, width: "100%" }}
            />
          </div>
          {[
            { label: "Все блоки", val: filterBlock, setter: setFilterBlock, opts: blocks },
            { label: "Все статусы", val: filterStatus, setter: setFilterStatus, opts: statuses },
            { label: "Все приоритеты", val: filterPriority, setter: setFilterPriority, opts: priorities },
          ].map((f, i) => (
            <select
              key={i}
              value={f.val}
              onChange={e => f.setter(e.target.value)}
              style={inputStyle}
            >
              <option value="Все">{f.label}</option>
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          {(filterBlock !== "Все" || filterStatus !== "Все" || filterPriority !== "Все" || search) && (
            <button
              onClick={() => { setFilterBlock("Все"); setFilterStatus("Все"); setFilterPriority("Все"); setSearch(""); }}
              className="flex items-center gap-1 text-xs"
              style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
            >
              <X size={12} /> Сбросить
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #a855f7)",
              boxShadow: "0 0 20px rgba(59,130,246,0.3)",
            }}
          >
            <Plus size={15} /> Новая задача
          </button>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
                {[
                  { k: "executor", l: "Исполнитель" },
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
                    className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors"
                    style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}
                  >
                    {col.l}<SortIcon k={col.k as keyof Task} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-sm" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>
                    Задачи не найдены
                  </td>
                </tr>
              )}
              {filtered.map(t => (
                <tr
                  key={t.id}
                  className="transition-colors"
                  style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,36,71,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{t.executor}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-medium"
                      style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }}>
                      {t.block}
                    </span>
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
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{t.deadline}</td>
                  <td className="px-4 py-3 text-center">
                    {t.daysOverdue > 0 ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                        +{t.daysOverdue} дн.
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>—</span>
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
          style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}
        >
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
            Показано {filtered.length} из {tasks.length} задач
          </p>
        </div>
      </GlassCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
          <div
            className="w-full max-w-lg rounded-2xl p-6"
            style={{
              background: isDark ? "rgba(10,18,40,0.95)" : "rgba(255,255,255,0.98)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>Новая задача</h3>
                <p className="text-xs mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>Заполните обязательные поля</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Задача *</label>
                <textarea
                  value={newTask.task}
                  onChange={e => setNewTask({ ...newTask, task: e.target.value })}
                  style={{ ...inputStyle, width: "100%", resize: "none" }}
                  rows={2}
                  placeholder="Описание задачи..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Исполнитель *</label>
                  <input
                    value={newTask.executor}
                    onChange={e => setNewTask({ ...newTask, executor: e.target.value })}
                    style={{ ...inputStyle, width: "100%" }}
                    placeholder="ФИО"
                  />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Блок</label>
                  <select value={newTask.block} onChange={e => setNewTask({ ...newTask, block: e.target.value as Block })} style={{ ...inputStyle, width: "100%" }}>
                    {blocks.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Приоритет</label>
                  <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })} style={{ ...inputStyle, width: "100%" }}>
                    {priorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>Срок выполнения *</label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                    style={{ ...inputStyle, width: "100%", colorScheme: isDark ? "dark" : "light" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                Отмена
              </button>
              <button
                onClick={addTask}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #a855f7)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                }}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
