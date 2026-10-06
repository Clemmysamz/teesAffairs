import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isAdminSessionValid,
  verifyAdminCredentials,
} from "@/lib/admin-auth.server";

export async function GET() {
  const cookieStore = await cookies();
  const authorized = isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json({ authorized });
}

export async function POST(request: Request) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    if (typeof body.username !== "string" || typeof body.password !== "string" || !verifyAdminCredentials(body.username, body.password)) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const response = NextResponse.json({ authorized: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authorized: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
