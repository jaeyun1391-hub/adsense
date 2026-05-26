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
            <p>
              {site.name}은 현재 회원가입 없이 공개 정보를 제공하며, 문의 처리에 필요한 최소 정보만 수집합니다.
              이 방침은 개인정보 보호와 광고·분석 도구 사용 가능성을 방문자에게 알리기 위해 작성했습니다.
            </p>
            <h2>수집 항목</h2>
            <ul>
              <li>문의자가 이메일로 제공한 이름, 이메일 주소, 문의 내용</li>
              <li>웹 서버가 자동으로 기록할 수 있는 접속 일시, 브라우저, 기기 정보, IP 주소 일부</li>
              <li>광고 또는 방문 통계 도구가 사용할 수 있는 쿠키, 광고 식별자, 페이지 이용 기록</li>
            </ul>
            <h2>이용 목적</h2>
            <ul>
              <li>문의 응대와 정정 요청 확인</li>
              <li>사이트 오류, 비정상 접속, 보안 문제 대응</li>
              <li>콘텐츠 품질 개선과 방문 통계 확인</li>
              <li>광고 게재, 광고 빈도 관리, 부정 클릭 방지</li>
            </ul>
            <h2>보관 기간</h2>
            <p>문의 처리 완료 후 필요한 기간 동안 보관한 뒤 파기합니다. 법령상 보관 의무가 있는 경우 해당 기간을 따릅니다.</p>
            <h2>광고와 분석</h2>
            <p>
              사이트에는 Google AdSense 등 광고 서비스와 방문 통계 도구가 적용될 수 있습니다. Google과 제3자는
              쿠키를 사용해 방문자의 이전 방문 기록을 바탕으로 광고를 게재할 수 있으며, 사용자는 브라우저 설정 또는
              Google 광고 설정에서 맞춤 광고와 쿠키 사용을 관리할 수 있습니다.
            </p>
            <h2>외부 링크</h2>
            <p>
              {site.name}에는 공식 기관, 주관사, 공공 포털 등 외부 사이트 링크가 포함됩니다. 외부 사이트에서는
              해당 사이트의 개인정보처리방침과 이용약관이 적용됩니다.
            </p>
            <h2>이용자의 선택권</h2>
            <p>
              방문자는 브라우저 설정에서 쿠키 저장을 거부하거나 기존 쿠키를 삭제할 수 있습니다. 다만 쿠키를 제한하면
              일부 광고, 통계, 보안 기능이 정상적으로 작동하지 않을 수 있습니다.
            </p>
            <h2>문의</h2>
            <p>
              개인정보 관련 문의는{" "}
              <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>로 연락해 주세요.
            </p>
          </article>
          <aside className="notice">시행일: 2026년 5월 15일 · 최종 업데이트: 2026년 5월 26일</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
