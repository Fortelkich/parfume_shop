import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTelegramUser, requireRole } from "@/lib/auth";
import { formatManagerLabel } from "@/lib/labels";

export async function GET() {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const where = {};
  const orders = await prisma.order.findMany({
    where,
    include: { manager: true },
    orderBy: { createdAt: "desc" }
  });

  const totalOrders = await prisma.order.count({ where });
  const waitingPayment = await prisma.order.count({ where: { ...where, status: "WAITING_PAYMENT" } });
  const paid = await prisma.order.count({ where: { ...where, status: "PAID" } });

  return NextResponse.json({
    totalOrders,
    waitingPayment,
    paid,
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      type: order.type,
      totalAmount: Number(order.totalAmount),
      customerName: order.customerName,
      createdAt: order.createdAt,
      managerLabel: formatManagerLabel(order.manager)
    }))
  });
}
