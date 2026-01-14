import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getTelegramUser } from "@/lib/auth";
import { formatManagerLabel } from "@/lib/labels";

const ACTIVE_STATUSES = ["NEW", "WAITING_PAYMENT", "PAID", "PROCESSING", "SHIPPED"] as const;

export async function POST(request: Request) {
  const user = await getTelegramUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  if (!payload.customerName || !payload.phone || !payload.type) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const items = Array.isArray(payload.items) ? payload.items : [];
  const giftWrap = Boolean(payload.giftWrap);
  const giftWrapPrice = payload.giftWrapPrice ? Number(payload.giftWrapPrice) : null;

  const subtotal = items.reduce(
    (sum: number, item: { price: number; qty: number }) => sum + Number(item.price) * Number(item.qty || 1),
    0
  );
  const totalAmount = subtotal + (giftWrap && giftWrapPrice ? giftWrapPrice : 0);

  const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });
  let managerId: string | null = null;

  if (managers.length > 0) {
    const counts = await prisma.order.groupBy({
      by: ["managerId"],
      where: { status: { in: ACTIVE_STATUSES as any }, managerId: { not: null } },
      _count: { _all: true }
    });

    const managerCounts = new Map<string, number>();
    counts.forEach((item) => {
      if (item.managerId) managerCounts.set(item.managerId, item._count._all);
    });

    managerId = managers
      .slice()
      .sort((a, b) => (managerCounts.get(a.id) ?? 0) - (managerCounts.get(b.id) ?? 0))[0].id;
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      managerId,
      type: payload.type,
      status: "WAITING_PAYMENT",
      totalAmount: new Prisma.Decimal(totalAmount),
      giftWrap,
      giftWrapPrice: giftWrapPrice ? new Prisma.Decimal(giftWrapPrice) : null,
      customerName: payload.customerName,
      phone: payload.phone,
      deliveryAddress: payload.deliveryAddress || null,
      comment: payload.comment || null,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId || null,
          titleSnapshot: item.title,
          priceSnapshot: new Prisma.Decimal(item.price),
          qty: Number(item.qty || 1)
        }))
      }
    },
    include: {
      manager: true
    }
  });

  const managerLabel = formatManagerLabel(order.manager);

  return NextResponse.json({ orderId: order.id, managerLabel });
}
