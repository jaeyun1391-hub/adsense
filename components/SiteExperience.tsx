import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, CalendarDays, CircleAlert, ExternalLink, FileCheck2, Flag, House, MapPinned, ShieldCheck } from "lucide-react";
import { ExperienceShell } from "@/components/ExperienceShell";
import { HousingPathFinder } from "@/components/HousingPathFinder";
import { SiteExplorer } from "@/components/SiteExplorer";
import { RichContent } from "@/components/RichContent";
import { StructuredData } from "@/components/StructuredData";
import { documentLabel, getEditorialGuides, getExperience, publicOperator } from "@/lib/experience";
import { getPublicRecord, getPublicRecords, getSourceHealth, readCurrentTimestamp, type PublishedRecord } from "@/lib/operations";
import { operationalDocumentAddendum, operationalDocumentBlocks, type OperatingDocumentKey } from "@/lib/operational-content";
import { publicUrl } from "@/lib/seo";
import { getItem, type Guide, type SiteConfig, type SiteSlug } from "@/lib/sites";

export const operationalDocuments = [
  "about",
  "editorial-policy",
  "sources",
  "updates",
  "contact",
  "privacy",
  "terms",
  "copyright",
  "youth-policy",
  "email-collection"
] as const;

export type OperationalDocument = (typeof operationalDocuments)[number];

export function isOperationalDocument(value: string): value is OperationalDocument {
  return operationalDocuments.includes(value as OperationalDocument);
}

function toDisplayDate(value?: string) {
  if (!value) return "공식 원문 기준";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" }).format(parsed);
}

function SourceState({ site, live }: { site: SiteConfig; live: boolean }) {
  const health = getSourceHealth(site.slug);
  return (
    <div className="source-state">
      <span className={live ? "state-live" : "state-reference"}>{live ? "공식 기록 반영" : "편집 검토 자료"}</span>
      <p>각 페이지의 마지막 검토일과 원문 링크를 기준으로 현재 조건을 다시 확인하세요.</p>
      <div className="source-state-list">
        {health.map((source) => <a key={source.id} href={source.publicUrl} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={13} /></a>)}
      </div>
    </div>
  );
}

function eventBoundary(value: string, end = false) {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T${end ? "23:59:59.999" : "00:00:00"}+09:00`
    : value;
  return Date.parse(normalized);
}

function ExamHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="exam-planner experience-width">
        <header className="exam-planner-head"><div><p>EXAM PLANNER / 일정 관리판</p><h1>접수·응시·발표를<br />각각 관리하는 시험 일정판</h1><span>{experience.descriptor}</span></div><nav><Link href="/items">일정 전체 <ArrowRight size={15} /></Link><Link href="/guides">준비 가이드</Link></nav></header>
        <div className="exam-planner-board">
          <section className="exam-date-lanes"><header><div><p>NOW IN REVIEW</p><h2>다음 행동을 정할 일정</h2></div><CalendarClock size={21} /></header>{records.slice(0, 6).map((record, index) => <Link key={record.id} href={`/items/${record.slug}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{record.category}</small><b>{record.title}</b></div><p>{record.period}</p><ArrowUpRight size={16} /></Link>)}</section>
          <aside className="exam-planner-notes"><p>접수 전에 메모할 것</p><ol><li><b>01</b><span>활용처의 제출 마감</span></li><li><b>02</b><span>결제·환불 가능 기간</span></li><li><b>03</b><span>사진·신분증·서류 상태</span></li><li><b>04</b><span>시험장과 입실 경로</span></li></ol><Link href="/guides/exam-application-order">접수 순서 읽기 <ArrowRight size={15} /></Link></aside>
        </div>
      </section>
      <section className="exam-decision-strip"><div className="experience-width"><p>시험 탐색의 기준</p><b>시험일 하나가 아니라, 접수·결제·준비물·발표일을 같은 일정표에서 비교합니다.</b></div></section>
      <section className="experience-width exam-explorer-section"><div className="section-intro"><p>시험 탐색</p><h2>필요한 일정만 좁혀 보기</h2><span>분야와 현재 준비 단계로 탐색합니다.</span></div><SiteExplorer siteSlug={site.slug} records={records} compact /></section>
      <section className="experience-width source-row"><SourceState site={site} live={live} /></section>
    </ExperienceShell>
  );
}

function EventsHome({ site, records, live, currentTimestamp }: { site: SiteConfig; records: PublishedRecord[]; live: boolean; currentTimestamp: number }) {
  const active = records.filter((record) => {
    if (!record.startDate) return false;
    return eventBoundary(record.startDate) <= currentTimestamp && eventBoundary(record.endDate ?? record.startDate, true) >= currentTimestamp;
  });
  const next = records.filter((record) => record.startDate && eventBoundary(record.startDate) > currentTimestamp);
  const formatRange = (record: PublishedRecord) => {
    if (!record.startDate) return record.period;
    const start = new Date(record.startDate);
    const end = new Date(record.endDate ?? record.startDate);
    const startLabel = `${start.getMonth() + 1}.${String(start.getDate()).padStart(2, "0")}`;
    const endLabel = `${end.getMonth() + 1}.${String(end.getDate()).padStart(2, "0")}`;
    return startLabel === endLabel ? startLabel : `${startLabel}–${endLabel}`;
  };
  return (
    <ExperienceShell site={site} active="home">
      <section className="events-desk experience-width">
        <header className="events-desk-heading">
          <div><p>VERIFIED EVENT DESK</p><h1>날짜가 확인된<br />행사만 올립니다.</h1></div>
          <div className="events-desk-status"><span><i /> 공식 상세 직접 연결</span><b>{records.length}건</b><small>2026년 8월 6일 편집 점검</small></div>
        </header>
        <div className="events-now-board">
          <section>
            <header><div><p>OPEN NOW</p><h2>지금 진행 중</h2></div><CalendarDays size={21} /></header>
            <div className="events-now-list">
              {active.map((record) => <Link key={record.id} href={`/items/${record.slug}`}><time>{formatRange(record)}</time><div><span>{record.region}</span><b>{record.title}</b><p>{record.period}</p></div><ArrowUpRight size={17} /></Link>)}
              {!active.length ? <p className="events-empty">현재 진행 중으로 확인된 행사가 없습니다.</p> : null}
            </div>
          </section>
          <aside>
            <CircleAlert size={21} />
            <p>이번 주 확인 메모</p>
            <h2>표시되지 않은 정보는<br />임의로 채우지 않습니다.</h2>
            <dl><div><dt>확정</dt><dd>날짜·장소·공식 원문</dd></div><div><dt>예정</dt><dd>주최 측이 예정으로 표기</dd></div><div><dt>미공개</dt><dd>가격·예매 발표 전</dd></div></dl>
            <Link href="/editorial-policy">편집 기준 확인 <ArrowRight size={15} /></Link>
          </aside>
        </div>
      </section>
      <section className="events-calendar-band"><div className="experience-width"><header className="events-calendar-head"><div><p>UPCOMING</p><h2>다음 일정</h2></div><Link href="/items">전체 일정 <ArrowRight size={15} /></Link></header><div className="events-calendar-list">{next.slice(0, 7).map((record) => <Link key={record.id} href={`/items/${record.slug}`}><time>{formatRange(record)}</time><span>{record.region}</span><b>{record.title}</b><small>{record.period}</small><ArrowRight size={16} /></Link>)}</div></div></section>
      <section className="events-filter-desk"><div className="experience-width"><div className="section-intro"><p>DATE FILTER</p><h2>오늘·이번 주·이번 달로 좁히기</h2><span>필터는 실제 시작일과 종료일을 계산합니다.</span></div><SiteExplorer siteSlug={site.slug} records={records} compact /></div></section>
      <nav className="events-category-links experience-width" aria-label="행사 유형별 탐색">
        <p>행사 유형으로 보기</p>
        {site.categories.map((category) => {
          const count = records.filter((record) => record.category === category).length;
          return <Link key={category} href={`/category/${encodeURIComponent(category)}`}><span>{category}</span><b>{count}건</b><ArrowRight size={15} /></Link>;
        })}
      </nav>
      <section className="experience-width events-source-row"><div><p className="eyebrow">SOURCE CHECK</p><h2>기관 첫 화면이 아닌<br />행사별 원문을 연결합니다.</h2></div><SourceState site={site} live={live} /></section>
    </ExperienceShell>
  );
}

function HousingHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="housing-workbench experience-width">
        <header className="housing-workbench-head"><div><p>청년주거도움 / 주거지원 작업대</p><h1>공고를 읽기 전에<br />내 상황의 확인 순서를<br />먼저 정리합니다.</h1></div><aside><b>오늘의 원칙</b><span>지원 여부를 추정하지 않고, 계약·주소·소득·서류를 각각 확인합니다.</span><small>마지막 편집 검토 2026년 8월 3일</small></aside></header>
        <HousingPathFinder records={records} />
      </section>
      <section className="housing-reading-desk"><div className="experience-width"><header><p>READING DESK</p><h2>공고를 열기 전, 먼저 읽을 기록</h2><span>문서와 계약, 비용, 상담 준비를 서로 다른 질문으로 정리했습니다.</span></header><div className="housing-reading-list">{records.slice(0, 6).map((record, index) => <Link key={record.id} href={`/items/${record.slug}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{record.category}</small><b>{record.title}</b><p>{record.summary}</p></div><ArrowRight size={17} /></Link>)}</div></div></section>
      <section className="housing-source-band"><div className="experience-width"><SourceState site={site} live={live} /></div></section>
    </ExperienceShell>
  );
}

function BusinessHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="business-console experience-width">
        <header className="business-console-head"><div><p>지원사업 관제 화면</p><h1>공고 제목보다<br />내 사업장 조건부터 비교합니다.</h1><span>{experience.descriptor}</span></div><Link href="/items">공고 전체 보기 <ArrowRight size={16} /></Link></header>
        <div className="business-console-layout"><aside><p>신청 전 필터</p><ol><li><b>대상 업종</b><span>사업자등록·업력·소재지</span></li><li><b>제외 조건</b><span>중복 수혜·휴폐업·체납</span></li><li><b>집행 조건</b><span>자부담·선집행·정산</span></li><li><b>마감 일정</b><span>제출 경로·보완 가능 시간</span></li></ol></aside><section className="business-watchlist"><header><p>REVIEW QUEUE</p><h2>먼저 비교할 공고</h2></header>{records.slice(0, 5).map((record, index) => <Link key={record.id} href={`/items/${record.slug}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{record.category}</small><b>{record.title}</b></div><p>{record.period}</p><ArrowUpRight size={16} /></Link>)}</section></div>
      </section>
      <section className="business-filter-desk"><div className="experience-width"><div className="section-intro"><p>공고 탐색</p><h2>업종과 준비 상태로 좁혀 보기</h2><span>금액보다 신청 가능성과 후속 의무를 먼저 비교합니다.</span></div><SiteExplorer siteSlug={site.slug} records={records} compact /></div></section>
      <section className="experience-width business-source-split"><SourceState site={site} live={live} /><div><p>공고 확인 원칙</p><b>지원 대상·제외 업종·자부담·정산 조건을 원문에서 나누어 확인합니다.</b></div></section>
    </ExperienceShell>
  );
}

function FacilitiesHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="facility-workspace experience-width">
        <header className="facility-workspace-head"><div><p>공공시설 이용 도구</p><h1>시설을 고른 뒤에도<br />예약·요금·현장 동선을<br />한 번 더 확인합니다.</h1><span>{experience.descriptor}</span></div><Link href="/guides/facility-before-visit">방문 전 체크 <ArrowRight size={16} /></Link></header>
        <div className="facility-workspace-grid"><aside><MapPinned size={22} /><p>시설을 찾은 뒤 확인할 순서</p><ol><li><b>01</b><span>예약 가능 시간과 대상</span></li><li><b>02</b><span>취소·노쇼·환불 기준</span></li><li><b>03</b><span>요금·감면 증빙</span></li><li><b>04</b><span>주차·보행·현장 문의</span></li></ol></aside><section><header><p>FIND A FACILITY</p><h2>지도와 목록에서 바로 비교</h2></header><SiteExplorer siteSlug={site.slug} records={records} compact /></section></div>
      </section>
      <section className="facility-use-band"><div className="experience-width"><p>시설 이용은 예약 완료로 끝나지 않습니다.</p><b>출발 직전에는 운영 공지, 예약 상태, 입장 마감, 주차·대중교통 정보를 다시 확인하세요.</b></div></section>
      <section className="experience-width source-row"><SourceState site={site} live={live} /></section>
    </ExperienceShell>
  );
}

export async function SiteHome({ site }: { site: SiteConfig }) {
  const snapshot = await getPublicRecords(site);
  if (site.slug === "exam") return <ExamHome site={site} records={snapshot.records} live={snapshot.live} />;
  if (site.slug === "events") return <EventsHome site={site} records={snapshot.records} live={snapshot.live} currentTimestamp={readCurrentTimestamp()} />;
  if (site.slug === "housing") return <HousingHome site={site} records={snapshot.records} live={snapshot.live} />;
  if (site.slug === "business") return <BusinessHome site={site} records={snapshot.records} live={snapshot.live} />;
  return <FacilitiesHome site={site} records={snapshot.records} live={snapshot.live} />;
}

export async function SiteItemsView({ site, heading, records: suppliedRecords }: { site: SiteConfig; heading?: string; records?: PublishedRecord[] }) {
  const snapshot = suppliedRecords ? { records: suppliedRecords, live: false } : await getPublicRecords(site);
  const experience = getExperience(site.slug);
  if (site.slug === "events") {
    return <ExperienceShell site={site} active="items"><section className="events-index-head experience-width"><p>EVENT CALENDAR / VERIFIED LINKS</p><h1>{heading ?? "확인된 행사 일정"}</h1><div><span>총 {snapshot.records.length}건</span><p>개별 공식 페이지에서 날짜와 장소가 확인된 행사입니다. 예정·미공개 상태는 확정 정보와 구분합니다.</p></div></section><section className="experience-width explorer-page"><SiteExplorer siteSlug={site.slug} records={snapshot.records} /></section></ExperienceShell>;
  }
  return (
    <ExperienceShell site={site} active="items">
      <section className={`experience-index experience-index--${experience.frame} experience-width`}>
        <div className="index-intro"><p className="eyebrow">{experience.deskName}</p><h1>{heading ?? experience.primaryAction}</h1><p>{experience.audience}을 위해 제목이 아닌 실제 판단 순서로 정보를 묶었습니다.</p></div>
        <div className="index-side-note"><b>{snapshot.records.length}</b><span>{snapshot.live ? "원문 확인 기록" : "편집 글"}</span></div>
      </section>
      <section className="experience-width explorer-page"><SiteExplorer siteSlug={site.slug} records={snapshot.records} /></section>
    </ExperienceShell>
  );
}

export async function SiteCategoryView({ site, category }: { site: SiteConfig; category: string }) {
  const snapshot = await getPublicRecords(site);
  const records = snapshot.records.filter((record) => record.category === category);
  const experience = getExperience(site.slug);
  if (site.slug === "events") {
    return <ExperienceShell site={site} active="items"><section className="events-category-head experience-width"><p>EVENT TYPE</p><h1>{category}</h1><div><b>{records.length}건</b><span>기간·장소·입장 조건이 확인된 {category} 기록입니다.</span></div></section><section className="experience-width explorer-page"><SiteExplorer siteSlug={site.slug} records={records} /></section></ExperienceShell>;
  }
  return (
    <ExperienceShell site={site} active="items">
      <section className={`experience-category experience-category--${experience.frame} experience-width`}>
        <header>
          <p className="eyebrow">{experience.deskName} / CATEGORY NOTE</p>
          <h1>{category}</h1>
          <p>{category} 항목은 같은 제목이라도 대상, 시기, 장소, 제출 순서가 달라질 수 있습니다. 이 페이지에서는 먼저 비교할 항목을 정리하고, 실제 원문 확인으로 이어집니다.</p>
        </header>
        <div className="category-brief-grid">
          <div><span>먼저 확인</span><b>{experience.sourceFocus}</b></div>
          <div><span>자주 생기는 문제</span><b>제목만 보고 조건·마감·예외를 놓치는 경우</b></div>
          <div><span>현재 기록</span><b>{records.length}개 항목</b></div>
        </div>
      </section>
      <section className="experience-width explorer-page"><SiteExplorer siteSlug={site.slug} records={records} /></section>
    </ExperienceShell>
  );
}

function ArticleSources({ record, links }: { record: PublishedRecord; links?: { label: string; url: string }[] }) {
  const sources = links?.length ? links : [{ label: record.sourceName, url: record.sourceUrl }];
  return (
    <section className="article-context article-sources">
      <p>확인한 원문</p>
      <h2>이 글의 근거</h2>
      <ul>
        {sources.map((source) => <li key={source.url}><a className="article-source-link" href={source.url} target="_blank" rel="noreferrer">{source.label} 열기 <ExternalLink size={15} /></a></li>)}
      </ul>
      <small>마지막 편집 검토 {toDisplayDate(record.lastCheckedAt)}</small>
    </section>
  );
}

function DetailLabels({ site, record }: { site: SiteConfig; record: PublishedRecord }) {
  const experience = getExperience(site.slug);
  const entries = Object.entries(record.details).slice(0, 6);
  return <dl className="detail-facts"><div><dt>분류</dt><dd>{record.category}</dd></div><div><dt>지역</dt><dd>{record.region}</dd></div><div><dt>기간·상태</dt><dd>{record.period}</dd></div>{entries.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}<div><dt>확인 기준</dt><dd>{experience.sourceFocus}</dd></div></dl>;
}

function DetailChecklist({ record, checks }: { record: PublishedRecord; checks?: string[] }) {
  const visibleChecks = (checks?.length ? checks : Object.values(record.details).slice(0, 4)).filter(Boolean);
  if (!visibleChecks.length) return null;
  return <section className="article-checklist"><p>이 글에서 확인할 항목</p><h2>방문 전 확인 순서</h2><ol>{visibleChecks.map((check, index) => <li key={check}><span>{String(index + 1).padStart(2, "0")}</span>{check}</li>)}</ol></section>;
}

export async function SiteItemDetailView({ site, slug }: { site: SiteConfig; slug: string }) {
  const record = await getPublicRecord(site, slug);
  if (!record) return null;
  const editorialItem = getItem(site, slug);
  const related = (await getPublicRecords(site)).records.filter((candidate) => candidate.slug !== slug && candidate.category === record.category).slice(0, 3);
  const guides = getEditorialGuides(site).slice(0, 3);
  const event = site.slug === "events" ? editorialItem?.eventSchema : undefined;
  const structuredData = event ? {
    "@context": "https://schema.org",
    "@type": "Event",
    name: record.title,
    description: record.summary,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: event.eventStatus ?? "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.locationName,
      address: { "@type": "PostalAddress", streetAddress: event.locationAddress, addressCountry: "KR" }
    },
    organizer: { "@type": "Organization", name: event.organizerName },
    offers: event.ticketUrl && event.price !== undefined ? {
      "@type": "Offer",
      url: event.ticketUrl,
      price: event.price,
      priceCurrency: event.priceCurrency ?? "KRW",
      availability: event.availability ?? "https://schema.org/InStock"
    } : undefined,
    image: [publicUrl(site, "/opengraph-image")],
    url: publicUrl(site, `/items/${record.slug}`),
    dateModified: record.updatedAt
  } : {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: record.title,
    description: record.summary,
    dateModified: record.updatedAt,
    mainEntityOfPage: publicUrl(site, `/items/${record.slug}`),
    author: { "@type": "Person", name: publicOperator.name },
    publisher: { "@type": "Organization", name: publicOperator.organization },
    image: [publicUrl(site, "/opengraph-image")]
  };
  return (
    <ExperienceShell site={site} active="items">
      <StructuredData data={structuredData} />
      <article className={`experience-article experience-article--${site.slug} experience-width`}>
        <header className="article-header"><div className="article-labels"><span>{record.category}</span><span>{record.region}</span><span>{record.status === "published" ? "원문 확인 기록" : "편집 글"}</span></div><h1>{record.title}</h1><p>{record.summary}</p><div className="article-byline"><span>작성·검토 {getExperience(site.slug).deskName}</span><span>마지막 검토 {toDisplayDate(record.lastCheckedAt)}</span></div></header>
        <div className="article-grid"><div className="article-main"><DetailLabels site={site} record={record} /><DetailChecklist record={record} checks={editorialItem?.keyChecks} />{editorialItem ? <section className="article-editorial"><p>편집 해설</p><RichContent blocks={editorialItem.body} />{editorialItem.faq.length ? <section className="article-faq"><h2>관련 질문</h2>{editorialItem.faq.map((faq) => <div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}</section> : null}</section> : <section className="article-context"><p>공식 기록</p><h2>기록된 정보</h2><p>{record.summary}</p></section>}<ArticleSources record={record} links={editorialItem?.sourceLinks} /><section className="article-related"><p>같이 읽을 자료</p><div>{related.map((item) => <Link key={item.id} href={`/items/${item.slug}`}>{item.title}<ArrowRight size={15} /></Link>)}{guides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`}>{guide.title}<ArrowRight size={15} /></Link>)}</div></section></div><aside className="article-aside"><div className="article-source-card"><ShieldCheck size={21} /><b>확인 기준</b><p>원문 링크, 작성일, 개별 체크 항목을 함께 남깁니다.</p></div><div className="article-review-card"><p>편집 책임</p><b>{getExperience(site.slug).deskName}</b><span>운영자 {publicOperator.name} · {publicOperator.organization}</span></div></aside></div>
      </article>
    </ExperienceShell>
  );
}

export function SiteGuidesView({ site }: { site: SiteConfig }) {
  const guides = getEditorialGuides(site);
  const experience = getExperience(site.slug);
  return <ExperienceShell site={site} active="guides"><section className={`guide-index guide-index--${site.slug} experience-width`}><header><p className="eyebrow">EDITORIAL GUIDES</p><h1>{experience.secondaryAction}</h1><p>정답을 대신 말하기보다, 실제로 막히는 순서를 풀어낸 편집형 가이드입니다.</p></header><div className="guide-grid">{guides.map((guide, index) => <Link className="guide-card" key={guide.slug} href={`/guides/${guide.slug}`}><span>GUIDE {String(index + 1).padStart(2, "0")}</span><p>{guide.category}</p><h2>{guide.title}</h2><small>{guide.summary}</small><b>읽기 <ArrowRight size={15} /></b></Link>)}</div></section></ExperienceShell>;
}

function headingsFor(guide: Guide) {
  return guide.body.filter((block) => block.startsWith("## ")).map((block) => block.slice(3));
}

export function SiteGuideDetailView({ site, guide }: { site: SiteConfig; guide: Guide }) {
  const headings = headingsFor(guide);
  const canonical = publicUrl(site, `/guides/${guide.slug}`);
  return <ExperienceShell site={site} active="guides"><StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.summary, datePublished: guide.updatedAt, dateModified: guide.updatedAt, mainEntityOfPage: canonical, image: [publicUrl(site, "/opengraph-image")], author: { "@type": "Person", name: publicOperator.name }, publisher: { "@type": "Organization", name: publicOperator.organization, url: publicUrl(site) } }} /><article className="guide-article experience-width"><header><p>{guide.category}</p><h1>{guide.title}</h1><span>{guide.summary}</span><div>작성·검토 {getExperience(site.slug).deskName} · 마지막 검토 {toDisplayDate(guide.updatedAt)}</div></header><div className="guide-article-grid"><aside className="guide-toc"><b>이 글의 순서</b>{headings.map((heading) => <span key={heading}>{heading}</span>)}<Link href="/sources">출처 정책 보기</Link></aside><div className="guide-content"><RichContent blocks={guide.body} /><section className="guide-author"><FileCheck2 size={20} /><div><h3>작성자 검토 메모</h3><b>{publicOperator.name} · {publicOperator.organization}</b><p>공식 원문과 실제 이용 순서를 대조해, 독자가 마지막으로 확인해야 할 항목을 편집합니다.</p></div></section></div></div></article></ExperienceShell>;
}

function DocumentBody({ site, document }: { site: SiteConfig; document: OperationalDocument }) {
  const sourceHealth = getSourceHealth(site.slug);
  const blocks = operationalDocumentBlocks(site, document as OperatingDocumentKey);
  return <>
    <RichContent blocks={blocks} />
    <RichContent blocks={operationalDocumentAddendum(site, document as OperatingDocumentKey, blocks)} />
    {document === "sources" ? <section className="document-source-list" aria-label="공식 원문 링크">{sourceHealth.map((source) => <div key={source.id}><b>{source.label}</b><a href={source.publicUrl} target="_blank" rel="noreferrer">원문 열기 <ExternalLink size={14} /></a></div>)}</section> : null}
  </>;
}

export function SiteDocumentView({ site, document }: { site: SiteConfig; document: OperationalDocument }) {
  const experience = getExperience(site.slug);
  return <ExperienceShell site={site} active="documents"><article className={`document-page document-page--${experience.frame} experience-width`}><header><p className="eyebrow">OPERATING DOCUMENT / {experience.deskName}</p><h1>{documentLabel(document)}</h1><p>{site.name}의 공개 운영 기준과 확인 흐름을 기록합니다.</p></header><div className="document-content"><DocumentBody site={site} document={document} /></div><footer><Flag size={17} /><span>최종 기준은 해당 기관의 공식 원문이며, 이 문서는 변경 사항을 확인하는 기준을 설명합니다.</span></footer></article></ExperienceShell>;
}
