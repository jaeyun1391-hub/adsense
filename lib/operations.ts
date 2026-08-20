import operationsFile from "@/data/operations.json";
import { getExperience, type SubmissionMode } from "@/lib/experience";
import type { InfoItem, SiteConfig, SiteSlug } from "@/lib/sites";

export type SourceDefinition = {
  id: string;
  siteSlug: SiteSlug;
  label: string;
  publicUrl: string;
  allowedHosts: string[];
  mode: SubmissionMode;
};

export type PublishedRecord = {
  id: string;
  siteSlug: SiteSlug;
  sourceId?: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  region: string;
  period: string;
  startDate?: string;
  endDate?: string;
  sourceName: string;
  sourceUrl: string;
  status: "published" | "reference" | "stale";
  updatedAt: string;
  lastCheckedAt: string;
  expiresAt?: string | null;
  tags: string[];
  details: Record<string, string>;
};

export function readCurrentTimestamp() {
  return Date.now();
}

export type RecordRevision = {
  id: string;
  recordId: string;
  reason: "initial-publication" | "official-source-update" | "expired";
  previousSnapshot: Partial<PublishedRecord> | null;
  nextSnapshot: Partial<PublishedRecord> | null;
  createdAt: string;
};

export type SourceHealth = {
  id: string;
  label: string;
  publicUrl: string;
  state: "reference";
  note: string;
};

export type ApplicationStatus = "준비 중" | "검토 필요" | "주의 필요" | "준비됨";

export type ApplicationRun = {
  siteSlug: SiteSlug;
  mode: SubmissionMode;
  status: ApplicationStatus;
  lastActionAt: string | null;
  nextAction: string;
};

export type CollectionRunLog = {
  id: string;
  sourceId: string;
  siteSlug: SiteSlug;
  state: "completed" | "skipped" | "failed" | "reviewed";
  detail: string;
  recordCount: number;
  startedAt: string;
  finishedAt: string | null;
};

type OperationsManifest = {
  schemaVersion: number;
  updatedAt: string;
  records: PublishedRecord[];
  revisions: RecordRevision[];
  collectionRuns: CollectionRunLog[];
  applicationRuns: ApplicationRun[];
};

const manifest = operationsFile as unknown as OperationsManifest;

const sourceDefinitions: SourceDefinition[] = [
  {
    id: "dataq-schedule",
    siteSlug: "exam",
    label: "데이터자격시험 2026 일정",
    publicUrl: "https://www.dataq.or.kr/www/accept/schedule.do",
    allowedHosts: ["dataq.or.kr"],
    mode: "stability"
  },
  { id: "history-schedule", siteSlug: "exam", label: "한국사능력검정시험 일정", publicUrl: "https://www.historyexam.go.kr/pageLink.do?link=examSchedule", allowedHosts: ["historyexam.go.kr"], mode: "stability" },
  { id: "toeic-schedule", siteSlug: "exam", label: "TOEIC 공식 시험일정", publicUrl: "https://exam.toeic.co.kr/receipt/examSchList.php", allowedHosts: ["toeic.co.kr"], mode: "stability" },
  { id: "jlpt-schedule", siteSlug: "exam", label: "JLPT 2026 제2회 일정", publicUrl: "https://jlpt.or.kr/html/index.html", allowedHosts: ["jlpt.or.kr"], mode: "stability" },
  { id: "qnet-realtor", siteSlug: "exam", label: "Q-Net 공인중개사 제37회", publicUrl: "https://www.q-net.or.kr/man001.do?gId=08&gSite=L&id=", allowedHosts: ["q-net.or.kr"], mode: "stability" },
  { id: "local-gosi", siteSlug: "exam", label: "2026 지방공무원 공통 일정", publicUrl: "https://local.gosi.go.kr/klid/sihum/examNewNoticeView.do?pageNo=1&pageUnit=10&strClass=0&strKeyword=&strOperOrg=&strOperOrgCd=00&strOperYy=2025&strSearch=0&strSeq=274", allowedHosts: ["local.gosi.go.kr"], mode: "stability" },
  {
    id: "seoul-events",
    siteSlug: "events",
    label: "서울특별시 펀서울 행사 상세",
    publicUrl: "https://festival.seoul.go.kr/",
    allowedHosts: ["festival.seoul.go.kr"],
    mode: "operating"
  },
  {
    id: "busan-events",
    siteSlug: "events",
    label: "부산축제조직위원회 행사 공지",
    publicUrl: "https://www.bfo.or.kr/",
    allowedHosts: ["bfo.or.kr"],
    mode: "operating"
  },
  {
    id: "myhome-youth",
    siteSlug: "housing",
    label: "마이홈 청년 주거지원",
    publicUrl: "https://www.myhome.go.kr/hws/portal/main/getMgtMainYhsPage.do",
    allowedHosts: ["myhome.go.kr"],
    mode: "stability"
  },
  {
    id: "lh-notices",
    siteSlug: "housing",
    label: "LH 청약플러스 공고",
    publicUrl: "https://apply.lh.or.kr/lhapply/apply/sc/list.do",
    allowedHosts: ["lh.or.kr"],
    mode: "stability"
  },
  {
    id: "bizinfo-support",
    siteSlug: "business",
    label: "기업마당 지원사업",
    publicUrl: "https://www.bizinfo.go.kr/",
    allowedHosts: ["bizinfo.go.kr"],
    mode: "operating"
  },
  {
    id: "facility-reservations",
    siteSlug: "facilities",
    label: "공공데이터포털 시설 예약 정보",
    publicUrl: "https://www.data.go.kr/",
    allowedHosts: ["data.go.kr"],
    mode: "stability"
  }
];

const siteSlugs: SiteSlug[] = ["exam", "events", "housing", "business", "facilities"];

export function sourcesForSite(siteSlug: SiteSlug) {
  return sourceDefinitions.filter((source) => source.siteSlug === siteSlug);
}

function toReferenceRecord(site: SiteConfig, item: InfoItem): PublishedRecord {
  return {
    id: "reference-" + site.slug + "-" + item.slug,
    siteSlug: site.slug,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    category: item.category,
    region: item.region,
    period: item.period,
    startDate: item.eventSchema?.startDate ?? item.examSchema?.startDate,
    endDate: item.eventSchema?.endDate ?? item.examSchema?.endDate,
    sourceName: item.source,
    sourceUrl: item.sourceUrl,
    status: "reference",
    updatedAt: item.updatedAt,
    lastCheckedAt: item.lastCheckedAt ?? item.updatedAt,
    tags: item.tags,
    details: item.details
  };
}

function isAllowedOfficialUrl(source: SourceDefinition, value: string) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return source.allowedHosts.some((allowedHost) => host === allowedHost || host.endsWith("." + allowedHost));
  } catch {
    return false;
  }
}

function isPublishableRecord(record: PublishedRecord, siteSlug: SiteSlug) {
  if (record.siteSlug !== siteSlug || record.status !== "published" || !record.sourceId) return false;
  if (!record.id || !record.slug || !record.title || !record.summary || !record.category || !record.region || !record.period) return false;
  if (!record.sourceName || !record.sourceUrl || !record.updatedAt || !record.lastCheckedAt) return false;
  if (!Array.isArray(record.tags) || !record.details || typeof record.details !== "object") return false;
  if (Number.isNaN(Date.parse(record.updatedAt)) || Number.isNaN(Date.parse(record.lastCheckedAt))) return false;
  if (record.expiresAt && !Number.isNaN(Date.parse(record.expiresAt)) && Date.parse(record.expiresAt) < Date.now()) return false;

  const source = sourceDefinitions.find((candidate) => candidate.id === record.sourceId && candidate.siteSlug === siteSlug);
  return Boolean(source && isAllowedOfficialUrl(source, record.sourceUrl));
}

export async function getPublicRecords(site: SiteConfig) {
  const examStatusRank = (status = "") => {
    if (status.includes("마감 임박")) return 0;
    if (status.includes("접수 중")) return 1;
    if (status.includes("시험 임박")) return 2;
    if (status.includes("점수") || status.includes("발표 예정")) return 3;
    if (status.includes("수험표")) return 4;
    if (status.includes("접수 예정")) return 5;
    return 6;
  };
  const published = manifest.records
    .filter((record) => isPublishableRecord(record, site.slug))
    .sort((left, right) => {
      if (site.slug === "exam") {
        const rankDifference = examStatusRank(left.details["현재 상태"]) - examStatusRank(right.details["현재 상태"]);
        if (rankDifference !== 0) return rankDifference;
        return Date.parse(right.lastCheckedAt) - Date.parse(left.lastCheckedAt);
      }
      if (site.slug === "events" && left.startDate && right.startDate) {
        const now = Date.now();
        const leftStart = Date.parse(left.startDate);
        const rightStart = Date.parse(right.startDate);
        const leftEnd = Date.parse(left.endDate ?? left.startDate) + 86_399_999;
        const rightEnd = Date.parse(right.endDate ?? right.startDate) + 86_399_999;
        const rank = (start: number, end: number) => (start <= now && end >= now ? 0 : start > now ? 1 : 2);
        const rankDifference = rank(leftStart, leftEnd) - rank(rightStart, rightEnd);
        if (rankDifference !== 0) return rankDifference;
        if (rank(leftStart, leftEnd) === 0) return leftEnd - rightEnd;
        return leftStart - rightStart;
      }
      return Date.parse(right.lastCheckedAt) - Date.parse(left.lastCheckedAt);
    });
  const publishedSlugs = new Set(published.map((record) => record.slug));
  const editorial = site.items
    .map((item) => toReferenceRecord(site, item))
    .filter((record) => !publishedSlugs.has(record.slug));

  return { records: [...published, ...editorial], live: published.length > 0 };
}

export async function getPublicRecord(site: SiteConfig, slug: string) {
  const snapshot = await getPublicRecords(site);
  return snapshot.records.find((record) => record.slug === slug) ?? null;
}

export function getSourceHealth(siteSlug: SiteSlug): SourceHealth[] {
  return sourcesForSite(siteSlug).map((source) => ({
    id: source.id,
    label: source.label,
    publicUrl: source.publicUrl,
    state: "reference",
    note: "이 사이트의 글을 대조할 때 우선 확인하는 공식 원문입니다."
  }));
}

function defaultApplicationRuns(): ApplicationRun[] {
  return siteSlugs.map((siteSlug) => {
    const experience = getExperience(siteSlug);
    return {
      siteSlug,
      mode: experience.submissionMode,
      status: "준비 중",
      lastActionAt: null,
      nextAction:
        experience.submissionMode === "stability"
          ? "핵심 글과 운영 문서가 안정화된 뒤, 애드센스 화면에서 수동으로 신청 상태를 확인합니다."
          : "공식 변경 사항과 문제 해결형 글의 운영 이력을 확인한 뒤, 애드센스 화면에서 수동으로 신청 상태를 확인합니다."
    };
  });
}

export async function getApplicationRuns(): Promise<ApplicationRun[]> {
  const savedBySite = new Map(manifest.applicationRuns.map((run) => [run.siteSlug, run]));
  return defaultApplicationRuns().map((fallback) => savedBySite.get(fallback.siteSlug) ?? fallback);
}

export async function getCollectionRuns(limit = 30): Promise<CollectionRunLog[]> {
  return [...manifest.collectionRuns]
    .sort((left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt))
    .slice(0, limit);
}

export function getOperationsManifestStatus() {
  return {
    updatedAt: manifest.updatedAt,
    publishedRecordCount: manifest.records.filter((record) => record.status === "published").length,
    revisionCount: manifest.revisions.length,
    collectionRunCount: manifest.collectionRuns.length
  };
}
