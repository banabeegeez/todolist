export function initReminder() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
}

export function showReminder(task) {
  if (!("Notification" in window) || Notification.permission !== "granted")
    return;
  new Notification("Focus nudge", {
    body: `${task.title} is waiting for your attention.`,
  });
}
