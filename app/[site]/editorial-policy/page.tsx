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
    title: `편집 기준 - ${site.name}`,
    description: `${site.name}의 콘텐츠 작성, 검수, 정정 기준입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/editorial-policy"
    },
    openGraph: {
      title: `편집 기준 - ${site.name}`,
      description: `${site.name}의 콘텐츠 작성, 검수, 정정 기준입니다.`,
      url: publicUrl(site, "/editorial-policy"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function EditorialPolicyPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return (
    <div style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>편집 기준</h1>
            <p>
              이 사이트는 공개된 공식 정보를 그대로 긁어 모으는 곳이 아니라, 사용자가 신청·접수·방문 전에
              실제로 확인해야 할 순서를 정리하는 정보 서비스입니다.
            </p>
            <h2>누가 작성하나요</h2>
            <p>
              각 페이지는 사이트 편집팀 명의로 작성합니다. 개인의 합격, 선정, 대출 실행, 예약 성공을
              보장하지 않으며, 공식 기관의 최신 안내를 확인하도록 돕는 해설 자료로 운영합니다.
            </p>
            <h2>어떻게 검토하나요</h2>
            <ul>
              <li>공식 접수처, 주관기관, 지자체, 공공 포털, 운영기관 안내를 우선 확인합니다.</li>
              <li>대상 조건, 제외 조건, 기간, 비용, 서류, 문의처를 분리해 읽습니다.</li>
              <li>바뀔 수 있는 정보에는 업데이트 기준일과 공식 출처를 함께 표시합니다.</li>
              <li>원문이 애매한 부분은 단정하지 않고 사용자가 다시 확인해야 할 질문 형태로 남깁니다.</li>
            </ul>
            {site.slug === "business" ? (
              <>
                <h2>business100.co.kr 추가 기준</h2>
                <p>
                  사업자 지원 정보는 돈과 사업 판단에 영향을 줄 수 있어, 단순한 모집공고 요약보다 더 보수적으로
                  다룹니다. 정책자금은 대출·보증·금융기관 심사를 나눠 설명하고, 시설개선형 지원은 승인 전 지출,
                  자부담, 부가세, 정산 증빙을 따로 확인합니다.
                </p>
                <p>
                  창업지원 글은 아이디어 소개보다 업력, 사업계획서, 평가 기준, 사업비 집행 가능 항목을 먼저
                  봅니다. 교육·컨설팅 글은 수강 여부보다 실제 실행에 필요한 자료와 후속 점검을 중심으로 정리합니다.
                </p>
              </>
            ) : null}
            <h2>정정 기준</h2>
            <p>
              오래된 일정, 마감된 공고, 잘못된 기관명, 변경된 제출 서류를 발견하면 공식 원문을 기준으로 수정합니다.
              정정 요청은 페이지 주소, 수정이 필요한 문장, 확인 가능한 공식 링크를 함께 보내주시면 검토가 빠릅니다.
            </p>
          </article>
          <aside className="notice">
            편집 기준 최종 업데이트: 2026년 5월 26일
            <br />
            문의: <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>
          </aside>
        </main>
      </SiteChrome>
    </div>
  );
}
