# Грузоперевозки — Великий Новгород

Продовый лендинг с серверной отправкой заявок в Telegram.

## Локальный запуск

1. `npm install`
2. Скопировать `.env.example` в `.env` и заполнить `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
3. Разработка: в одном терминале `npm run dev`, во втором `npm start`.
4. Открыть http://127.0.0.1:5174/

## Публикация в интернет

Сайт состоит из **фронтенда** (React) и **бэкенда** (Node.js для Telegram).  
GitHub Pages умеет хранить только статику — **форма с заявками там не заработает**.

Рекомендуемая схема:

| Что | Где |
|-----|-----|
| Код | GitHub (репозиторий) |
| Сайт + API | [Render](https://render.com) (бесплатный тариф) |
| Домен | Привязывается к Render |

### Шаг 1. Залить код на GitHub

```bash
git init
git add .
git commit -m "Initial commit: NOV Cargo landing"
```

На github.com: **New repository** → имя, например `nov-cargo` → **Create**.

```bash
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/nov-cargo.git
git push -u origin main
```

> Файл `.env` в git не попадает — это правильно. Секреты только на сервере.

### Шаг 2. Задеплоить на Render

1. Зайти на https://render.com и войти через GitHub.
2. **New +** → **Blueprint** (или **Web Service**).
3. Подключить репозиторий `nov-cargo`.
4. Render подхватит `render.yaml` автоматически.
5. В настройках сервиса добавить переменные:
   - `TELEGRAM_BOT_TOKEN` — токен от BotFather
   - `TELEGRAM_CHAT_ID` — ваш id
6. Нажать **Deploy**.

Через 2–3 минуты сайт будет доступен по адресу вида `https://nov-cargo.onrender.com`.

### Шаг 3. Привязать домен

Когда купите домен (например `novcargo.ru`):

1. В Render: сервис → **Settings** → **Custom Domains** → добавить домен.
2. Render покажет DNS-записи (обычно CNAME или A).
3. У регистратора домена (Reg.ru, Timeweb и т.д.) прописать эти записи.
4. Подождать 15 минут – 24 часа (пока DNS обновится).
5. Заменить `https://example.ru/` на ваш домен в файлах:
   - `index.html` (строка `canonical`)
   - `public/robots.txt`
   - `public/sitemap.xml`
6. Закоммитить и запушить — Render пересоберёт сайт сам.

### Шаг 4. Проверка

- Сайт открывается по домену
- Форма отправляется
- Заявка приходит в Telegram

## Telegram

Создайте бота через `@BotFather`, нажмите **Start** в чате с ботом и укажите id чата в `.env` / Render.

Токен хранится только на сервере и не попадает в клиентский JavaScript.
