create extension if not exists pgcrypto;

create table if not exists source_definitions (
  id text primary key,
  site_slug text not null,
  label text not null,
  public_url text not null,
  endpoint_env text not null,
  api_key_env text,
  cadence_hours integer not null check (cadence_hours > 0),
  mode text not null check (mode in ('stability', 'operating')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists source_records (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references source_definitions(id) on delete cascade,
  site_slug text not null,
  external_id text not null,
  title text not null,
  source_url text not null,
  source_published_at timestamptz,
  raw_payload jsonb,
  collected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (source_id, external_id)
);

create table if not exists published_records (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null,
  source_id text references source_definitions(id) on delete set null,
  external_id text not null,
  slug text not null,
  title text not null,
  summary text not null,
  category text not null,
  region text not null,
  period text not null,
  source_name text not null,
  source_url text not null,
  status text not null default 'published' check (status in ('published', 'reference', 'stale')),
  updated_at timestamptz not null,
  last_checked_at timestamptz not null default now(),
  expires_at timestamptz,
  tags text[] not null default '{}',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (site_slug, external_id),
  unique (site_slug, slug)
);

create index if not exists published_records_site_status_checked_idx on published_records (site_slug, status, last_checked_at desc);
create index if not exists source_records_site_collected_idx on source_records (site_slug, collected_at desc);

create table if not exists record_revisions (
  id uuid primary key default gen_random_uuid(),
  published_record_id uuid not null references published_records(id) on delete cascade,
  reason text not null,
  previous_payload jsonb,
  next_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists collection_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references source_definitions(id) on delete cascade,
  site_slug text not null,
  state text not null check (state in ('completed', 'failed', 'skipped')),
  detail text not null,
  record_count integer not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists collection_runs_source_started_idx on collection_runs (source_id, started_at desc);

create table if not exists editorial_guides (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null,
  slug text not null,
  title text not null,
  summary text not null,
  body jsonb not null,
  source_urls text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_slug, slug)
);

create table if not exists application_runs (
  site_slug text primary key,
  mode text not null check (mode in ('stability', 'operating')),
  status text not null check (status in ('준비 전', '준비 중', '검토 필요', '주의 필요', '준비됨')),
  last_action_at timestamptz,
  next_action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table source_definitions enable row level security;
alter table source_records enable row level security;
alter table published_records enable row level security;
alter table record_revisions enable row level security;
alter table collection_runs enable row level security;
alter table editorial_guides enable row level security;
alter table application_runs enable row level security;

comment on table published_records is '공식 원천에서 확인된 사실형 공개 기록. 해석·보장 문장은 저장하지 않는다.';
comment on table application_runs is '도메인별 애드센스 신청·반려 대응 상태 기록.';
