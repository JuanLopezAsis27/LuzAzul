import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const branchId = searchParams.get("branchId");

  const dateFilter: Record<string, unknown> = {};
  if (startDate) dateFilter.gte = new Date(startDate + "T00:00:00.000Z");
  if (endDate) dateFilter.lte = new Date(endDate + "T00:00:00.000Z");

  const where: Record<string, unknown> = {};
  if (Object.keys(dateFilter).length > 0) where.dailyLoad = { date: dateFilter };

  if (auth.user.role === "ADMIN" && auth.user.branchId) {
    if (!where.dailyLoad) where.dailyLoad = {};
    (where.dailyLoad as Record<string, unknown>).branchId = auth.user.branchId;
  } else if (branchId) {
    if (!where.dailyLoad) where.dailyLoad = {};
    (where.dailyLoad as Record<string, unknown>).branchId = branchId;
  }

  const items = await prisma.loadItem.findMany({
    where,
    include: {
      product: { select: { id: true, name: true, code: true } },
      state: { select: { id: true, name: true } },
      dailyLoad: { select: { branch: { select: { id: true, name: true } }, date: true } },
    },
  });

  const summary: Record<string, { branch: { id: string; name: string }; sections: Record<string, { totalQuantity: number; products: Record<string, { name: string; code: string; quantity: number }> }> }> = {};

  for (const item of items) {
    const branchKey = item.dailyLoad.branch.id;
    if (!summary[branchKey]) summary[branchKey] = { branch: item.dailyLoad.branch, sections: {} };
    if (!summary[branchKey].sections[item.section]) summary[branchKey].sections[item.section] = { totalQuantity: 0, products: {} };

    const sec = summary[branchKey].sections[item.section];
    sec.totalQuantity += item.quantity;
    if (!sec.products[item.productId]) sec.products[item.productId] = { name: item.product.name, code: item.product.code, quantity: 0 };
    sec.products[item.productId].quantity += item.quantity;
  }

  const result = Object.values(summary).map((entry) => ({
    branch: entry.branch,
    sections: Object.entries(entry.sections).map(([section, data]) => ({
      section,
      totalQuantity: data.totalQuantity,
      products: Object.values(data.products).sort((a, b) => b.quantity - a.quantity),
    })),
  }));

  return NextResponse.json(result);
}
