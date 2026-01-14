"use client";

import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Button, Card } from "@/components/ui";
import { useCart } from "@/components/cart-context";

export default function CartPage() {
  const { items, updateQty, removeItem } = useCart();
  const [giftWrap, setGiftWrap] = useState(false);
  const giftWrapPrice = 600;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );
  const total = subtotal + (giftWrap ? giftWrapPrice : 0);

  return (
    <SiteShell>
      <div className="py-10 space-y-8">
        <h1 className="font-display text-3xl">Корзина</h1>
        {items.length === 0 ? (
          <Card>Корзина пуста. Добавьте ароматы из каталога.</Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.productId} className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex-1">
                    <h3 className="font-display text-xl">{item.title}</h3>
                    <p className="text-ivory-300 text-sm">
                      {item.price.toLocaleString("ru-RU")} ₽ × {item.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="h-9 w-9 rounded-full border border-white/10 cursor-pointer"
                      onClick={() => updateQty(item.productId, Math.max(1, item.qty - 1))}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      className="h-9 w-9 rounded-full border border-white/10 cursor-pointer"
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <Button variant="ghost" onClick={() => removeItem(item.productId)}>
                    Удалить
                  </Button>
                </Card>
              ))}
            </div>
            <Card className="space-y-5">
              <label className="flex items-center gap-3 text-sm text-ivory-300">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(event) => setGiftWrap(event.target.checked)}
                />
                Подарочная упаковка (+{giftWrapPrice} ₽)
              </label>
              <div className="space-y-2 text-sm text-ivory-300">
                <div className="flex justify-between">
                  <span>Сумма</span>
                  <span>{subtotal.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Упаковка</span>
                  <span>{giftWrap ? giftWrapPrice.toLocaleString("ru-RU") : "0"} ₽</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Итого</span>
                <span>{total.toLocaleString("ru-RU")} ₽</span>
              </div>
              <Button href={`/checkout?giftWrap=${giftWrap ? "1" : "0"}`}>Оформить</Button>
            </Card>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
