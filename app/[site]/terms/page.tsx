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
            <h2>서비스의 성격</h2>
            <p>
              사이트의 콘텐츠는 일정, 공고, 제도, 시설 이용 조건을 이해하기 쉽게 정리한 일반 정보입니다. 개별
              합격, 선정, 지원금 지급, 예약 성공, 입장 가능 여부를 보장하지 않습니다.
            </p>
            <h2>정보의 정확성</h2>
            <p>{site.disclaimer}</p>
            <p>
              운영자는 공개 정보를 바탕으로 내용을 점검하지만, 기관 정책 변경, 예산 소진, 접수 조기 마감, 행사 취소,
              시설 운영 변경이 실시간으로 반영되지 않을 수 있습니다. 중요한 일정이나 신청은 반드시 공식 원문을 다시
              확인해야 합니다.
            </p>
            <h2>외부 링크</h2>
            <p>
              사이트에는 공식 기관 또는 관련 서비스로 이동하는 외부 링크가 포함될 수 있습니다. 외부 사이트의 정보,
              결제, 예약, 개인정보 처리, 서비스 장애에 대해서는 해당 기관의 정책이 적용됩니다.
            </p>
            <h2>콘텐츠 이용</h2>
            <p>
              {site.name}의 자체 설명, 체크리스트, 편집 자료를 무단으로 대량 복제하거나 자동 수집해 재배포하는
              행위를 금지합니다. 짧은 인용이 필요한 경우 출처와 링크를 함께 표시해 주세요.
            </p>
            <h2>금지 행위</h2>
            <ul>
              <li>사이트 콘텐츠를 자동 수집해 별도 사이트나 문서로 재배포하는 행위</li>
              <li>허위 정보, 악성 코드, 스팸, 광고성 메시지를 보내는 행위</li>
              <li>운영자 또는 공식 기관을 사칭하는 행위</li>
              <li>타인의 개인정보나 민감한 자료를 동의 없이 전송하는 행위</li>
            </ul>
            <h2>책임 제한</h2>
            <p>
              일정 변경, 접수 마감, 정책 변경, 시설 운영 변경 등으로 발생하는 결과에 대해 사이트는 법적 책임을
              지지 않습니다.
            </p>
            <h2>정정 요청</h2>
            <p>
              오류나 오래된 정보를 발견하면{" "}
              <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>로 알려 주세요. 공식
              출처를 확인한 뒤 필요한 경우 수정합니다.
            </p>
          </article>
          <aside className="notice">시행일: 2026년 5월 15일</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
