import { ArrowUpRight } from "lucide-react";
import type { SiteQualityAudit } from "@/lib/editorial-audit";
import type { ApplicationRun, CollectionRunLog, SourceHealth } from "@/lib/operations";
import type { SiteSlug } from "@/lib/sites";

type Snapshot = { siteSlug: SiteSlug; name: string; count: number; live: boolean };

function formatDate(value: string | null) {
  if (!value) return "기록 없음";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function sourceStateLabel(state: SourceHealth["state"]) {
  return state === "stale" ? "재검토 필요" : "Codex 정기 점검";
}

export function OpsDashboard({
  applicationRuns,
  sourceHealth,
  snapshots,
  collectionRuns,
  qualityAudits,
  manifestUpdatedAt
}: {
  applicationRuns: ApplicationRun[];
  sourceHealth: SourceHealth[];
  snapshots: Snapshot[];
  collectionRuns: CollectionRunLog[];
  qualityAudits: SiteQualityAudit[];
  manifestUpdatedAt: string;
}) {
  return (
    <main className="ops-shell">
      <header className="ops-header">
        <div>
          <p>COLOJISTER / CODEX OPERATIONS</p>
          <h1>공개 정보 운영 보드</h1>
          <span>Codex 정기 작업이 공식 원문을 검토하고, 검증된 변경만 Git 기록과 배포에 반영합니다.</span>
        </div>
        <form action="/api/ops/logout" method="post"><button type="submit">로그아웃</button></form>
      </header>

      <section className="ops-readonly-note">
        <div><b>서버 저장소 방식</b><p>이 화면은 data/operations.json의 배포본을 읽습니다. 사이트 화면이나 Vercel 함수가 정보를 직접 쓰지 않으므로, 원문 확인 없이 공개 내용이 바뀌지 않습니다.</p></div>
        <small>운영 파일 마지막 변경: {formatDate(manifestUpdatedAt)}</small>
      </section>

      <section className="ops-summary-grid">
        {snapshots.map((snapshot) => <article key={snapshot.siteSlug}><span>{snapshot.name}</span><b>{snapshot.count}</b><small>{snapshot.live ? "검토된 공식 데이터 포함" : "편집 기준 데이터"}</small></article>)}
      </section>

      <section className="ops-panel">
        <div className="ops-panel-head"><div><p>CONTENT QUALITY</p><h2>공개 전 콘텐츠 검사</h2></div></div>
        <div className="ops-quality-list">
          {qualityAudits.map((audit) => (
            <article key={audit.siteSlug}>
              <div><b>{audit.siteName}</b><span>상세 {audit.itemCount} · 가이드 {audit.guideCount}</span></div>
              <p>1,000자 미만 상세 {audit.shortItems} · 가이드 {audit.shortGuides}</p>
              <p>빈 카테고리 {audit.emptyCategories} · 제목 중복 {audit.duplicateTitles} · 설명 중복 {audit.duplicateDescriptions}</p>
              <p>출처 누락 {audit.missingSourceLinks} · 검토일 누락 {audit.missingReviewDates} · 4회 이상 반복 문장 {audit.repeatedSentences}</p>
              {audit.repeatedSentenceSamples.length ? <small className="ops-quality-samples">반복 예시: {audit.repeatedSentenceSamples.join(" / ")}</small> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-head"><div><p>CODEX COLLECTION</p><h2>공식 원천 점검</h2></div></div>
        <div className="ops-source-list">
          {sourceHealth.map((source) => (
            <article key={source.id}>
              <div>
                <b>{source.label}</b>
                <small>{source.cadenceHours}시간 기준 · {sourceStateLabel(source.state)}</small>
                <p>{source.note}</p>
              </div>
              <a href={source.publicUrl} target="_blank" rel="noreferrer">원문 <ArrowUpRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-head"><div><p>APPLICATION RUNS</p><h2>애드센스 신청 상태</h2></div></div>
        <div className="ops-runs">
          {applicationRuns.map((run) => (
            <article key={run.siteSlug}>
              <div><span>{run.siteSlug}</span><b>{run.mode === "stability" ? "안정화 모드" : "운영형 모드"}</b><small>마지막 기록: {formatDate(run.lastActionAt)}</small></div>
              <div className="ops-run-state"><span>상태</span><b>{run.status}</b></div>
              <p>{run.nextAction}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-head"><div><p>RECENT LOGS</p><h2>검토 이력</h2></div></div>
        {collectionRuns.length ? (
          <div className="ops-log-list">{collectionRuns.map((run) => <article key={run.id}><b>{run.sourceId}</b><span>{run.state} · {run.recordCount}건</span><p>{run.detail}</p><small>{formatDate(run.startedAt)}</small></article>)}</div>
        ) : (
          <p className="ops-empty">첫 Codex 점검이 완료되면 실제 원문 확인, 공개 항목 수, 오류 여부가 이곳에 기록됩니다.</p>
        )}
      </section>
    </main>
  );
}
