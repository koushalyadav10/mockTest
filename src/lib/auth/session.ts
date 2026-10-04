import { NextRequest, NextResponse } from "next/server";
import { signJwt, verifyJwt, JwtPayload } from "./jwt";
import { hasPermission, Permission, Role } from "./rbac";

export const SESSION_COOKIE_NAME = "examforge_session";

export function createSessionToken(payload: JwtPayload): string {
  return signJwt(payload, 7 * 24 * 3600); // 7 days
}

export function createSessionCookie(payload: JwtPayload): string {
  const token = createSessionToken(payload);
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getSessionUser(req: NextRequest): JwtPayload | null {
  // Check cookie first
  let token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Check Authorization Bearer header if not in cookie
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  return verifyJwt(token);
}

export function requireAuth(
  req: NextRequest,
  allowedRoles?: ("STUDENT" | "TEACHER" | "ADMIN")[]
): { user: JwtPayload | null; errorResponse: NextResponse | null } {
  const user = getSessionUser(req);

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: `Forbidden: requires ${allowedRoles.join(" or ")} privilege.` },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}

export function requirePermission(
  req: NextRequest,
  permission: Permission
): { user: JwtPayload | null; errorResponse: NextResponse | null } {
  const user = getSessionUser(req);

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      ),
    };
  }

  if (!hasPermission(user.role as Role, permission)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: `Forbidden: permission '${permission}' denied for role '${user.role}'.` },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}
