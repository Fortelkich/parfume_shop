import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTelegramUser } from "@/lib/auth";
import { formatManagerLabel } from "@/lib/labels";

export async function GET() {
  const user = await getTelegramUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { manager: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      telegramUsername: user.telegramUsername,
      role: user.role,
      phone: user.phone
    },
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      type: order.type,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      managerLabel: formatManagerLabel(order.manager),
      trackingCode: order.cdekTrackCode
    }))
  });
}
