"use client";

import { useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import type { SiteQualityAudit } from "@/lib/editorial-audit";
import type { ApplicationRun, ApplicationStatus, CollectionRunLog, SourceHealth } from "@/lib/operations";
import type { SiteSlug } from "@/lib/sites";

type Snapshot = { siteSlug: SiteSlug; name: string; count: number; live: boolean };
type CollectionResult = { source: string; state: string; count: number; detail: string };

const statuses: ApplicationStatus[] = ["준비 전", "준비 중", "검토 필요", "주의 필요", "준비됨"];

function formatDate(value: string | null) {
  if (!value) return "기록 없음";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function OpsDashboard({
  applicationRuns,
  sourceHealth,
  snapshots,
  collectionRuns,
  qualityAudits
}: {
  applicationRuns: ApplicationRun[];
  sourceHealth: SourceHealth[];
  snapshots: Snapshot[];
  collectionRuns: CollectionRunLog[];
  qualityAudits: SiteQualityAudit[];
}) {
  const [runs, setRuns] = useState(applicationRuns);
  const [notice, setNotice] = useState("");
  const [collecting, setCollecting] = useState(false);
  const [collectionResult, setCollectionResult] = useState<CollectionResult[]>([]);

  async function saveStatus(siteSlug: SiteSlug, status: ApplicationStatus) {
    setNotice("");
    const response = await fetch("/api/ops/application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteSlug, status })
    });
    const data = await response.json().catch(() => ({ ok: false, message: "상태를 저장하지 못했습니다." }));
    if (!data.ok) {
      setNotice(data.message ?? "상태를 저장하지 못했습니다.");
      return;
    }
    setRuns((current) => current.map((run) => run.siteSlug === siteSlug ? { ...run, status, lastActionAt: new Date().toISOString() } : run));
    setNotice("신청 상태를 저장했습니다.");
  }

  async function collectNow() {
    setCollecting(true);
    setNotice("");
    const response = await fetch("/api/ops/collect", { method: "POST" });
    const data = await response.json().catch(() => ({ ok: false, message: "수집 결과를 확인하지 못했습니다." }));
    setCollecting(false);
    if (!data.ok) {
      setNotice(data.message ?? "수집을 완료하지 못했습니다.");
      return;
    }
    setCollectionResult(data.results ?? []);
    setNotice("수집 작업을 실행했습니다. 결과를 확인한 뒤 새로고침하면 기록이 반영됩니다.");
  }

  return (
    <main className="ops-shell">
      <header className="ops-header">
        <div>
          <p>COLOJISTER / PRIVATE OPERATIONS</p>
          <h1>승인 운영 보드</h1>
          <span>수집 원천, 자동 공개 상태, 신청 단계를 한곳에서 기록합니다.</span>
        </div>
        <form action="/api/ops/logout" method="post"><button type="submit">로그아웃</button></form>
      </header>

      <section className="ops-summary-grid">
        {snapshots.map((snapshot) => <article key={snapshot.siteSlug}><span>{snapshot.name}</span><b>{snapshot.count}</b><small>{snapshot.live ? "자동 공개 데이터" : "편집 기준 데이터"}</small></article>)}
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
        <div className="ops-panel-head"><div><p>COLLECTION</p><h2>공식 원천 연결</h2></div><button type="button" onClick={collectNow} disabled={collecting}><RefreshCw size={16} className={collecting ? "is-spinning" : undefined} />{collecting ? "수집 중" : "지금 수집"}</button></div>
        <div className="ops-source-list">
          {sourceHealth.map((source) => <article key={source.id}><div><b>{source.label}</b><small>{source.cadenceHours}시간 주기 · {source.state === "connected" ? "연결 설정됨" : "환경 설정 필요"}</small></div><a href={source.publicUrl} target="_blank" rel="noreferrer">원문 <ArrowUpRight size={14} /></a></article>)}
        </div>
        {collectionResult.length ? <div className="ops-result-list">{collectionResult.map((result) => <p key={result.source}><b>{result.source}</b> · {result.state} · {result.count}건 · {result.detail}</p>)}</div> : null}
      </section>

      <section className="ops-panel">
        <div className="ops-panel-head"><div><p>APPLICATION RUNS</p><h2>애드센스 신청 상태</h2></div></div>
        <div className="ops-runs">
          {runs.map((run) => <article key={run.siteSlug}><div><span>{run.siteSlug}</span><b>{run.mode === "stability" ? "안정화 모드" : "운영형 모드"}</b><small>마지막 기록: {formatDate(run.lastActionAt)}</small></div><label>상태<select value={run.status} onChange={(event) => saveStatus(run.siteSlug, event.target.value as ApplicationStatus)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label><p>{run.nextAction}</p></article>)}
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-head"><div><p>RECENT LOGS</p><h2>수집 이력</h2></div></div>
        {collectionRuns.length ? <div className="ops-log-list">{collectionRuns.map((run) => <article key={run.id}><b>{run.sourceId}</b><span>{run.state} · {run.recordCount}건</span><p>{run.detail}</p><small>{formatDate(run.startedAt)}</small></article>)}</div> : <p className="ops-empty">Supabase 연결 후 첫 수집을 실행하면 여기에서 성공·실패·만료 점검 기록을 확인할 수 있습니다.</p>}
      </section>

      {notice ? <p className="ops-notice" role="status">{notice}</p> : null}
    </main>
  );
}
