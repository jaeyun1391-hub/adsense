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
              이 사이트는 사용자가 흩어진 공지와 안내를 더 쉽게 이해하도록 돕는 정보형 서비스입니다. 단순 링크
              모음이 아니라 조건, 준비 서류, 일정, 방문 전 주의사항, 공식 출처를 함께 설명합니다.
            </p>
            <p>
              검색 결과에는 오래된 글, 홍보성 요약, 개인 경험담이 섞여 나오는 경우가 많습니다. {site.name}은
              사용자가 최종 신청이나 방문 전에 어떤 항목을 공식 페이지에서 다시 확인해야 하는지 보여주는 것을
              목표로 합니다.
            </p>
            <h2>편집 원칙</h2>
            <p>
              공식 기관의 공개 정보를 기준으로 요약하고, 운영자가 이해를 돕는 설명과 체크리스트를 더합니다.
              변경 가능성이 있는 정보는 업데이트일과 출처를 함께 표시합니다.
            </p>
            <ul>
              <li>공식 기관, 주관사, 공공 포털, 운영기관 안내를 우선 확인합니다.</li>
              <li>신청 가능 여부나 이용 가능 여부를 단정하지 않고 확인 순서를 설명합니다.</li>
              <li>일정, 금액, 운영시간처럼 바뀔 수 있는 정보에는 기준일과 공식 출처를 표시합니다.</li>
              <li>광고가 게재되더라도 본문 결론과 편집 순서는 광고주가 정하지 않습니다.</li>
            </ul>
            <h2>콘텐츠 작성 방식</h2>
            <p>
              각 글은 핵심 요약, 확인 순서, 자주 놓치는 조건, 공식 출처 확인 항목, 체크리스트를 중심으로
              구성합니다. 같은 주제라도 지역, 기관, 회차, 공고에 따라 조건이 달라질 수 있으므로 사용자가 직접
              확인해야 하는 지점을 반복해서 안내합니다.
            </p>
            <h2>정정과 업데이트</h2>
            <p>
              오래된 링크, 잘못된 기관명, 변경된 일정, 마감된 공고를 발견하면 공식 원문을 확인한 뒤 필요한 부분을
              수정합니다. 정정 요청에는 페이지 주소와 공식 출처를 함께 보내주시면 검토가 더 빠릅니다.
            </p>
            <h2>문의</h2>
            <p>
              정보 정정, 제휴, 문의는 운영자 이메일{" "}
              <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>로 보내주세요.
            </p>
          </article>
          <aside className="notice">{site.disclaimer}</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
