import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { createUserSchema, updateUserSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

const userSelect = {
  id: true, email: true, name: true, role: true, isActive: true,
  branchId: true, branch: { select: { id: true, name: true } }, createdAt: true,
};

export async function GET(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (auth.user.role === "ADMIN") {
    // Branch admins can only see users from their own branch
    where.branchId = auth.user.branchId;
  } else {
    const branchId = searchParams.get("branchId");
    if (branchId) where.branchId = branchId;
  }

  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const pageParam = searchParams.get("page");
  if (pageParam !== null) {
    const page = Math.max(1, parseInt(pageParam) || 1);
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") ?? "10") || 10);
    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, select: userSelect, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return NextResponse.json({ data: users, pagination: { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) } });
  }

  const users = await prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, select: userSelect });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const result = createUserSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    let { email, password, name, role, branchId } = result.data;

    // Branch admins can only create EMPLOYEE users for their branch
    if (auth.user.role === "ADMIN") {
      if (role !== "EMPLOYEE") return NextResponse.json({ error: "Solo podés crear empleados" }, { status: 403 });
      if (!auth.user.branchId) return NextResponse.json({ error: "Tu cuenta no tiene sucursal asignada" }, { status: 403 });
      branchId = auth.user.branchId;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 });

    if (role === "ADMIN" && branchId) {
      const adminCount = await prisma.user.count({ where: { branchId, role: "ADMIN", isActive: true } });
      if (adminCount >= 2) return NextResponse.json({ error: "La sucursal ya tiene 2 administradores asignados" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role, branchId: branchId || null },
      select: userSelect,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}
