import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTelegramUser, requireRole } from "@/lib/auth";
import { cdekClient } from "@/lib/cdek";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const cdek = await cdekClient.createOrder(order);

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: "PAID",
      cdekTrackCode: cdek.trackCode,
      cdekOrderId: cdek.cdekOrderId
    }
  });

  return NextResponse.json({ id: updated.id, cdekTrackCode: updated.cdekTrackCode });
}
