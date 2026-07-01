import { escapeHTML, formatDate, getGreeting } from "./utils.js";
import { loadData, saveTasks, saveStats } from "./storage.js";

let state = {
  tasks: [],
  settings: {},
  stats: {},
  userProfile: { name: "Nova", email: "" },
  selectedDate: new Date().toISOString().slice(0, 10),
  filter: "all",
  search: "",
};

export function initUI() {
  const { tasks, settings, stats, profile } = loadData();
  state.tasks = tasks;
  state.settings = settings;
  state.stats = stats;
  state.userProfile = profile;
  renderGreeting();
  renderCalendarStrip();
  renderTaskFilters();
  renderTasks();
  renderStatsSummary();
  renderCalendarGrid();
  renderAgenda();
  renderSettings();
}

export function getState() {
  return state;
}

export function setState(partial) {
  state = { ...state, ...partial };
}

export function renderGreeting() {
  const greetingEl = document.getElementById("greeting");
  const nameEl = document.getElementById("userName");
  const todayEl = document.getElementById("todayLabel");
  const displayName = state.userProfile?.name?.trim() || "Nova";
  if (greetingEl) greetingEl.textContent = getGreeting();
  if (nameEl) nameEl.textContent = `Hello, ${displayName}`;
  if (todayEl) {
    const now = new Date();
    todayEl.textContent = `Today • ${now.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}`;
  }
}

export function renderCalendarStrip() {
  const container = document.getElementById("calendarStrip");
  if (!container) return;
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index - 3);
    return date;
  });

  container.innerHTML = days
    .map((date) => {
      const iso = date.toISOString().slice(0, 10);
      const isToday = iso === new Date().toISOString().slice(0, 10);
      const isSelected = iso === state.selectedDate;
      return `
      <button class="calendar-day ${isSelected ? "active" : ""} ${isToday ? "has-task" : ""}" data-date="${iso}">
        <div class="text-[11px] text-slate-400">${date.toLocaleDateString("en", { weekday: "short" })}</div>
        <div class="mt-1 text-base font-semibold">${date.getDate()}</div>
      </button>
    `;
    })
    .join("");
}

export function renderTaskFilters() {
  const filters = document.getElementById("taskFilters");
  if (!filters) return;
  const options = ["all", "pending", "completed", "favorite"];
  filters.innerHTML = options
    .map(
      (option) =>
        `<button class="filter-chip ${state.filter === option ? "active" : ""}" data-filter="${option}">${option}</button>`,
    )
    .join("");
}

export function renderTasks() {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;
  const visibleTasks = state.tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(state.search.toLowerCase()) ||
        task.notes.toLowerCase().includes(state.search.toLowerCase());
      const matchesFilter =
        state.filter === "all" ||
        (state.filter === "pending" && !task.completed) ||
        (state.filter === "completed" && task.completed) ||
        (state.filter === "favorite" && task.favorite);
      const matchesDate = task.date === state.selectedDate;
      return matchesSearch && matchesFilter && matchesDate;
    })
    .sort((a, b) => Number(b.pin) - Number(a.pin));

  if (!visibleTasks.length) {
    taskList.innerHTML =
      '<div class="empty-state">No tasks yet for this day. Add one to start your flow.</div>';
    return;
  }

  taskList.innerHTML = visibleTasks
    .map(
      (task) => `
    <article class="task-card card-enter ${task.completed ? "completed" : ""}">
      <button class="mt-1 h-5 w-5 rounded-full border ${task.completed ? "bg-violet-500" : "border-slate-500"}" data-action="toggle" data-id="${task.id}"></button>
      <div class="flex-1">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold ${task.completed ? "line-through text-slate-400" : ""}">${escapeHTML(task.title)}</h3>
            <p class="mt-1 text-sm text-slate-400">${escapeHTML(task.notes || "No notes")}</p>
          </div>
          <button class="text-xl" data-action="delete" data-id="${task.id}">✕</button>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
          <span class="priority-pill">${escapeHTML(task.category || "Personal")}</span>
          <span class="priority-pill">${escapeHTML(task.priority || "Medium")}</span>
          <span class="priority-pill">${task.time || "Any time"}</span>
        </div>
      </div>
    </article>
  `,
    )
    .join("");
}

export function renderStatsSummary() {
  const flowPercent = document.getElementById("flowPercent");
  const flowHint = document.getElementById("flowHint");
  const dailyGoal = document.getElementById("dailyGoal");
  const streakBadge = document.getElementById("streakBadge");
  const ringProgress = document.getElementById("ringProgress");

  const completed = state.tasks.filter((task) => task.completed).length;
  const percentage = state.tasks.length
    ? Math.round((completed / state.tasks.length) * 100)
    : 0;
  const openTasks = state.tasks.filter((task) => !task.completed).length;

  if (flowPercent) flowPercent.textContent = `${percentage}%`;
  if (flowHint) flowHint.textContent = `${openTasks} tasks left to finish`;
  if (dailyGoal) dailyGoal.textContent = `${completed}/${state.tasks.length}`;
  if (streakBadge)
    streakBadge.textContent = `${state.stats.streak || 0} streak`;
  if (ringProgress) {
    ringProgress.dataset.progress = String(percentage);
    ringProgress
      .querySelector(".ring-value")
      ?.replaceChildren(`${percentage}%`);
  }
}

export function renderCalendarGrid() {
  const container = document.getElementById("calendarGrid");
  if (!container) return;
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  container.innerHTML = [...days, ...Array.from({ length: 35 }, (_, i) => i)]
    .map((day, index) => {
      if (index < 7)
        return `<div class="text-center text-sm text-slate-400">${day}</div>`;
      const date = new Date();
      date.setDate(date.getDate() + index - 7);
      const iso = date.toISOString().slice(0, 10);
      const hasTask = state.tasks.some((task) => task.date === iso);
      const active = iso === state.selectedDate;
      return `<button class="calendar-day ${active ? "active" : ""} ${hasTask ? "has-task" : ""}" data-date="${iso}">${date.getDate()}</button>`;
    })
    .join("");
}

export function renderAgenda() {
  const container = document.getElementById("calendarAgenda");
  if (!container) return;
  const selectedTasks = state.tasks.filter(
    (task) => task.date === state.selectedDate,
  );
  if (!selectedTasks.length) {
    container.innerHTML =
      '<div class="empty-state">Nothing scheduled on this day.</div>';
    return;
  }
  container.innerHTML = selectedTasks
    .map(
      (task) =>
        `<div class="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">${escapeHTML(task.title)} • ${task.time || "Any time"}</div>`,
    )
    .join("");
}

export function renderSettings() {
  const themeBtn = document.getElementById("themeToggle");
  const notifBtn = document.getElementById("notifToggle");
  if (themeBtn)
    themeBtn.textContent = state.settings.theme === "dark" ? "On" : "Off";
  if (notifBtn)
    notifBtn.textContent = state.settings.notifications ? "On" : "Off";
}

export function updateStats() {
  const completed = state.tasks.filter((task) => task.completed).length;
  state.stats.completed = completed;
  state.stats.total = state.tasks.length;
  state.stats.streak = Math.max(
    1,
    state.stats.streak + (completed > 0 ? 1 : 0),
  );
  state.stats.history = [...state.stats.history.slice(-6), completed];
  saveStats(state.stats);
  renderStatsSummary();
}

export function persistTasks() {
  saveTasks(state.tasks);
  renderTasks();
  renderCalendarGrid();
  renderAgenda();
  updateStats();
}
