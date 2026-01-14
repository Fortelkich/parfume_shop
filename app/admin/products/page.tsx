"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { useTelegramWebApp } from "@/components/telegram-webapp-provider";

type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  volumeMl: number;
  gender: string;
  concentration: string;
  description: string;
  images: string[];
  inStock: boolean;
  sku: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
};

const emptyProduct: Product = {
  id: "",
  title: "",
  brand: "",
  price: 0,
  volumeMl: 50,
  gender: "UNISEX",
  concentration: "EDP",
  description: "",
  images: [],
  inStock: true,
  sku: "",
  topNotes: [],
  heartNotes: [],
  baseNotes: []
};

export default function AdminProductsPage() {
  const { initData } = useTelegramWebApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Product>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/admin/products", {
      headers: { "X-Telegram-Init-Data": initData || "" }
    });
    if (!response.ok) return;
    const payload = await response.json();
    setProducts(
      payload.products.map((product: Product) => ({
        ...product,
        price: Number(product.price)
      }))
    );
  };

  useEffect(() => {
    load();
  }, [initData]);

  const parseList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const submit = async () => {
    const payload = {
      ...draft,
      price: Number(draft.price),
      volumeMl: Number(draft.volumeMl)
    };

    await fetch("/api/admin/products", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData || ""
      },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload)
    });

    setDraft(emptyProduct);
    setEditingId(null);
    load();
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft(product);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData || ""
      },
      body: JSON.stringify({ id })
    });
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-4">
        <h2 className="font-display text-2xl">Товары</h2>
        <div className="space-y-3 text-sm">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-ivory-100">{product.title}</p>
                <p className="text-xs text-ivory-300">{product.brand} · {product.volumeMl} мл</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => startEdit(product)}>
                  Редактировать
                </Button>
                <Button variant="ghost" onClick={() => remove(product.id)}>
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-4">
        <h2 className="font-display text-2xl">{editingId ? "Редактирование" : "Новый товар"}</h2>
        <Input label="Название" name="title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
        <Input label="Бренд" name="brand" value={draft.brand} onChange={(value) => setDraft({ ...draft, brand: value })} />
        <Input label="Цена" name="price" value={String(draft.price)} onChange={(value) => setDraft({ ...draft, price: Number(value) })} />
        <Input
          label="Объем (мл)"
          name="volumeMl"
          value={String(draft.volumeMl)}
          onChange={(value) => setDraft({ ...draft, volumeMl: Number(value) })}
        />
        <label className="flex flex-col gap-2 text-sm text-ivory-300">
          <span>Гендер</span>
          <select
            value={draft.gender}
            onChange={(event) => setDraft({ ...draft, gender: event.target.value })}
            className="rounded-xl border border-white/10 bg-noir-900 px-4 py-3 text-ivory-100"
          >
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="UNISEX">UNISEX</option>
          </select>
        </label>
        <Input
          label="Концентрация"
          name="concentration"
          value={draft.concentration}
          onChange={(value) => setDraft({ ...draft, concentration: value })}
        />
        <Input
          label="SKU"
          name="sku"
          value={draft.sku}
          onChange={(value) => setDraft({ ...draft, sku: value })}
        />
        <label className="flex items-center gap-3 text-sm text-ivory-300">
          <input
            type="checkbox"
            checked={draft.inStock}
            onChange={(event) => setDraft({ ...draft, inStock: event.target.checked })}
          />
          В наличии
        </label>
        <Input
          label="Изображения (URL через запятую)"
          name="images"
          value={draft.images.join(", ")}
          onChange={(value) => setDraft({ ...draft, images: parseList(value) })}
        />
        <Input
          label="Верхние ноты"
          name="topNotes"
          value={draft.topNotes.join(", ")}
          onChange={(value) => setDraft({ ...draft, topNotes: parseList(value) })}
        />
        <Input
          label="Ноты сердца"
          name="heartNotes"
          value={draft.heartNotes.join(", ")}
          onChange={(value) => setDraft({ ...draft, heartNotes: parseList(value) })}
        />
        <Input
          label="Базовые ноты"
          name="baseNotes"
          value={draft.baseNotes.join(", ")}
          onChange={(value) => setDraft({ ...draft, baseNotes: parseList(value) })}
        />
        <Textarea
          label="Описание"
          name="description"
          value={draft.description}
          onChange={(value) => setDraft({ ...draft, description: value })}
        />
        <Button onClick={submit}>{editingId ? "Сохранить" : "Создать"}</Button>
      </Card>
    </div>
  );
}
