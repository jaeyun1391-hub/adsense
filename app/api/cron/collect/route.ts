import { NextResponse } from "next/server";
import { hasCronAccess } from "@/lib/ops-auth";
import { collectConfiguredSources } from "@/lib/operations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function collect(request: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, message: "CRON_SECRET이 설정되지 않았습니다." }, { status: 503 });
  }
  if (!hasCronAccess(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await collectConfiguredSources();
    return NextResponse.json({ ok: true, collectedAt: new Date().toISOString(), results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "수집 작업을 완료하지 못했습니다.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export const GET = collect;
export const POST = collect;
