import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { createDailyLoadSchema } from "@/lib/validations";

const loadInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, code: true } },
      state: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
  user: { select: { id: true, name: true } },
  branch: { select: { id: true, name: true } },
};

// Argentina is UTC-3 (no DST). Returns "YYYY-MM-DD" in Argentina local time.
function getArgentinaDateStr(date?: Date): string {
  const d = date ?? new Date();
  const argTime = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return argTime.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const today = dateParam
    ? new Date(dateParam + "T00:00:00.000Z")
    : new Date(getArgentinaDateStr() + "T00:00:00.000Z");

  if (auth.user.role === "EMPLOYEE") {
    const dailyLoad = await prisma.dailyLoad.findUnique({
      where: { userId_date: { userId: auth.user.userId, date: today } },
      include: loadInclude,
    });
    return NextResponse.json(dailyLoad);
  }

  const where: Record<string, unknown> = { date: today };
  if (auth.user.role === "ADMIN" && auth.user.branchId) where.branchId = auth.user.branchId;
  const branchId = searchParams.get("branchId");
  if (branchId && auth.user.role === "SUPER_ADMIN") where.branchId = branchId;

  const dailyLoads = await prisma.dailyLoad.findMany({ where, include: loadInclude, orderBy: { createdAt: "desc" } });
  return NextResponse.json(dailyLoads);
}

export async function POST(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const result = createDailyLoadSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    const today = new Date(getArgentinaDateStr() + "T00:00:00.000Z");

    const existing = await prisma.dailyLoad.findUnique({ where: { userId_date: { userId: auth.user.userId, date: today } } });

    if (existing?.isClosed) return NextResponse.json({ error: "La planilla del día ya fue cerrada y no se puede modificar" }, { status: 400 });
    if (!auth.user.branchId) return NextResponse.json({ error: "El usuario no tiene una sucursal asignada" }, { status: 400 });

    const dailyLoad = await prisma.$transaction(async (tx) => {
      const load = existing ?? await tx.dailyLoad.create({ data: { date: today, userId: auth.user.userId, branchId: auth.user.branchId! } });
      await tx.loadItem.createMany({ data: result.data.items.map((item) => ({ ...item, dailyLoadId: load.id })) });
      return tx.dailyLoad.findUnique({ where: { id: load.id }, include: loadInclude });
    });

    return NextResponse.json(dailyLoad, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("Create daily load error:", error);
    return NextResponse.json({ error: "Error al crear carga diaria" }, { status: 500 });
  }
}
