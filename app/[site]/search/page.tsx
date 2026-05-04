import type { Metadata } from "next";
import { ItemCard } from "@/components/ItemCard";
import { SearchBox } from "@/components/SearchBox";
import { SiteChrome } from "@/components/SiteChrome";
import { getSite, sites, siteStyle } from "@/lib/sites";
import { publicUrl } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string }>;
  searchParams: Promise<{ q?: string }>;
};

export function generateStaticParams() {
  return sites.map((site) => ({ site: site.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) return {};
  return {
    title: `검색 - ${site.name}`,
    description: `${site.name}에서 필요한 정보를 검색합니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/search"
    },
    robots: {
      index: false,
      follow: true
    }
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { site: slug } = await params;
  const { q = "" } = await searchParams;
  const site = getSite(slug);
  if (!site) notFound();

  const normalized = q.trim().toLowerCase();
  const items = normalized
    ? site.items.filter((item) =>
        [item.title, item.summary, item.category, item.region, item.source, ...item.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      )
    : site.items;

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container list-layout">
          <aside className="sidebar">
            <strong>검색</strong>
            <p className="muted">사이트 내부 콘텐츠를 제목, 요약, 태그 기준으로 찾습니다.</p>
          </aside>
          <section className="stack">
            <div className="search-panel">
              <SearchBox siteSlug={site.slug} placeholder={site.searchPlaceholder} />
            </div>
            <div className="section-head">
              <div>
                <h1>검색 결과</h1>
                <p className="muted">
                  {q ? `"${q}" 검색 결과 ${items.length}건` : `전체 ${items.length}건`}
                </p>
              </div>
            </div>
            <div className="grid two">
              {items.map((item) => (
                <ItemCard key={item.slug} site={site} item={item} />
              ))}
            </div>
            {items.length === 0 ? <p className="notice">검색 결과가 없습니다. 다른 키워드로 다시 찾아보세요.</p> : null}
          </section>
        </main>
      </SiteChrome>
    </div>
  );
}
