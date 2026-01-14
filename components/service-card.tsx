import Link from "next/link";
import { Card } from "./ui";

export function ServiceCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} prefetch={false}>
      <Card className="h-full transition hover:-translate-y-1 hover:border-cacao-600">
        <h3 className="font-display text-xl">{title}</h3>
        <p className="mt-3 text-sm text-ivory-300">{description}</p>
        <span className="mt-4 inline-flex text-xs uppercase tracking-[0.3em] text-cacao-600">
          Открыть форму
        </span>
      </Card>
    </Link>
  );
}
