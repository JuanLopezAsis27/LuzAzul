import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/auth-middleware";

const loadInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, code: true } },
      state: { select: { id: true, name: true } },
    },
  },
  user: { select: { id: true, name: true } },
  branch: { select: { id: true, name: true } },
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const dailyLoad = await prisma.dailyLoad.findUnique({ where: { id } });
    if (!dailyLoad) return NextResponse.json({ error: "Carga no encontrada" }, { status: 404 });
    if (auth.user.role === "EMPLOYEE" && dailyLoad.userId !== auth.user.userId) {
      return NextResponse.json({ error: "No puede cerrar cargas de otros usuarios" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({})) as { isClosed?: boolean };
    const isClosed = typeof body.isClosed === "boolean" ? body.isClosed : true;

    if (isClosed === false && auth.user.role === "EMPLOYEE") {
      return NextResponse.json({ error: "Solo un administrador puede reabrir una planilla" }, { status: 403 });
    }

    const updated = await prisma.dailyLoad.update({ where: { id }, data: { isClosed }, include: loadInclude });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Close daily load error:", error);
    return NextResponse.json({ error: "Error al actualizar planilla" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authorize(request, ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "Se requiere itemId" }, { status: 400 });

  try {
    const dailyLoad = await prisma.dailyLoad.findUnique({ where: { id } });
    if (!dailyLoad) return NextResponse.json({ error: "Carga no encontrada" }, { status: 404 });
    if (dailyLoad.isClosed) return NextResponse.json({ error: "La planilla ya fue cerrada" }, { status: 400 });
    if (auth.user.role === "EMPLOYEE" && dailyLoad.userId !== auth.user.userId) {
      return NextResponse.json({ error: "No puede modificar cargas de otros usuarios" }, { status: 403 });
    }

    await prisma.loadItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete load item error:", error);
    return NextResponse.json({ error: "Error al eliminar item" }, { status: 500 });
  }
}
