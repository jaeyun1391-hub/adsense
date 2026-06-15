import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { EventsTextPage } from "@/components/EventsPlatform";
import { SiteChrome } from "@/components/SiteChrome";
import { housingSourceGroups } from "@/lib/housing-platform-content";
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
  const housingGroups = site.slug === "housing" ? housingSourceGroups() : [];

  if (site.slug === "events") {
    const eventSourceGroups = [
      {
        title: "전국 행사·문화 포털",
        links: [
          { label: "대한민국 구석구석", url: "https://korean.visitkorea.or.kr/" },
          { label: "문화포털", url: "https://www.culture.go.kr/" },
          { label: "서울문화포털", url: "https://culture.seoul.go.kr/" }
        ]
      },
      {
        title: "지역 관광·문화 안내",
        links: [
          { label: "비짓부산", url: "https://www.visitbusan.net/" },
          { label: "비짓제주", url: "https://www.visitjeju.net/" },
          { label: "강릉시 문화관광", url: "https://www.gn.go.kr/tour/" }
        ]
      },
      {
        title: "행사장·공간 운영 안내",
        links: [
          { label: "BEXCO", url: "https://www.bexco.co.kr/" },
          { label: "광화문광장", url: "https://gwanghwamun.seoul.go.kr/" },
          { label: "한강공원", url: "https://hangang.seoul.go.kr/" }
        ]
      }
    ];

    return (
      <EventsTextPage
        site={site}
        title="전국행사노트 출처 안내"
        intro="전국행사노트는 행사 홍보 문구가 아니라 공식 공지, 예매처, 행사장 운영 안내를 대조해 방문자가 확인해야 할 조건을 다시 정리합니다."
        aside="출처 링크는 최종 확인을 돕기 위한 장치입니다. 본문은 원문을 그대로 옮기지 않고 방문 판단 순서와 주의사항을 자체 문장으로 다시 작성합니다."
      >
        <h2>출처를 고르는 기준</h2>
        <p>
          행사 정보는 같은 제목이라도 주최 기관, 예매처, 행사장, 지자체 관광 포털에서 서로 다른 세부 안내를
          제공할 수 있습니다. 전국행사노트는 일정과 장소는 주최 측 공지에서, 입장과 티켓은 예매처에서, 현장
          운영과 교통은 행사장·지자체 공지에서 확인하는 방식을 우선합니다.
        </p>
        <p>
          개인 후기, SNS 게시물, 커뮤니티 글은 현장 분위기를 이해하는 데 도움이 될 수 있지만 일정·입장료·취소
          여부의 단독 근거로 사용하지 않습니다. 특히 무료 행사, 야외 행사, 야간 행사는 변경 공지가 빠르게 올라올
          수 있으므로 공식 채널을 함께 표시합니다.
        </p>
        <h2>주요 출처 묶음</h2>
        {eventSourceGroups.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.label} <ExternalLink size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <h2>글별 출처</h2>
        <p>
          아래 목록은 현재 등록된 행사 글에서 직접 연결하는 대표 공식 출처입니다. 같은 기관이 여러 행사를
          운영하는 경우 중복을 줄여 표시합니다. 방문자는 이 링크에서 공지 날짜, 회차, 장소, 예매 상태를 다시
          확인해야 합니다.
        </p>
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
        <h2>업데이트 기준</h2>
        <p>
          일정, 요금, 예매 방식, 장소, 교통 통제, 우천 취소 여부는 변경 가능성이 큽니다. 상세 글에는 확인일을
          표시하고, 변경이 확인되면 본문을 수정합니다. 다만 모든 행사 공지를 실시간으로 대체할 수는 없기 때문에
          출발 직전 공식 출처 재확인을 반복 안내합니다.
        </p>
      </EventsTextPage>
    );
  }

  return (
    <div className={site.slug === "housing" ? "money-platform" : undefined} style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>출처 안내</h1>
            <p>
              이 사이트는 공식 기관, 주관사, 공공 포털 등 공개적으로 확인 가능한 정보를 기준으로 내용을
              정리합니다. 단순 복사가 아니라 신청자와 방문자가 확인해야 할 조건, 준비물, 주의사항을 함께 설명합니다.
            </p>
            <p>
              출처 표기는 사용자가 최종 원문으로 이동할 수 있도록 돕기 위한 장치입니다. 본문은 원문을 그대로
              옮기지 않고, 실제 이용자가 확인해야 할 순서와 판단 기준을 자체 문장으로 다시 정리합니다.
            </p>
            <h2>업데이트 기준</h2>
            <p>
              각 상세 페이지에는 업데이트일과 원문 출처를 표시합니다. 일정, 모집 여부, 이용 조건이 바뀔 수 있는
              정보는 운영자가 주기적으로 다시 확인하는 방식으로 관리합니다.
            </p>
            <h2>출처 선택 원칙</h2>
            <ul>
              <li>공식 접수처, 주관기관, 공공기관, 지자체, 운영기관 안내를 우선합니다.</li>
              <li>개인 블로그, 커뮤니티, 광고 페이지는 단독 근거로 사용하지 않습니다.</li>
              <li>마감일, 요금, 제출 서류, 운영시간처럼 변경 가능한 정보는 원문 확인을 함께 안내합니다.</li>
              <li>같은 정보가 여러 곳에 있을 때는 신청 또는 방문자가 실제로 이용하는 공식 페이지를 우선합니다.</li>
            </ul>
            {site.slug === "business" ? (
              <>
                <h2>사업자 지원사업 출처 확인 방식</h2>
                <p>
                  business100.co.kr은 소상공인정책자금, K-Startup, 기업마당, 소상공인24, 지자체 공고,
                  창업보육·수출지원 관련 공식 안내를 우선합니다. 포털형 목록은 공고를 찾는 입구로 쓰고,
                  실제 조건은 개별 공고문과 신청 화면에서 다시 확인하는 방식으로 정리합니다.
                </p>
                <p>
                  정책자금은 직접대출·대리대출, 보증·금융기관 절차, 예산 소진 가능성을 따로 표시합니다.
                  시설개선·디자인·간판·안전 사업은 접수기간, 보조율, 자부담, 승인 전 지출 가능 여부,
                  정산 증빙을 함께 확인합니다.
                </p>
              </>
            ) : null}
            {housingGroups.length ? (
              <>
                <h2>청년 주거지원 출처 확인 방식</h2>
                <p>
                  money1000.co.kr은 주거복지 포털, 지자체 공고, 공공임대 청약 시스템, 전세·보증금 관련
                  공공기관 안내를 나누어 확인합니다. 같은 청년 주거지원이라도 접수 창구와 심사 기준이 다르기
                  때문에 원문 링크만 모으지 않고, 신청자가 실제로 확인해야 할 조건과 서류를 함께 정리합니다.
                </p>
                <p>
                  금전 지원과 대출 판단은 개인의 소득, 계약 조건, 보증 가능성, 예산 상황에 따라 달라질 수
                  있습니다. 따라서 각 글에서는 공식 출처 링크와 함께 상담 전 질문, 보완 서류, 제외 조건을
                  분리해 안내합니다.
                </p>
                {housingGroups.map((group) => (
                  <section key={group.title}>
                    <h3>{group.title}</h3>
                    <ul>
                      {group.links.map((link) => (
                        <li key={link.url}>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            {link.label} <ExternalLink size={13} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </>
            ) : null}
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
              오래된 정보나 잘못된 내용을 발견하면{" "}
              <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>로 원문 링크와 함께
              알려주세요. 확인 후 필요한 경우 페이지를 수정합니다.
            </p>
          </article>
          <aside className="notice">{site.disclaimer}</aside>
        </main>
      </SiteChrome>
    </div>
  );
}
