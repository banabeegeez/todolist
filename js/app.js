import {
  createTask,
  loadData,
  resetAppState,
  saveSettings,
  saveStats,
  saveTasks,
  STORAGE_KEYS,
} from "./storage.js";
import { initAnimations, showConfetti } from "./animation.js";
import { initCalendarInteractions } from "./calendar.js";
import { initReminder, showReminder } from "./reminder.js";
import { renderChart } from "./statistics.js";
import {
  getState,
  initUI,
  persistTasks,
  renderAgenda,
  renderCalendarGrid,
  renderCalendarStrip,
  renderGreeting,
  renderSettings,
  renderStatsSummary,
  renderTaskFilters,
  renderTasks,
  setState,
  updateStats,
} from "./ui.js";

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .catch(console.error);
    });
  }
}

function wireEvents() {
  document.getElementById("fab")?.addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("hidden");
  });

  document.getElementById("closeModal")?.addEventListener("click", () => {
    document.getElementById("taskModal").classList.add("hidden");
  });

  document.getElementById("taskForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const task = createTask({
      title: form.get("title"),
      notes: form.get("notes"),
      category: form.get("category"),
      priority: form.get("priority"),
      date: form.get("date") || new Date().toISOString().slice(0, 10),
      time: form.get("time"),
      favorite: form.get("favorite") === "on",
      pin: form.get("pin") === "on",
    });
    const state = getState();
    state.tasks.unshift(task);
    persistTasks();
    event.currentTarget.reset();
    document.getElementById("taskModal").classList.add("hidden");
    if (
      state.tasks.filter((item) => item.completed).length === state.tasks.length
    )
      showConfetti();
  });

  document.getElementById("taskList")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const taskId = button.dataset.id;
    const state = getState();
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    if (action === "toggle") {
      task.completed = !task.completed;
      if (task.completed) {
        showReminder(task);
        const allCompleted = state.tasks.every((item) => item.completed);
        if (allCompleted) showConfetti();
      }
      persistTasks();
      updateStats();
    }
    if (action === "delete") {
      state.tasks = state.tasks.filter((item) => item.id !== taskId);
      persistTasks();
    }
  });

  document.getElementById("taskFilters")?.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-chip");
    if (!button) return;
    setState({ filter: button.dataset.filter });
    renderTaskFilters();
    renderTasks();
  });

  document.getElementById("searchInput")?.addEventListener("input", (event) => {
    setState({ search: event.target.value });
    renderTasks();
  });

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const state = getState();
    state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
    saveSettings(state.settings);
    renderSettings();
  });

  document.getElementById("notifToggle")?.addEventListener("click", () => {
    const state = getState();
    state.settings.notifications = !state.settings.notifications;
    saveSettings(state.settings);
    renderSettings();
  });

  document.getElementById("resetBtn")?.addEventListener("click", () => {
    resetAppState();
    location.reload();
  });

  document.getElementById("notificationBtn")?.addEventListener("click", () => {
    initReminder();
  });

  document.getElementById("quickAddBtn")?.addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("hidden");
  });
}

function initPage() {
  resetAppState();

  initUI();
  initCalendarInteractions();
  initAnimations();
  initReminder();
  registerServiceWorker();
  wireEvents();
  renderChart();
  setTimeout(() => {
    document.getElementById("splash")?.classList.add("hidden");
  }, 950);
}

window.addEventListener("DOMContentLoaded", initPage);
