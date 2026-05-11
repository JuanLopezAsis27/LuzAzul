import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { createProductStateSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  const where: Record<string, unknown> = {};
  if (section) {
    where.OR = [{ section }, { section: null }];
  }

  const pageParam = searchParams.get("page");
  if (pageParam !== null) {
    const page = Math.max(1, parseInt(pageParam) || 1);
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") ?? "10") || 10);
    const [total, states] = await Promise.all([
      prisma.productState.count({ where }),
      prisma.productState.findMany({ where, orderBy: { name: "asc" }, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return NextResponse.json({ data: states, pagination: { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) } });
  }

  const states = await prisma.productState.findMany({ where, orderBy: { name: "asc" } });
  return NextResponse.json(states);
}

export async function POST(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const result = createProductStateSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    const existing = await prisma.productState.findFirst({
      where: { name: result.data.name, section: result.data.section ?? null },
    });
    if (existing) return NextResponse.json({ error: "Ya existe un estado con ese nombre para esa sección" }, { status: 409 });

    const state = await prisma.productState.create({ data: result.data });
    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    console.error("Create state error:", error);
    return NextResponse.json({ error: "Error al crear estado" }, { status: 500 });
  }
}
