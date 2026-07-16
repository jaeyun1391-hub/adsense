import { NextResponse } from "next/server";
import { getExperience } from "@/lib/experience";
import { hasOpsAccess } from "@/lib/ops-auth";
import { saveApplicationRun, type ApplicationStatus } from "@/lib/operations";
import { getSite } from "@/lib/sites";

const allowedStatuses: ApplicationStatus[] = ["준비 전", "준비 중", "검토 필요", "주의 필요", "준비됨"];

function nextActionFor(status: ApplicationStatus, mode: "stability" | "operating") {
  if (status === "준비됨") return "광고 설정, ads.txt, 노출 상태와 PIN·정산 흐름 점검";
  if (status === "검토 필요") return "소유권·연결·정책 문서·모바일 화면을 재점검한 뒤 신청";
  if (status === "주의 필요") return mode === "stability" ? "도움 글 1~2개 보강 후 안정화 기간을 다시 확인" : "문제 해결형 글 3~5개와 공식 업데이트를 보강";
  if (status === "준비 중") return "초기 콘텐츠, 출처 연결, 중복·빈 카테고리 검사를 진행";
  return mode === "stability" ? "초기 12개 편집 글 공개 후 48시간 안정화 확인" : "초기 12개 편집 글과 공식 데이터 흐름 확인";
}

export async function POST(request: Request) {
  if (!(await hasOpsAccess())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { siteSlug?: unknown; status?: unknown } | null;
  const siteSlug = typeof body?.siteSlug === "string" ? body.siteSlug : "";
  const status = typeof body?.status === "string" ? body.status as ApplicationStatus : null;
  const site = getSite(siteSlug);
  if (!site || !status || !allowedStatuses.includes(status)) {
    return NextResponse.json({ ok: false, message: "사이트 또는 상태 값이 올바르지 않습니다." }, { status: 400 });
  }

  const mode = getExperience(site.slug).submissionMode;
  try {
    await saveApplicationRun({
      siteSlug: site.slug,
      mode,
      status,
      lastActionAt: new Date().toISOString(),
      nextAction: nextActionFor(status, mode)
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "신청 상태를 저장하지 못했습니다.";
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}
