import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { updateBranchSchema } from "@/lib/validations";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const body = await request.json();
    const result = updateBranchSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    const branch = await prisma.branch.update({ where: { id }, data: result.data });
    return NextResponse.json(branch);
  } catch (error) {
    console.error("Update branch error:", error);
    return NextResponse.json({ error: "Error al actualizar sucursal" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    await prisma.branch.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete branch error:", error);
    return NextResponse.json({ error: "Error al eliminar sucursal" }, { status: 500 });
  }
}
