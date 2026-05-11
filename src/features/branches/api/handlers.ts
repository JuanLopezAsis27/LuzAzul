import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { createBranchSchema, updateBranchSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get("page");

  if (pageParam !== null) {
    const page = Math.max(1, parseInt(pageParam) || 1);
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") ?? "10") || 10);
    const [total, branches] = await Promise.all([
      prisma.branch.count(),
      prisma.branch.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } }, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return NextResponse.json({ data: branches, pagination: { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) } });
  }

  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } } });
  return NextResponse.json(branches);
}

export async function POST(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const result = createBranchSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    const existing = await prisma.branch.findUnique({ where: { name: result.data.name } });
    if (existing) return NextResponse.json({ error: "Ya existe una sucursal con ese nombre" }, { status: 409 });

    const branch = await prisma.branch.create({ data: result.data });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("Create branch error:", error);
    return NextResponse.json({ error: "Error al crear sucursal" }, { status: 500 });
  }
}
