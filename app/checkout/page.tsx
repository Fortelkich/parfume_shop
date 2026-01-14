"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { useCart } from "@/components/cart-context";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { initData } = useTelegramWebApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const giftWrap = searchParams.get("giftWrap") === "1";

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [comment, setComment] = useState("");
  const [managerInfo, setManagerInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const giftWrapPrice = giftWrap ? 600 : 0;

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0) + giftWrapPrice;

  const submitOrder = async () => {
    setLoading(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData || ""
      },
      body: JSON.stringify({
        type: "STOCK",
        items,
        giftWrap,
        giftWrapPrice: giftWrap ? giftWrapPrice : null,
        customerName,
        phone,
        deliveryAddress,
        comment
      })
    });

    if (response.ok) {
      const data = await response.json();
      clear();
      setManagerInfo(data.managerLabel || null);
    }
    setLoading(false);
  };

  return (
    <SiteShell>
      <div className="py-10 space-y-8">
        <h1 className="font-display text-3xl">Оформление заказа</h1>
        {managerInfo ? (
          <Card className="space-y-3">
            <p className="text-lg">Спасибо! Мы закрепили менеджера.</p>
            <p className="text-ivory-300">Ваш менеджер: {managerInfo}</p>
            <Button onClick={() => router.push("/catalog")}>Вернуться в каталог</Button>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <Card className="space-y-4">
              <Input label="Имя" name="customerName" value={customerName} onChange={setCustomerName} required />
              <Input label="Телефон" name="phone" value={phone} onChange={setPhone} required />
              <Input
                label="Адрес доставки"
                name="deliveryAddress"
                value={deliveryAddress}
                onChange={setDeliveryAddress}
                placeholder="Город, улица, дом"
              />
              <Textarea label="Комментарий" name="comment" value={comment} onChange={setComment} />
            </Card>
            <Card className="space-y-4">
              <div className="text-sm text-ivory-300">
                <p>Всего позиций: {items.length}</p>
                <p>Подарочная упаковка: {giftWrap ? "Да" : "Нет"}</p>
              </div>
              <div className="text-lg font-semibold">Итого: {total.toLocaleString("ru-RU")} ₽</div>
              <Button onClick={submitOrder} className="w-full" type="button">
                {loading ? "Отправляем..." : "Подтвердить заказ"}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
