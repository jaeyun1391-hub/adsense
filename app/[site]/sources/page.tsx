import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
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
    title: `출처 안내 - ${site.name}`,
    description: `${site.name}의 정보 출처와 업데이트 기준입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/sources"
    },
    openGraph: {
      title: `출처 안내 - ${site.name}`,
      description: `${site.name}의 정보 출처와 업데이트 기준입니다.`,
      url: publicUrl(site, "/sources"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function SourcesPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const sources = Array.from(new Map(site.items.map((item) => [item.sourceUrl, item])).values());

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>출처 안내</h1>
            <p>
              {site.name}은 공식 기관, 주관사, 공공 포털 등 공개적으로 확인 가능한 정보를 기준으로 내용을
              정리합니다. 단순 복사가 아니라 신청자와 방문자가 확인해야 할 조건, 준비물, 주의사항을 함께 설명합니다.
            </p>
            <h2>업데이트 기준</h2>
            <p>
              각 상세 페이지에는 업데이트일과 원문 출처를 표시합니다. 일정, 모집 여부, 이용 조건이 바뀔 수 있는
              정보는 운영자가 주기적으로 다시 확인하는 방식으로 관리합니다.
            </p>
            <h2>주요 출처</h2>
            <table className="info-table">
              <tbody>
                {sources.map((item) => (
                  <tr key={item.sourceUrl}>
                    <th>{item.source}</th>
                    <td>
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                        {item.sourceUrl} <ExternalLink size={13} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>정정 요청</h2>
            <p>
              오래된 정보나 잘못된 내용을 발견하면 contact@{site.domainHint} 로 원문 링크와 함께 알려주세요.
              확인 후 필요한 경우 페이지를 수정합니다.
            </p>
          </article>
          <aside className="notice">{site.disclaimer}</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
