import "dotenv/config";
import compression from "compression";
import crypto from "node:crypto";
import express from "express";
import fs from "node:fs";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 4173);
const root = path.dirname(fileURLToPath(import.meta.url));
const attempts = new Map();
const rateWindowMs = 60_000;
const indexPath = path.join(root, "dist", "index.html");
let schemaHash;
try {
  const html = fs.readFileSync(indexPath, "utf8");
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (schema) schemaHash = `'sha256-${crypto.createHash("sha256").update(schema).digest("base64")}'`;
} catch {}

app.disable("x-powered-by");
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
app.use((req, res, next) => {
  const host = (req.hostname || "").toLowerCase();
  if (host === "nov-cargo.online" || host === "www.nov-cargo.online") {
    return res.redirect(301, `https://nov-cargo.ru${req.originalUrl}`);
  }
  next();
});
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://mc.yandex.ru", "https://yastatic.net", "https://www.googletagmanager.com", ...(schemaHash ? [schemaHash] : [])],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://mc.yandex.ru", "https://www.google-analytics.com"],
      connectSrc: ["'self'", "https://mc.yandex.ru", "wss://mc.yandex.ru", "https://mc.webvisor.com", "https://mc.webvisor.org", "https://www.google-analytics.com", "https://region1.google-analytics.com", "https://www.googletagmanager.com"],
      frameSrc: ["'self'", "blob:", "https://mc.yandex.ru", "https://mc.webvisor.com", "https://mc.webvisor.org"],
      childSrc: ["'self'", "blob:", "https://mc.yandex.ru"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  next();
});
app.use(compression());
app.use(express.json({ limit: "20kb" }));
app.use("/api", (_req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });

setInterval(() => {
  const cutoff = Date.now() - rateWindowMs;
  for (const [ip, times] of attempts) {
    const active = times.filter((time) => time > cutoff);
    if (active.length) attempts.set(ip, active); else attempts.delete(ip);
  }
}, rateWindowMs).unref();

app.post("/api/lead", async (req, res) => {
  if (!req.is("application/json")) return res.status(415).json({ ok: false, message: "Ожидается JSON." });
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < rateWindowMs);
  if (recent.length >= 4) return res.status(429).json({ ok: false, message: "Слишком много попыток. Позвоните нам." });
  if (!attempts.has(ip) && attempts.size >= 10_000) return res.status(503).json({ ok: false, message: "Сервис временно занят. Позвоните нам." });
  attempts.set(ip, [...recent, now]);

  const source = req.body && typeof req.body === "object" ? req.body : {};
  const field = (key, max = 500) => typeof source[key] === "string" ? source[key].trim().slice(0, max) : "";
  const name = field("name", 100), phone = field("phone", 30), route = field("route"), cargo = field("cargo"), mass = field("mass", 30), loaders = field("loaders", 30), date = field("date", 10), time = field("time", 5), company = field("company", 200), website = field("website", 200), consent = field("personal_consent", 1);
  if (website) return res.json({ ok: true });
  if (name.length < 2 || !/^[\p{L}\p{M}\s.'-]{2,100}$/u.test(name) || !/^\+?[\d\s()-]{10,20}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: "Проверьте имя и номер телефона." });
  }
  if (consent !== "1") return res.status(400).json({ ok: false, message: "Подтвердите согласие на обработку персональных данных." });
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ ok: false, message: "Некорректная дата." });
  if (time && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return res.status(400).json({ ok: false, message: "Некорректное время." });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(503).json({ ok: false, message: "Онлайн-заявка настраивается. Позвоните +7 950 688-88-62." });

  const clean = (value) => String(value).replace(/[<>\u0000-\u001f\u007f]/g, " ").trim().slice(0, 500);
  const text = [
    "🚚 Новая заявка с сайта",
    `Имя: ${clean(name)}`,
    `Телефон: ${clean(phone)}`,
    company ? `Компания: ${clean(company)}` : "",
    route ? `Маршрут: ${clean(route)}` : "",
    cargo ? `Что везём: ${clean(cargo)}` : "",
    mass ? `Масса груза: ${clean(mass)}` : "",
    loaders ? `Грузчики: ${clean(loaders)}` : "",
    date ? `Желаемая дата: ${clean(date)}` : "",
    time ? `Желаемое время: ${clean(time)}` : "",
    `Время: ${new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Moscow" }).format(new Date())}`,
  ].filter(Boolean).join("\n");

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!telegram.ok) throw new Error(`Telegram ${telegram.status}`);
    res.json({ ok: true });
  } catch (error) {
    const safeMessage = String(error?.message || "unknown").replaceAll(token, "[redacted]");
    console.error("Telegram delivery failed:", safeMessage);
    res.status(502).json({ ok: false, message: "Не удалось отправить. Позвоните +7 950 688-88-62." });
  }
});

app.use((error, _req, res, next) => {
  if (!error) return next();
  if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ ok: false, message: "Некорректный JSON." });
  console.error("Unhandled request error:", error.message);
  res.status(500).json({ ok: false, message: "Внутренняя ошибка." });
});

app.use(express.static(path.join(root, "dist"), {
  maxAge: "7d",
  etag: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
  },
}));
app.get("*splat", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));
app.listen(port, "0.0.0.0", () => console.log(`Cargo landing: http://127.0.0.1:${port}`));
