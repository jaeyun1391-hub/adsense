import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ExamItemDetail } from "@/components/ExamPlatform";
import { EventsItemDetail } from "@/components/EventsPlatform";
import { HousingItemDetail } from "@/components/HousingPlatform";
import { RichContent } from "@/components/RichContent";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { getItem, getSite, sites, siteStyle } from "@/lib/sites";
import { publicUrl } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string; item: string }>;
};

export function generateStaticParams() {
  return sites.flatMap((site) => site.items.map((item) => ({ site: site.slug, item: item.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug, item: itemSlug } = await params;
  const site = getSite(slug);
  if (!site) return {};
  const item = getItem(site, itemSlug);
  if (!item) return {};

  return {
    title: `${item.title} - ${site.name}`,
    description: item.summary,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: `/items/${item.slug}`
    },
    keywords: [item.title, item.category, item.region, ...item.tags],
    openGraph: {
      title: item.title,
      description: item.summary,
      url: publicUrl(site, `/items/${item.slug}`),
      siteName: site.name,
      locale: "ko_KR",
      type: "article"
    }
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { site: slug, item: itemSlug } = await params;
  const site = getSite(slug);
  if (!site) notFound();
  const item = getItem(site, itemSlug);
  if (!item) notFound();

  if (site.slug === "housing") {
    return <HousingItemDetail site={site} item={item} />;
  }

  if (site.slug === "events") {
    return <EventsItemDetail site={site} item={item} />;
  }

  if (site.slug === "exam") {
    return <ExamItemDetail site={site} item={item} />;
  }

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
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
                name: item.category,
                item: publicUrl(site, `/category/${encodeURIComponent(item.category)}`)
              },
              {
                "@type": "ListItem",
                position: 3,
                name: item.title,
                item: publicUrl(site, `/items/${item.slug}`)
              }
            ]
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
        <main className="container detail-layout">
          <article className="detail-panel">
            <div className="tag-row">
              <Link className="tag" href={`/category/${encodeURIComponent(item.category)}`}>
                {item.category}
              </Link>
              <span className="tag">{item.region}</span>
              <span className="tag">업데이트 {item.updatedAt}</span>
            </div>
            <h1>{item.title}</h1>
            <p className="lead">{item.summary}</p>
            <p className="editor-note">
              작성·검토: {site.name} 편집팀 · 검토 기준일 {item.updatedAt} · 기준 출처: {item.source}
            </p>

            <table className="info-table">
              <tbody>
                <tr>
                  <th>기간</th>
                  <td>{item.period}</td>
                </tr>
                <tr>
                  <th>출처</th>
                  <td>
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                      {item.source} <ExternalLink size={13} />
                    </a>
                  </td>
                </tr>
                {Object.entries(item.details).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="content">
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
          <aside className="stack">
            <div className="notice">
              <strong>공식 출처 확인</strong>
              <p>
                이 페이지는 사용자가 공고나 일정을 빠르게 이해하도록 돕는 요약입니다. 신청, 접수, 방문 전에는
                공식 기관의 최신 공지를 확인하세요.
              </p>
              <a className="button" href={item.sourceUrl} target="_blank" rel="noreferrer">
                공식 페이지 확인 <ExternalLink size={15} />
              </a>
            </div>
            <div className="sidebar">
              <strong>관련 태그</strong>
              {item.tags.map((tag) => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                  <span>{tag}</span>
                </Link>
              ))}
            </div>
          </aside>
        </main>
      </SiteChrome>
    </div>
  );
}
