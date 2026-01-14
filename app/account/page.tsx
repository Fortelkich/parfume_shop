"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Новый",
  WAITING_PAYMENT: "Ожидает оплаты",
  PAID: "Оплачен",
  PROCESSING: "В работе",
  SHIPPED: "Отправлен",
  COMPLETED: "Завершен",
  CANCELLED: "Отменен"
};

const TYPE_LABELS: Record<string, string> = {
  STOCK: "Покупка из ассортимента",
  PREORDER_DELIVERY: "Заказ под привоз",
  SELECTION_SERVICE: "Подбор аромата",
  SAMPLE_SET: "Набор пробников"
};

type MeResponse = {
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    telegramUsername?: string | null;
    role: string;
    phone?: string | null;
  };
  orders: {
    id: string;
    status: string;
    type: string;
    totalAmount: number;
    createdAt: string;
    managerLabel?: string | null;
    trackingCode?: string | null;
  }[];
};

export default function AccountPage() {
  const { initData } = useTelegramWebApp();
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/me", {
        headers: { "X-Telegram-Init-Data": initData || "" }
      });
      if (!response.ok) {
        setData(null);
        setLoading(false);
        return;
      }
      const payload = await response.json();
      setData(payload);
      setLoading(false);
    };
    load();
  }, [initData]);

  return (
    <SiteShell>
      <div className="py-10 space-y-8">
        <h1 className="font-display text-3xl">Личный кабинет</h1>
        {loading ? (
          <Card>Загружаем профиль...</Card>
        ) : !data ? (
          <Card>Не удалось загрузить профиль. Попробуйте позже.</Card>
        ) : (
          <>
            <Card className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-ivory-300">Ваш профиль</p>
              <div>
                <p className="text-xl">
                  {data.user.firstName || ""} {data.user.lastName || ""}
                </p>
                <p className="text-ivory-300">
                  {data.user.telegramUsername ? `@${data.user.telegramUsername}` : "Имя пользователя не указано"}
                </p>
              </div>
              <p className="text-ivory-300">ID: {data.user.id}</p>
              <p className="text-ivory-300">
                Телефон: {data.user.phone || "не указан"}
              </p>
            </Card>

            <div className="space-y-4">
              <h2 className="font-display text-2xl">История заказов</h2>
              {data.orders.length === 0 ? (
                <Card>Заказов пока нет. Самое время выбрать аромат.</Card>
              ) : (
                data.orders.map((order) => (
                  <Card key={order.id} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-ivory-300">
                          {TYPE_LABELS[order.type] || order.type}
                        </p>
                        <p className="text-lg">{STATUS_LABELS[order.status] || order.status}</p>
                      </div>
                      <div className="text-lg font-semibold">
                        {Number(order.totalAmount).toLocaleString("ru-RU")} ₽
                      </div>
                    </div>
                    <p className="text-sm text-ivory-300">
                      Дата: {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                    <p className="text-sm text-ivory-300">
                      Менеджер: {order.managerLabel || "Назначается"}
                    </p>
                    {order.trackingCode && (
                      <p className="text-sm text-ivory-300">Трек-номер: {order.trackingCode}</p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </SiteShell>
  );
}
