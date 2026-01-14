import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteShell } from "@/components/site-shell";
import { ProductDetailClient } from "@/components/product-detail-client";

function NotesBlock({ title, notes }: { title: string; notes: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-ivory-300">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {notes.map((note) => (
          <span
            key={note}
            className="rounded-full border border-cacao-600/60 px-3 py-1 text-xs text-ivory-300"
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return notFound();

  return (
    <SiteShell>
      <div className="grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-noir-850">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ivory-300">Image</div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ivory-300">{product.brand}</p>
            <h1 className="mt-3 font-display text-3xl">{product.title}</h1>
            <p className="mt-3 text-lg">{Number(product.price).toLocaleString("ru-RU")} ₽</p>
            <p className="mt-2 text-ivory-300">
              {product.volumeMl} мл · {product.concentration}
            </p>
          </div>
          <p className="text-ivory-300 leading-relaxed">{product.description}</p>
          <div className="space-y-4">
            <NotesBlock title="Верхние" notes={product.topNotes} />
            <NotesBlock title="Сердце" notes={product.heartNotes} />
            <NotesBlock title="База" notes={product.baseNotes} />
          </div>
          <ProductDetailClient id={product.id} title={product.title} price={Number(product.price)} />
        </div>
      </div>
    </SiteShell>
  );
}
