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
    title: `개인정보처리방침 - ${site.name}`,
    description: `${site.name} 개인정보처리방침입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/privacy"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>개인정보처리방침</h1>
            <p>{site.name}은 현재 회원가입 없이 공개 정보를 제공하며, 문의 처리에 필요한 최소 정보만 수집합니다.</p>
            <h2>수집 항목</h2>
            <p>문의자가 이메일로 제공한 이름, 이메일 주소, 문의 내용이 수집될 수 있습니다.</p>
            <h2>이용 목적</h2>
            <p>문의 응대, 정보 정정 확인, 서비스 개선을 위한 목적으로만 사용합니다.</p>
            <h2>보관 기간</h2>
            <p>문의 처리 완료 후 필요한 기간 동안 보관한 뒤 파기합니다. 법령상 보관 의무가 있는 경우 해당 기간을 따릅니다.</p>
            <h2>광고와 분석</h2>
            <p>
              향후 광고 또는 방문 통계 도구가 적용될 수 있으며, 이 경우 관련 고지와 선택권을 제공하도록 운영합니다.
            </p>
          </article>
          <aside className="notice">시행일: 2026년 5월 4일</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
