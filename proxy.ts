import { NextRequest, NextResponse } from "next/server";

const domainToSite: Record<string, string> = {
  "licensemoa.co.kr": "exam",
  "www.licensemoa.co.kr": "exam",
  "conferenceinfo.co.kr": "events",
  "www.conferenceinfo.co.kr": "events",
  "money1000.co.kr": "housing",
  "www.money1000.co.kr": "housing",
  "business100.co.kr": "business",
  "www.business100.co.kr": "business",
  "publicguide.co.kr": "facilities",
  "www.publicguide.co.kr": "facilities"
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const site = domainToSite[host];
  const { pathname } = request.nextUrl;

  if (!site || pathname.startsWith(`/${site}`) || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${site}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
