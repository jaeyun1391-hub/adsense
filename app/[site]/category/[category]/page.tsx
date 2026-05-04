import type { Metadata } from "next";
import { ItemCard } from "@/components/ItemCard";
import { SiteChrome } from "@/components/SiteChrome";
import { getSite, sites, siteStyle } from "@/lib/sites";
import { publicUrl, siteKeywords } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string; category: string }>;
};

export function generateStaticParams() {
  return sites.flatMap((site) => site.categories.map((category) => ({ site: site.slug, category })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug, category } = await params;
  const site = getSite(slug);
  if (!site) return {};
  const label = decodeURIComponent(category);
  return {
    title: `${label} - ${site.name}`,
    description: `${site.name}의 ${label} 카테고리 정보입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: `/category/${encodeURIComponent(label)}`
    },
    keywords: [label, ...siteKeywords(site)],
    openGraph: {
      title: `${label} - ${site.name}`,
      description: `${site.name}의 ${label} 카테고리 정보입니다.`,
      url: publicUrl(site, `/category/${encodeURIComponent(label)}`),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { site: slug, category } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const label = decodeURIComponent(category);
  const items = site.items.filter((item) => item.category === label);

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container list-layout">
          <aside className="sidebar">
            <strong>{site.name}</strong>
            {site.categories.map((categoryItem) => (
              <a key={categoryItem} href={`/${site.slug}/category/${categoryItem}`}>
                <span>{categoryItem}</span>
                <span>{site.items.filter((item) => item.category === categoryItem).length}</span>
              </a>
            ))}
          </aside>
          <section>
            <div className="section-head">
              <div>
                <h1>{label}</h1>
                <p className="muted">{items.length}개의 정보를 정리했습니다.</p>
              </div>
            </div>
            <div className="grid two">
              {items.map((item) => (
                <ItemCard key={item.slug} site={site} item={item} />
              ))}
            </div>
            {items.length === 0 ? <p className="notice">이 카테고리는 운영 데이터 추가가 필요합니다.</p> : null}
          </section>
        </main>
      </SiteChrome>
    </div>
  );
}
