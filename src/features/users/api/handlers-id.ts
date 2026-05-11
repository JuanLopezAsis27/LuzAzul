import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { updateUserSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

const userSelect = {
  id: true, email: true, name: true, role: true, isActive: true,
  branchId: true, branch: { select: { id: true, name: true } }, createdAt: true,
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  if (auth.user.role === "ADMIN" && user.branchId !== auth.user.branchId) {
    return NextResponse.json({ error: "No tenés permisos para ver este usuario" }, { status: 403 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const target = await prisma.user.findUnique({ where: { id }, select: { branchId: true } });
    if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    if (auth.user.role === "ADMIN" && target.branchId !== auth.user.branchId) {
      return NextResponse.json({ error: "No tenés permisos para editar este usuario" }, { status: 403 });
    }

    const body = await request.json();
    const result = updateUserSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    const data = result.data;

    // Branch admins cannot change role or branchId
    if (auth.user.role === "ADMIN") {
      delete data.role;
      delete data.branchId;
    }

    if (data.password) data.password = await hashPassword(data.password);

    const user = await prisma.user.update({ where: { id }, data, select: userSelect });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const target = await prisma.user.findUnique({ where: { id }, select: { branchId: true } });
    if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    if (auth.user.role === "ADMIN" && target.branchId !== auth.user.branchId) {
      return NextResponse.json({ error: "No tenés permisos para desactivar este usuario" }, { status: 403 });
    }

    await prisma.user.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
  }
}
