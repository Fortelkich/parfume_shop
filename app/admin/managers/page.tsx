"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

type User = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  telegramUsername?: string | null;
  role: string;
};

export default function AdminManagersPage() {
  const { initData } = useTelegramWebApp();
  const [users, setUsers] = useState<User[]>([]);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const roleLabels: Record<string, string> = {
    CUSTOMER: "Покупатель",
    MANAGER: "Менеджер",
    ADMIN: "Администратор"
  };

  const load = async () => {
    const response = await fetch("/api/admin/users", {
      headers: { "X-Telegram-Init-Data": initData || "" }
    });
    if (!response.ok) return;
    const payload = await response.json();
    setUsers(payload.users);
  };

  useEffect(() => {
    load();
  }, [initData]);

  const updateRole = async (id: string, role: string) => {
    setSavingIds((prev) => new Set(prev).add(id));
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData || ""
      },
      body: JSON.stringify({ id, role })
    });
    if (response.ok) {
      const payload = await response.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: payload.user.role } : user))
      );
    } else {
      load();
    }
    setSavingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const onRoleChange = (id: string, role: string) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)));
  };

  return (
    <Card className="space-y-4">
      <h2 className="font-display text-2xl">Менеджеры и роли</h2>
      <div className="space-y-3 text-sm">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-ivory-100">
                {user.firstName || ""} {user.lastName || ""}
              </p>
              <p className="text-xs text-ivory-300">@{user.telegramUsername || "unknown"}</p>
              <p className="text-xs text-ivory-300">{roleLabels[user.role] || user.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={user.role}
                onChange={(event) => onRoleChange(user.id, event.target.value)}
                disabled={savingIds.has(user.id)}
                className="rounded-xl border border-white/10 bg-noir-900 px-3 py-2 text-sm text-ivory-100"
              >
                <option value="CUSTOMER">Покупатель</option>
                <option value="MANAGER">Менеджер</option>
                <option value="ADMIN">Администратор</option>
              </select>
              <Button variant="ghost" onClick={() => updateRole(user.id, user.role)}>
                {savingIds.has(user.id) ? "Сохраняем..." : "Сохранить"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
