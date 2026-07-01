export function initAnimations() {
  document.querySelectorAll(".task-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 60}ms`;
  });
}

export function showConfetti() {
  const body = document.body;
  const burst = document.createElement("div");
  burst.className = "fixed inset-0 pointer-events-none z-[120]";
  burst.innerHTML =
    '<div class="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-fuchsia-400" style="animation: float 0.9s ease-out"></div>';
  body.appendChild(burst);
  setTimeout(() => burst.remove(), 900);
}
