import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTelegramUser, requireRole } from "@/lib/auth";
import { formatManagerLabel } from "@/lib/labels";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, manager: true }
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    type: order.type,
    totalAmount: Number(order.totalAmount),
    customerName: order.customerName,
    phone: order.phone,
    deliveryAddress: order.deliveryAddress,
    comment: order.comment,
    cdekTrackCode: order.cdekTrackCode,
    managerLabel: formatManagerLabel(order.manager),
    items: order.items.map((item) => ({
      id: item.id,
      titleSnapshot: item.titleSnapshot,
      qty: item.qty,
      priceSnapshot: Number(item.priceSnapshot)
    }))
  });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const payload = await request.json();
  const updated = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: payload.status
    }
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
}
