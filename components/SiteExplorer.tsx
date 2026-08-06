"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ListFilter, Map, MapPinned, Search, SlidersHorizontal } from "lucide-react";
import type { SiteSlug } from "@/lib/sites";
import type { PublishedRecord } from "@/lib/operations";

type SiteExplorerProps = {
  siteSlug: SiteSlug;
  records: PublishedRecord[];
  title?: string;
  compact?: boolean;
};

const modeLabels: Record<SiteSlug, string[]> = {
  exam: ["전체", "접수", "준비물", "결과"],
  events: ["오늘", "이번 주", "이번 달", "우천 시"],
  housing: ["거주", "소득", "계약", "서류"],
  business: ["마감 임박", "업종", "지역", "서류"],
  facilities: ["목록", "지도", "예약", "이용 전"]
};

function eventBoundary(value: string, end = false) {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T${end ? "23:59:59.999" : "00:00:00"}+09:00`
    : value;
  return Date.parse(normalized);
}

function matchesMode(siteSlug: SiteSlug, record: PublishedRecord, mode: string) {
  if (siteSlug === "events" && ["오늘", "이번 주", "이번 달"].includes(mode)) {
    if (!record.startDate) return false;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(record.startDate);
    const end = new Date(record.endDate ?? record.startDate);
    const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);

    if (mode === "오늘") return normalizedStart <= today && normalizedEnd >= today;
    if (mode === "이번 주") {
      const day = today.getDay() || 7;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - day + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      return normalizedStart <= weekEnd && normalizedEnd >= weekStart;
    }

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    return normalizedStart <= monthEnd && normalizedEnd >= monthStart;
  }
  if (mode === "전체" || mode === "목록" || mode === "지도") return true;
  const haystack = [record.title, record.summary, record.category, record.region, record.period, ...record.tags].join(" ").toLowerCase();
  const needles: Record<string, string[]> = {
    접수: ["접수", "원서"],
    준비물: ["준비", "서류", "신분"],
    결과: ["결과", "발표", "성적"],
    "우천 시": ["우천", "비", "실내"],
    거주: ["거주", "주소", "전입"],
    소득: ["소득", "가구", "재산"],
    계약: ["계약", "보증금", "월세"],
    서류: ["서류", "증빙", "발급"],
    "마감 임박": ["마감", "접수", "신청"],
    업종: ["업종", "사업", "소상공인"],
    지역: ["서울", "경기", "부산", "지역", "전국"],
    예약: ["예약", "접수"],
    "이용 전": ["주차", "요금", "취소", "이용"]
  };
  return (needles[mode] ?? []).some((needle) => haystack.includes(needle));
}

function eventState(record: PublishedRecord) {
  if (!record.startDate) return "일정 확인";
  const now = Date.now();
  const start = eventBoundary(record.startDate);
  const end = eventBoundary(record.endDate ?? record.startDate, true);
  if (start <= now && end >= now) return "진행 중";
  if (start > now) return "예정";
  return "종료";
}

export function SiteExplorer({ siteSlug, records, title, compact = false }: SiteExplorerProps) {
  const [mode, setMode] = useState(modeLabels[siteSlug][0]);
  const [query, setQuery] = useState("");
  const [facilityView, setFacilityView] = useState<"list" | "map">("list");

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records
      .filter((record) => matchesMode(siteSlug, record, mode))
      .filter((record) => {
        if (!normalized) return true;
        return [record.title, record.summary, record.category, record.region, record.sourceName, ...record.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      })
      .slice(0, compact ? 6 : 30);
  }, [compact, mode, query, records, siteSlug]);

  const isFacilities = siteSlug === "facilities";
  const isHousing = siteSlug === "housing";

  return (
    <section className={`site-explorer site-explorer--${siteSlug}`} aria-label={title ?? "정보 탐색"}>
      <div className="explorer-toolbar">
        <div className="explorer-mode-tabs" role="tablist" aria-label="탐색 기준">
          {modeLabels[siteSlug].map((label) => (
            <button
              key={label}
              type="button"
              className={mode === label ? "is-selected" : undefined}
              onClick={() => {
                setMode(label);
                if (label === "지도") setFacilityView("map");
                if (label === "목록") setFacilityView("list");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="explorer-search">
          <Search size={16} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목, 지역, 조건 검색" />
        </label>
      </div>

      {isHousing ? (
        <div className="housing-quick-check" aria-label="주거 상황 빠른 점검">
          <SlidersHorizontal size={18} />
          <p><b>빠른 점검:</b> 거주지, 가구·소득, 임대차 계약, 제출 서류를 순서대로 확인한 뒤 공식 공고로 이동하세요.</p>
        </div>
      ) : null}

      {isFacilities ? (
        <div className="facility-view-switch" role="group" aria-label="시설 보기 방식">
          <button type="button" className={facilityView === "list" ? "is-selected" : undefined} onClick={() => setFacilityView("list")}><ListFilter size={15} /> 목록</button>
          <button type="button" className={facilityView === "map" ? "is-selected" : undefined} onClick={() => setFacilityView("map")}><Map size={15} /> 지도</button>
        </div>
      ) : null}

      {isFacilities && facilityView === "map" ? (
        <div className="facility-map" aria-label="시설 분포 도식">
          <div className="facility-map-grid" />
          {visible.slice(0, 9).map((record, index) => (
            <a className={`facility-pin facility-pin-${index + 1}`} key={record.id} href={`/items/${record.slug}`}>
              <MapPinned size={15} /><span>{record.region}</span>
            </a>
          ))}
        </div>
      ) : (
        <div className={`explorer-results ${compact ? "is-compact" : ""}`}>
          {visible.map((record) => (
            <a className="explorer-record" key={record.id} href={`/items/${record.slug}`}>
              <div className="record-meta"><span>{record.category}</span><span>{record.region}</span><span>{siteSlug === "events" ? eventState(record) : record.status === "published" ? "원문 확인 기록" : "편집 글"}</span></div>
              <h3>{record.title}</h3>
              <p>{record.summary}</p>
              <div className="record-bottom"><span>{record.period}</span><ArrowRight size={16} /></div>
            </a>
          ))}
          {visible.length === 0 ? <p className="explorer-empty">조건에 맞는 항목이 없습니다. 다른 키워드나 기준으로 다시 찾아보세요.</p> : null}
        </div>
      )}
    </section>
  );
}
