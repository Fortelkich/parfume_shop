import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.TELEGRAM_WEBAPP_ALLOWED_ORIGIN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set");
}

if (!webAppUrl) {
  throw new Error("TELEGRAM_WEBAPP_ALLOWED_ORIGIN is not set");
}

const greetedUsers = new Set<string>();
let offset = 0;

type Update = {
  update_id: number;
  message?: {
    message_id: number;
    text?: string;
    chat: { id: number };
    from?: { id: number; first_name?: string };
  };
};

async function callApi<T>(method: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Telegram API error: ${text}`);
  }

  const data = (await response.json()) as { ok: boolean; result: T };
  if (!data.ok) {
    throw new Error("Telegram API response not ok");
  }

  return data.result;
}

async function sendWelcome(chatId: number) {
  return callApi("sendMessage", {
    chat_id: chatId,
    text: "Добро пожаловать в бутик. Откройте мини-приложение, чтобы выбрать аромат.",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть мини-приложение",
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
}

async function poll() {
  while (true) {
    const updates = await callApi<Update[]>("getUpdates", {
      offset,
      timeout: 30,
      allowed_updates: ["message"]
    });

    for (const update of updates) {
      offset = update.update_id + 1;

      const message = update.message;
      if (!message) continue;

      const text = message.text?.trim() ?? "";
      const userId = message.from?.id ? String(message.from.id) : null;
      const isStart = text.startsWith("/start");
      const isFirstMessage = userId ? !greetedUsers.has(userId) : false;

      if (isStart || isFirstMessage) {
        await sendWelcome(message.chat.id);
        if (userId) {
          greetedUsers.add(userId);
        }
      }
    }
  }
}

poll().catch((error) => {
  console.error(error);
  process.exit(1);
});
