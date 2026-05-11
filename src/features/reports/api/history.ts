import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { reportFilterSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const filters = reportFilterSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!filters.success) return NextResponse.json({ error: "Filtros inválidos", details: filters.error.flatten() }, { status: 400 });

  const { startDate, endDate, branchId, section, userId, page, pageSize } = filters.data;
  const where: Record<string, unknown> = {};

  if (startDate || endDate) {
    where.date = {};
    if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate + "T00:00:00.000Z");
    if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate + "T00:00:00.000Z");
  }

  if (auth.user.role === "ADMIN" && auth.user.branchId) where.branchId = auth.user.branchId;
  else if (branchId) where.branchId = branchId;

  if (userId) where.userId = userId;
  if (section) where.items = { some: { section } };

  const [total, dailyLoads] = await Promise.all([
    prisma.dailyLoad.count({ where }),
    prisma.dailyLoad.findMany({
      where,
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, code: true } },
            state: { select: { id: true, name: true } },
          },
          ...(section ? { where: { section } } : {}),
        },
        user: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ data: dailyLoads, pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
}
