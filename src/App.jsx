import { useEffect, useMemo, useRef, useState } from "react";
import { trackMetrikaGoal } from "./analytics.js";
import {
  ArrowRight, Buildings, CalendarBlank, CaretDown, CaretLeft, CaretRight, Check, Clock, Globe, MapPin,
  Package, Phone, ShieldCheck, X,
} from "@phosphor-icons/react";

const phoneHref = "tel:+79506888862";

const dictionary = {
  ru: {
    nav: ["Услуги", "Бизнесу", "Маршруты", "Контакты"],
    eyebrow: "Великий Новгород · область · межгород",
    heroTitle: <>Логистика<br /><em>нового уровня.</em></>,
    heroText: "NOV Cargo перевозит грузы до 2 тонн. Точная подача, бережный маршрут и один человек на связи от заявки до выгрузки.",
    calculate: "Рассчитать перевозку", call: "Позвонить", scroll: "Листайте — машины уже в пути",
    capacity: "До 2 тонн", response: "Ответим за 10 минут", schedule: "Ежедневно 08:00–22:00",
    manifestoLabel: "Прямая логистика. Личная ответственность.",
    manifesto: <>Ваш груз — наша ответственность.<br /><em>От адреса до адреса.</em></>,
    manifestoText: "Берём на себя подачу машины, маршрут и аккуратную перевозку. Вы заранее знаете условия и всегда понимаете, где находится ваш груз.",
    serviceLabel: "Что мы делаем", serviceTitle: "Три сценария. Один стандарт сервиса.",
    services: [
      ["01", "Доставка для бизнеса", "Товары, оборудование и материалы. Разовые рейсы или постоянный график без собственного автопарка."],
      ["02", "Переезды без стресса", "Квартиры, офисы и склады. Подберём машину, разместим груз и будем на связи до последней коробки."],
      ["03", "Город и межгород", "Великий Новгород, вся область, Санкт-Петербург и маршруты по Северо-Западу."],
    ],
    fleetLabel: "Флот в движении", fleetTitle: "Много места. До 2 тонн груза.",
    fleetText: "Вместительный закрытый кузов 400 × 180 × 220 см защищает груз от погоды и дорожной пыли. Максимальная масса — 2 000 кг.",
    features: ["Закрытый кузов", "Чистая погрузочная зона", "Грузчики по запросу", "Контроль на маршруте"],
    dimensions: "Д × Ш × В: 400 × 180 × 220 см",
    processLabel: "Как всё происходит", processTitle: "Просто. Прозрачно. В срок.",
    steps: [["01", "Оставляете контакт", "Мы быстро связываемся удобным способом."], ["02", "Уточняем задачу", "Маршрут, груз, дату и удобное время."], ["03", "Машина выезжает", "Вы знаете стоимость и остаётесь на связи."]],
    routeLabel: "Наша география", routeTitle: <>Весь 53 регион.<br /><em>И дальше.</em></>,
    routeText: "Великий Новгород · Валдай · Боровичи · Старая Русса · Чудово · Окуловка · Санкт-Петербург и другие направления.",
    leadLabel: "Рассчитаем маршрут", leadTitle: "Расскажите, куда едем.",
    name: "Ваше имя", phone: "Телефон", company: "Компания", route: "Откуда → куда", mass: "Масса груза", date: "Желаемая дата", time: "Желаемое время", cargo: "Что везём", loaders: "Грузчики", unknown: "Пока не знаю",
    cargoPlaceholder: "Например: диван, стол и 12 коробок", routePlaceholder: "Великий Новгород → Валдай",
    consent: "Даю согласие на обработку персональных данных и ознакомлен(а) с", privacy: "Политикой конфиденциальности", consentDocument: "Согласием на обработку данных", submit: "Получить расчёт", sending: "Отправляем…",
    success: "Заявка уже у нас", successText: "Скоро позвоним и всё уточним.",
    modalLabel: "Быстрый расчёт", modalTitle: "Начнём с двух слов.", footer: "Грузоперевозки до 2 тонн · Великий Новгород", legalOwner: "ИП Коновалов Николай Сергеевич", legalIds: "ИНН 532117818588 · ОГРНИП 320532100016343", legalNote: "Стоимость и условия перевозки согласовываются индивидуально. Информация на сайте не является публичной офертой.",
  },
  en: {
    nav: ["Services", "Business", "Routes", "Contact"],
    eyebrow: "Veliky Novgorod · region · intercity",
    heroTitle: <>Logistics<br /><em>at a new level.</em></>,
    heroText: "NOV Cargo transports loads up to 2 tonnes. On-time arrival, careful handling and one direct contact from request to unloading.",
    calculate: "Get a quote", call: "Call us", scroll: "Scroll — the fleet is already moving",
    capacity: "Up to 2 tonnes", response: "Reply in 10 minutes", schedule: "Daily 08:00–22:00",
    manifestoLabel: "Direct logistics. Personal responsibility.",
    manifesto: <>Your cargo is our responsibility.<br /><em>From address to address.</em></>,
    manifestoText: "We handle the van, the route and careful delivery. You know the terms in advance and always understand where your cargo is.",
    serviceLabel: "What we do", serviceTitle: "Three scenarios. One service standard.",
    services: [
      ["01", "Business delivery", "Goods, equipment and materials. One-off trips or a reliable schedule without maintaining your own fleet."],
      ["02", "Stress-free moves", "Homes, offices and warehouses. We choose the right van and stay connected to the last box."],
      ["03", "City & intercity", "Veliky Novgorod, the entire region, Saint Petersburg and routes across Northwest Russia."],
    ],
    fleetLabel: "Fleet in motion", fleetTitle: "More room. Up to 2 tonnes.",
    fleetText: "The enclosed 400 × 180 × 220 cm cargo body protects loads from weather and road dust. Maximum weight: 2,000 kg.",
    features: ["Enclosed body", "Clean loading area", "Loaders on request", "Route updates"],
    dimensions: "L × W × H: 400 × 180 × 220 cm",
    processLabel: "How it works", processTitle: "Simple. Clear. On time.",
    steps: [["01", "Leave your contact", "We get back to you promptly."], ["02", "We clarify the task", "Route, cargo, date and preferred time."], ["03", "The van departs", "You know the cost and stay connected."]],
    routeLabel: "Our coverage", routeTitle: <>All of region 53.<br /><em>And beyond.</em></>,
    routeText: "Veliky Novgorod · Valday · Borovichi · Staraya Russa · Chudovo · Okulovka · Saint Petersburg and more.",
    leadLabel: "Route estimate", leadTitle: "Tell us where to go.",
    name: "Your name", phone: "Phone", company: "Company", route: "From → to", mass: "Cargo weight", date: "Preferred date", time: "Preferred time", cargo: "Cargo details", loaders: "Loaders", unknown: "Not sure yet",
    cargoPlaceholder: "For example: a sofa, a table and 12 boxes", routePlaceholder: "Veliky Novgorod → Valday",
    consent: "I consent to the processing of my personal data and have read the", privacy: "Privacy Policy", consentDocument: "Personal Data Consent", submit: "Get a quote", sending: "Sending…",
    success: "We have your request", successText: "We will call shortly and clarify the details.",
    modalLabel: "Quick quote", modalTitle: "Let’s start with hello.", footer: "Cargo transport up to 2 tonnes · Veliky Novgorod", legalOwner: "Individual entrepreneur Nikolay S. Konovalov", legalIds: "Tax ID 532117818588 · OGRNIP 320532100016343", legalNote: "Prices and transport terms are agreed individually. Website information is not a public offer.",
  },
};

function Brand() {
  return <a className="brand" href="#top" aria-label="NOV Cargo"><span className="brand-cube"><img src="/assets/nov-logo-mark.webp" alt="" /></span><span><b>NOV</b><small>CARGO / 53</small></span></a>;
}

function PremiumSelect({ label, name, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const root = useRef(null);
  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);
  const selected = options.find((option) => option.value === value);
  return <div className={`premium-field ${open ? "open" : ""}`} ref={root}>
    <span>{label}</span><input type="hidden" name={name} value={value} readOnly />
    <button className="premium-trigger select-trigger" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}><b>{selected?.label || placeholder}</b><CaretDown /></button>
    {open && <div className="premium-popover" role="listbox">{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} className={option.value === value ? "selected" : ""} key={option.value || "empty"} onClick={() => { setValue(option.value); setOpen(false); }}><span>{option.label}</span>{option.value === value && <Check weight="bold" />}</button>)}</div>}
  </div>;
}

function PremiumDate({ label, name, lang }) {
  const today = new Date();
  const [open, setOpen] = useState(false); const [value, setValue] = useState("");
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const root = useRef(null);
  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", close); return () => document.removeEventListener("pointerdown", close);
  }, []);
  const year = view.getFullYear(), month = view.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const weekdays = lang === "ru" ? ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"] : ["Mo","Tu","We","Th","Fr","Sa","Su"];
  const pick = (day) => { const raw = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; setValue(raw); setOpen(false); };
  const display = value ? new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-GB", { day:"2-digit", month:"long", year:"numeric" }).format(new Date(`${value}T12:00:00`)) : (lang === "ru" ? "Выберите дату" : "Choose a date");
  return <div className={`premium-field ${open ? "open" : ""}`} ref={root}><span>{label}</span><input type="hidden" name={name} value={value} readOnly /><button className="premium-trigger date-trigger" type="button" onClick={() => setOpen((current) => !current)}><b>{display}</b><CalendarBlank /></button>{open && <div className="premium-popover calendar-popover"><header><button type="button" onClick={() => setView(new Date(year,month - 1,1))}><CaretLeft /></button><b>{new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-GB", { month:"long", year:"numeric" }).format(view)}</b><button type="button" onClick={() => setView(new Date(year,month + 1,1))}><CaretRight /></button></header><div className="calendar-grid">{weekdays.map((day) => <small key={day}>{day}</small>)}{Array.from({ length:offset },(_,index) => <i key={`blank-${index}`}></i>)}{Array.from({ length:count },(_,index) => { const day=index+1; const raw=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; return <button type="button" className={value===raw ? "selected" : ""} key={day} onClick={() => pick(day)}>{day}</button>; })}</div></div>}</div>;
}

function LeadForm({ t, lang, compact = false, onDone }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault(); setState("loading"); setMessage("");
    const data = { ...Object.fromEntries(new FormData(event.currentTarget)), lang };
    try {
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(lang === "en" ? `Could not send. Please call +7 950 688-88-62.` : result.message);
      trackMetrikaGoal("lead_submit");
      setState("success");
      onDone?.();
    } catch (error) { setState("error"); setMessage(error.message); }
  }
  if (state === "success") return <div className="form-success"><Check weight="bold" /><h3>{t.success}</h3><p>{t.successText}</p></div>;
  return <form className={`lead-form ${compact ? "compact" : ""}`} onSubmit={submit}>
    <label><span>{t.name} *</span><input name="name" required minLength="2" autoComplete="name" placeholder={lang === "ru" ? "Как к вам обращаться" : "How should we address you?"} /></label>
    <label><span>{t.phone} *</span><input name="phone" required inputMode="tel" autoComplete="tel" pattern="[+0-9 ()-]{10,20}" placeholder="+7 999 000-00-00" /></label>
    {!compact && <label><span>{t.company}</span><input name="company" autoComplete="organization" /></label>}
    <label><span>{t.route}</span><input name="route" placeholder={t.routePlaceholder} /></label>
    <PremiumSelect label={t.mass} name="mass" placeholder={t.unknown} options={[{value:"",label:t.unknown},{value:"до 500 кг",label:lang === "ru" ? "до 500 кг" : "up to 500 kg"},{value:"500–1000 кг",label:lang === "ru" ? "500–1000 кг" : "500–1000 kg"},{value:"1000–1500 кг",label:lang === "ru" ? "1000–1500 кг" : "1000–1500 kg"},{value:"1500–2000 кг",label:lang === "ru" ? "1500–2000 кг" : "1500–2000 kg"}]} />
    <PremiumSelect label={t.loaders} name="loaders" placeholder={t.unknown} options={[{value:"",label:t.unknown},{value:"нужен 1",label:lang === "ru" ? "нужен 1" : "1 loader"},{value:"нужно 2",label:lang === "ru" ? "нужно 2" : "2 loaders"},{value:"нужны 3 и более",label:lang === "ru" ? "нужны 3 и более" : "3+ loaders"},{value:"Не нужны",label:lang === "ru" ? "Не нужны" : "Not required"}]} />
    <PremiumDate label={t.date} name="date" lang={lang} />
    <PremiumSelect label={t.time} name="time" placeholder={lang === "ru" ? "Выберите время" : "Choose a time"} options={[{value:"",label:lang === "ru" ? "Пока не знаю" : "Not sure yet"},...Array.from({length:29},(_,index) => { const minutes=8*60+index*30; const value=`${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`; return {value,label:value}; })]} />
    <label className="wide"><span>{t.cargo}</span><textarea name="cargo" rows="3" placeholder={t.cargoPlaceholder} /></label>
    <input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
    <label className="consent-check wide"><input type="checkbox" name="personal_consent" value="1" required /><span><i></i>{t.consent} <a href="/privacy.html" target="_blank" rel="noreferrer">{t.privacy}</a>. <a href="/consent.html" target="_blank" rel="noreferrer">{t.consentDocument}</a>.</span></label>
    <button className="action primary wide" disabled={state === "loading"}>{state === "loading" ? t.sending : <>{t.submit}<ArrowRight weight="bold" /></>}</button>
    {message && <p className="form-error wide" role="alert">{message}</p>}
  </form>;
}

export function App() {
  const [lang, setLang] = useState(() => {
    const requested = new URLSearchParams(location.search).get("lang");
    return requested === "en" || requested === "ru" ? requested : (localStorage.getItem("nov-lang") || "ru");
  });
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const heroRef = useRef(null); const orangeRef = useRef(null); const whiteRef = useRef(null); const copyRef = useRef(null);
  const t = useMemo(() => dictionary[lang], [lang]);

  useEffect(() => {
    localStorage.setItem("nov-lang", lang);
    document.documentElement.lang = lang;
    const url = new URL(location.href);
    if (lang === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (`${location.pathname}${location.search}${location.hash}` !== next) {
      history.replaceState(null, "", next);
    }
    document.title = lang === "ru" ? "NOV Cargo — премиальные грузоперевозки в Великом Новгороде" : "NOV Cargo — premium cargo transport in Veliky Novgorod";
  }, [lang]);
  useEffect(() => { document.body.classList.toggle("locked", menu || modal); return () => document.body.classList.remove("locked"); }, [menu, modal]);
  useEffect(() => {
    let frame = 0;
    const render = () => {
      frame = 0; const hero = heroRef.current; if (!hero) return;
      const rect = hero.getBoundingClientRect(); const range = Math.max(1, hero.offsetHeight - innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / range)); const mobile = innerWidth < 700;
      if (orangeRef.current) orangeRef.current.style.transform = `translate3d(${-p * (mobile ? 32 : 47)}vw, ${p * (mobile ? 4 : 12)}vh, 0) rotateY(${-5 + p * 8}deg) rotateZ(${p * -1.4}deg) scale(${1 + p * .06})`;
      if (whiteRef.current) whiteRef.current.style.transform = `translate3d(${p * (mobile ? 52 : 76)}vw, ${p * (mobile ? -3 : -8)}vh, 0) rotateY(${8 - p * 7}deg) scale(${1 - p * .12})`;
      if (copyRef.current) { copyRef.current.style.transform = `translate3d(0, ${p * -11}vh, 0)`; copyRef.current.style.opacity = String(1 - p * .78); }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(render); };
    render(); addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), { threshold: .14 });
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
    return () => { observer.disconnect(); document.documentElement.classList.remove("motion-ready"); };
  }, [lang]);
  useEffect(() => {
    const requestedSection = new URLSearchParams(location.search).get("section");
    const selector = requestedSection ? `#${requestedSection}` : location.hash;
    if (!selector) return;
    const timer = setTimeout(() => document.querySelector(selector)?.scrollIntoView({ behavior: "auto" }), 350);
    return () => clearTimeout(timer);
  }, []);

  const toggleLang = () => setLang((current) => current === "ru" ? "en" : "ru");
  const icons = [Package, Buildings, MapPin];
  return <div className="site-shell">
    <header className="topbar"><Brand /><nav>{t.nav.map((item, index) => <a key={item} href={["#services", "#business", "#routes", "#contact"][index]}>{item}</a>)}</nav><div className="nav-actions"><button className="lang-switch" onClick={toggleLang}><Globe />{lang === "ru" ? "EN" : "RU"}</button><a className="nav-phone" href={phoneHref}><Phone weight="fill" />+7 950 688-88-62</a><button className="menu-toggle" onClick={() => setMenu(true)} aria-label="Menu"><span></span><span></span></button></div></header>
    {menu && <aside className="mobile-menu"><button onClick={() => setMenu(false)}><X /></button><Brand /><nav>{t.nav.map((item, index) => <a key={item} href={["#services", "#business", "#routes", "#contact"][index]} onClick={() => setMenu(false)}>{item}<ArrowRight /></a>)}</nav><button className="lang-switch mobile-lang" onClick={toggleLang}><Globe />{lang === "ru" ? "English" : "Русский"}</button><a className="action primary" href={phoneHref}><Phone weight="fill" />{t.call}</a></aside>}

    <main>
      <section className="hero-scroll" id="top" ref={heroRef}><div className="hero-sticky">
        <div className="scene-backdrop"></div><div className="scene-grid"></div>
        <img ref={whiteRef} className="vehicle vehicle-white" src="/assets/van-white-3d-clean.webp" alt="" aria-hidden="true" />
        <img ref={orangeRef} className="vehicle vehicle-orange" src="/assets/van-orange-3d-clean.webp" alt="Orange NOV Cargo van" />
        <div className="hero-copy" ref={copyRef}><p className="eyebrow"><span></span>{t.eyebrow}</p><h1>{t.heroTitle}</h1><p className="hero-lead">{t.heroText}</p><div className="hero-actions"><button className="action primary" onClick={() => setModal(true)}>{t.calculate}<ArrowRight weight="bold" /></button><a className="action secondary" href={phoneHref}><Phone weight="fill" />{t.call}</a></div></div>
        <div className="hero-data"><span><b>2 000</b> KG MAX</span><span><b>53</b> REGION</span><span className="scroll-cue">{t.scroll}<ArrowRight /></span></div>
      </div></section>

      <section className="trust-bar"><div><span><ShieldCheck weight="fill" />{t.capacity}</span><span><Clock weight="fill" />{t.response}</span><span><CalendarBlank weight="fill" />{t.schedule}</span></div></section>

      <section className="manifesto reveal"><div className="section-wrap"><p className="section-label fly-left">{t.manifestoLabel}</p><h2 className="fly-right">{t.manifesto}</h2><p className="fly-up">{t.manifestoText}</p></div></section>

      <section className="services section-wrap reveal" id="services"><div className="section-intro"><p className="section-label fly-left">{t.serviceLabel}</p><h2 className="fly-right">{t.serviceTitle}</h2></div><div className="service-cards">{t.services.map((service, index) => { const Icon = icons[index]; const vans = ["/assets/van-orange-3d-clean.webp","/assets/van-white-3d-clean.webp","/assets/van-blue-3d-clean.webp"]; return <article key={service[0]}><div className="card-meta"><span>{service[0]}</span><Icon weight="fill" /></div><div className={`card-visual visual-${index + 1}`}><img src={vans[index]} alt="" /></div><h3>{service[1]}</h3><p>{service[2]}</p><button onClick={() => setModal(true)} aria-label={t.calculate}><ArrowRight /></button></article>; })}</div></section>

      <section className="fleet-stage reveal" id="business"><div className="fleet-copy fly-left"><p className="section-label">{t.fleetLabel}</p><h2>{t.fleetTitle}</h2><p>{t.fleetText}</p><ul>{t.features.map((item) => <li key={item}><Check weight="bold" />{item}</li>)}</ul><button className="action primary" onClick={() => setModal(true)}>{t.calculate}<ArrowRight /></button></div><div className="fleet-object fly-right"><img src="/assets/van-orange-3d-clean.webp" alt="NOV Cargo van" /><span className="spec spec-one">{t.dimensions}</span><span className="spec spec-two">2 000 KG</span></div></section>

      <section className="process section-wrap reveal"><div className="section-intro"><p className="section-label fly-left">{t.processLabel}</p><h2 className="fly-right">{t.processTitle}</h2></div><ol className="fly-up">{t.steps.map((step) => <li key={step[0]}><span>{step[0]}</span><div><h3>{step[1]}</h3><p>{step[2]}</p></div><ArrowRight /></li>)}</ol></section>

      <section className="routes reveal" id="routes"><img className="fly-left" src="/assets/van-white-3d-clean.webp" alt="NOV Cargo route vehicle" /><div className="fly-right"><p className="section-label">{t.routeLabel}</p><h2>{t.routeTitle}</h2><p>{t.routeText}</p></div></section>

      <section className="contact section-wrap reveal" id="contact"><div className="contact-copy fly-left"><p className="section-label">{t.leadLabel}</p><h2>{t.leadTitle}</h2><a href={phoneHref}><span><Phone weight="fill" /></span><div><small>{t.call}</small><b>+7 950 688-88-62</b></div></a></div><div className="form-motion fly-right"><LeadForm t={t} lang={lang} /></div></section>
    </main>

    <footer className="site-footer"><div className="footer-brand"><Brand /><p>{t.footer}</p></div><div className="footer-legal"><b>{t.legalOwner}</b><span className="legal-ids">{t.legalIds}</span><a href={phoneHref}>+7 950 688-88-62</a><span>{t.legalNote}</span></div><nav aria-label={lang === "ru" ? "Юридическая информация" : "Legal information"}><a href="/privacy.html">{t.privacy}</a><a href="/consent.html">{t.consentDocument}</a><span>© 2020 NOV Cargo</span></nav></footer>
    <a className="mobile-call" href={phoneHref}><Phone weight="fill" /><span>{t.call}</span></a>
    {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(false)}><div className="modal"><button className="modal-close" onClick={() => setModal(false)}><X /></button><p className="section-label">{t.modalLabel}</p><h2>{t.modalTitle}</h2><LeadForm t={t} lang={lang} compact onDone={() => setTimeout(() => setModal(false), 1800)} /></div></div>}
  </div>;
}
