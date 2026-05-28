import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";
import { getArgentinaDateStr, getArgentinaDateUTC } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (user instanceof NextResponse) return user;

  const today = getArgentinaDateUTC(getArgentinaDateStr());

  const loadWhere =
    user.role === "EMPLOYEE"
      ? { date: today, userId: user.userId }
      : user.role === "ADMIN" && user.branchId
        ? { date: today, branchId: user.branchId }
        : { date: today };

  const [usersCount, branchesCount, productsCount, todayLoadsCount, sectionTotals] =
    await Promise.all([
      user.role === "SUPER_ADMIN"
        ? prisma.user.count({ where: { isActive: true } })
        : Promise.resolve(null),
      user.role === "SUPER_ADMIN"
        ? prisma.branch.count({ where: { isActive: true } })
        : Promise.resolve(null),
      user.role === "SUPER_ADMIN"
        ? prisma.product.count({ where: { isActive: true } })
        : Promise.resolve(null),
      prisma.dailyLoad.count({ where: loadWhere }),
      prisma.loadItem.groupBy({
        by: ["section", "unit"],
        where: { dailyLoad: loadWhere },
        _sum: { quantity: true },
      }),
    ]);

  const sections: Record<string, { unit: string; total: number }[]> = {
    MERMA: [],
    DONACION: [],
    REFRIGERIO: [],
  };
  for (const row of sectionTotals) {
    if (row.section in sections) {
      sections[row.section].push({ unit: row.unit, total: row._sum.quantity ?? 0 });
    }
  }

  return NextResponse.json({ usersCount, branchesCount, productsCount, todayLoadsCount, sections });
}
