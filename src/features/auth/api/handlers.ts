import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, generateTokenPair, verifyRefreshToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function handleLogin(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 });
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email }, include: { branch: true } });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const payload = { userId: user.id, email: user.email, role: user.role, branchId: user.branchId };
    const tokens = generateTokenPair(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { token: tokens.refreshToken, userId: user.id, expiresAt } });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, branch: user.branch ? { id: user.branch.id, name: user.branch.name } : null },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function handleLogout(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("refreshToken", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function handleRefresh(request: NextRequest) {
  try {
    let refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      try { const body = await request.json(); refreshToken = body.refreshToken; } catch { /* no body */ }
    }

    if (!refreshToken) {
      return NextResponse.json({ error: "No se encontró refresh token" }, { status: 401 });
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken }, include: { user: { include: { branch: true } } } });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) await prisma.refreshToken.deleteMany({ where: { id: storedToken.id } });
      return NextResponse.json({ error: "Token expirado o inválido" }, { status: 401 });
    }

    try { verifyRefreshToken(refreshToken); } catch {
      await prisma.refreshToken.deleteMany({ where: { id: storedToken.id } });
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const user = storedToken.user;
    if (!user.isActive) return NextResponse.json({ error: "Usuario desactivado" }, { status: 403 });

    const payload = { userId: user.id, email: user.email, role: user.role, branchId: user.branchId };
    const tokens = generateTokenPair(payload);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({ where: { id: storedToken.id } });
      await tx.refreshToken.create({ data: { token: tokens.refreshToken, userId: user.id, expiresAt } });
    });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, branch: user.branch ? { id: user.branch.id, name: user.branch.name } : null },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    response.cookies.set("refreshToken", tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });
    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
