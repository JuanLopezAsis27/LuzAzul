import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type JWTPayload } from "@/lib/auth";

type Role = "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE";

/**
 * Extrae y verifica el token JWT del header Authorization.
 * Retorna el payload del usuario o un NextResponse de error.
 */
export function getAuthUser(
  request: NextRequest
): JWTPayload | NextResponse {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    return payload;
  } catch {
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 }
    );
  }
}

/**
 * Verifica que el usuario tenga uno de los roles permitidos.
 */
export function requireRole(
  user: JWTPayload,
  allowedRoles: Role[]
): NextResponse | null {
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "No tiene permisos para esta acción" },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Helper combinado: autenticación + autorización por rol.
 */
export function authorize(
  request: NextRequest,
  allowedRoles: Role[]
): { user: JWTPayload } | { error: NextResponse } {
  const result = getAuthUser(request);

  if (result instanceof NextResponse) {
    return { error: result };
  }

  const roleError = requireRole(result, allowedRoles);
  if (roleError) {
    return { error: roleError };
  }

  return { user: result };
}
