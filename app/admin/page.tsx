"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

type OrderSummary = {
  id: string;
  status: string;
  type: string;
  totalAmount: number;
  createdAt: string;
  customerName: string;
};

type DashboardData = {
  totalOrders: number;
  waitingPayment: number;
  paid: number;
  lastOrders: OrderSummary[];
};

export default function AdminDashboardPage() {
  const { initData } = useTelegramWebApp();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/orders", {
        headers: {
          "X-Telegram-Init-Data": initData || ""
        }
      });
      if (!response.ok) return;
      const payload = await response.json();
      setData({
        totalOrders: payload.totalOrders,
        waitingPayment: payload.waitingPayment,
        paid: payload.paid,
        lastOrders: payload.orders.slice(0, 5)
      });
    };
    load();
  }, [initData]);

  if (!data) {
    return <Card>Загрузка данных...</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Всего заказов</p>
          <p className="mt-3 text-2xl font-semibold">{data.totalOrders}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Ждут оплату</p>
          <p className="mt-3 text-2xl font-semibold">{data.waitingPayment}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Оплачены</p>
          <p className="mt-3 text-2xl font-semibold">{data.paid}</p>
        </Card>
      </div>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Последние заказы</h2>
          <Link href="/admin/orders" className="text-sm text-cacao-600">
            Все заказы
          </Link>
        </div>
        <div className="space-y-3 text-sm text-ivory-300">
          {data.lastOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div>
                <p className="text-ivory-100">{order.customerName}</p>
                <p className="text-xs">{order.type} · {order.status}</p>
              </div>
              <div className="text-ivory-100">{Number(order.totalAmount).toLocaleString("ru-RU")} ₽</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
