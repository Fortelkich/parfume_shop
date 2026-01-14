"use client";

import { useMemo, useState } from "react";
import { ProductCard, ProductCardData } from "@/components/product-card";
import { Card } from "@/components/ui";

type CatalogProps = {
  products: ProductCardData[];
  brands: string[];
};

export function CatalogClient({ products, brands }: CatalogProps) {
  const [brand, setBrand] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (brand && product.brand !== brand) return false;
      if (gender && product.gender !== gender) return false;
      if (maxPrice) {
        const price = Number(maxPrice);
        if (!Number.isNaN(price) && product.price > price) return false;
      }
      return true;
    });
  }, [products, brand, gender, maxPrice]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Card className="h-fit space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Бренд</p>
          <select
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-noir-900 px-3 py-2 text-sm text-ivory-100"
          >
            <option value="">Все бренды</option>
            {brands.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Гендер</p>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-noir-900 px-3 py-2 text-sm text-ivory-100"
          >
            <option value="">Все</option>
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
            <option value="UNISEX">Унисекс</option>
          </select>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Цена до</p>
          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            type="number"
            className="mt-3 w-full rounded-xl border border-white/10 bg-noir-900 px-3 py-2 text-sm text-ivory-100"
            placeholder="15000"
          />
        </div>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
