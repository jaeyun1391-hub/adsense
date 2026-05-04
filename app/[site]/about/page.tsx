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
    title: `소개 - ${site.name}`,
    description: site.identity,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/about"
    },
    openGraph: {
      title: `소개 - ${site.name}`,
      description: site.identity,
      url: publicUrl(site, "/about"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function AboutPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>{site.name} 소개</h1>
            <p>{site.identity}</p>
            <p>
              이 사이트는 사용자가 흩어진 공지와 안내를 더 쉽게 이해하도록 돕는 정보형 서비스입니다. 단순한
              링크 모음이 아니라 확인해야 할 조건, 준비 서류, 방문 전 주의사항, 공식 출처를 함께 제공합니다.
            </p>
            <h2>편집 원칙</h2>
            <p>
              공식 기관의 공개 정보를 기준으로 요약하고, 운영자가 이해를 돕는 설명과 체크리스트를 더합니다.
              변경 가능성이 있는 정보는 업데이트일과 출처를 함께 표시합니다.
            </p>
            <h2>문의</h2>
            <p>정보 정정, 제휴, 문의는 운영자 이메일 contact@{site.domainHint} 로 보내주세요.</p>
          </article>
          <aside className="notice">{site.disclaimer}</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
