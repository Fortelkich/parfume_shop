import { prisma } from "@/lib/db";
import { SiteShell } from "@/components/site-shell";
import { Section } from "@/components/ui";
import { CatalogClient } from "@/components/catalog-client";

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      brand: true,
      price: true,
      volumeMl: true,
      images: true,
      gender: true
    }
  });
  const brands = Array.from(new Set(products.map((product) => product.brand)));

  return (
    <SiteShell>
      <Section title="Каталог" subtitle="Эксклюзивные позиции">
        <CatalogClient
          products={products.map((product) => ({
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: Number(product.price),
            volumeMl: product.volumeMl,
            images: product.images,
            gender: product.gender
          }))}
          brands={brands}
        />
      </Section>
    </SiteShell>
  );
}
