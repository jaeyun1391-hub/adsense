import type { Metadata } from "next";
import { ItemCard } from "@/components/ItemCard";
import { SiteChrome } from "@/components/SiteChrome";
import { getSite, sites, siteStyle } from "@/lib/sites";
import { publicUrl, siteKeywords } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";

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
    title: `전체 목록 - ${site.name}`,
    description: `${site.name}의 전체 정보 목록입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/items"
    },
    keywords: siteKeywords(site),
    openGraph: {
      title: `전체 목록 - ${site.name}`,
      description: `${site.name}의 전체 정보 목록입니다.`,
      url: publicUrl(site, "/items"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function ItemsPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container list-layout">
          <aside className="sidebar">
            <strong>카테고리</strong>
            {site.categories.map((category) => (
              <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
                <span>{category}</span>
                <span>{site.items.filter((item) => item.category === category).length}</span>
              </Link>
            ))}
          </aside>
          <section>
            <div className="section-head">
              <div>
                <h1>전체 목록</h1>
                <p className="muted">{site.items.length}개의 핵심 정보를 확인할 수 있습니다.</p>
              </div>
            </div>
            <div className="grid two">
              {site.items.map((item) => (
                <ItemCard key={item.slug} site={site} item={item} />
              ))}
            </div>
          </section>
        </main>
      </SiteChrome>
    </div>
  );
}
