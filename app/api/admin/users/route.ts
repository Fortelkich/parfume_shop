import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTelegramUser, requireRole } from "@/lib/auth";

export async function GET() {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const user = await getTelegramUser();
  if (!requireRole(user, ["ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const updated = await prisma.user.update({
    where: { id: payload.id },
    data: {
      role: payload.role
    }
  });

  return NextResponse.json({ user: updated });
}
