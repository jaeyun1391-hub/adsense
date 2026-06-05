import type { Metadata } from "next";
import { RichContent } from "@/components/RichContent";
import { SiteChrome } from "@/components/SiteChrome";
import { housingNextReviewDate, housingReviewDate } from "@/lib/housing-platform-content";
import { editorialPolicyBlocks } from "@/lib/site-depth-content";
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
  const policyBlocks = editorialPolicyBlocks(site.slug);

  return (
    <div className={site.slug === "housing" ? "money-platform" : undefined} style={siteStyle(site)}>
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
            {site.slug === "housing" ? (
              <>
                <h2>money1000 주거지원 검토 기준</h2>
                <p>
                  주거지원 정보는 금전 지원, 임대주택 선정, 전세대출 상담처럼 개인 상황에 영향을 줄 수 있으므로
                  과장 표현을 쓰지 않습니다. “무조건 가능”, “확정 지급”처럼 결과를 단정하는 문구를 피하고,
                  신청자가 공식 공고와 상담 창구에서 다시 확인해야 할 질문을 함께 남깁니다.
                </p>
                <ul>
                  <li>월세지원 글은 계약서, 전입신고, 납부 증빙, 소득 기준을 함께 확인합니다.</li>
                  <li>전세·보증금 글은 계약 전 보증 가능성, 은행 상담 서류, 위험 신호를 분리합니다.</li>
                  <li>임대주택 글은 공급 유형, 순위 조건, 예비입주자 흐름을 공고 읽는 순서대로 정리합니다.</li>
                  <li>서류 글은 발급일, 표시 옵션, 주소 일치 여부, 보완 요청 가능성을 중심으로 검토합니다.</li>
                </ul>
                <p>
                  money1000 콘텐츠의 현재 검토 기준일은 {housingReviewDate}이며, 다음 정기 검토 예정일은{" "}
                  {housingNextReviewDate}입니다. 다만 접수 마감, 예산 소진, 공고 변경이 확인되면 정기 검토일
                  전에도 수정할 수 있습니다.
                </p>
              </>
            ) : null}
            {policyBlocks.length ? <RichContent blocks={policyBlocks} /> : null}
            <h2>정정 기준</h2>
            <p>
              오래된 일정, 마감된 공고, 잘못된 기관명, 변경된 제출 서류를 발견하면 공식 원문을 기준으로 수정합니다.
              정정 요청은 페이지 주소, 수정이 필요한 문장, 확인 가능한 공식 링크를 함께 보내주시면 검토가 빠릅니다.
            </p>
          </article>
          <aside className="notice">
            편집 기준 최종 업데이트: {site.slug === "housing" ? housingReviewDate : "2026년 5월 26일"}
            <br />
            문의: <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>
          </aside>
        </main>
      </SiteChrome>
    </div>
  );
}
