import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, FileText, ShieldCheck } from "lucide-react";
import { GuideCard } from "@/components/GuideCard";
import { ItemCard } from "@/components/ItemCard";
import { SearchBox } from "@/components/SearchBox";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { getSite, sites, siteStyle } from "@/lib/sites";
import { publicUrl, siteKeywords } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string }>;
};

export function generateStaticParams() {
  return sites.map((site) => ({ site: site.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) return {};

  return {
    title: `${site.name} - ${site.headline}`,
    description: site.description,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/"
    },
    keywords: siteKeywords(site),
    openGraph: {
      title: site.name,
      description: site.description,
      url: publicUrl(site),
      siteName: site.name,
      locale: "ko_KR",
      type: "website"
    }
  };
}

export default async function SiteHome({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const featured = site.items.slice(0, 3);
  const latest = site.items.slice(2, 5);

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
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
              contactType: "customer support",
              email: `contact@${site.domainHint}`,
              availableLanguage: "Korean"
            }
          }}
        />
        <main>
          <section className="hero">
            <div className="container hero-grid">
              <div>
                <span className="eyebrow">
                  <ShieldCheck size={16} />
                  {site.domainHint}
                </span>
                <h1>{site.headline}</h1>
                <p className="lead">{site.description}</p>
                <div className="quick-links">
                  {site.categories.map((category) => (
                    <Link key={category} className="chip" href={`/${site.slug}/category/${category}`}>
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              <aside className="search-panel" aria-label="검색과 요약">
                <SearchBox siteSlug={site.slug} placeholder={site.searchPlaceholder} />
                <div className="stats">
                  {site.stats.map((stat) => (
                    <div key={stat.label} className="stat">
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div className="visual-band" style={{ marginTop: 18 }}>
                  <strong>{site.visualText}</strong>
                </div>
              </aside>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-head">
                <div>
                  <h2>마감과 확인이 필요한 정보</h2>
                  <p>신청, 예약, 접수 전에 먼저 확인할 항목입니다.</p>
                </div>
                <Link className="button secondary" href={`/${site.slug}/items`}>
                  전체 보기 <ArrowRight size={15} />
                </Link>
              </div>
              <div className="grid">
                {featured.map((item) => (
                  <ItemCard key={item.slug} site={site} item={item} />
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-head">
                <div>
                  <h2>최근 업데이트</h2>
                  <p>공식 출처와 함께 검토한 최신 정리입니다.</p>
                </div>
              </div>
              <div className="grid">
                {latest.map((item) => (
                  <ItemCard key={item.slug} site={site} item={item} />
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-head">
                <div>
                  <h2>처음 보는 사람을 위한 가이드</h2>
                  <p>단순 목록이 아니라 판단 기준을 함께 제공합니다.</p>
                </div>
                <Link className="button secondary" href={`/${site.slug}/guides`}>
                  가이드 전체 <FileText size={15} />
                </Link>
              </div>
              <div className="grid two">
                {site.guides.map((guide) => (
                  <GuideCard key={guide.slug} site={site} guide={guide} />
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container notice">
              <Clock size={16} /> 업데이트 기준일은 2026년 5월 4일입니다. 사이트 공개 전 실제 운영 데이터로 확장하고,
              각 상세 페이지의 공식 링크를 재확인하는 흐름으로 운영하는 것을 권장합니다.
            </div>
          </section>
        </main>
      </SiteChrome>
    </div>
  );
}
