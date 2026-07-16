import operationsFile from "@/data/operations.json";
import { getExperience, type SubmissionMode } from "@/lib/experience";
import type { InfoItem, SiteConfig, SiteSlug } from "@/lib/sites";

export type SourceDefinition = {
  id: string;
  siteSlug: SiteSlug;
  label: string;
  publicUrl: string;
  allowedHosts: string[];
  cadenceHours: number;
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
  sourceName: string;
  sourceUrl: string;
  status: "published" | "reference" | "stale";
  updatedAt: string;
  lastCheckedAt: string;
  expiresAt?: string | null;
  tags: string[];
  details: Record<string, string>;
};

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
  cadenceHours: number;
  state: "codex-scheduled" | "stale";
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
    id: "qnet-schedule",
    siteSlug: "exam",
    label: "Q-Net 시험 일정",
    publicUrl: "https://www.q-net.or.kr/",
    allowedHosts: ["q-net.or.kr"],
    cadenceHours: 12,
    mode: "stability"
  },
  {
    id: "visitkorea-events",
    siteSlug: "events",
    label: "한국관광공사 행사 정보",
    publicUrl: "https://korean.visitkorea.or.kr/",
    allowedHosts: ["visitkorea.or.kr"],
    cadenceHours: 3,
    mode: "operating"
  },
  {
    id: "myhome-youth",
    siteSlug: "housing",
    label: "마이홈 청년 주거지원",
    publicUrl: "https://www.myhome.go.kr/hws/portal/main/getMgtMainYhsPage.do",
    allowedHosts: ["myhome.go.kr"],
    cadenceHours: 6,
    mode: "stability"
  },
  {
    id: "lh-notices",
    siteSlug: "housing",
    label: "LH 청약플러스 공고",
    publicUrl: "https://apply.lh.or.kr/lhapply/apply/sc/list.do",
    allowedHosts: ["lh.or.kr"],
    cadenceHours: 6,
    mode: "stability"
  },
  {
    id: "bizinfo-support",
    siteSlug: "business",
    label: "기업마당 지원사업",
    publicUrl: "https://www.bizinfo.go.kr/",
    allowedHosts: ["bizinfo.go.kr"],
    cadenceHours: 3,
    mode: "operating"
  },
  {
    id: "facility-reservations",
    siteSlug: "facilities",
    label: "공공데이터포털 시설 예약 정보",
    publicUrl: "https://www.data.go.kr/",
    allowedHosts: ["data.go.kr"],
    cadenceHours: 6,
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
  const published = manifest.records
    .filter((record) => isPublishableRecord(record, site.slug))
    .sort((left, right) => Date.parse(right.lastCheckedAt) - Date.parse(left.lastCheckedAt));
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

function latestRunFor(source: SourceDefinition) {
  return manifest.collectionRuns
    .filter((run) => run.sourceId === source.id)
    .sort((left, right) => Date.parse(right.finishedAt ?? right.startedAt) - Date.parse(left.finishedAt ?? left.startedAt))[0];
}

export function getSourceHealth(siteSlug: SiteSlug): SourceHealth[] {
  return sourcesForSite(siteSlug).map((source) => {
    const latestRun = latestRunFor(source);
    const lastCompletedAt = latestRun?.finishedAt ?? latestRun?.startedAt;
    const ageMs = lastCompletedAt ? Date.now() - Date.parse(lastCompletedAt) : 0;
    const isStale = Boolean(lastCompletedAt && !Number.isNaN(ageMs) && ageMs > source.cadenceHours * 3 * 60 * 60 * 1000);

    return {
      id: source.id,
      label: source.label,
      publicUrl: source.publicUrl,
      cadenceHours: source.cadenceHours,
      state: isStale ? "stale" : "codex-scheduled",
      note: latestRun
        ? latestRun.state + " 기록: " + latestRun.detail
        : "Codex 정기 작업이 공식 원문을 확인한 뒤, 검증 기준을 통과한 항목만 저장소에 반영합니다."
    };
  });
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
