const STORAGE_KEYS = {
  tasks: "vanta.tasks",
  settings: "vanta.settings",
  stats: "vanta.stats",
};

const defaultSettings = {
  theme: "dark",
  notifications: true,
  accent: "#8b5cf6",
};

const defaultStats = {
  completed: 0,
  total: 0,
  streak: 0,
  history: [3, 4, 6, 5, 7, 6, 8],
};

export function loadData() {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) || "[]");
  const settings = {
    ...defaultSettings,
    ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || "{}"),
  };
  const stats = {
    ...defaultStats,
    ...JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || "{}"),
  };
  return { tasks, settings, stats };
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function saveStats(stats) {
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
}

export function createTask(task) {
  return {
    id: crypto.randomUUID(),
    title: task.title,
    notes: task.notes || "",
    category: task.category || "Personal",
    priority: task.priority || "Medium",
    date: task.date || new Date().toISOString().slice(0, 10),
    time: task.time || "",
    favorite: Boolean(task.favorite),
    pin: Boolean(task.pin),
    completed: false,
    createdAt: Date.now(),
  };
}
