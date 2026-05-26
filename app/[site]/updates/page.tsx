import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { updateLogItems } from "@/lib/site-depth-content";
import { getSite, sites, siteStyle } from "@/lib/sites";
import { publicUrl } from "@/lib/seo";
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
    title: `업데이트 기록 - ${site.name}`,
    description: `${site.name}의 최근 콘텐츠 점검 및 업데이트 기록입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/updates"
    },
    openGraph: {
      title: `업데이트 기록 - ${site.name}`,
      description: `${site.name}의 최근 콘텐츠 점검 및 업데이트 기록입니다.`,
      url: publicUrl(site, "/updates"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function UpdatesPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const recentItems = site.items.slice(0, 6);
  const updates = updateLogItems(site.slug);

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>업데이트 기록</h1>
            <p>
              이 페이지는 최근 어떤 기준으로 콘텐츠를 손본 것인지 남기는 운영 기록입니다. 단순히
              날짜만 바꾸지 않고, 사용자가 실제로 확인해야 하는 항목이 늘어났는지를 기준으로 기록합니다.
            </p>
            <h2>2026년 5월 26일 점검</h2>
            <ul>
              {updates.map((update) => (
                <li key={update}>{update}</li>
              ))}
            </ul>
            <h2>이번에 다시 확인한 대표 페이지</h2>
            <table className="info-table">
              <tbody>
                {recentItems.map((item) => (
                  <tr key={item.slug}>
                    <th>{item.category}</th>
                    <td>
                      <Link href={`/items/${item.slug}`}>{item.title}</Link>
                      <br />
                      <span className="muted">{item.source} · 업데이트 {item.updatedAt}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>다음 점검에서 보는 항목</h2>
            <p>
              일정이 지난 정보, 접수처나 운영기관이 바뀐 정보, 조건·요금·서류·운영시간이 달라진 정보를 우선
              확인합니다. 사용자가 정정 요청을 보내면 공식 원문을 확인한 뒤 필요한 부분을 반영합니다.
            </p>
          </article>
          <aside className="notice">
            정정 요청은 페이지 주소와 공식 출처를 함께 보내주세요.
            <br />
            <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>
          </aside>
        </main>
      </SiteChrome>
    </div>
  );
}
