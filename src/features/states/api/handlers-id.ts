import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";
import { updateProductStateSchema } from "@/lib/validations";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const body = await request.json();
    const result = updateProductStateSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });

    const state = await prisma.productState.update({ where: { id }, data: result.data });
    return NextResponse.json(state);
  } catch (error) {
    console.error("Update state error:", error);
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    await prisma.productState.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete state error:", error);
    return NextResponse.json({ error: "Error al eliminar estado" }, { status: 500 });
  }
}
