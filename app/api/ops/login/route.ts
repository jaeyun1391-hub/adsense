import { NextResponse } from "next/server";
import { matchesSecret } from "@/lib/ops-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  const expected = process.env.OPS_ACCESS_TOKEN;

  if (!expected) {
    return NextResponse.json({ ok: false, message: "관리자 접근 토큰이 아직 설정되지 않았습니다." }, { status: 503 });
  }
  if (!matchesSecret(password, expected)) {
    return NextResponse.json({ ok: false, message: "접근 토큰을 확인해 주세요." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("ops_session", expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}
