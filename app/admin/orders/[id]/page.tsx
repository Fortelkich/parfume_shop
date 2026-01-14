"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

type OrderDetail = {
  id: string;
  status: string;
  type: string;
  totalAmount: number;
  customerName: string;
  phone: string;
  deliveryAddress?: string | null;
  comment?: string | null;
  managerLabel?: string | null;
  cdekTrackCode?: string | null;
  items: {
    id: string;
    titleSnapshot: string;
    qty: number;
    priceSnapshot: number;
  }[];
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { initData } = useTelegramWebApp();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState("");

  const load = async () => {
    const response = await fetch(`/api/admin/orders/${params.id}`, {
      headers: {
        "X-Telegram-Init-Data": initData || ""
      }
    });
    if (!response.ok) return;
    const payload = await response.json();
    setOrder(payload);
    setStatus(payload.status);
  };

  useEffect(() => {
    load();
  }, [initData]);

  const updateStatus = async () => {
    await fetch(`/api/admin/orders/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData || ""
      },
      body: JSON.stringify({ status })
    });
    load();
  };

  const markPaid = async () => {
    await fetch(`/api/admin/orders/${params.id}/mark-paid`, {
      method: "POST",
      headers: {
        "X-Telegram-Init-Data": initData || ""
      }
    });
    load();
  };

  if (!order) return <Card>Загрузка...</Card>;

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="font-display text-2xl">Заказ {order.id.slice(0, 8)}</h2>
        <p className="text-ivory-300">{order.customerName} · {order.phone}</p>
        {order.deliveryAddress && <p className="text-ivory-300">Адрес: {order.deliveryAddress}</p>}
        {order.comment && <p className="text-ivory-300">Комментарий: {order.comment}</p>}
        {order.managerLabel && <p className="text-ivory-300">Менеджер: {order.managerLabel}</p>}
      </Card>
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-white/10 bg-noir-900 px-3 py-2 text-sm text-ivory-100"
          >
            <option value="NEW">NEW</option>
            <option value="WAITING_PAYMENT">WAITING_PAYMENT</option>
            <option value="PAID">PAID</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <Button onClick={updateStatus}>Сохранить статус</Button>
          <Button onClick={markPaid} variant="ghost">
            Отметить оплату → создать отправление
          </Button>
        </div>
        {order.cdekTrackCode && <p className="text-ivory-300">Трек-номер: {order.cdekTrackCode}</p>}
      </Card>
      <Card className="space-y-3">
        <h3 className="font-display text-xl">Состав заказа</h3>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="text-ivory-100">{item.titleSnapshot}</p>
              <p className="text-xs text-ivory-300">{item.qty} шт.</p>
            </div>
            <div className="text-ivory-100">
              {Number(item.priceSnapshot).toLocaleString("ru-RU")} ₽
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
