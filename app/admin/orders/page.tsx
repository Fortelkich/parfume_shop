"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

type OrderRow = {
  id: string;
  status: string;
  type: string;
  totalAmount: number;
  customerName: string;
  createdAt: string;
  managerLabel?: string | null;
};

export default function AdminOrdersPage() {
  const { initData } = useTelegramWebApp();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/orders", {
        headers: {
          "X-Telegram-Init-Data": initData || ""
        }
      });
      if (!response.ok) return;
      const payload = await response.json();
      setOrders(payload.orders);
    };
    load();
  }, [initData]);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (status && order.status !== status) return false;
      if (type && order.type !== type) return false;
      return true;
    });
  }, [orders, status, type]);

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-white/10 bg-noir-900 px-3 py-2 text-sm text-ivory-100"
        >
          <option value="">Все статусы</option>
          <option value="NEW">NEW</option>
          <option value="WAITING_PAYMENT">WAITING_PAYMENT</option>
          <option value="PAID">PAID</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-xl border border-white/10 bg-noir-900 px-3 py-2 text-sm text-ivory-100"
        >
          <option value="">Все типы</option>
          <option value="STOCK">STOCK</option>
          <option value="PREORDER_DELIVERY">PREORDER_DELIVERY</option>
          <option value="SELECTION_SERVICE">SELECTION_SERVICE</option>
          <option value="SAMPLE_SET">SAMPLE_SET</option>
        </select>
      </div>
      <div className="space-y-3 text-sm">
        {filtered.map((order) => (
          <div key={order.id} className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <Link href={`/admin/orders/${order.id}`} className="text-ivory-100">
                {order.customerName}
              </Link>
              <p className="text-xs text-ivory-300">
                {order.type} · {order.status}
              </p>
              {order.managerLabel && <p className="text-xs text-ivory-300">Менеджер: {order.managerLabel}</p>}
            </div>
            <div className="text-ivory-100">{Number(order.totalAmount).toLocaleString("ru-RU")} ₽</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
