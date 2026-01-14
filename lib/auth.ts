import { prisma } from "@/lib/db";
import { parseTelegramUser, verifyTelegramInitData } from "@/lib/telegram";
import { headers } from "next/headers";

export async function getTelegramUser() {
  const headerStore = headers();
  const initData = headerStore.get("x-telegram-init-data") ?? "";
  const botToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
  const parseList = (value?: string) =>
    (value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  const adminIds = parseList(process.env.ADMIN_TELEGRAM_IDS);
  const adminUsernames = parseList(process.env.ADMIN_TELEGRAM_USERNAMES).map((item) =>
    item.replace(/^@/, "").toLowerCase()
  );

  if (!initData) {
    if (process.env.NODE_ENV === "development") {
      const isAdmin = adminIds.includes("dev-user") || adminUsernames.includes("devuser");
      return {
        id: "dev-user",
        firstName: "Dev",
        lastName: "User",
        telegramUsername: "devuser",
        role: (isAdmin ? "ADMIN" : "CUSTOMER") as const
      };
    }
    return null;
  }

  const result = verifyTelegramInitData(initData, botToken);
  if (!result.valid) return null;

  const telegramUser = parseTelegramUser(initData);
  if (!telegramUser) return null;

  const id = String(telegramUser.id);
  const username = telegramUser.username?.toLowerCase();
  const isAdmin = adminIds.includes(id) || (username ? adminUsernames.includes(username) : false);

  const user = await prisma.user.upsert({
    where: { id },
    update: {
      firstName: telegramUser.first_name ?? null,
      lastName: telegramUser.last_name ?? null,
      telegramUsername: telegramUser.username ?? null,
      ...(isAdmin ? { role: "ADMIN" } : {})
    },
    create: {
      id,
      firstName: telegramUser.first_name ?? null,
      lastName: telegramUser.last_name ?? null,
      telegramUsername: telegramUser.username ?? null,
      role: isAdmin ? "ADMIN" : "CUSTOMER"
    }
  });

  return user;
}

export function requireRole(user: { role: string } | null, roles: string[]) {
  if (!user) return false;
  return roles.includes(user.role);
}
