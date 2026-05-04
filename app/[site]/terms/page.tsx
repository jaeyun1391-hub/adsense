import type { Metadata } from "next";
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
    title: `이용약관 - ${site.name}`,
    description: `${site.name} 이용약관입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/terms"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function TermsPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>이용약관</h1>
            <p>
              {site.name}은 공개 정보와 자체 해설을 제공하는 정보 서비스입니다. 사용자는 제공된 정보를 참고용으로
              활용할 수 있으며, 최종 판단과 신청은 공식 기관의 안내를 기준으로 해야 합니다.
            </p>
            <h2>정보의 정확성</h2>
            <p>{site.disclaimer}</p>
            <h2>외부 링크</h2>
            <p>사이트에는 공식 기관 또는 관련 서비스로 이동하는 외부 링크가 포함될 수 있습니다.</p>
            <h2>책임 제한</h2>
            <p>
              일정 변경, 접수 마감, 정책 변경, 시설 운영 변경 등으로 발생하는 결과에 대해 사이트는 법적 책임을
              지지 않습니다.
            </p>
          </article>
          <aside className="notice">시행일: 2026년 5월 4일</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
