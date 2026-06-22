import type { Metadata } from "next";
import { ExamTextPage } from "@/components/ExamPlatform";
import { EventsTextPage } from "@/components/EventsPlatform";
import { examNextReviewDate, examReviewDate } from "@/lib/exam-content";
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

  if (site.slug === "exam") {
    return (
      <ExamTextPage
        site={site}
        title="시험일정센터 편집 기준"
        intro="시험 콘텐츠는 시험일 하나를 크게 보여주는 방식으로 만들지 않습니다. 접수 마감, 시험장, 준비물, 응시자격, 성적 발표를 공식 접수처 기준으로 분리해 설명합니다."
        aside={`현재 검토 기준일은 ${examReviewDate}이며 다음 정기 검토 예정일은 ${examNextReviewDate}입니다. 시험 일정은 수시로 바뀔 수 있어 실제 접수 전 공식 접수처 확인을 우선합니다.`}
      >
        <h2>작성 책임과 범위</h2>
        <p>
          시험일정센터의 글은 편집팀 명의로 작성합니다. 글의 목적은 시험 접수나 합격을 보장하는 것이 아니라,
          수험생이 공식 접수처에서 어떤 항목을 다시 확인해야 하는지 알려주는 것입니다. 특정 시험 응시를 권유하거나
          개인별 응시자격을 판정하지 않습니다.
        </p>
        <h2>기본 검토 순서</h2>
        <ol>
          <li>공식 접수처와 시행기관 공지에서 시험명, 회차, 접수 기간, 시험일을 확인합니다.</li>
          <li>정기시험, 상시시험, 추가 접수, CBT처럼 접수 방식이 다른 경우를 분리합니다.</li>
          <li>응시자격 서류, 인정 신분증, 사진, 수험표, 준비물 기준을 확인합니다.</li>
          <li>성적 발표일, 성적표 발급, 제출처 마감일을 시험일과 함께 봅니다.</li>
          <li>변경 공고, 시험장 공지, 합격자 발표 메뉴가 별도로 있는지 확인합니다.</li>
        </ol>
        <h2>본문 구성 기준</h2>
        <p>
          상세 글은 한 줄 결론, 필요한 사람, 접수 전 확인 순서, 서류와 본인 확인, 시험장과 당일 준비, 성적 발표와
          제출 마감, 자주 생기는 실수, 공식 출처 순서로 작성합니다. 모든 시험에 같은 문장을 반복하지 않고
          국가기술자격은 필기·실기 연결, 어학시험은 성적 제출, 공공시험은 공고와 전형 일정처럼 다른 기준을 앞에 둡니다.
        </p>
        <h2>공식 출처 우선 원칙</h2>
        <p>
          일정, 접수 가능 여부, 응시 조건은 개인 블로그나 커뮤니티를 근거로 쓰지 않습니다. 공식 접수처의 현재
          공지, 원서접수 화면, 수험자 유의사항, 마이페이지 접수 상태, 합격자 발표 메뉴를 우선 기준으로 삼습니다.
        </p>
        <h2>단정 표현 제한</h2>
        <p>
          “무조건 접수 가능”, “확정 합격”, “반드시 인정” 같은 표현을 쓰지 않습니다. 시험 일정과 응시 조건은
          시행기관 사정에 따라 달라질 수 있으므로, 글의 결론은 항상 공식 접수처 재확인으로 이어지도록 작성합니다.
        </p>
        <h2>업데이트 우선순위</h2>
        <p>
          접수 마감, 추가 접수, 시험장 변경, 응시자격 서류 제출, 성적 발표일, 공공시험 변경 공고처럼 수험생의
          행동에 직접 영향을 주는 항목을 우선 점검합니다. 단순 시험 소개 문구보다 접수 실패나 제출 마감 누락을
          줄이는 정보가 먼저입니다.
        </p>
        {policyBlocks.length ? <RichContent blocks={policyBlocks} /> : null}
      </ExamTextPage>
    );
  }

  if (site.slug === "events") {
    return (
      <EventsTextPage
        site={site}
        title="전국행사노트 편집 기준"
        intro="행사 콘텐츠는 홍보 문구를 다시 쓰는 방식으로 만들지 않습니다. 방문자가 출발 전에 실제로 확인해야 하는 조건을 공식 출처 기준으로 분리해 설명합니다."
        aside="전국행사노트는 행사 참여, 예매 성공, 입장 가능 여부를 보장하지 않습니다. 일정·요금·입장 조건은 공식 주최 측 공지를 기준으로 최종 확인해야 합니다."
      >
        <h2>작성자와 책임 범위</h2>
        <p>
          각 글은 전국행사노트 편집팀 명의로 작성합니다. 글의 목적은 행사 홍보가 아니라 방문 판단을 돕는
          설명입니다. 특정 행사 참여를 권유하거나 티켓 구매를 유도하는 방식으로 작성하지 않고, 방문자가
          불확실성을 줄일 수 있도록 확인 순서를 제공합니다.
        </p>
        <h2>기본 검토 순서</h2>
        <ol>
          <li>공식 홈페이지, 주최·주관 기관 공지, 예매처 안내에서 행사명과 일정이 일치하는지 확인합니다.</li>
          <li>사전예매, 무료입장, 현장권, 회차 예약, 연령 제한처럼 입장 조건을 분리합니다.</li>
          <li>입장료와 체험비, 주차비, 셔틀, 물품 보관, 먹거리 비용을 따로 적어 무료 범위 오해를 줄입니다.</li>
          <li>우천, 폭염, 강풍, 미세먼지, 안전 통제에 따른 취소·변경 공지 채널을 확인합니다.</li>
          <li>주차장, 지하철역, 셔틀, 귀가 막차, 보행 통제처럼 실제 방문 동선을 점검합니다.</li>
        </ol>
        <h2>본문 구성 기준</h2>
        <p>
          상세 글은 한 줄 결론, 방문 적합 대상, 일정·장소·예매 상태, 무료·유료 범위, 입장 마감과 혼잡 시간,
          우천·폭염 대안, 주차와 대중교통, 아이 동반 주의점, 공식 출처 순서로 정리합니다. 글마다 같은 문장을
          반복하는 대신 행사 성격에 맞는 변수와 주의점을 다르게 씁니다.
        </p>
        <p>
          예를 들어 야외 축제는 날씨와 교통 통제를 먼저 보고, 전시회는 사전등록과 마지막 입장 시간을 먼저 봅니다.
          가족 체험은 회차 예약, 연령 제한, 대기 공간을 확인하고, 무료 행사는 무료 범위와 추가 비용을 나눠 봅니다.
          이처럼 같은 템플릿 문장을 돌려 쓰지 않고 방문 상황별로 판단 기준을 바꿉니다.
        </p>
        <h2>공식 출처 우선 원칙</h2>
        <p>
          일정, 요금, 입장 조건은 개인 블로그나 커뮤니티를 근거로 쓰지 않습니다. 개인 후기는 분위기나 혼잡도를
          이해하는 보조 자료가 될 수 있지만, 정보의 기준은 공식 공지입니다. 공식 페이지가 여러 곳일 때는 실제
          방문자가 최종 행동을 하는 예매처, 주최 측 공지, 행사장 안내를 우선합니다.
        </p>
        <h2>반복 문장 제한</h2>
        <p>
          행사 글은 같은 구조를 쓰더라도 같은 문장을 반복하지 않도록 점검합니다. 모든 글에 “방문 전 공식
          안내를 확인하세요”만 반복하면 독자에게 필요한 차이가 보이지 않습니다. 따라서 축제 글은 교통과 우천,
          전시 글은 예매와 마지막 입장, 가족 글은 연령과 대기 공간, 무료 글은 추가 비용과 선착순 여부를
          중심으로 문장을 다르게 씁니다.
        </p>
        <h2>행사별 고유 문단 기준</h2>
        <p>
          각 상세 글에는 행사명, 지역, 장소, 예매 방식, 비용 범위, 날씨 변수, 교통 메모가 반영되어야 합니다.
          카테고리 공통 설명만으로 채운 글은 운영자가 직접 편집한 행사 노트로 보기 어렵기 때문입니다. 같은
          행사장이라도 회차, 홀 위치, 계절, 동행자 기준이 달라지면 본문도 함께 달라져야 합니다.
        </p>
        <h2>민감한 표현 관리</h2>
        <p>
          행사 정보도 방문자의 시간과 비용에 영향을 줍니다. 그래서 “꼭 가야 하는”, “무조건 추천”, “확정 입장”
          같은 과장 문구를 피합니다. 대신 확인 가능한 조건과 불확실한 변수를 분리해 씁니다. 예매처가 마감
          상태를 바꾸거나 주최 측이 당일 공지를 올릴 수 있으므로, 글의 결론은 항상 공식 확인 행동으로 이어져야
          합니다.
        </p>
        <h2>업데이트 우선순위</h2>
        <p>
          모든 행사를 같은 주기로 다시 볼 수는 없기 때문에 방문자 피해 가능성이 큰 순서대로 점검합니다. 취소와
          장소 변경, 입장 마감, 무료 범위 변경, 교통 통제, 우천 대체 프로그램은 우선순위가 높습니다. 반대로
          분위기 소개나 포스터 문구처럼 방문 조건에 직접 영향을 주지 않는 내용은 급하게 수정하지 않습니다.
        </p>
        <h2>종료된 행사 처리</h2>
        <p>
          종료된 행사는 무조건 삭제하지 않습니다. 다음 회차 준비나 비슷한 행사 방문에 도움이 되는 구조가 있다면
          확인일과 공식 출처를 남겨 참고 자료로 유지할 수 있습니다. 다만 예매 가능, 당일 방문 가능처럼 현재형으로
          오해될 수 있는 문장은 종료 상태에 맞게 수정합니다.
        </p>
        <p>
          반복 개최 행사는 이전 회차 글을 그대로 재사용하지 않고, 새 회차의 장소, 예매처, 운영 시간, 교통 공지를
          다시 확인합니다. 같은 이름의 행사라도 회차가 바뀌면 방문자가 확인해야 할 조건도 달라질 수 있습니다.
        </p>
        <h2>단정 표현 제한</h2>
        <p>
          행사 정보는 변동성이 크기 때문에 “무조건 입장 가능”, “반드시 무료”, “확정 개최”처럼 방문 결과를
          보장하는 표현을 쓰지 않습니다. 대신 “공식 공지에서 확인”, “예매처 기준 확인”, “출발 전 재확인”처럼
          사용자가 직접 확인할 수 있는 행동을 안내합니다.
        </p>
        <h2>정정과 재검토</h2>
        <p>
          취소 공지, 장소 변경, 회차 마감, 우천 대체 프로그램, 교통 통제 변경이 확인되면 기존 글을 수정합니다.
          정정 요청에는 페이지 주소, 잘못된 문장, 공식 링크, 공지 날짜를 함께 보내주시면 검토가 빠릅니다.
        </p>
      </EventsTextPage>
    );
  }

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
