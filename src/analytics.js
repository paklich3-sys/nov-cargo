const ymId = import.meta.env.VITE_YM_ID;
const gaId = import.meta.env.VITE_GA_ID;

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initYandexMetrika(id) {
  window.ym = window.ym || function ym(...args) { (window.ym.a = window.ym.a || []).push(args); };
  window.ym.l = Date.now();
  loadScript("https://mc.yandex.ru/metrika/tag.js");
  window.ym(Number(id), "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

function initGoogleAnalytics(id) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) { window.dataLayer.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", id);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
}

export function initAnalytics() {
  if (ymId) initYandexMetrika(ymId);
  if (gaId) initGoogleAnalytics(gaId);
}
