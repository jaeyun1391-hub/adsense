import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  CloudRain,
  ExternalLink,
  MapPinned,
  ShieldCheck,
  Ticket,
  TrainFront,
  Umbrella
} from "lucide-react";
import type { ReactNode } from "react";
import { RichContent } from "@/components/RichContent";
import { SearchBox } from "@/components/SearchBox";
import { StructuredData } from "@/components/StructuredData";
import { eventsNextReviewDate, eventsReviewDate } from "@/lib/events-content";
import { localPath, publicUrl } from "@/lib/seo";
import type { Guide, InfoItem, SiteConfig } from "@/lib/sites";
import { siteStyle } from "@/lib/sites";

function pickItems(site: SiteConfig, slugs: string[], fallbackCount = 5) {
  const picked = slugs
    .map((slug) => site.items.find((item) => item.slug === slug))
    .filter(Boolean) as InfoItem[];
  const seen = new Set(picked.map((item) => item.slug));
  return [...picked, ...site.items.filter((item) => !seen.has(item.slug))].slice(0, fallbackCount);
}

function pickGuides(site: SiteConfig, slugs: string[], fallbackCount = 6) {
  const picked = slugs
    .map((slug) => site.guides.find((guide) => guide.slug === slug))
    .filter(Boolean) as Guide[];
  const seen = new Set(picked.map((guide) => guide.slug));
  return [...picked, ...site.guides.filter((guide) => !seen.has(guide.slug))].slice(0, fallbackCount);
}

function EventShell({ site, children }: { site: SiteConfig; children: ReactNode }) {
  return (
    <div className="event-platform" style={siteStyle(site)}>
      <div className="event-shell">
        <header className="event-topbar">
          <Link className="event-brand" href={localPath(site)} aria-label={`${site.name} 홈`}>
            <span>행</span>
            <strong>{site.name}</strong>
          </Link>
          <nav className="event-nav" aria-label="전국행사노트 주요 메뉴">
            <Link href={localPath(site, "/items")}>행사판</Link>
            <Link href={localPath(site, "/category/무료 행사")}>무료</Link>
            <Link href={localPath(site, "/guides/event-rain-outdoor-decision")}>우천</Link>
            <Link href={localPath(site, "/sources")}>출처</Link>
          </nav>
          <span className="event-top-date">확인 {eventsReviewDate}</span>
        </header>
        {children}
        <footer className="event-footer">
          <div>
            <strong>{site.name}</strong>
            <p>
              행사 일정, 예매, 교통, 날씨 변수를 방문자 관점으로 다시 확인하는 편집 노트 · 다음 정기 점검{" "}
              {eventsNextReviewDate}
            </p>
          </div>
          <div className="event-footer-links">
            <Link href={localPath(site, "/about")}>소개</Link>
            <Link href={localPath(site, "/editorial-policy")}>편집 기준</Link>
            <Link href={localPath(site, "/updates")}>점검 기록</Link>
            <Link href={localPath(site, "/contact")}>문의</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function EventsTextPage({
  site,
  title,
  intro,
  children,
  aside
}: {
  site: SiteConfig;
  title: string;
  intro: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <EventShell site={site}>
      <main className="event-container event-report-page">
        <article className="event-report guide event-ops-page">
          <div className="event-report-head">
            <div>
              <div className="event-badges">
                <span>운영 문서</span>
                <span>검토 {eventsReviewDate}</span>
              </div>
              <h1>{title}</h1>
              <p>{intro}</p>
            </div>
          </div>
          <div className="event-report-layout">
            <div className="event-content">{children}</div>
            <aside className="event-detail-aside">
              <div className="event-aside-card">
                <strong>전국행사노트 운영 기준</strong>
                <p>{aside ?? site.disclaimer}</p>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </EventShell>
  );
}

function BadgeList({ item }: { item: InfoItem }) {
  const badges = item.statusBadges?.length ? item.statusBadges : [item.category, item.region];
  return (
    <div className="event-badges">
      {badges.slice(0, 4).map((badge) => (
        <span key={badge}>{badge}</span>
      ))}
    </div>
  );
}

function EventScheduleRow({ site, item, index }: { site: SiteConfig; item: InfoItem; index: number }) {
  return (
    <Link className="event-schedule-row" href={localPath(site, `/items/${item.slug}`)}>
      <span className="event-row-num">{String(index + 1).padStart(2, "0")}</span>
      <span className="event-row-main">
        <strong>{item.title}</strong>
        <small>{item.eventDateStatus ?? item.period}</small>
      </span>
      <span className="event-row-meta">
        <span>{item.region}</span>
        <span>{item.bookingType ?? "공식 확인"}</span>
      </span>
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

function EventCard({ site, item }: { site: SiteConfig; item: InfoItem }) {
  return (
    <Link className="event-card" href={localPath(site, `/items/${item.slug}`)}>
      <div className="event-card-top">
        <span>{item.region}</span>
        <span>{item.category}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <BadgeList item={item} />
      <div className="event-card-foot">
        <span>{item.lastCheckedAt ?? item.updatedAt}</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}

function GuideTile({ site, guide }: { site: SiteConfig; guide: Guide }) {
  return (
    <Link className="event-guide-tile" href={localPath(site, `/guides/${guide.slug}`)}>
      <span>{guide.category}</span>
      <h3>{guide.title}</h3>
      <p>{guide.summary}</p>
      <ArrowRight size={16} />
    </Link>
  );
}

export function EventsHome({ site }: { site: SiteConfig }) {
  const deskItems = pickItems(site, [
    "gwanghwamun-square-weekend",
    "hangang-park-free-program",
    "busan-fireworks-guide",
    "seoul-book-fair-visit",
    "bexco-exhibition"
  ]);
  const freeItems = site.items.filter((item) => item.category === "무료 행사").slice(0, 8);
  const guides = pickGuides(site, [
    "event-rain-outdoor-decision",
    "free-family-event-check",
    "exhibition-ticket-compare",
    "festival-traffic-control",
    "night-event-return-plan",
    "event-cancel-update-source"
  ]);
  const regions = ["수도권", "부산·경남", "충청", "전라", "강원·제주"];

  return (
    <EventShell site={site}>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: publicUrl(site),
          description: site.description,
          potentialAction: {
            "@type": "SearchAction",
            target: publicUrl(site, "/search?q={search_term_string}"),
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <main>
        <section className="event-desk-hero">
          <div className="event-container">
            <div className="event-desk-head">
              <span className="event-kicker">
                <CalendarCheck2 size={18} />
                {eventsReviewDate} 편집 데스크
              </span>
              <h1>
                <span className="event-title-line">이번 주말 행사는</span>{" "}
                <span className="event-title-line">날짜보다 방문 조건부터</span>{" "}
                <span className="event-title-line">확인하세요.</span>
              </h1>
              <p>
                전국행사노트는 행사명을 추천하기 전에 예매 방식, 무료 범위, 우천 변경, 귀가 동선을 먼저 정리합니다.
                출발 직전 다시 봐야 할 공식 공지도 함께 남깁니다.
              </p>
            </div>

            <div className="event-finder">
              <div className="event-date-tabs" aria-label="날짜 기준">
                {["오늘", "이번 주", "이번 달", "우천 시"].map((tab, index) => (
                  <span key={tab} className={index === 1 ? "is-active" : undefined}>
                    {tab}
                  </span>
                ))}
              </div>
              <div className="event-region-row" aria-label="지역 기준">
                {regions.map((region) => (
                  <span key={region}>{region}</span>
                ))}
              </div>
              <SearchBox siteSlug={site.slug} placeholder={site.searchPlaceholder} />
            </div>

            <div className="event-live-grid">
              <section className="event-board" aria-label="이번 주 추천 행사">
                <div className="event-board-head">
                  <div>
                    <span>Weekend Board</span>
                    <h2>방문 전 다시 볼 행사 5개</h2>
                  </div>
                  <Link href={localPath(site, "/items")}>
                    전체 행사판 <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="event-schedule-list">
                  {deskItems.map((item, index) => (
                    <EventScheduleRow key={item.slug} site={site} item={item} index={index} />
                  ))}
                </div>
              </section>

              <aside className="event-operation-panel" aria-label="운영 점검">
                <div className="event-panel-block warning">
                  <Umbrella size={21} />
                  <strong>오늘의 주의</strong>
                  <p>야외 행사는 우천·폭염 공지가 출발 직전에 바뀔 수 있어 공식 채널 확인이 우선입니다.</p>
                </div>
                <div className="event-panel-block">
                  <ShieldCheck size={21} />
                  <strong>최근 확인</strong>
                  <p>무료 행사 카테고리를 0건에서 실제 공식 출처 기반 행사로 보강했습니다.</p>
                </div>
                <div className="event-status-list">
                  {["사전예매", "무료입장", "현장권", "우천확인", "교통통제"].map((status) => (
                    <span key={status}>{status}</span>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="event-section">
          <div className="event-container">
            <div className="event-section-head">
              <span>Free Picks</span>
              <h2>입장료보다 현장 조건을 먼저 보는 무료 행사</h2>
            </div>
            <div className="event-card-grid">
              {freeItems.map((item) => (
                <EventCard key={item.slug} site={site} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="event-section event-guide-section">
          <div className="event-container event-guide-layout">
            <div className="event-guide-copy">
              <span>Visit Rules</span>
              <h2>출발 전 10분을 줄이는 방문 기준</h2>
              <p>날씨, 예매, 교통, 아이 동반처럼 실제 현장에서 결과가 갈리는 기준만 따로 모았습니다.</p>
            </div>
            <div className="event-guide-grid">
              {guides.map((guide) => (
                <GuideTile key={guide.slug} site={site} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </EventShell>
  );
}

export function EventsItemsIndex({ site }: { site: SiteConfig }) {
  return (
    <EventShell site={site}>
      <main className="event-container event-index-page">
        <div className="event-page-title">
          <span>Event Board</span>
          <h1>행사판</h1>
          <p>행사명을 나열하지 않고 방문 전에 확인해야 할 예매, 비용, 교통, 날씨 기준을 함께 보여줍니다.</p>
        </div>
        <div className="event-card-grid">
          {site.items.map((item) => (
            <EventCard key={item.slug} site={site} item={item} />
          ))}
        </div>
      </main>
    </EventShell>
  );
}

export function EventsGuidesIndex({ site }: { site: SiteConfig }) {
  return (
    <EventShell site={site}>
      <main className="event-container event-index-page">
        <div className="event-page-title">
          <span>Visit Guides</span>
          <h1>방문 기준 가이드</h1>
          <p>행사 후기보다 먼저 확인해야 할 공식 공지, 예매, 날씨, 귀가 동선 기준을 정리했습니다.</p>
        </div>
        <div className="event-guide-grid wide">
          {site.guides.map((guide) => (
            <GuideTile key={guide.slug} site={site} guide={guide} />
          ))}
        </div>
      </main>
    </EventShell>
  );
}

export function EventsCategory({ site, label, items }: { site: SiteConfig; label: string; items: InfoItem[] }) {
  const regions = Array.from(new Set(items.map((item) => item.region))).slice(0, 8);
  return (
    <EventShell site={site}>
      <main className="event-container event-category-page">
        <div className="event-category-hero">
          <span>{label} 편집판</span>
          <h1>{label} 행사는 날짜, 이동, 현장 변수를 같이 봅니다.</h1>
          <p>
            {label} 카테고리에는 {items.length}개의 행사 노트가 있습니다. 지역과 방문 상황을 먼저 좁힌 뒤 공식
            출처에서 최신 공지를 다시 확인하세요.
          </p>
          <div className="event-region-row">
            {regions.map((region) => (
              <span key={region}>{region}</span>
            ))}
          </div>
        </div>
        <div className="event-category-layout">
          <aside className="event-filter-note">
            <strong>이 카테고리에서 먼저 볼 것</strong>
            <p>예매 방식, 무료 범위, 우천 공지, 귀가 동선은 같은 카테고리 안에서도 행사별로 다릅니다.</p>
            <Link href={localPath(site, "/sources")}>출처 확인 기준 보기</Link>
          </aside>
          <div className="event-card-grid compact">
            {items.map((item) => (
              <EventCard key={item.slug} site={site} item={item} />
            ))}
          </div>
        </div>
      </main>
    </EventShell>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) {
  return (
    <div className="event-fact">
      <span>{icon}</span>
      <small>{label}</small>
      <strong>{value ?? "공식 확인"}</strong>
    </div>
  );
}

export function EventsItemDetail({ site, item }: { site: SiteConfig; item: InfoItem }) {
  return (
    <EventShell site={site}>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.summary,
          dateModified: item.updatedAt,
          datePublished: item.updatedAt,
          author: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          publisher: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          mainEntityOfPage: publicUrl(site, `/items/${item.slug}`)
        }}
      />
      {item.eventSchema ? (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: item.title,
            startDate: item.eventSchema.startDate,
            endDate: item.eventSchema.endDate,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: item.eventSchema.locationName
            },
            organizer: {
              "@type": "Organization",
              name: item.source,
              url: item.sourceUrl
            }
          }}
        />
      ) : null}
      <main className="event-container event-report-page">
        <article className="event-report">
          <div className="event-report-head">
            <div>
              <BadgeList item={item} />
              <h1>{item.title}</h1>
              <p>{item.summary}</p>
            </div>
            <a className="event-source-button" href={item.sourceUrl} target="_blank" rel="noreferrer">
              공식 출처 확인 <ExternalLink size={16} />
            </a>
          </div>
          <div className="event-fact-grid">
            <Fact icon={<CalendarCheck2 size={19} />} label="일정 상태" value={item.eventDateStatus ?? item.period} />
            <Fact icon={<MapPinned size={19} />} label="장소" value={item.venue} />
            <Fact icon={<Ticket size={19} />} label="예매·입장" value={item.bookingType} />
            <Fact icon={<CloudRain size={19} />} label="날씨 변수" value={item.weatherRisk} />
            <Fact icon={<TrainFront size={19} />} label="교통" value={item.trafficNote} />
            <Fact icon={<CheckCircle2 size={19} />} label="확인일" value={item.lastCheckedAt ?? item.updatedAt} />
          </div>
          <div className="event-report-layout">
            <div className="event-content">
              <RichContent blocks={item.body} />
              <h2>자주 묻는 질문</h2>
              {item.faq.map((faq) => (
                <section key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </section>
              ))}
            </div>
            <aside className="event-detail-aside">
              <div className="event-aside-card">
                <strong>출발 전 체크</strong>
                {(item.keyChecks ?? []).map((check) => (
                  <span key={check}>{check}</span>
                ))}
              </div>
              <div className="event-aside-card">
                <strong>공식 링크</strong>
                {(item.officialLinks ?? item.sourceLinks ?? []).map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    {link.label} <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </article>
      </main>
    </EventShell>
  );
}

export function EventsGuideDetail({ site, guide }: { site: SiteConfig; guide: Guide }) {
  return (
    <EventShell site={site}>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          dateModified: guide.updatedAt,
          datePublished: guide.updatedAt,
          author: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          publisher: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          mainEntityOfPage: publicUrl(site, `/guides/${guide.slug}`)
        }}
      />
      <main className="event-container event-report-page">
        <article className="event-report guide">
          <div className="event-report-head">
            <div>
              <div className="event-badges">
                <span>{guide.category}</span>
                <span>{guide.readingTime ?? "6분 읽기"}</span>
              </div>
              <h1>{guide.title}</h1>
              <p>{guide.summary}</p>
            </div>
            <Link className="event-source-button" href={localPath(site, "/guides")}>
              가이드 전체 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="event-report-layout">
            <div className="event-content">
              <RichContent blocks={guide.body} />
            </div>
            <aside className="event-detail-aside">
              <div className="event-aside-card">
                <strong>적용 대상</strong>
                <p>{guide.audience}</p>
              </div>
              <div className="event-aside-card">
                <strong>체크 항목</strong>
                {(guide.keyChecks ?? []).map((check) => (
                  <span key={check}>{check}</span>
                ))}
              </div>
            </aside>
          </div>
        </article>
      </main>
    </EventShell>
  );
}
