import {
  getState,
  setState,
  renderCalendarStrip,
  renderCalendarGrid,
  renderAgenda,
  renderTasks,
} from "./ui.js";

export function initCalendarInteractions() {
  document.addEventListener("click", (event) => {
    const day = event.target.closest("[data-date]");
    if (!day) return;
    setState({ selectedDate: day.dataset.date });
    renderCalendarStrip();
    renderCalendarGrid();
    renderAgenda();
    renderTasks();
  });
}
