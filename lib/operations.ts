import type { InfoItem, SiteConfig, SiteSlug } from "@/lib/sites";
import { getExperience, type SubmissionMode } from "@/lib/experience";

export type SourceDefinition = {
  id: string;
  siteSlug: SiteSlug;
  label: string;
  publicUrl: string;
  endpointEnv: string;
  apiKeyEnv?: string;
  cadenceHours: number;
  mode: SubmissionMode;
};

export type PublishedRecord = {
  id: string;
  siteSlug: SiteSlug;
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
  tags: string[];
  details: Record<string, string>;
};

export type SourceHealth = {
  id: string;
  label: string;
  publicUrl: string;
  cadenceHours: number;
  state: "connected" | "configuration-needed" | "stale";
  note: string;
};

export type ApplicationStatus = "준비 전" | "준비 중" | "검토 필요" | "주의 필요" | "준비됨";

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
  state: string;
  detail: string;
  recordCount: number;
  startedAt: string;
  finishedAt: string | null;
};

const sourceDefinitions: SourceDefinition[] = [
  {
    id: "qnet-schedule",
    siteSlug: "exam",
    label: "Q-Net 시험일정",
    publicUrl: "https://www.q-net.or.kr/",
    endpointEnv: "QNET_SCHEDULE_ENDPOINT",
    apiKeyEnv: "QNET_SERVICE_KEY",
    cadenceHours: 12,
    mode: "stability"
  },
  {
    id: "visitkorea-events",
    siteSlug: "events",
    label: "한국관광공사 행사 정보",
    publicUrl: "https://api.visitkorea.or.kr/",
    endpointEnv: "VISITKOREA_EVENTS_ENDPOINT",
    apiKeyEnv: "VISITKOREA_SERVICE_KEY",
    cadenceHours: 3,
    mode: "operating"
  },
  {
    id: "myhome-youth",
    siteSlug: "housing",
    label: "마이홈 청년 주거지원",
    publicUrl: "https://www.myhome.go.kr/hws/portal/main/getMgtMainYhsPage.do",
    endpointEnv: "MYHOME_YOUTH_ENDPOINT",
    cadenceHours: 6,
    mode: "stability"
  },
  {
    id: "lh-notices",
    siteSlug: "housing",
    label: "LH 청약플러스 공고",
    publicUrl: "https://apply.lh.or.kr/lhapply/apply/sc/list.do",
    endpointEnv: "LH_NOTICES_ENDPOINT",
    cadenceHours: 6,
    mode: "stability"
  },
  {
    id: "bizinfo-support",
    siteSlug: "business",
    label: "기업마당 지원사업",
    publicUrl: "https://www.bizinfo.go.kr/apiList.do",
    endpointEnv: "BIZINFO_SUPPORT_ENDPOINT",
    apiKeyEnv: "BIZINFO_API_KEY",
    cadenceHours: 3,
    mode: "operating"
  },
  {
    id: "facility-reservations",
    siteSlug: "facilities",
    label: "지자체 공공시설 예약 데이터",
    publicUrl: "https://www.data.go.kr/",
    endpointEnv: "FACILITY_RESERVATION_ENDPOINT",
    apiKeyEnv: "FACILITY_SERVICE_KEY",
    cadenceHours: 6,
    mode: "stability"
  }
];

export function sourcesForSite(siteSlug: SiteSlug) {
  return sourceDefinitions.filter((source) => source.siteSlug === siteSlug);
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const config = supabaseConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=merge-duplicates",
      ...init.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) return null;
  return (await response.json()) as T;
}

function toReferenceRecord(site: SiteConfig, item: InfoItem): PublishedRecord {
  return {
    id: `reference-${site.slug}-${item.slug}`,
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

type StoredPublishedRecord = {
  id: string;
  site_slug: SiteSlug;
  source_id?: string | null;
  external_id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  region: string;
  period: string;
  source_name: string;
  source_url: string;
  status: "published" | "reference" | "stale";
  updated_at: string;
  last_checked_at: string;
  expires_at?: string | null;
  tags: string[] | null;
  details: Record<string, string> | null;
};

function fromStoredRecord(record: StoredPublishedRecord): PublishedRecord {
  return {
    id: record.id,
    siteSlug: record.site_slug,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    category: record.category,
    region: record.region,
    period: record.period,
    sourceName: record.source_name,
    sourceUrl: record.source_url,
    status: record.status,
    updatedAt: record.updated_at,
    lastCheckedAt: record.last_checked_at,
    tags: record.tags ?? [],
    details: record.details ?? {}
  };
}

function revisionSnapshot(record: Pick<StoredPublishedRecord, "site_slug" | "external_id" | "slug" | "title" | "summary" | "category" | "region" | "period" | "source_name" | "source_url" | "status" | "expires_at" | "tags" | "details">) {
  return {
    siteSlug: record.site_slug,
    externalId: record.external_id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    category: record.category,
    region: record.region,
    period: record.period,
    sourceName: record.source_name,
    sourceUrl: record.source_url,
    status: record.status,
    expiresAt: record.expires_at ?? null,
    tags: record.tags ?? [],
    details: record.details ?? {}
  };
}

function sameRevisionSnapshot(left: ReturnType<typeof revisionSnapshot>, right: ReturnType<typeof revisionSnapshot>) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export async function getPublicRecords(site: SiteConfig) {
  try {
    const stored = await supabaseRequest<StoredPublishedRecord[]>(
      `published_records?site_slug=eq.${site.slug}&status=eq.published&order=last_checked_at.desc&select=*`
    );
    if (stored?.length) {
      const published = stored.map(fromStoredRecord);
      const publishedSlugs = new Set(published.map((record) => record.slug));
      const editorial = site.items.map((item) => toReferenceRecord(site, item)).filter((record) => !publishedSlugs.has(record.slug));
      return { records: [...published, ...editorial], live: true };
    }
  } catch {
    // Public pages remain usable with the verified local editorial set if the remote source is unavailable.
  }

  return { records: site.items.map((item) => toReferenceRecord(site, item)), live: false };
}

export async function getPublicRecord(site: SiteConfig, slug: string) {
  const snapshot = await getPublicRecords(site);
  return snapshot.records.find((record) => record.slug === slug) ?? null;
}

export function getSourceHealth(siteSlug: SiteSlug): SourceHealth[] {
  return sourcesForSite(siteSlug).map((source) => {
    const configured = Boolean(process.env[source.endpointEnv] && supabaseConfig());
    return {
      id: source.id,
      label: source.label,
      publicUrl: source.publicUrl,
      cadenceHours: source.cadenceHours,
      state: configured ? "connected" : "configuration-needed",
      note: configured
        ? `${source.cadenceHours}시간 주기 자동 수집 대기`
        : "공식 자료 연결을 시작하려면 운영 저장소와 API 설정이 필요합니다."
    };
  });
}

export async function getApplicationRuns(): Promise<ApplicationRun[]> {
  const defaults: ApplicationRun[] = (Object.keys({ exam: true, events: true, housing: true, business: true, facilities: true }) as SiteSlug[]).map(
    (siteSlug) => {
      const experience = getExperience(siteSlug);
      return {
        siteSlug,
        mode: experience.submissionMode,
        status: "준비 전" as ApplicationStatus,
        lastActionAt: null,
        nextAction:
          experience.submissionMode === "stability"
            ? "초기 12개 편집 글 공개 후 48시간 안정화 확인"
            : "초기 12개 편집 글과 공식 데이터 흐름 확인"
      };
    }
  );

  try {
    const stored = await supabaseRequest<{ site_slug: SiteSlug; mode: SubmissionMode; status: ApplicationStatus; last_action_at: string | null; next_action: string }[]>(
      "application_runs?select=site_slug,mode,status,last_action_at,next_action"
    );
    if (!stored?.length) return defaults;
    const storedBySite = new Map(stored.map((run) => [run.site_slug, run]));
    return defaults.map((fallback) => {
      const saved = storedBySite.get(fallback.siteSlug);
      return saved
        ? { siteSlug: saved.site_slug, mode: saved.mode, status: saved.status, lastActionAt: saved.last_action_at, nextAction: saved.next_action }
        : fallback;
    });
  } catch {
    return defaults;
  }
}

export async function saveApplicationRun(input: ApplicationRun) {
  if (!supabaseConfig()) {
    throw new Error("운영 저장소 연결이 설정되기 전에는 신청 상태를 저장할 수 없습니다.");
  }
  return supabaseRequest("application_runs?on_conflict=site_slug", {
    method: "POST",
    body: JSON.stringify({
      site_slug: input.siteSlug,
      mode: input.mode,
      status: input.status,
      last_action_at: input.lastActionAt ?? new Date().toISOString(),
      next_action: input.nextAction
    })
  });
}

export async function getCollectionRuns(limit = 30): Promise<CollectionRunLog[]> {
  try {
    const stored = await supabaseRequest<{
      id: string;
      source_id: string;
      site_slug: SiteSlug;
      state: string;
      detail: string;
      record_count: number;
      started_at: string;
      finished_at: string | null;
    }[]>("collection_runs?order=started_at.desc&limit=" + limit + "&select=*");
    return (stored ?? []).map((run) => ({
      id: run.id,
      sourceId: run.source_id,
      siteSlug: run.site_slug,
      state: run.state,
      detail: run.detail,
      recordCount: run.record_count,
      startedAt: run.started_at,
      finishedAt: run.finished_at
    }));
  } catch {
    return [];
  }
}

function pickString(value: unknown, keys: string[]) {
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    if (typeof candidate === "number") return String(candidate);
  }
  return "";
}

function pickArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  for (const value of Object.values(record)) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = pickArray(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function toIsoDate(value: string) {
  if (!value) return null;
  const compact = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  const candidate = compact ? `${compact[1]}-${compact[2]}-${compact[3]}T00:00:00.000Z` : value;
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normalizeRemoteRecord(source: SourceDefinition, row: unknown, index: number) {
  const title = pickString(row, ["title", "pblancNm", "eventNm", "name", "subject"]);
  const sourceUrl = pickString(row, ["url", "detailUrl", "link", "pblancUrl", "homepage"]);
  if (!title || !sourceUrl) return null;

  const date = pickString(row, ["updatedAt", "regDt", "date", "startDate", "pblancRcptEndDt"]);
  const expiresAt = toIsoDate(pickString(row, ["endDate", "eventEndDate", "pblancRcptEndDt", "endDt"]));
  const category = pickString(row, ["category", "lclasNm", "type", "eventType"]) || "공식 안내";
  const region = pickString(row, ["region", "area", "areaNm", "areaCode", "location"]) || "전국";
  const period = pickString(row, ["period", "dateRange", "pblancRcptBgngDt", "eventStartDate"]) || "공식 원문 확인";
  const externalId = pickString(row, ["id", "contentid", "pblancId", "seq", "serviceId"]) || `${source.id}-${index}`;

  const slugValue = `${source.id}-${externalId}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || `${source.id}-record-${index + 1}`;

  return {
    site_slug: source.siteSlug,
    source_id: source.id,
    external_id: `${source.id}:${externalId}`,
    slug: slugValue,
    title,
    summary: pickString(row, ["summary", "description", "contents", "intro"]) || `${source.label}에서 수집한 공식 안내입니다.`,
    category,
    region,
    period,
    source_name: source.label,
    source_url: sourceUrl,
    status: "published",
    updated_at: toIsoDate(date) ?? new Date().toISOString(),
    last_checked_at: new Date().toISOString(),
    expires_at: expiresAt,
    tags: [category, region, source.label],
    details: { "수집 출처": source.label, "공식 원문": sourceUrl }
  };
}

async function persistCollectionRun(source: SourceDefinition, state: string, detail: string, count = 0) {
  const now = new Date().toISOString();
  return supabaseRequest("collection_runs", {
    method: "POST",
    body: JSON.stringify({
      source_id: source.id,
      site_slug: source.siteSlug,
      state,
      detail,
      record_count: count,
      started_at: now,
      finished_at: new Date().toISOString()
    })
  });
}

async function syncSourceDefinitions() {
  return supabaseRequest("source_definitions?on_conflict=id", {
    method: "POST",
    body: JSON.stringify(sourceDefinitions.map((source) => ({
      id: source.id,
      site_slug: source.siteSlug,
      label: source.label,
      public_url: source.publicUrl,
      endpoint_env: source.endpointEnv,
      api_key_env: source.apiKeyEnv ?? null,
      cadence_hours: source.cadenceHours,
      mode: source.mode,
      active: true
    })))
  });
}

async function sourceIsDue(source: SourceDefinition) {
  try {
    const runs = await supabaseRequest<{ finished_at: string | null }[]>(
      "collection_runs?source_id=eq." + encodeURIComponent(source.id) + "&state=eq.completed&order=finished_at.desc&limit=1&select=finished_at"
    );
    const finishedAt = runs?.[0]?.finished_at;
    if (!finishedAt) return true;
    const elapsedMs = Date.now() - new Date(finishedAt).getTime();
    return Number.isNaN(elapsedMs) || elapsedMs >= source.cadenceHours * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

async function markExpiredRecords() {
  const now = new Date().toISOString();
  try {
    await supabaseRequest("published_records?status=eq.published&expires_at=lt." + encodeURIComponent(now), {
      method: "PATCH",
      body: JSON.stringify({ status: "stale", last_checked_at: now })
    });
  } catch {
    // Expiry handling resumes automatically when the data store is connected again.
  }
}

export async function collectConfiguredSources() {
  const results: { source: string; state: string; count: number; detail: string }[] = [];

  if (!supabaseConfig()) {
    return sourceDefinitions.map((source) => ({
      source: source.id,
      state: "skipped",
      count: 0,
      detail: "운영 저장소 연결이 설정되기 전에는 수집 결과를 공개하지 않습니다."
    }));
  }

  try {
    await syncSourceDefinitions();
    await markExpiredRecords();
  } catch {
    // Individual sources still report their own collection result below.
  }

  for (const source of sourceDefinitions) {
    const endpoint = process.env[source.endpointEnv];
    const apiKey = source.apiKeyEnv ? process.env[source.apiKeyEnv] : undefined;

    if (!endpoint) {
      try {
        await persistCollectionRun(source, "skipped", "엔드포인트 미설정");
      } catch {
        // The dashboard can still show the configuration state from environment variables.
      }
      results.push({ source: source.id, state: "skipped", count: 0, detail: "엔드포인트 미설정" });
      continue;
    }

    if (!(await sourceIsDue(source))) {
      results.push({ source: source.id, state: "skipped", count: 0, detail: `${source.cadenceHours}시간 수집 주기 대기` });
      continue;
    }

    try {
      const url = new URL(endpoint);
      if (apiKey && !url.searchParams.has("serviceKey") && !url.searchParams.has("crtfcKey")) {
        url.searchParams.set("serviceKey", apiKey);
      }
      const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!response.ok) throw new Error(`원천 응답 ${response.status}`);
      const payload = await response.json();
      const candidates = pickArray(payload).map((row, index) => ({ row, index, record: normalizeRemoteRecord(source, row, index) }));
      const normalized = candidates
        .filter((candidate): candidate is { row: unknown; index: number; record: NonNullable<ReturnType<typeof normalizeRemoteRecord>> } => Boolean(candidate.record));

      if (!normalized.length) throw new Error("공개 가능한 제목·원문 URL 항목을 찾지 못했습니다.");

      const existing = await supabaseRequest<StoredPublishedRecord[]>(
        "published_records?source_id=eq." + encodeURIComponent(source.id) + "&select=id,site_slug,source_id,external_id,slug,title,summary,category,region,period,source_name,source_url,status,expires_at,tags,details"
      );
      const existingByExternalId = new Map((existing ?? []).map((record) => [record.external_id, record]));

      await supabaseRequest("source_records?on_conflict=source_id,external_id", {
        method: "POST",
        body: JSON.stringify(
          normalized.map(({ row, record }) => ({
            source_id: source.id,
            site_slug: source.siteSlug,
            external_id: record.external_id,
            title: record.title,
            source_url: record.source_url,
            source_published_at: record.updated_at,
            raw_payload: row,
            collected_at: record.last_checked_at
          }))
        )
      });

      const published = await supabaseRequest<StoredPublishedRecord[]>("published_records?on_conflict=site_slug,external_id", {
        method: "POST",
        body: JSON.stringify(normalized.map(({ record }) => record))
      });
      const revisions = (published ?? []).flatMap((record) => {
        const previous = existingByExternalId.get(record.external_id);
        const nextPayload = revisionSnapshot(record);
        const previousPayload = previous ? revisionSnapshot(previous) : null;
        if (previousPayload && sameRevisionSnapshot(previousPayload, nextPayload)) return [];

        return [{
          published_record_id: record.id,
          reason: previous ? "official-source-update" : "initial-publication",
          previous_payload: previousPayload,
          next_payload: nextPayload
        }];
      });
      if (revisions.length) {
        await supabaseRequest("record_revisions", { method: "POST", body: JSON.stringify(revisions) });
      }
      await persistCollectionRun(source, "completed", "자동 수집 및 즉시 공개", normalized.length);
      results.push({ source: source.id, state: "completed", count: normalized.length, detail: "즉시 공개 완료" });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "알 수 없는 수집 오류";
      try {
        await persistCollectionRun(source, "failed", detail);
      } catch {
        // The source result itself is still returned when the logging destination is unavailable.
      }
      results.push({ source: source.id, state: "failed", count: 0, detail });
    }
  }

  return results;
}
