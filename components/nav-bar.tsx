"use client";

import Link from "next/link";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

export function NavBar() {
  const { profile } = useTelegramWebApp();
  const showAdmin = profile?.role === "ADMIN";

  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm text-ivory-300">
      <Link href="/catalog" prefetch={false} className="hover:text-ivory-100">
        Каталог
      </Link>
      <Link href="/service/selection" prefetch={false} className="hover:text-ivory-100">
        Подбор
      </Link>
      <Link href="/cart" prefetch={false} className="hover:text-ivory-100">
        Корзина
      </Link>
      <Link href="/account" prefetch={false} className="hover:text-ivory-100">
        Профиль
      </Link>
      {showAdmin && (
        <Link href="/admin" prefetch={false} className="text-cacao-600 hover:text-cacao-500">
          Панель
        </Link>
      )}
    </nav>
  );
}
