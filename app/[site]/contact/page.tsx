import type { Metadata } from "next";
import { Mail } from "lucide-react";
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
    title: `문의하기 - ${site.name}`,
    description: `${site.name} 운영자 문의와 정보 정정 요청 안내입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/contact"
    },
    openGraph: {
      title: `문의하기 - ${site.name}`,
      description: `${site.name} 운영자 문의와 정보 정정 요청 안내입니다.`,
      url: publicUrl(site, "/contact"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function ContactPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>문의하기</h1>
            <p>
              {site.name}에 대한 정보 정정, 출처 추가, 제휴 문의, 운영 관련 의견을 받을 수 있는 연락 창구입니다.
            </p>
            <h2>운영자 이메일</h2>
            <p>
              <a className="button secondary" href={`mailto:contact@${site.domainHint}`}>
                <Mail size={15} />
                contact@{site.domainHint}
              </a>
            </p>
            <h2>정정 요청 시 포함할 내용</h2>
            <p>페이지 주소, 수정이 필요한 문장, 확인 가능한 공식 출처 링크를 함께 보내주시면 검토가 빠릅니다.</p>
            <h2>답변 기준</h2>
            <p>
              모든 문의에 즉시 답변하기는 어렵지만, 정보 정확성과 이용자 안전에 관련된 내용은 우선 확인합니다.
            </p>
          </article>
          <aside className="notice">
            <strong>{site.name}</strong>
            <p>{site.identity}</p>
          </aside>
        </main>
      </SiteChrome>
    </div>
  );
}
