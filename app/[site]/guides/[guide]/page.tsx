import type { Metadata } from "next";
import { RichContent } from "@/components/RichContent";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { getGuide, getSite, sites, siteStyle } from "@/lib/sites";
import { publicUrl } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string; guide: string }>;
};

export function generateStaticParams() {
  return sites.flatMap((site) => site.guides.map((guide) => ({ site: site.slug, guide: guide.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug, guide: guideSlug } = await params;
  const site = getSite(slug);
  if (!site) return {};
  const guide = getGuide(site, guideSlug);
  if (!guide) return {};

  return {
    title: `${guide.title} - ${site.name}`,
    description: guide.summary,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: `/guides/${guide.slug}`
    },
    keywords: [guide.title, guide.category, site.name, "가이드", "체크리스트"],
    openGraph: {
      title: guide.title,
      description: guide.summary,
      url: publicUrl(site, `/guides/${guide.slug}`),
      siteName: site.name,
      locale: "ko_KR",
      type: "article"
    }
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { site: slug, guide: guideSlug } = await params;
  const site = getSite(slug);
  if (!site) notFound();
  const guide = getGuide(site, guideSlug);
  if (!guide) notFound();

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
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
            }
          }}
        />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: site.name,
                item: publicUrl(site)
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "가이드",
                item: publicUrl(site, "/guides")
              },
              {
                "@type": "ListItem",
                position: 3,
                name: guide.title,
                item: publicUrl(site, `/guides/${guide.slug}`)
              }
            ]
          }}
        />
        <main className="container detail-layout">
          <article className="detail-panel">
            <div className="tag-row">
              <span className="tag">{guide.category}</span>
              <span className="tag">업데이트 {guide.updatedAt}</span>
            </div>
            <h1>{guide.title}</h1>
            <p className="lead">{guide.summary}</p>
            <p className="editor-note">
              작성·검토: {site.name} 편집팀 · 검토 기준일 {guide.updatedAt} · 해석 기준: 공식 출처와 이용자
              확인 순서
            </p>
            <div className="content">
              <RichContent blocks={guide.body} />
              <h2>운영 메모</h2>
              <p>
                이 가이드는 사용자가 정보를 해석하는 기준을 제공하기 위한 자체 콘텐츠입니다. 세부 조건이나 일정은
                공식 출처를 기준으로 다시 확인해야 합니다.
              </p>
            </div>
          </article>
          <aside className="notice">
            <strong>{site.name}</strong>
            <p>{site.identity}</p>
            <p>{site.disclaimer}</p>
          </aside>
        </main>
      </SiteChrome>
    </div>
  );
}
