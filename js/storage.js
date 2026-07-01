const STORAGE_KEYS = {
  tasks: "banabells.tasks",
  settings: "banabells.settings",
  stats: "banabells.stats",
  userProfile: "banabells.userProfile",
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

const defaultProfile = {
  name: "Nova",
  email: "",
};

function readStoredJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadData() {
  const tasks = readStoredJSON(STORAGE_KEYS.tasks, []);
  const settings = {
    ...defaultSettings,
    ...readStoredJSON(STORAGE_KEYS.settings, {}),
  };
  const stats = {
    ...defaultStats,
    ...readStoredJSON(STORAGE_KEYS.stats, {}),
  };
  const profile = {
    ...defaultProfile,
    ...readStoredJSON(STORAGE_KEYS.userProfile, {}),
  };
  return { tasks, settings, stats, profile };
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

export function resetAppState() {
  const legacyKeys = ["vanta.tasks", "vanta.settings", "vanta.stats"];
  for (const key of [...Object.values(STORAGE_KEYS), ...legacyKeys]) {
    localStorage.removeItem(key);
  }

  saveTasks([]);
  saveSettings(defaultSettings);
  saveStats(defaultStats);
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
