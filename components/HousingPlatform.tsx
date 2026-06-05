import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Home,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  WalletCards
} from "lucide-react";
import { RichContent } from "@/components/RichContent";
import { SearchBox } from "@/components/SearchBox";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import {
  housingCategoryMeta,
  housingNextReviewDate,
  housingPickGuides,
  housingPickItems,
  housingPillars,
  housingReviewDate,
  housingSourceGroups
} from "@/lib/housing-platform-content";
import { publicUrl } from "@/lib/seo";
import type { Guide, InfoItem, SiteConfig } from "@/lib/sites";
import { siteStyle } from "@/lib/sites";

function housingTone(categoryOrTone?: string) {
  const value = categoryOrTone ?? "";
  if (value.includes("월세") || value === "rent") return "rent";
  if (value.includes("전세") || value.includes("보증금") || value === "deposit") return "deposit";
  if (value.includes("임대") || value === "home") return "home";
  if (value.includes("지역") || value === "map") return "map";
  return "docs";
}

function ToneIcon({ tone, size }: { tone: string; size: number }) {
  if (tone === "rent") return <WalletCards size={size} strokeWidth={1.7} />;
  if (tone === "deposit") return <Landmark size={size} strokeWidth={1.7} />;
  if (tone === "home") return <Home size={size} strokeWidth={1.7} />;
  if (tone === "map") return <MapPin size={size} strokeWidth={1.7} />;
  return <ClipboardCheck size={size} strokeWidth={1.7} />;
}

function HousingThumb({ tone, label }: { tone?: string; label: string }) {
  const normalized = housingTone(tone);
  return (
    <div className={`money-thumb money-thumb-${normalized}`} aria-hidden="true">
      <span>{label}</span>
      <ToneIcon tone={normalized} size={40} />
    </div>
  );
}

function MoneyItemCard({ item, featured = false }: { item: InfoItem; featured?: boolean }) {
  return (
    <Link className={`money-card ${featured ? "money-card-featured" : ""}`} href={`/items/${item.slug}`}>
      <HousingThumb tone={item.thumbnail ?? item.category} label={item.category} />
      <div className="money-card-body">
        <div className="money-mini-meta">
          <span>{item.category}</span>
          <span>{item.readingTime ?? "검토 리포트"}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="money-card-foot">
          <span>검토일 {item.updatedAt}</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}

function MoneyGuideCard({ guide }: { guide: Guide }) {
  return (
    <Link className="money-guide-card" href={`/guides/${guide.slug}`}>
      <div className="money-guide-icon">
        <BookOpenCheck size={20} />
      </div>
      <div>
        <div className="money-mini-meta">
          <span>{guide.category}</span>
          <span>{guide.readingTime ?? "가이드"}</span>
        </div>
        <h3>{guide.title}</h3>
        <p>{guide.summary}</p>
      </div>
      <ArrowRight className="money-guide-arrow" size={17} />
    </Link>
  );
}

function HousingShell({ site, children }: { site: SiteConfig; children: ReactNode }) {
  return (
    <div className="money-platform" style={siteStyle(site)}>
      <SiteChrome site={site}>{children}</SiteChrome>
    </div>
  );
}

function ReviewBadge() {
  return (
    <div className="money-review-badge">
      <ShieldCheck size={17} />
      <span>검토일 {housingReviewDate}</span>
      <span>다음 검토 {housingNextReviewDate}</span>
    </div>
  );
}

function HousingSourceRail() {
  return (
    <div className="money-source-grid">
      {housingSourceGroups().map((group) => (
        <section key={group.title} className="money-source-group">
          <h3>{group.title}</h3>
          {group.links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <ExternalLink size={14} />
            </a>
          ))}
        </section>
      ))}
    </div>
  );
}

function relatedItems(site: SiteConfig, currentSlug: string, category: string) {
  return site.items.filter((item) => item.slug !== currentSlug && item.category === category).slice(0, 3);
}

export function HousingHome({ site }: { site: SiteConfig }) {
  const pillars = housingPillars(site);
  const featured = housingPickItems(site, [
    "youth-rent-overview",
    "deposit-loan-overview",
    "public-rental-overview",
    "housing-documents-basic"
  ]);
  const reviewed = housingPickItems(site, [
    "monthly-rent-transfer-history",
    "rent-contract-name-check",
    "hug-guarantee-before-contract",
    "bank-visit-document-pack",
    "registered-address-before-apply",
    "support-rejected-next-step"
  ]);
  const guides = housingPickGuides(site, [
    "youth-rent-pillar",
    "jeonse-loan-pillar",
    "public-rental-pillar",
    "document-pack-pillar"
  ]);
  const fallbackFeatured = featured.length ? featured : site.items.slice(0, 4);
  const fallbackReviewed = reviewed.length ? reviewed : site.items.slice(4, 10);

  return (
    <HousingShell site={site}>
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
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: publicUrl(site),
          description: site.identity,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "editorial desk",
            email: `contact@${site.domainHint}`,
            availableLanguage: "Korean"
          }
        }}
      />
      <main>
        <section className="money-hero">
          <div className="container money-hero-grid">
            <div className="money-hero-copy">
              <ReviewBadge />
              <h1>내 상황에 맞는 청년 주거지원을 먼저 좁혀보세요</h1>
              <p>
                money1000.co.kr은 월세지원, 전세·보증금, 임대주택, 서류·계약 정보를 신청자 기준으로 다시
                검토하는 주거지원 허브입니다. 조건을 단정하지 않고, 공식 공고를 읽기 전 확인 순서를 제공합니다.
              </p>
              <div className="money-search-panel">
                <SearchBox siteSlug={site.slug} placeholder={site.searchPlaceholder} />
                <span>
                  <Search size={14} />
                  예: 월세 이체내역, 전입신고, 전세 보증, LH 청년
                </span>
              </div>
            </div>
            <div className="money-hero-board" aria-label="주거지원 검토 현황">
              <div className="money-board-top">
                <span>Housing Desk</span>
                <strong>지원 전 점검표</strong>
              </div>
              {[
                ["거주지", "등본·계약서 주소 일치"],
                ["소득", "본인·가구 기준 분리"],
                ["계약", "보증금·월세·기간 확인"],
                ["출처", "공식 공고와 상담 창구 확인"]
              ].map(([label, text]) => (
                <div key={label} className="money-board-row">
                  <span>{label}</span>
                  <strong>{text}</strong>
                  <CheckCircle2 size={18} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="money-section money-path-section">
          <div className="container">
            <div className="money-section-head">
              <div>
                <span>Situation Paths</span>
                <h2>신청자가 가장 먼저 갈라지는 4개 경로</h2>
              </div>
              <Link className="money-text-link" href="/items">
                전체 글 보기 <ArrowRight size={15} />
              </Link>
            </div>
            <div className="money-path-grid">
              {pillars.map((pillar) => {
                return (
                  <Link key={pillar.title} className={`money-path-card money-path-${pillar.tone}`} href={pillar.href}>
                    <div>
                      <span>{pillar.eyebrow}</span>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.description}</p>
                    </div>
                    <ToneIcon tone={pillar.tone} size={36} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="money-section">
          <div className="container">
            <div className="money-section-head">
              <div>
                <span>Essential Reports</span>
                <h2>처음 방문자가 먼저 읽을 핵심 리포트</h2>
              </div>
            </div>
            <div className="money-feature-grid">
              {fallbackFeatured.map((item) => (
                <MoneyItemCard key={item.slug} item={item} featured />
              ))}
            </div>
          </div>
        </section>

        <section className="money-section money-rail-section">
          <div className="container">
            <div className="money-section-head">
              <div>
                <span>Recently Reviewed</span>
                <h2>최근 다시 점검한 실무형 주제</h2>
              </div>
              <ReviewBadge />
            </div>
            <div className="money-horizontal-rail">
              {fallbackReviewed.map((item) => (
                <MoneyItemCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="money-section">
          <div className="container money-guide-layout">
            <div>
              <div className="money-section-head compact">
                <div>
                  <span>Guides</span>
                  <h2>공고를 읽기 전 필요한 기준 가이드</h2>
                </div>
              </div>
              <div className="money-guide-list">
                {(guides.length ? guides : site.guides.slice(0, 4)).map((guide) => (
                  <MoneyGuideCard key={guide.slug} guide={guide} />
                ))}
              </div>
            </div>
            <aside className="money-faq-panel">
              <span>자주 헷갈리는 질문</span>
              <h2>선정 가능성을 단정하지 않는 이유</h2>
              <p>
                주거지원은 공고, 접수 시점, 거주지, 소득 산정 방식, 기존 수혜 여부가 함께 작동합니다. 그래서
                이 사이트는 “가능”보다 “확인 순서”를 먼저 보여줍니다.
              </p>
              <ul>
                <li>신청 가능성과 최종 선정은 다를 수 있습니다.</li>
                <li>월세지원은 납부 증빙과 주소 기준을 함께 봐야 합니다.</li>
                <li>전세대출은 계약 전 보증 가능성을 먼저 확인해야 합니다.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="money-section">
          <div className="container">
            <div className="money-section-head">
              <div>
                <span>Official Sources</span>
                <h2>공식 출처 묶음</h2>
              </div>
              <Link className="money-text-link" href="/sources">
                출처 기준 보기 <ArrowRight size={15} />
              </Link>
            </div>
            <HousingSourceRail />
          </div>
        </section>
      </main>
    </HousingShell>
  );
}

export function HousingCategory({
  site,
  label,
  items,
  categoryBlocks
}: {
  site: SiteConfig;
  label: string;
  items: InfoItem[];
  categoryBlocks: string[];
}) {
  const meta = housingCategoryMeta(label);
  const relatedGuides = site.guides
    .filter((guide) => guide.category === label || guide.title.includes(label.slice(0, 2)))
    .slice(0, 4);

  return (
    <HousingShell site={site}>
      <main className="container money-category">
        <aside className="money-category-nav">
          <strong>주거지원 경로</strong>
          {site.categories.map((category) => (
            <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
              <span>{category}</span>
              <span>{site.items.filter((item) => item.category === category).length}</span>
            </Link>
          ))}
        </aside>
        <section className="money-category-main">
          <div className="money-category-hero">
            <span>{meta.kicker}</span>
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
            <ReviewBadge />
          </div>

          <div className="money-check-strip">
            {meta.checklist.map((check) => (
              <div key={check}>
                <CheckCircle2 size={17} />
                <span>{check}</span>
              </div>
            ))}
          </div>

          {categoryBlocks.length ? (
            <article className="money-brief content">
              <RichContent blocks={categoryBlocks} />
            </article>
          ) : null}

          <div className="money-section-head">
            <div>
              <span>Category Reports</span>
              <h2>{label} 상세 글</h2>
            </div>
          </div>
          <div className="money-list-grid">
            {items.map((item) => (
              <MoneyItemCard key={item.slug} item={item} />
            ))}
          </div>

          {relatedGuides.length ? (
            <>
              <div className="money-section-head money-related-head">
                <div>
                  <span>Related Guides</span>
                  <h2>같이 읽을 가이드</h2>
                </div>
              </div>
              <div className="money-guide-list">
                {relatedGuides.map((guide) => (
                  <MoneyGuideCard key={guide.slug} guide={guide} />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </main>
    </HousingShell>
  );
}

export function HousingItemDetail({ site, item }: { site: SiteConfig; item: InfoItem }) {
  const sources = item.sourceLinks?.length ? item.sourceLinks : [{ label: item.source, url: item.sourceUrl }];
  const related = relatedItems(site, item.slug, item.category);

  return (
    <HousingShell site={site}>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.summary,
          dateModified: item.updatedAt,
          datePublished: item.updatedAt,
          author: {
            "@type": "Organization",
            name: site.name,
            url: publicUrl(site)
          },
          publisher: {
            "@type": "Organization",
            name: site.name,
            url: publicUrl(site)
          },
          mainEntityOfPage: publicUrl(site, `/items/${item.slug}`)
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: item.faq.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
        }}
      />
      <main className="container money-detail">
        <article className="money-report">
          <div className="money-report-hero">
            <div>
              <div className="money-mini-meta">
                <Link href={`/category/${encodeURIComponent(item.category)}`}>{item.category}</Link>
                <span>{item.region}</span>
                <span>{item.readingTime ?? "검토 리포트"}</span>
              </div>
              <h1>{item.title}</h1>
              <p>{item.summary}</p>
            </div>
            <HousingThumb tone={item.thumbnail ?? item.category} label={item.category} />
          </div>

          <div className="money-summary-grid">
            <div>
              <span>검토일</span>
              <strong>{item.updatedAt}</strong>
            </div>
            <div>
              <span>다음 검토</span>
              <strong>{item.nextReviewAt ?? housingNextReviewDate}</strong>
            </div>
            <div>
              <span>공식 출처</span>
              <strong>{item.source}</strong>
            </div>
          </div>

          <section className="money-target-box">
            <h2>이 글을 먼저 보면 좋은 사람</h2>
            <p>{item.audience}</p>
            <ul>
              {(item.keyChecks ?? []).slice(0, 5).map((check) => (
                <li key={check}>
                  <CheckCircle2 size={16} />
                  {check}
                </li>
              ))}
            </ul>
          </section>

          <table className="info-table money-info-table">
            <tbody>
              <tr>
                <th>신청·확인 기간</th>
                <td>{item.period}</td>
              </tr>
              {Object.entries(item.details).map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="content money-content">
            <RichContent blocks={item.body} />
            <h2>자주 묻는 질문</h2>
            {item.faq.map((faq) => (
              <section key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </section>
            ))}
            <h2>확인 안내</h2>
            <p>{site.disclaimer}</p>
          </div>
        </article>

        <aside className="money-detail-aside">
          <section className="money-aside-card">
            <CalendarDays size={18} />
            <h2>운영 검토 메모</h2>
            <p>
              이 글은 {site.name} 편집 기준에 따라 공식 출처, 신청 전 체크포인트, 보완 사례를 분리해 정리했습니다.
            </p>
            <p>최종 판단은 운영기관의 최신 공고와 상담 창구를 기준으로 확인해야 합니다.</p>
          </section>
          <section className="money-aside-card">
            <h2>공식 출처</h2>
            {sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                <span>{source.label}</span>
                <ExternalLink size={14} />
              </a>
            ))}
          </section>
          {related.length ? (
            <section className="money-aside-card">
              <h2>관련 글</h2>
              {related.map((relatedItem) => (
                <Link key={relatedItem.slug} href={`/items/${relatedItem.slug}`}>
                  <span>{relatedItem.title}</span>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </section>
          ) : null}
        </aside>
      </main>
    </HousingShell>
  );
}

export function HousingGuideDetail({ site, guide }: { site: SiteConfig; guide: Guide }) {
  const sources = guide.sourceLinks?.length
    ? guide.sourceLinks
    : [
        { label: "마이홈 주거복지", url: "https://www.myhome.go.kr/" },
        { label: "정부24", url: "https://www.gov.kr/" }
      ];

  return (
    <HousingShell site={site}>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          dateModified: guide.updatedAt,
          datePublished: guide.updatedAt,
          author: {
            "@type": "Organization",
            name: site.name,
            url: publicUrl(site)
          },
          publisher: {
            "@type": "Organization",
            name: site.name,
            url: publicUrl(site)
          },
          mainEntityOfPage: publicUrl(site, `/guides/${guide.slug}`)
        }}
      />
      <main className="container money-detail">
        <article className="money-report">
          <div className="money-report-hero guide">
            <div>
              <div className="money-mini-meta">
                <Link href="/guides">가이드</Link>
                <span>{guide.category}</span>
                <span>{guide.readingTime ?? "기준 가이드"}</span>
              </div>
              <h1>{guide.title}</h1>
              <p>{guide.summary}</p>
            </div>
            <HousingThumb tone={guide.thumbnail ?? guide.category} label={guide.category} />
          </div>
          <div className="money-summary-grid">
            <div>
              <span>검토일</span>
              <strong>{guide.updatedAt}</strong>
            </div>
            <div>
              <span>다음 검토</span>
              <strong>{guide.nextReviewAt ?? housingNextReviewDate}</strong>
            </div>
            <div>
              <span>성격</span>
              <strong>신청 전 기준 가이드</strong>
            </div>
          </div>
          <section className="money-target-box">
            <h2>이 가이드에서 확인할 것</h2>
            <ul>
              {(guide.keyChecks ?? ["신청 전 확인 순서", "서류 보완 포인트", "공식 출처 확인"]).map((check) => (
                <li key={check}>
                  <CheckCircle2 size={16} />
                  {check}
                </li>
              ))}
            </ul>
          </section>
          <div className="content money-content">
            <RichContent blocks={guide.body} />
            <h2>운영 메모</h2>
            <p>
              이 가이드는 특정 지원의 선정이나 대출 실행을 보장하지 않습니다. 사용자가 공고를 읽을 때 필요한 기준과
              질문을 정리하는 자체 해설이며, 최종 조건은 공식 출처와 상담 창구를 통해 확인해야 합니다.
            </p>
          </div>
        </article>
        <aside className="money-detail-aside">
          <section className="money-aside-card">
            <FileText size={18} />
            <h2>편집 기준</h2>
            <p>공고 원문, 민원서류 발급 경로, 주거복지 공식 채널을 우선 확인합니다.</p>
          </section>
          <section className="money-aside-card">
            <h2>참고 출처</h2>
            {sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                <span>{source.label}</span>
                <ExternalLink size={14} />
              </a>
            ))}
          </section>
        </aside>
      </main>
    </HousingShell>
  );
}
