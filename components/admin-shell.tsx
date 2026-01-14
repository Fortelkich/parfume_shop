"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";
import { Card } from "@/components/ui";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { profile, profileLoading } = useTelegramWebApp();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileLoading) {
      setLoading(true);
      return;
    }
    setRole(profile?.role ?? null);
    setLoading(false);
  }, [profile, profileLoading]);

  if (loading) {
    return <Card>Проверяем доступ...</Card>;
  }

  if (role !== "ADMIN") {
    return <Card>Доступ открыт только администраторам.</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 text-sm text-ivory-300">
        <Link href="/admin" prefetch={false} className="hover:text-ivory-100">
          Dashboard
        </Link>
        <Link href="/admin/orders" prefetch={false} className="hover:text-ivory-100">
          Orders
        </Link>
        <Link href="/admin/products" prefetch={false} className="hover:text-ivory-100">
          Products
        </Link>
        <Link href="/admin/managers" prefetch={false} className="hover:text-ivory-100">
          Managers
        </Link>
      </div>
      {children}
    </div>
  );
}
