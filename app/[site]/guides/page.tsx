import type { Metadata } from "next";
import { EventsGuidesIndex } from "@/components/EventsPlatform";
import { GuideCard } from "@/components/GuideCard";
import { SiteChrome } from "@/components/SiteChrome";
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
    title: `가이드 - ${site.name}`,
    description: `${site.name}의 초보자 가이드 모음입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/guides"
    },
    keywords: ["가이드", ...siteKeywords(site)],
    openGraph: {
      title: `가이드 - ${site.name}`,
      description: `${site.name}의 초보자 가이드 모음입니다.`,
      url: publicUrl(site, "/guides"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function GuidesPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  if (site.slug === "events") {
    return <EventsGuidesIndex site={site} />;
  }

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container list-layout">
          <aside className="sidebar">
            <strong>가이드 주제</strong>
            {site.guides.map((guide) => (
              <a key={guide.slug} href={`/guides/${guide.slug}`}>
                <span>{guide.category}</span>
              </a>
            ))}
          </aside>
          <section>
            <div className="section-head">
              <div>
                <h1>가이드</h1>
                <p className="muted">{site.name} 이용자가 처음 확인하면 좋은 설명 콘텐츠입니다.</p>
              </div>
            </div>
            <div className="grid two">
              {site.guides.map((guide) => (
                <GuideCard key={guide.slug} site={site} guide={guide} />
              ))}
            </div>
          </section>
        </main>
      </SiteChrome>
    </div>
  );
}
