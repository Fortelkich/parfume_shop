import Image from "next/image";
import Link from "next/link";
import { Card, Button } from "./ui";

export type ProductCardData = {
  id: string;
  title: string;
  brand: string;
  price: number;
  volumeMl: number;
  images: string[];
  gender?: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="relative h-44 overflow-hidden rounded-xl bg-noir-900">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ivory-300 text-sm">
            Image placeholder
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">{product.brand}</p>
        <h3 className="font-display text-xl mt-2">{product.title}</h3>
        <p className="text-ivory-300 mt-2">{product.volumeMl} мл</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{product.price.toLocaleString("ru-RU")} ₽</span>
        <Button href={`/product/${product.id}`} variant="ghost">
          Смотреть
        </Button>
      </div>
      <Link
        href={`/product/${product.id}`}
        prefetch={false}
        className="text-xs text-ivory-300 underline underline-offset-4"
      >
        Подробнее и ноты
      </Link>
    </Card>
  );
}
