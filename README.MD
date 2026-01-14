# Noir Atelier Mini App

Telegram Mini App для премиального магазина парфюмерии с админ-панелью.

## Стек
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Telegram WebApp JS API + Telegram Bot API
- CDEK API (mock-клиент)

## Быстрый старт

1. Установите зависимости:

```bash
npm install
```


2. Скопируйте переменные окружения и заполните значения:

```bash
cp .env.example .env
```

`ADMIN_TELEGRAM_IDS` — список Telegram ID администраторов через запятую.
`ADMIN_TELEGRAM_USERNAMES` — список username администраторов через запятую (без @).

3. Настройте базу данных PostgreSQL и миграции:

```bash
npm run prisma:migrate
```

4. Заполните seed-данные (админ, менеджеры, товары):

```bash
npm run prisma:seed
```

5. Запустите dev-сервер:

```bash
npm run dev
```

## Telegram WebApp

- Frontend отправляет `X-Telegram-Init-Data`.
- Backend валидирует initData через HMAC-SHA256 с `TELEGRAM_BOT_TOKEN`.
- В dev-режиме (без initData) используется фейковый admin-пользователь.

## Админ-панель

Путь: `/admin`
- ADMIN: полный доступ
- MANAGER: доступ к своим заказам и отметка оплаты

## CDEK

Интеграция моковая. При `mark-paid` создается `cdekTrackCode` и `cdekOrderId`.

## Скрипты
- `npm run dev` — запуск
- `npm run prisma:migrate` — миграции
- `npm run prisma:seed` — сиды

## Краткая инструкция запуска
1) `npm install`
2) `cp .env.example .env` и заполнить `DATABASE_URL`
3) `npm run prisma:migrate`
4) `npm run prisma:seed`
5) `npm run dev` → открыть `http://localhost:3000`
6) `npx cloudflared tunnel --url http://localhost:3003`
