export function formatManagerLabel(user?: {
  firstName?: string | null;
  lastName?: string | null;
  telegramUsername?: string | null;
} | null) {
  if (!user) return null;
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (name && user.telegramUsername) {
    return `${name} / @${user.telegramUsername}`;
  }
  if (name) return name;
  if (user.telegramUsername) return `@${user.telegramUsername}`;
  return null;
}
