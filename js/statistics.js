import { getState } from "./ui.js";

export function renderChart() {
  const chart = document.getElementById("barChart");
  if (!chart) return;
  const state = getState();
  const max = Math.max(...state.stats.history, 1);
  chart.innerHTML = state.stats.history
    .map(
      (value) => `
    <div class="flex-1 rounded-t-2xl bg-gradient-to-t from-violet-500 to-fuchsia-400" style="height: ${Math.max(20, (value / max) * 100)}%"></div>
  `,
    )
    .join("");
}
