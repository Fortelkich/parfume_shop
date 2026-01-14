"use client";

import { useState } from "react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

export function ServiceOrderForm({
  type,
  title,
  hint
}: {
  type: "PREORDER_DELIVERY" | "SELECTION_SERVICE" | "SAMPLE_SET";
  title: string;
  hint: string;
}) {
  const { initData } = useTelegramWebApp();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [comment, setComment] = useState("");
  const [managerInfo, setManagerInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitOrder = async () => {
    setLoading(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData || ""
      },
      body: JSON.stringify({
        type,
        items: [],
        giftWrap: false,
        giftWrapPrice: null,
        customerName,
        phone,
        deliveryAddress,
        comment
      })
    });
    if (response.ok) {
      const data = await response.json();
      setManagerInfo(data.managerLabel || null);
    }
    setLoading(false);
  };

  return (
    <Card className="space-y-4">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        <p className="mt-3 text-ivory-300">{hint}</p>
      </div>
      {managerInfo ? (
        <div className="space-y-2">
          <p className="text-lg">Заявка отправлена. Менеджер свяжется с вами.</p>
          <p className="text-ivory-300">Ваш менеджер: {managerInfo}</p>
        </div>
      ) : (
        <>
          <Input label="Имя" name="customerName" value={customerName} onChange={setCustomerName} required />
          <Input label="Телефон" name="phone" value={phone} onChange={setPhone} required />
          <Input
            label="Адрес доставки"
            name="deliveryAddress"
            value={deliveryAddress}
            onChange={setDeliveryAddress}
            placeholder="Если нужна доставка"
          />
          <Textarea label="Комментарий" name="comment" value={comment} onChange={setComment} />
          <Button onClick={submitOrder} type="button">
            {loading ? "Отправляем..." : "Отправить запрос"}
          </Button>
        </>
      )}
    </Card>
  );
}
