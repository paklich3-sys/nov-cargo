export function trackMetrikaGoal(goal) {
  const ymId = import.meta.env.VITE_YM_ID || "110089421";
  if (!window.ym) return;
  window.ym(Number(ymId), "reachGoal", goal);
}

export function initAnalytics() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="tel:"]');
    if (link) trackMetrikaGoal("phone_click");
  });
}
