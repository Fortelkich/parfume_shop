import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getTelegramUser, requireRole } from "@/lib/auth";

export async function GET() {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const product = await prisma.product.create({
    data: {
      title: payload.title,
      brand: payload.brand,
      price: new Prisma.Decimal(payload.price),
      volumeMl: Number(payload.volumeMl),
      gender: payload.gender,
      concentration: payload.concentration,
      description: payload.description,
      images: payload.images || [],
      inStock: payload.inStock ?? true,
      sku: payload.sku,
      topNotes: payload.topNotes || [],
      heartNotes: payload.heartNotes || [],
      baseNotes: payload.baseNotes || []
    }
  });

  return NextResponse.json({ product });
}

export async function PUT(request: Request) {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const product = await prisma.product.update({
    where: { id: payload.id },
    data: {
      title: payload.title,
      brand: payload.brand,
      price: new Prisma.Decimal(payload.price),
      volumeMl: Number(payload.volumeMl),
      gender: payload.gender,
      concentration: payload.concentration,
      description: payload.description,
      images: payload.images || [],
      inStock: payload.inStock ?? true,
      sku: payload.sku,
      topNotes: payload.topNotes || [],
      heartNotes: payload.heartNotes || [],
      baseNotes: payload.baseNotes || []
    }
  });

  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  await prisma.product.delete({ where: { id: payload.id } });
  return NextResponse.json({ ok: true });
}
