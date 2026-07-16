import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, ExternalLink, FileCheck2, Flag, House, MapPinned, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { ExperienceShell } from "@/components/ExperienceShell";
import { SiteExplorer } from "@/components/SiteExplorer";
import { RichContent } from "@/components/RichContent";
import { StructuredData } from "@/components/StructuredData";
import { documentLabel, getEditorialGuides, getExperience, publicOperator } from "@/lib/experience";
import { getPublicRecord, getPublicRecords, getSourceHealth, type PublishedRecord } from "@/lib/operations";
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
  "email-collection",
  "adsense-playbook"
] as const;

export type OperationalDocument = (typeof operationalDocuments)[number];

const domainOperatingNotes: Record<SiteSlug, {
  scope: string;
  review: string;
  update: string;
  contact: string;
  privacy: string;
  boundary: string;
}> = {
  exam: {
    scope: "시험일정센터는 시험명 자체보다 접수 시작·마감, 결제, 사진·신분 확인, 시험장, 성적 발표처럼 수험생의 다음 행동을 바꾸는 정보를 우선 정리합니다.",
    review: "시험 일정은 회차, 지역, 정기·상시 구분에 따라 달라질 수 있어 주관기관 공지와 접수 화면을 함께 대조합니다. 접수 가능 여부나 합격 가능성을 대신 판단하지 않습니다.",
    update: "접수 회차 변경, 시험장 추가, 사진 규정, 성적 발표일 수정이 확인되면 해당 항목의 확인일과 안내 문구를 함께 갱신합니다.",
    contact: "시험 접수 오류는 주관기관이 처리합니다. 이 데스크에는 링크 오류, 날짜 표기 차이, 공식 공지 누락처럼 편집 범위의 정정 자료를 보내주세요.",
    privacy: "시험 성적표, 수험번호, 신분증 사진 같은 민감한 자료는 문의로 받지 않습니다. 정정 요청에는 공개된 공지 주소만 보내주세요.",
    boundary: "시험일정센터의 글은 접수 준비를 돕는 편집 자료이며, 실제 접수와 시험 응시는 각 주관기관의 현재 안내를 따릅니다."
  },
  events: {
    scope: "전국행사노트는 행사 홍보문을 옮기지 않고, 날짜·회차·예매·우천·교통·아이 동반처럼 출발 전에 갈리는 방문 조건을 정리합니다.",
    review: "행사별로 공식 홈페이지, 예매처, 지자체 공지의 날짜와 운영 범위를 대조하며, 무료 입장이라도 체험비·주차비·예약비가 남는지 따로 표시합니다.",
    update: "우천 취소, 입장 마감, 교통 통제, 예매 방식 변경처럼 당일 방문에 영향을 주는 공지가 확인되면 최신 목록에서 먼저 반영합니다.",
    contact: "행사 취소나 환불의 직접 처리는 주최자·예매처의 업무입니다. 이 데스크에는 원문 공지와 다른 일정 표기 또는 누락된 현장 정보를 알려주세요.",
    privacy: "예매 번호, 방문자 이름, 결제 내역은 받지 않습니다. 수정 요청에는 행사명, 방문 예정일, 공개된 공식 공지 링크만 필요합니다.",
    boundary: "전국행사노트의 브리핑은 방문 판단을 돕는 자료이며, 입장·예매·환불의 최종 기준은 주최자와 예매처의 현재 안내입니다."
  },
  housing: {
    scope: "청년주거도움은 월세지원, 보증금, 임대주택, 계약·서류처럼 주거지원 신청 전에 스스로 대조해야 할 조건을 순서로 정리합니다.",
    review: "거주지, 계약 주소, 가구·소득 기준, 모집 시점, 제출 서류를 공고문 원문과 대조합니다. 개인별 수급 가능 여부나 대출 실행을 확정하는 표현은 사용하지 않습니다.",
    update: "모집 마감, 소득 기준, 공급 유형, 서류 양식, 상담 창구가 바뀌면 원문 주소와 마지막 검토일을 다시 확인해 표시합니다.",
    contact: "신청 결과나 계약 분쟁은 기관 상담과 법률·금융 전문가의 범위입니다. 이 데스크에는 공고 링크 오류와 문서상 표현 차이를 알려주세요.",
    privacy: "주민등록번호, 임대차계약서 원본, 소득·자산 증빙은 받지 않습니다. 문의에는 개인정보를 지운 공개 공지 주소만 남겨주세요.",
    boundary: "청년주거도움은 공고를 읽는 순서를 제공할 뿐, 지원 가능성·대출·계약의 결과를 보장하거나 개별 판단을 대신하지 않습니다."
  },
  business: {
    scope: "사장님지원캘린더는 지원금 규모보다 대상 업종, 소재지, 마감, 자부담, 정산 의무를 먼저 비교하도록 돕는 공고 검토 서비스입니다.",
    review: "기업마당과 운영기관 공고를 기준으로 제외 업종, 업력, 증빙 발급일, 지출 인정 범위를 분리해 읽습니다. 선정·대출·지급을 보장하는 문구는 쓰지 않습니다.",
    update: "예산 소진, 접수 연장, 서식 교체, 지원 대상 변경, 정산 규칙 수정이 확인되면 해당 공고의 상태와 확인 시각을 함께 갱신합니다.",
    contact: "개별 심사나 자금 상담은 공고 운영기관의 업무입니다. 이 데스크에는 공고 원문과 다른 마감·대상 표기 또는 깨진 링크를 알려주세요.",
    privacy: "사업자등록번호, 재무제표, 납세증명, 대출·신용 자료는 문의로 받지 않습니다. 정정 요청에는 공개된 공고 URL과 확인 근거만 보내주세요.",
    boundary: "사장님지원캘린더의 내용은 공고 해석을 돕는 자료이며, 신청 적합성·선정·자금 실행은 공식 공고와 기관 상담을 기준으로 판단해야 합니다."
  },
  facilities: {
    scope: "공공시설가이드는 시설명 목록보다 예약, 취소, 요금, 주차, 이용 제한처럼 실제 방문 동선을 바꾸는 정보를 중심으로 정리합니다.",
    review: "시설별 예약 화면과 운영 공지를 대조해 휴관일, 감면 증빙, 노쇼 규정, 주차 가능 범위를 분리해 적습니다. 현장 수용 인원은 확정값처럼 표현하지 않습니다.",
    update: "예약 가능 시간, 휴관 공지, 환불 기준, 주차 통제, 운영 주체가 바뀌면 목록 상태와 마지막 확인일을 함께 수정합니다.",
    contact: "예약 변경·환불·분실물 처리는 해당 시설의 업무입니다. 이 데스크에는 공개된 운영 안내의 오류, 누락, 바뀐 URL을 알려주세요.",
    privacy: "예약 번호, 차량 번호, 회원 정보, 결제 내역은 받지 않습니다. 수정 요청에는 시설명과 공개된 운영 안내 주소만 보내주세요.",
    boundary: "공공시설가이드의 정보는 방문 준비를 위한 편집 자료이며, 예약·요금·취소의 최종 기준은 시설 운영기관의 현재 안내입니다."
  }
};

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
      <span className={live ? "state-live" : "state-reference"}>{live ? "자동 동기화" : "편집 기준 데이터"}</span>
      <p>{live ? "공식 원천을 수집해 변경 이력을 남기고 있습니다." : "공식 원천 연결 전에는 검토된 편집 데이터와 원문 링크를 표시합니다."}</p>
      <div className="source-state-list">
        {health.map((source) => <span key={source.id}>{source.label} · {source.cadenceHours}시간</span>)}
      </div>
    </div>
  );
}

function ExamHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="exam-hero experience-width">
        <div className="exam-hero-copy">
          <p className="eyebrow">시험 운영 데스크 / 접수 흐름부터</p>
          <h1>시험일을 외우기 전에<br />접수와 결과 발표를<br />한 장의 흐름으로 보세요.</h1>
          <p>{experience.descriptor} 시험명보다 먼저 마감, 준비물, 접수 방식, 성적 활용 시점을 확인합니다.</p>
          <div className="hero-links"><Link href="/items">{experience.primaryAction} <ArrowRight size={16} /></Link><Link href="/guides">{experience.secondaryAction}</Link></div>
        </div>
        <section className="exam-timeline" aria-label="시험 일정 흐름">
          <div className="timeline-head"><span>THIS WEEK</span><b>접수 흐름</b><CalendarClock size={18} /></div>
          {records.slice(0, 4).map((record, index) => (
            <Link className="timeline-row" key={record.id} href={`/items/${record.slug}`}>
              <span className="timeline-index">0{index + 1}</span><span><b>{record.title}</b><small>{record.period}</small></span><ArrowUpRight size={16} />
            </Link>
          ))}
        </section>
      </section>
      <section className="exam-check-strip experience-width">
        {experience.homeSections.map((label, index) => <div key={label}><span>CHECK {index + 1}</span><b>{label}</b><p>{["원서·결제 마감", "사진·신분증·서류", "성적표·제출 마감", "시행기관 공지"][index]}</p></div>)}
      </section>
      <section className="experience-width explorer-section exam-explorer-section"><div className="section-intro"><p>시험 탐색</p><h2>지금 정리할 일정</h2><span>시험명, 접수, 서류, 결과 발표를 함께 찾습니다.</span></div><SiteExplorer siteSlug={site.slug} records={records} compact /></section>
      <section className="experience-width source-row"><SourceState site={site} live={live} /></section>
    </ExperienceShell>
  );
}

function EventsHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  const lead = records[0];
  return (
    <ExperienceShell site={site} active="home">
      <section className="events-front experience-width">
        <div className="events-front-intro"><p>THIS WEEKEND / EDITED FOR A REAL VISIT</p><h1>이번 주말,<br />출발 전에 읽을<br />행사 브리핑.</h1><p>{experience.descriptor}</p></div>
        <article className="events-lead-story">
          <span>EDITOR&apos;S NOTE</span>
          <h2>{lead?.title ?? "이번 주 행사 정보를 확인하고 있습니다."}</h2>
          <p>{lead?.summary}</p>
          {lead ? <Link href={`/items/${lead.slug}`}>방문 브리핑 읽기 <ArrowRight size={16} /></Link> : null}
        </article>
        <aside className="events-conditions"><b>출발 전 4가지</b><ol><li>예매·현장권</li><li>무료 범위</li><li>우천 변경</li><li>교통·귀가</li></ol></aside>
      </section>
      <section className="events-docket"><div className="experience-width"><div className="section-intro"><p>WEEKEND DOCKET</p><h2>날짜보다 상황으로 고르기</h2></div><SiteExplorer siteSlug={site.slug} records={records} compact /></div></section>
      <section className="experience-width events-bottom-grid"><div><p className="eyebrow">편집 원칙</p><h2>행사 소개보다<br />변경 가능성을 먼저.</h2></div><SourceState site={site} live={live} /></section>
    </ExperienceShell>
  );
}

function HousingHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="housing-hero experience-width">
        <div className="housing-hero-heading"><p className="eyebrow">청년 주거 판단실</p><h1>조건을 단정하기 전에<br />내 상황에서 확인할<br />순서를 만듭니다.</h1><p>{experience.descriptor}</p></div>
        <div className="housing-decision-board"><div className="decision-board-head"><House size={18} /><span>MY HOUSING CHECK</span><b>지원 전 점검표</b></div><ol><li><span>01</span> 거주지와 전입 상태</li><li><span>02</span> 본인·가구 소득 기준</li><li><span>03</span> 보증금·월세·계약 기간</li><li><span>04</span> 공고 원문과 접수 창구</li></ol><Link href="/items">상황별 공고 보기 <ArrowRight size={16} /></Link></div>
      </section>
      <section className="housing-context experience-width"><div className="section-intro"><p>CONTEXT FIRST</p><h2>어떤 문제에서 시작하나요?</h2><span>월세, 임대주택, 계약, 서류를 섞지 않고 따로 점검합니다.</span></div><SiteExplorer siteSlug={site.slug} records={records} compact /></section>
      <section className="housing-source-band"><div className="experience-width"><SourceState site={site} live={live} /></div></section>
    </ExperienceShell>
  );
}

function BusinessHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="business-ticker"><div className="experience-width"><span>SUPPORT DESK LIVE</span><p>마감, 대상 업종, 제외 조건, 제출 서류를 공고 제목보다 먼저 확인합니다.</p><span>공식 원문 우선</span></div></section>
      <section className="business-hero experience-width"><div><p className="eyebrow">사업자 지원 관제실</p><h1>지원사업을 찾기 전에<br />내 사업장에 맞는지<br />먼저 가려냅니다.</h1><p>{experience.descriptor}</p><Link className="business-main-action" href="/items">마감 공고 열기 <ArrowRight size={16} /></Link></div><aside className="business-priority-panel"><span>오늘의 판단 순서</span><b>01. 대상</b><b>02. 제외 업종</b><b>03. 자부담·정산</b><b>04. 제출 마감</b></aside></section>
      <section className="business-feed experience-width"><div className="section-intro"><p>DEADLINE FEED</p><h2>공고를 비교할 시간</h2><span>업종, 지역, 마감, 서류로 바로 좁혀봅니다.</span></div><SiteExplorer siteSlug={site.slug} records={records} compact /></section>
      <section className="experience-width business-source-split"><SourceState site={site} live={live} /><div><p>운영형 신청 모드</p><b>공식 업데이트와 새 문제 해결 글을 계속 발행합니다.</b></div></section>
    </ExperienceShell>
  );
}

function FacilitiesHome({ site, records, live }: { site: SiteConfig; records: PublishedRecord[]; live: boolean }) {
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="home">
      <section className="facilities-hero experience-width"><div><p className="eyebrow">공공시설 찾기 데스크</p><h1>예약 여부만 보지 말고<br />취소, 요금, 주차까지<br />이용 동선을 확인하세요.</h1><p>{experience.descriptor}</p></div><div className="facilities-quick-search"><MapPinned size={22} /><b>어디를 찾고 있나요?</b><p>도서관 · 체육시설 · 공영주차장 · 지역 시설</p><Link href="/items">시설 탐색 열기 <ArrowRight size={16} /></Link></div></section>
      <section className="facilities-finder experience-width"><div className="section-intro"><p>FIND A FACILITY</p><h2>지도와 목록으로 비교</h2><span>이용 전 확인할 정보가 시설 유형마다 다릅니다.</span></div><SiteExplorer siteSlug={site.slug} records={records} compact /></section>
      <section className="facilities-procedure"><div className="experience-width"><div><span>01</span><b>예약 가능 시간</b></div><div><span>02</span><b>취소·노쇼 기준</b></div><div><span>03</span><b>요금·감면</b></div><div><span>04</span><b>주차·현장 문의</b></div></div></section>
      <section className="experience-width source-row"><SourceState site={site} live={live} /></section>
    </ExperienceShell>
  );
}

export async function SiteHome({ site }: { site: SiteConfig }) {
  const snapshot = await getPublicRecords(site);
  if (site.slug === "exam") return <ExamHome site={site} records={snapshot.records} live={snapshot.live} />;
  if (site.slug === "events") return <EventsHome site={site} records={snapshot.records} live={snapshot.live} />;
  if (site.slug === "housing") return <HousingHome site={site} records={snapshot.records} live={snapshot.live} />;
  if (site.slug === "business") return <BusinessHome site={site} records={snapshot.records} live={snapshot.live} />;
  return <FacilitiesHome site={site} records={snapshot.records} live={snapshot.live} />;
}

export async function SiteItemsView({ site, heading, records: suppliedRecords }: { site: SiteConfig; heading?: string; records?: PublishedRecord[] }) {
  const snapshot = suppliedRecords ? { records: suppliedRecords, live: false } : await getPublicRecords(site);
  const experience = getExperience(site.slug);
  return (
    <ExperienceShell site={site} active="items">
      <section className={`experience-index experience-index--${experience.frame} experience-width`}>
        <div className="index-intro"><p className="eyebrow">{experience.deskName}</p><h1>{heading ?? experience.primaryAction}</h1><p>{experience.audience}을 위해 제목이 아닌 실제 판단 순서로 정보를 묶었습니다.</p></div>
        <div className="index-side-note"><b>{snapshot.records.length}</b><span>{snapshot.live ? "자동 확인 항목" : "편집 기준 항목"}</span></div>
      </section>
      <section className="experience-width explorer-page"><SiteExplorer siteSlug={site.slug} records={snapshot.records} /></section>
    </ExperienceShell>
  );
}

export async function SiteCategoryView({ site, category }: { site: SiteConfig; category: string }) {
  const snapshot = await getPublicRecords(site);
  const records = snapshot.records.filter((record) => record.category === category);
  const experience = getExperience(site.slug);
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

function ArticleSource({ record }: { record: PublishedRecord }) {
  return <a className="article-source-link" href={record.sourceUrl} target="_blank" rel="noreferrer">{record.sourceName} 원문 확인 <ExternalLink size={15} /></a>;
}

function DetailLabels({ site, record }: { site: SiteConfig; record: PublishedRecord }) {
  const experience = getExperience(site.slug);
  const entries = Object.entries(record.details).slice(0, 6);
  return <dl className="detail-facts"><div><dt>분류</dt><dd>{record.category}</dd></div><div><dt>지역</dt><dd>{record.region}</dd></div><div><dt>기간·상태</dt><dd>{record.period}</dd></div>{entries.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}<div><dt>확인 기준</dt><dd>{experience.sourceFocus}</dd></div></dl>;
}

function DetailChecklist({ site, record }: { site: SiteConfig; record: PublishedRecord }) {
  const checks: Record<SiteConfig["slug"], string[]> = {
    exam: ["원서 접수와 결제 마감 시각", "인정 신분증·사진·응시자격 서류", "시험장 입실과 결과 발표일"],
    events: ["예매·현장권·마지막 입장 시간", "무료 범위와 추가 비용", "우천·교통·귀가 공지"],
    housing: ["거주지·전입 상태", "가구·소득·재산 기준", "계약서와 납부·제출 서류"],
    business: ["대상 업종·사업장 소재지", "제외 조건과 중복 수혜", "자부담·정산·제출 마감"],
    facilities: ["예약 가능 시간과 취소 규정", "요금·감면·현장 결제", "주차·운영 시간·전화 문의"]
  };
  return <section className="article-checklist"><p>방문·신청 전 점검</p><h2>{record.title}에서 먼저 볼 것</h2><ol>{checks[site.slug].map((check, index) => <li key={check}><span>0{index + 1}</span>{check}</li>)}</ol></section>;
}

export async function SiteItemDetailView({ site, slug }: { site: SiteConfig; slug: string }) {
  const record = await getPublicRecord(site, slug);
  if (!record) return null;
  const editorialItem = getItem(site, slug);
  const related = (await getPublicRecords(site)).records.filter((candidate) => candidate.slug !== slug && candidate.category === record.category).slice(0, 3);
  const guides = getEditorialGuides(site).slice(0, 3);
  const isEvent = site.slug === "events";
  return (
    <ExperienceShell site={site} active="items">
      <StructuredData data={{ "@context": "https://schema.org", "@type": isEvent ? "Event" : "Article", name: record.title, headline: record.title, description: record.summary, dateModified: record.updatedAt, url: publicUrl(site, `/items/${record.slug}`), organizer: { "@type": "Organization", name: site.name }, location: isEvent ? { "@type": "Place", name: record.region } : undefined }} />
      <article className={`experience-article experience-article--${site.slug} experience-width`}>
        <header className="article-header"><div className="article-labels"><span>{record.category}</span><span>{record.region}</span><span>{record.status === "published" ? "자동 확인" : "편집 기준"}</span></div><h1>{record.title}</h1><p>{record.summary}</p><div className="article-byline"><span>작성·검토 {getExperience(site.slug).deskName}</span><span>마지막 확인 {toDisplayDate(record.lastCheckedAt)}</span></div></header>
        <div className="article-grid"><div className="article-main"><p className="article-conclusion"><b>한 줄 결론.</b> 이 페이지는 {record.sourceName} 원문을 빠르게 읽기 위한 판단 자료입니다. 최종 일정과 조건은 원문에서 다시 확인하세요.</p><DetailLabels site={site} record={record} /><DetailChecklist site={site} record={record} />{editorialItem ? <section className="article-editorial"><p>편집 해설</p><RichContent blocks={editorialItem.body} />{editorialItem.faq.length ? <section className="article-faq"><h2>자주 놓치는 질문</h2>{editorialItem.faq.map((faq) => <div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}</section> : null}</section> : <section className="article-context"><p>공식 기록 읽기</p><h2>원문을 열기 전에 비교할 부분</h2><p>{record.summary} 자동 수집된 사실형 항목은 원문 제목, 링크, 기간, 확인 시각을 우선 기록합니다. 지원·접수·방문 가능 여부처럼 개인 조건이 필요한 판단은 자동으로 단정하지 않습니다.</p></section>}<section className="article-context"><p>왜 이 정보를 따로 정리하나요</p><h2>제목만으로 결정하기 어려운 부분</h2><p>{record.summary} 실제 이용 과정에서는 일정, 조건, 서류, 현장 변수 중 하나가 달라져도 결과가 달라질 수 있습니다. 그래서 이 데스크는 원문 링크와 함께 확인 순서를 남깁니다.</p><p>공식 공지가 변경되면 이 페이지의 상태와 기록을 함께 업데이트합니다. 이 글은 대행, 보장, 개별 심사 판단을 제공하지 않습니다.</p></section><section className="article-related"><p>같은 맥락의 자료</p><div>{related.map((item) => <Link key={item.id} href={`/items/${item.slug}`}>{item.title}<ArrowRight size={15} /></Link>)}{guides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`}>{guide.title}<ArrowRight size={15} /></Link>)}</div></section></div><aside className="article-aside"><div className="article-source-card"><ShieldCheck size={21} /><b>공식 원문 우선</b><p>일정, 접수, 금액, 이용 가능 여부는 수시로 바뀔 수 있습니다.</p><ArticleSource record={record} /></div><div className="article-review-card"><p>다음 확인</p><b>공식 변경 공지 발생 시</b><span>운영자 {publicOperator.name} · {publicOperator.organization}</span></div></aside></div>
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
  return <ExperienceShell site={site} active="guides"><StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.summary, dateModified: guide.updatedAt, author: { "@type": "Person", name: publicOperator.name }, publisher: { "@type": "Organization", name: publicOperator.organization } }} /><article className="guide-article experience-width"><header><p>{guide.category}</p><h1>{guide.title}</h1><span>{guide.summary}</span><div>작성·검토 {getExperience(site.slug).deskName} · 마지막 검토 {toDisplayDate(guide.updatedAt)}</div></header><div className="guide-article-grid"><aside className="guide-toc"><b>이 글의 순서</b>{headings.map((heading) => <span key={heading}>{heading}</span>)}<Link href="/sources">출처 정책 보기</Link></aside><div className="guide-content"><RichContent blocks={guide.body} /><section className="guide-author"><FileCheck2 size={20} /><div><h3>작성자 검토 메모</h3><b>{publicOperator.name} · {publicOperator.organization}</b><p>공식 원문과 실제 이용 순서를 대조해, 독자가 마지막으로 확인해야 할 항목을 편집합니다.</p></div></section></div></div></article></ExperienceShell>;
}

function DomainOperatingNote({ site, document }: { site: SiteConfig; document: OperationalDocument }) {
  const note = domainOperatingNotes[site.slug];
  const content =
    document === "about"
      ? { title: "이 서비스가 다루는 판단", body: note.scope }
      : document === "editorial-policy"
        ? { title: "이 데스크의 검토 방식", body: note.review }
        : document === "sources"
          ? { title: "원문을 읽는 기준", body: note.review }
          : document === "updates"
            ? { title: "이 사이트에서 기록하는 변경", body: note.update }
            : document === "contact"
              ? { title: "정정 요청 범위", body: note.contact }
              : document === "privacy"
                ? { title: "문의에서 받지 않는 정보", body: note.privacy }
                : { title: "서비스 이용의 경계", body: note.boundary };

  return <section className="document-domain-note"><h2>{content.title}</h2><p>{content.body}</p></section>;
}

function DocumentBody({ site, document }: { site: SiteConfig; document: OperationalDocument }) {
  const experience = getExperience(site.slug);
  const sourceHealth = getSourceHealth(site.slug);
  const content: Record<OperationalDocument, ReactNode> = {
    about: <><h2>{experience.deskName}가 하는 일</h2><p>{site.name}은 {experience.audience}을 위해 {experience.descriptor} 제목과 링크만 모으지 않고, 실제로 먼저 확인해야 할 조건과 원문 위치를 정리합니다.</p><h2>운영 주체</h2><p>이 사이트는 {publicOperator.name}이 {publicOperator.organization} 이름으로 운영합니다. 공통 운영자는 투명하게 공개하고, 사이트별 편집 범위와 정보 구조는 분리합니다.</p><h2>제공하지 않는 것</h2><p>개별 승인·합격·지원·예약을 보장하거나 신청을 대행하지 않습니다. 최종 판단과 접수는 해당 기관의 최신 안내를 기준으로 해야 합니다.</p></>,
    "editorial-policy": <><h2>편집 기준</h2><ol><li>공식 기관, 운영기관, 주최·접수 채널을 원문 기준으로 둡니다.</li><li>제목보다 기간, 제외 조건, 서류, 교통, 취소처럼 실제 이용에 영향을 주는 항목을 우선 정리합니다.</li><li>자동 수집 항목과 편집형 가이드를 명확히 구분합니다.</li><li>변경 가능성이 큰 문장은 확인 시각과 원문 링크를 남깁니다.</li></ol><h2>AI 사용 원칙</h2><p>AI는 초안 구조화와 사실 대조를 돕는 도구로만 사용합니다. 연도, 날짜, 기관명, 금액, 조건은 원문을 다시 확인하며, 출처 없는 확정 표현은 공개하지 않습니다.</p></>,
    sources: <><h2>자동 수집 원천</h2><div className="document-source-list">{sourceHealth.map((source) => <div key={source.id}><b>{source.label}</b><span>{source.cadenceHours}시간 주기 · {source.note}</span></div>)}</div><h2>출처 사용 원칙</h2><p>원문을 그대로 복제하지 않고, 이용자가 확인할 순서와 변경 가능성을 자체 문장으로 정리합니다. 개인 후기와 광고성 정보는 분위기 참고가 될 수 있어도 일정·조건의 단독 근거로 쓰지 않습니다.</p></>,
    updates: <><h2>운영 로그의 기준</h2><p>이 페이지는 날짜 장식이 아니라 수집 연결, 정정, 만료 처리, 가이드 보강을 기록하는 문서입니다.</p><ul><li>공식 원천 연결과 수집 주기 점검</li><li>변경·만료 항목의 최신 목록 제외</li><li>오류·서류·취소·마감 관련 가이드 후보 축적</li><li>정정 요청에 대한 원문 대조와 반영</li></ul><h2>현재 운영 방식</h2><p>{experience.submissionMode === "stability" ? "안정화 모드: 초기 편집 글 공개 후 심사 중에는 새 편집 글을 멈추고, 화면의 공식 상태 정보만 갱신합니다." : "운영형 모드: 공식 업데이트와 신규 문제 해결 가이드를 지속적으로 공개해 실제 운영 흐름을 유지합니다."}</p></>,
    contact: <><h2>문의와 정정 요청</h2><p>정보 정정 요청은 페이지 주소, 잘못되었다고 보는 항목, 공식 원문 링크를 함께 보내주세요. 단순 홍보성 등록, 개별 심사 결과 문의, 예약·환불 대행은 받지 않습니다.</p><dl className="contact-details"><div><dt>운영자</dt><dd>{publicOperator.name} · {publicOperator.organization}</dd></div><div><dt>이메일</dt><dd><a href={`mailto:${publicOperator.email}`}>{publicOperator.email}</a></dd></div><div><dt>전화</dt><dd><a href={`tel:${publicOperator.phone.replace(/-/g, "")}`}>{publicOperator.phone}</a></dd></div><div><dt>주소</dt><dd>{publicOperator.address}</dd></div></dl></>,
    privacy: <><h2>개인정보 처리 원칙</h2><p>이 사이트는 문의 과정에서 제공한 이름, 이메일, 연락처, 정정 요청 내용을 응답과 기록 검토 목적에서만 사용합니다. 별도 회원 가입 기능이나 판매 기능을 운영하지 않으며, 법령상 보관이 필요한 경우를 제외하고 목적 달성 뒤 삭제합니다.</p><h2>광고와 쿠키</h2><p>광고가 표시되는 경우 관련 서비스는 쿠키 또는 유사 기술을 사용할 수 있습니다. 이용자는 브라우저와 광고 서비스 설정을 통해 개인화 광고 설정을 관리할 수 있습니다.</p></>,
    terms: <><h2>이용약관</h2><p>본 사이트의 정보는 이해와 확인을 돕는 편집 자료입니다. 최신 공고, 예약, 시험, 지원, 계약 조건은 공식 원문이 우선하며, 이용자는 최종 행동 전 원문을 확인해야 합니다.</p><h2>금지 행위</h2><p>콘텐츠·데이터·운영 문서를 무단 복제하거나, 출처를 제거해 재배포하거나, 자동 수집을 방해하는 행위는 금지합니다.</p></>,
    copyright: <><h2>저작권 정책</h2><p>사이트의 편집 문장, 구조, 체크리스트, 자체 제작 시각 자산은 저작권 보호를 받습니다. 공식 원문 링크는 이용자의 최종 확인을 위해 제공하며, 원문 전체를 복제하지 않습니다.</p><p>권리 침해 우려가 있는 자료를 발견하면 출처와 근거를 포함해 문의 페이지로 알려주세요. 확인 후 필요한 조치를 진행합니다.</p></>,
    "youth-policy": <><h2>청소년 보호정책</h2><p>이 사이트는 청소년에게 유해한 상품·서비스를 목적으로 운영하지 않습니다. 청소년이 시험, 행사, 공공시설, 주거·사업 정보에 접근할 때도 공식 기관 안내와 보호자 판단이 필요한 항목을 명확히 구분합니다.</p></>,
    "email-collection": <><h2>이메일 주소 무단 수집 거부</h2><p>이 사이트에 게시된 이메일 주소의 자동 수집, 판매, 유통, 무단 이용을 거부합니다. 이를 위반할 경우 관련 법령에 따라 조치할 수 있습니다.</p></>,
    "adsense-playbook": <><h2>신청 전 점검</h2><ol><li>초기 편집 콘텐츠 12개와 비어 있지 않은 카테고리를 확인합니다.</li><li>도메인 URL, 국가, 소유권, HTTPS, 헤드 광고 코드, ads.txt, robots, sitemap을 확인합니다.</li><li>데스크톱·모바일 화면, HTTP 200, 내부 링크, 작성자·정책·출처 문서를 확인합니다.</li></ol><h2>반려와 대기 대응</h2><p>안정화 모드는 새 도움 글 1~2개, 운영형 모드는 실제 유입 가능성이 높은 글 3~5개를 추가한 뒤 재신청합니다. 3주 이상 반응이 없으면 개인 설정의 전화번호를 +82 형식으로 점검합니다.</p><h2>승인 후</h2><p>자동 광고 설정 뒤 노출을 확인하고, 광고가 겹치지 않게 관리합니다. PIN·정산·제휴·외부 유입·SNS 운영은 별도 수익화 기록으로 관리합니다.</p></>
  };
  return content[document];
}

export function SiteDocumentView({ site, document }: { site: SiteConfig; document: OperationalDocument }) {
  const experience = getExperience(site.slug);
  return <ExperienceShell site={site} active="documents"><article className={`document-page document-page--${experience.frame} experience-width`}><header><p className="eyebrow">OPERATING DOCUMENT / {experience.deskName}</p><h1>{documentLabel(document)}</h1><p>{site.name}의 공개 운영 기준과 확인 흐름을 기록합니다.</p></header><div className="document-content"><DocumentBody site={site} document={document} /><DomainOperatingNote site={site} document={document} /></div><footer><Flag size={17} /><span>최종 기준은 해당 기관의 공식 원문이며, 이 문서는 변경 사항을 확인하는 기준을 설명합니다.</span></footer></article></ExperienceShell>;
}
