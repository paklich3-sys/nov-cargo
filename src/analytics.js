const ymId = import.meta.env.VITE_YM_ID || "110089421";
const gaId = import.meta.env.VITE_GA_ID;

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initYandexMetrika(id) {
  const counter = Number(id);
  window.ym = window.ym || function ym(...args) { (window.ym.a = window.ym.a || []).push(args); };
  window.ym.l = Date.now();
  loadScript(`https://mc.yandex.ru/metrika/tag.js?id=${counter}`);
  window.ym(counter, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="tel:"]');
    if (link) trackMetrikaGoal("phone_click");
  });
}

function initGoogleAnalytics(id) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) { window.dataLayer.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", id);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
}

export function trackMetrikaGoal(goal) {
  if (!ymId || !window.ym) return;
  window.ym(Number(ymId), "reachGoal", goal);
}

export function initAnalytics() {
  if (ymId) initYandexMetrika(ymId);
  if (gaId) initGoogleAnalytics(gaId);
}
