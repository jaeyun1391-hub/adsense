import type { Metadata } from "next";
import Link from "next/link";
import { EventsTextPage } from "@/components/EventsPlatform";
import { SiteChrome } from "@/components/SiteChrome";
import { housingUpdateLog } from "@/lib/housing-platform-content";
import { updateLogItems } from "@/lib/site-depth-content";
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
    title: `업데이트 기록 - ${site.name}`,
    description: `${site.name}의 최근 콘텐츠 점검 및 업데이트 기록입니다.`,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/updates"
    },
    openGraph: {
      title: `업데이트 기록 - ${site.name}`,
      description: `${site.name}의 최근 콘텐츠 점검 및 업데이트 기록입니다.`,
      url: publicUrl(site, "/updates"),
      siteName: site.name,
      locale: "ko_KR"
    }
  };
}

export default async function UpdatesPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const recentItems = site.items.slice(0, site.slug === "housing" ? 8 : 6);
  const updates = site.slug === "housing" ? housingUpdateLog() : updateLogItems(site.slug);
  const updateHeading = site.slug === "housing" ? "2026년 6월 5일 최종 구조 점검" : "2026년 5월 26일 점검";

  if (site.slug === "events") {
    const freeCount = site.items.filter((item) => item.category === "무료 행사").length;

    return (
      <EventsTextPage
        site={site}
        title="전국행사노트 업데이트 기록"
        intro="이 페이지는 전국행사노트가 어떤 기준으로 행사 콘텐츠와 구조를 손보고 있는지 남기는 운영 로그입니다."
        aside="업데이트 기록은 날짜를 바꿔 보이기 위한 장식이 아니라, 어떤 정보가 보강됐고 어떤 변수를 다시 확인했는지 남기는 문서입니다."
      >
        <h2>2026년 6월 14일 구조 재설계</h2>
        <ul>
          <li>기존 대형 히어로와 오른쪽 도메인 카드, 3개 숫자 통계 카드 구조를 제거했습니다.</li>
          <li>홈을 이번 주말 행사 편집 데스크 형태로 바꾸고 날짜 탭, 지역 필터, 행사 상태 배지를 추가했습니다.</li>
          <li>추천 행사 5개를 일정표처럼 배치해 첫 화면에서 실제 방문 판단 정보가 보이도록 변경했습니다.</li>
          <li>상세 글을 행사 브리핑 형식으로 바꿔 예매, 무료 범위, 우천, 교통, 가족 방문 기준을 분리했습니다.</li>
          <li>무료 행사 카테고리의 빈 상태를 없애기 위해 공식 출처 확인이 가능한 무료 행사 글을 추가했습니다.</li>
        </ul>
        <h2>무료 행사 카테고리 보강</h2>
        <p>
          무료 행사 카테고리는 현재 {freeCount}개 글로 운영됩니다. 무료입장이라고 해도 체험비, 주차비, 물품
          보관료, 현장 대기, 사전 예약 여부가 다를 수 있으므로 각 글에서 무료 범위와 추가 비용을 나누어
          설명하도록 수정했습니다.
        </p>
        <h2>반복 구조 제거 기록</h2>
        <p>
          이번 업데이트에서는 다른 사이트와 같은 첫 화면 구조가 반복되는 문제를 우선 제거했습니다. 기존에는
          큰 소개 문구, 검색창, 숫자 통계, 카드 목록이 비슷한 순서로 이어졌지만, 전국행사노트는 날짜 탭,
          지역 필터, 행사 상태 배지, 일정표형 추천 목록을 앞에 두도록 바꿨습니다. 독자가 첫 화면에서 바로
          행사 방문 판단을 시작할 수 있어야 하기 때문입니다.
        </p>
        <h2>상세 글 재점검 기록</h2>
        <p>
          상세 글은 행사명과 공식 출처만 보여주는 방식에서 벗어나 한 줄 판단, 방문 적합 대상, 일정·장소·입장
          방식, 비용 범위, 날씨 변수, 교통과 귀가, 가족 동반 기준, 방문 전날 체크 순서, 보완 사례를 담도록
          확장했습니다. 같은 카테고리 글이라도 지역과 장소가 다르면 교통과 현장 변수가 달라지도록 다시
          작성했습니다.
        </p>
        <h2>최근 다시 확인한 행사 글</h2>
        <table className="info-table">
          <tbody>
            {site.items.slice(0, 10).map((item) => (
              <tr key={item.slug}>
                <th>{item.category}</th>
                <td>
                  <Link href={`/items/${item.slug}`}>{item.title}</Link>
                  <br />
                  <span className="muted">
                    {item.source} · 확인 {item.lastCheckedAt ?? item.updatedAt} · {item.bookingType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>다음 점검 항목</h2>
        <p>
          다음 점검에서는 행사가 종료된 글의 상태 표시, 우천 취소 공지 링크, 야간행사 귀가 안내, 가족 방문 시
          대기 공간 안내를 우선 봅니다. 지역 축제는 교통 통제와 셔틀 공지가 늦게 올라오는 경우가 많아 행사
          직전 재확인이 필요합니다.
        </p>
        <h2>정정 반영 방식</h2>
        <p>
          사용자가 오래된 행사 일정이나 잘못된 장소를 제보하면 공식 출처를 확인한 뒤 글의 요약, 상세 표,
          공식 링크, 업데이트 기록을 함께 수정합니다. 단순히 본문 한 문장만 바꾸지 않고 방문자가 실제로
          영향을 받는 예매·교통·우천 항목까지 같이 점검합니다.
        </p>
        <h2>운영자가 계속 확인할 부분</h2>
        <p>
          행사 정보는 시간이 지나면 빠르게 낡습니다. 전국행사노트는 종료된 행사, 예매 마감 행사, 장소가 바뀐
          행사, 무료 범위가 달라진 행사를 우선 점검합니다. 특히 야외 행사는 비 예보가 없더라도 안전 통제나
          현장 혼잡 때문에 운영 방식이 바뀔 수 있으므로 정기 점검 외에도 필요하면 글을 수정합니다.
        </p>
        <h2>기록을 남기는 이유</h2>
        <p>
          업데이트 기록은 검색엔진이나 광고 심사를 의식한 장식 문서가 아니라, 사이트가 실제로 어떤 기준으로
          관리되는지 보여주는 운영 문서입니다. 같은 날짜만 반복해서 바꾸지 않고, 어떤 카테고리가 보강됐는지,
          어떤 구조를 제거했는지, 어떤 정보가 방문자에게 더 도움이 되도록 바뀌었는지를 남깁니다.
        </p>
      </EventsTextPage>
    );
  }

  return (
    <div className={site.slug === "housing" ? "money-platform" : undefined} style={siteStyle(site)}>
      <SiteChrome site={site}>
        <main className="container detail-layout">
          <article className="detail-panel content">
            <h1>업데이트 기록</h1>
            <p>
              이 페이지는 최근 어떤 기준으로 콘텐츠를 손본 것인지 남기는 운영 기록입니다. 단순히
              날짜만 바꾸지 않고, 사용자가 실제로 확인해야 하는 항목이 늘어났는지를 기준으로 기록합니다.
            </p>
            <h2>{updateHeading}</h2>
            <ul>
              {updates.map((update) => (
                <li key={update}>{update}</li>
              ))}
            </ul>
            {site.slug === "housing" ? (
              <>
                <h2>money1000 추가 점검 기록</h2>
                <p>
                  이번 점검에서는 단순 글 수보다 사이트가 실제 운영되는 주거지원 플랫폼처럼 보이는지를 우선
                  확인했습니다. 홈 화면, 카테고리, 상세 글, 가이드, 출처 페이지가 서로 연결되도록 바꾸고,
                  각 상세 글에는 검토일, 다음 검토 예정일, 공식 출처, 신청 전 확인 순서를 함께 표시했습니다.
                </p>
              </>
            ) : null}
            <h2>이번에 다시 확인한 대표 페이지</h2>
            <table className="info-table">
              <tbody>
                {recentItems.map((item) => (
                  <tr key={item.slug}>
                    <th>{item.category}</th>
                    <td>
                      <Link href={`/items/${item.slug}`}>{item.title}</Link>
                      <br />
                      <span className="muted">{item.source} · 업데이트 {item.updatedAt}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>다음 점검에서 보는 항목</h2>
            <p>
              일정이 지난 정보, 접수처나 운영기관이 바뀐 정보, 조건·요금·서류·운영시간이 달라진 정보를 우선
              확인합니다. 사용자가 정정 요청을 보내면 공식 원문을 확인한 뒤 필요한 부분을 반영합니다.
            </p>
          </article>
          <aside className="notice">
            정정 요청은 페이지 주소와 공식 출처를 함께 보내주세요.
            <br />
            <a href={`mailto:contact@${site.domainHint}`}>contact@{site.domainHint}</a>
          </aside>
        </main>
      </SiteChrome>
    </div>
  );
}
