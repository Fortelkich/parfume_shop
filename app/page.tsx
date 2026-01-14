import Link from "next/link";
import { prisma } from "@/lib/db";
import { SiteShell } from "@/components/site-shell";
import { Section, Button } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { ServiceCard } from "@/components/service-card";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      brand: true,
      price: true,
      volumeMl: true,
      images: true
    }
  });

  return (
    <SiteShell>
      <section className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-ivory-300">Noir Atelier</p>
            <h1 className="mt-4 font-display text-4xl md:text-5xl">
              Премиальная парфюмерия и личные подборы в мини-приложении
            </h1>
            <p className="mt-6 text-ivory-300">
              Персональный менеджер сопровождает заказ, помогает подобрать аромат и оформляет доставку через
              службу доставки после подтверждения оплаты.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/catalog">Перейти в каталог</Button>
              <Button href="/service/selection" variant="ghost">
                Подбор аромата
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-noir-850/80 p-6 shadow-glow">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Сервис</p>
                <p className="mt-2 text-lg font-semibold">Менеджер принимает оплату лично</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Доставка</p>
                <p className="mt-2 text-lg font-semibold">Трек-номер доставки после оплаты</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory-300">Упаковка</p>
                <p className="mt-2 text-lg font-semibold">Подарочная упаковка по запросу</p>
              </div>
            </div>
            <Link href="/cart" prefetch={false} className="mt-6 inline-flex text-sm text-cacao-600">
              Проверить корзину →
            </Link>
          </div>
        </div>
      </section>

      <Section title="Ассортимент" subtitle="Изысканные ароматы">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                title: product.title,
                brand: product.brand,
                price: Number(product.price),
                volumeMl: product.volumeMl,
                images: product.images
              }}
            />
          ))}
        </div>
      </Section>

      <Section title="Услуги" subtitle="Персональный подход">
        <div className="grid gap-6 md:grid-cols-2">
          <ServiceCard
            title="Заказ под доставку"
            description="Привезем редкий аромат под ваш запрос и сроки."
            href="/service/preorder-delivery"
          />
          <ServiceCard
            title="Подбор аромата"
            description="Эксперт подберет аромат под настроение и стиль."
            href="/service/selection"
          />
          <ServiceCard
            title="Набор пробников"
            description="Соберите сет пробников для знакомства с брендом."
            href="/service/sample-set"
          />
          <ServiceCard
            title="Покупка из ассортимента"
            description="Выберите готовые позиции и оформите заказ."
            href="/catalog"
          />
        </div>
      </Section>
    </SiteShell>
  );
}
