import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { EventsTextPage } from "@/components/EventsPlatform";
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

  if (site.slug === "events") {
    return (
      <EventsTextPage
        site={site}
        title="전국행사노트 문의"
        intro="행사 일정 정정, 공식 출처 추가, 우천·취소 공지 반영 요청, 운영 의견을 받는 연락 창구입니다."
        aside="전국행사노트는 행사 주최사가 아니므로 티켓 환불, 예약 변경, 민원 접수, 행사장 운영 민원을 대신 처리할 수 없습니다."
      >
        <h2>운영자 이메일</h2>
        <p>
          <a className="button secondary" href={`mailto:contact@${site.domainHint}`}>
            <Mail size={15} />
            contact@{site.domainHint}
          </a>
        </p>
        <h2>정정 요청 시 보내주시면 좋은 내용</h2>
        <ul>
          <li>수정이 필요한 전국행사노트 페이지 주소</li>
          <li>행사명, 지역, 행사장명, 주최·주관 기관명</li>
          <li>잘못되었거나 오래된 문장</li>
          <li>확인 가능한 공식 공지 링크 또는 예매처 링크</li>
          <li>변경 공지가 올라온 날짜와 적용되는 행사 회차</li>
        </ul>
        <h2>우선 확인하는 문의</h2>
        <p>
          행사 취소, 장소 변경, 우천 대체, 입장 마감, 무료 범위 변경, 교통 통제처럼 방문자에게 직접 영향을 주는
          내용은 우선 확인합니다. 단순 홍보 요청이나 출처가 확인되지 않는 일정 추가 요청은 반영하지 않을 수
          있습니다.
        </p>
        <h2>행사 등록 요청 기준</h2>
        <p>
          새 행사 등록을 요청할 수는 있지만, 모든 요청이 바로 게시되지는 않습니다. 공식 홈페이지, 주최 기관
          공지, 예매처, 행사장 안내 중 하나 이상에서 일정과 장소를 확인할 수 있어야 합니다. 포스터 이미지나
          SNS 홍보 문구만 있는 경우에는 일정 변경, 무료 범위, 입장 조건을 검증하기 어려워 보류할 수 있습니다.
        </p>
        <h2>출처 추가 요청</h2>
        <p>
          이미 등록된 글에 더 정확한 공식 링크가 있다면 알려주세요. 예를 들어 관광 포털보다 주최 측 공지가
          더 최신이거나, 예매처에서 회차별 마감 상태를 더 정확히 보여주는 경우 출처를 교체하거나 함께 표시할 수
          있습니다. 이때 링크가 홍보 랜딩 페이지인지, 실제 공지와 예매 정보를 담은 페이지인지도 같이 봅니다.
        </p>
        <h2>우천·취소 제보</h2>
        <p>
          야외 행사는 취소와 축소 공지가 행사 당일에 올라오는 경우가 많습니다. 우천 취소, 장소 변경, 실내
          대체 프로그램, 교통 통제 변경을 제보할 때는 공지가 올라온 시각과 적용되는 날짜를 함께 보내주세요.
          같은 행사라도 일부 회차만 바뀔 수 있어 적용 범위를 확인해야 합니다.
        </p>
        <h2>처리하지 않는 문의</h2>
        <p>
          티켓 환불, 예매자 정보 변경, 단체 예약, 분실물, 행사장 민원, 주최 측과의 협찬 협의는 해당 공식
          운영 주체로 연락해야 합니다. 전국행사노트는 공개 정보를 바탕으로 방문 판단을 돕는 정보 사이트입니다.
        </p>
        <h2>답변이 늦어질 수 있는 경우</h2>
        <p>
          공식 출처가 여러 곳으로 나뉘어 있거나, 주최 측 공지와 예매처 안내가 서로 다른 경우 확인 시간이 더
          걸릴 수 있습니다. 이럴 때는 먼저 글에 단정 표현을 줄이고, 방문자가 공식 채널에서 다시 확인해야 할
          질문을 남기는 방식으로 임시 보완할 수 있습니다.
        </p>
        <h2>좋은 제보 예시</h2>
        <p>
          좋은 제보는 “이 행사가 취소됐어요”에서 끝나지 않고, 취소 공지가 올라온 공식 링크와 적용 날짜를 함께
          포함합니다. “무료가 아니에요”라는 제보도 입장료가 생긴 것인지, 체험비가 따로 있는 것인지, 주차비나
          좌석 예약 비용이 추가된 것인지 나눠 주면 본문을 더 정확히 고칠 수 있습니다.
        </p>
        <h2>검토가 어려운 제보</h2>
        <p>
          캡처 이미지만 있고 원문 링크가 없거나, 개인 SNS 후기만 근거로 한 제보는 바로 반영하기 어렵습니다.
          전국행사노트는 공식 출처를 기준으로 방문 조건을 정리하는 사이트이기 때문에, 분위기나 개인 경험보다
          주최 측이 공개한 일정·요금·입장 조건을 우선합니다.
        </p>
        <h2>지역 행사 제안</h2>
        <p>
          작은 지역 행사도 공식 공지가 있고 방문자가 확인해야 할 조건이 충분하다면 다룰 수 있습니다. 유명한
          대형 행사만 다루면 실제 생활권에서 갈 수 있는 무료 공연, 도서관 행사, 공원 체험, 지역 전시가
          묻힐 수 있습니다. 다만 행사의 규모와 상관없이 일정, 장소, 비용, 문의처가 확인되어야 합니다.
        </p>
        <h2>문의 전 확인하면 좋은 것</h2>
        <p>
          문의를 보내기 전 해당 글의 공식 출처 버튼, 업데이트 기록, 글 하단의 체크리스트를 먼저 확인해 주세요.
          이미 본문에 “출발 직전 확인 필요”로 표시된 항목은 주최 측의 실시간 공지를 기다려야 하는 경우가 많습니다.
          그래도 틀린 내용이 보이면 언제든 정정 요청을 보낼 수 있습니다.
        </p>
        <h2>운영 의견 보내기</h2>
        <p>
          특정 글의 오류가 아니더라도 사이트 구조, 카테고리, 모바일 화면, 검색어 제안처럼 운영 개선 의견을 보낼
          수 있습니다. 예를 들어 “무료 행사에서 주차비를 더 잘 보이게 해 달라”거나 “우천 대안 글을 지역별로
          나눠 달라”는 의견은 향후 편집 구조를 바꿀 때 참고할 수 있습니다.
        </p>
        <p>
          다만 전국행사노트는 모든 지역 행사를 실시간으로 등록하는 캘린더가 아니라 방문 판단에 필요한 정보를
          선별해 쓰는 사이트입니다. 따라서 행사 추가 요청보다 공식 출처가 분명한 정정 요청과 방문 조건 보강
          제보를 우선 처리합니다.
        </p>
        <h2>답변 방식</h2>
        <p>
          모든 문의에 즉시 답변하기는 어렵지만, 공식 출처와 함께 전달된 정정 요청은 확인 후 필요한 경우
          업데이트 기록에 남깁니다. 내용이 반영되면 해당 글의 확인일, 본문, 출처 표기를 함께 수정합니다.
        </p>
      </EventsTextPage>
    );
  }

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
            <ul>
              <li>수정이 필요한 페이지 주소</li>
              <li>잘못되었거나 오래된 문장</li>
              <li>확인 가능한 공식 출처 링크</li>
              <li>기관명, 공고명, 행사명, 시설명처럼 확인에 필요한 이름</li>
              <li>변경된 내용이 적용된 날짜 또는 공지 날짜</li>
            </ul>
            <h2>답변 기준</h2>
            <p>
              모든 문의에 즉시 답변하기는 어렵지만, 정보 정확성과 이용자 안전에 관련된 내용은 우선 확인합니다.
            </p>
            <h2>처리하지 않는 문의</h2>
            <p>
              개별 합격 가능성, 지원금 선정 여부, 예약 변경, 환불 처리, 민원 접수, 공식 기관을 대신한 상담은 처리할
              수 없습니다. 이런 내용은 해당 기관 또는 운영 주체의 공식 문의처로 연락해야 합니다.
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
