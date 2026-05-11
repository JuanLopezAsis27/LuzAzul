import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { createProductSchema, updateProductSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const barcode = searchParams.get("barcode");
  const activeOnly = searchParams.get("active") !== "false";

  const where: Record<string, unknown> = {};
  if (activeOnly) where.isActive = true;
  if (barcode) {
    where.barcode = barcode;
  } else if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { barcode: { contains: search, mode: "insensitive" } },
      { label: { contains: search, mode: "insensitive" } },
    ];
  }

  const pageParam = searchParams.get("page");
  if (pageParam !== null) {
    const page = Math.max(1, parseInt(pageParam) || 1);
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") ?? "10") || 10);
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, orderBy: { name: "asc" }, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return NextResponse.json({ data: products, pagination: { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) } });
  }

  const products = await prisma.product.findMany({ where, orderBy: { name: "asc" } });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const result = createProductSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    const existing = await prisma.product.findUnique({ where: { code: result.data.code } });
    if (existing) return NextResponse.json({ error: "Ya existe un producto con ese código" }, { status: 409 });

    const product = await prisma.product.create({ data: result.data });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
