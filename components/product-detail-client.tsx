"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui";

export function ProductDetailClient({
  id,
  title,
  price
}: {
  id: string;
  title: string;
  price: number;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <button
          className="h-10 w-10 rounded-full border border-white/10 text-lg cursor-pointer"
          onClick={() => setQty((prev) => Math.max(1, prev - 1))}
        >
          -
        </button>
        <span className="text-lg">{qty}</span>
        <button
          className="h-10 w-10 rounded-full border border-white/10 text-lg cursor-pointer"
          onClick={() => setQty((prev) => prev + 1)}
        >
          +
        </button>
      </div>
      <Button
        onClick={() =>
          addItem({
            productId: id,
            title,
            price,
            qty
          })
        }
      >
        Добавить в корзину
      </Button>
    </div>
  );
}
