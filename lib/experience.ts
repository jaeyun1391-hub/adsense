import type { Guide, SiteConfig, SiteSlug } from "@/lib/sites";

export type SubmissionMode = "stability" | "operating";

export type ExperienceDefinition = {
  slug: SiteSlug;
  deskName: string;
  descriptor: string;
  frame: "exam" | "events" | "housing" | "business" | "facilities";
  submissionMode: SubmissionMode;
  sourceCadenceHours: number;
  primaryAction: string;
  secondaryAction: string;
  sourceFocus: string;
  audience: string;
  navigation: { label: string; href: string }[];
  homeSections: string[];
};

export const publicOperator = {
  name: "김재윤",
  organization: "콜로지스터",
  email: "jaeyun1391@gmail.com",
  phone: "010-7255-1301",
  address: "서울 강서구 등촌동 664-2 219호"
} as const;

const definitions: Record<SiteSlug, ExperienceDefinition> = {
  exam: {
    slug: "exam",
    deskName: "시험 운영 데스크",
    descriptor: "접수부터 결과 발표까지 움직이는 일정을 한 화면에서 보는 수험생 작업대",
    frame: "exam",
    submissionMode: "stability",
    sourceCadenceHours: 12,
    primaryAction: "접수 일정 보기",
    secondaryAction: "준비물 점검",
    sourceFocus: "Q-Net, 시행기관, 접수처 공지",
    audience: "접수 일정과 제출 마감을 함께 관리해야 하는 수험생",
    navigation: [
      { label: "일정판", href: "/items" },
      { label: "준비 가이드", href: "/guides" },
      { label: "출처", href: "/sources" }
    ],
    homeSections: ["이번 접수", "준비물 점검", "결과 발표", "공식 일정"]
  },
  events: {
    slug: "events",
    deskName: "주말 행사 편집 데스크",
    descriptor: "날짜, 지역, 우천, 예매 상태를 먼저 읽는 실제 방문용 행사 브리핑",
    frame: "events",
    submissionMode: "operating",
    sourceCadenceHours: 3,
    primaryAction: "이번 주 일정",
    secondaryAction: "우천 확인",
    sourceFocus: "행사 주최·예매처·관광·문화 기관 공지",
    audience: "출발 전 예매, 교통, 날씨 변수를 한 번에 확인하려는 방문자",
    navigation: [
      { label: "이번 주", href: "/items" },
      { label: "방문 가이드", href: "/guides" },
      { label: "편집 로그", href: "/updates" }
    ],
    homeSections: ["오늘의 브리핑", "이번 주말", "우천·교통", "가족 방문"]
  },
  housing: {
    slug: "housing",
    deskName: "청년 주거 판단실",
    descriptor: "조건을 단정하지 않고, 내 상황에서 먼저 확인할 순서를 만드는 주거지원 도구",
    frame: "housing",
    submissionMode: "stability",
    sourceCadenceHours: 6,
    primaryAction: "내 상황 점검",
    secondaryAction: "공고 찾아보기",
    sourceFocus: "마이홈, LH, 지자체 주거복지 공고",
    audience: "월세·임대주택·계약 서류를 함께 판단해야 하는 청년",
    navigation: [
      { label: "조건 점검", href: "/items" },
      { label: "서류 가이드", href: "/guides" },
      { label: "공식 출처", href: "/sources" }
    ],
    homeSections: ["상황 점검", "마감 공고", "서류·계약", "지역별 지원"]
  },
  business: {
    slug: "business",
    deskName: "사업자 지원 관제실",
    descriptor: "공고 제목보다 마감, 대상 업종, 제외 조건, 제출 흐름을 먼저 보는 지원사업 데스크",
    frame: "business",
    submissionMode: "operating",
    sourceCadenceHours: 3,
    primaryAction: "마감 공고 보기",
    secondaryAction: "신청 서류 점검",
    sourceFocus: "기업마당, 중소기업·지자체·운영기관 공고",
    audience: "사업장 조건과 준비 서류를 놓치지 않고 지원사업을 찾는 사업자",
    navigation: [
      { label: "마감 피드", href: "/items" },
      { label: "신청 가이드", href: "/guides" },
      { label: "운영 기준", href: "/editorial-policy" }
    ],
    homeSections: ["마감 임박", "업종·지역", "적합성 점검", "신청 후 일정"]
  },
  facilities: {
    slug: "facilities",
    deskName: "공공시설 찾기 데스크",
    descriptor: "예약, 취소, 요금, 주차, 이용 전화를 실제 방문 동선으로 정리하는 시설 탐색기",
    frame: "facilities",
    submissionMode: "stability",
    sourceCadenceHours: 6,
    primaryAction: "시설 찾아보기",
    secondaryAction: "예약 전 확인",
    sourceFocus: "지자체 공공예약·시설 운영기관 안내",
    audience: "시설별 예약과 현장 이용 조건을 비교해야 하는 시민",
    navigation: [
      { label: "시설 찾기", href: "/items" },
      { label: "이용 절차", href: "/guides" },
      { label: "운영 출처", href: "/sources" }
    ],
    homeSections: ["시설 지도", "예약·취소", "요금·주차", "지역 안내"]
  }
};

export function getExperience(slug: SiteSlug) {
  return definitions[slug];
}

export function documentLabel(document: string) {
  const labels: Record<string, string> = {
    about: "소개",
    "editorial-policy": "편집 기준",
    sources: "출처 정책",
    updates: "업데이트 기록",
    contact: "문의",
    privacy: "개인정보처리방침",
    terms: "이용약관",
    copyright: "저작권 정책",
    "youth-policy": "청소년 보호정책",
    "email-collection": "이메일 수집 거부",
    "adsense-playbook": "신청 운영 안내"
  };

  return labels[document] ?? "운영 문서";
}

export function documentDescription(document: string, siteName: string) {
  const descriptions: Record<string, string> = {
    about: `${siteName}의 운영 목적, 편집 범위, 운영자 정보와 제공하지 않는 서비스를 안내합니다.`,
    "editorial-policy": `${siteName}이 공식 원문을 검토하고 편집형 가이드를 공개하는 기준을 설명합니다.`,
    sources: `${siteName}이 일정과 조건을 확인할 때 우선하는 공식 출처와 인용 원칙을 공개합니다.`,
    updates: `${siteName}의 수집 연결, 정보 정정, 만료 처리와 편집 보강 기록을 확인합니다.`,
    contact: `${siteName}의 정보 정정 요청 방법과 운영자 문의 창구를 안내합니다.`,
    privacy: `${siteName}의 개인정보 처리 목적, 보관 기준, 이용자 권리와 문의 방법을 안내합니다.`,
    terms: `${siteName} 정보 이용 시 적용되는 이용 범위, 책임 제한, 금지 행위를 안내합니다.`,
    copyright: `${siteName}의 자체 편집물, 외부 출처, 저작권 침해 신고 처리 기준을 안내합니다.`,
    "youth-policy": `${siteName}의 청소년 보호 원칙과 유해 정보 대응, 신고 처리 기준을 공개합니다.`,
    "email-collection": `${siteName}은 전자우편 주소의 무단 수집과 자동 추출을 거부합니다.`,
    "adsense-playbook": `${siteName}의 광고 신청 전 점검 항목과 반려 후 운영 대응 절차를 기록합니다.`
  };

  return descriptions[document] ?? `${siteName}의 공개 운영 기준과 정보 확인 절차를 안내합니다.`;
}

type SupplementSeed = {
  title: string;
  summary: string;
  category: string;
  firstCheck: string;
  failurePoint: string;
  example: string;
};

const supplements: Record<SiteSlug, SupplementSeed[]> = {
  exam: [
    { title: "접수 마감일을 놓치지 않는 시험 캘린더 정리법", summary: "접수, 결제, 서류 제출, 결과 발표를 한 줄에 적지 않는 일정 관리 방법입니다.", category: "일정 관리", firstCheck: "시험일보다 접수 시작일과 결제 마감 시각을 따로 적는 일", failurePoint: "시험일만 저장해 두고 원서 결제나 사진 등록을 뒤늦게 확인하는 경우", example: "필기 접수 후 응시자격 서류 검토가 남는 시험은 접수 완료와 서류 승인 상태를 별도 칸으로 관리해야 합니다." },
    { title: "시험 접수 사진과 신분증을 전날에 다시 확인하는 이유", summary: "사진 규격과 인정 신분증은 시험별로 달라질 수 있어 마지막 확인이 필요합니다.", category: "준비물", firstCheck: "공식 접수처의 사진 규격과 인정 신분증 문구", failurePoint: "예전에 쓰던 사진이나 만료된 신분증을 그대로 준비하는 경우", example: "모바일 신분증 인정 여부와 학생증 허용 여부는 시행기관 공지에서 다르게 적힐 수 있습니다." },
    { title: "성적 발표일을 제출 마감에서 역산하는 방법", summary: "시험일보다 성적표 발급 가능일이 중요한 지원·채용 상황을 정리합니다.", category: "성적 활용", firstCheck: "성적 발표일과 성적표 발급 가능일", failurePoint: "발표일 당일에 즉시 제출용 문서를 발급할 수 있다고 가정하는 경우", example: "채용 마감일이 발표일과 같다면 제출처가 인정하는 시각과 성적 조회 화면 인정 여부를 먼저 확인해야 합니다." },
    { title: "CBT 시험장에서 입실 전 확인할 세 가지", summary: "시험장 위치, 입실 마감, 컴퓨터 기반 응시 규정을 사전에 확인하는 순서입니다.", category: "시험장", firstCheck: "입실 가능 시간과 시험장 위치", failurePoint: "시험 시작 시각만 보고 현장 등록 또는 신분 확인 시간을 고려하지 않는 경우", example: "도심 CBT 센터는 건물 출입 절차와 엘리베이터 대기 시간이 변수일 수 있습니다." }
  ],
  events: [
    { title: "무료 행사라고 적혀 있을 때 추가 비용을 확인하는 순서", summary: "입장료와 체험비, 주차비, 예약 수수료를 나눠 보는 방법입니다.", category: "무료 행사", firstCheck: "무료 범위가 입장인지 프로그램 전체인지", failurePoint: "무료 입장만 보고 유료 체험 회차와 주차비를 놓치는 경우", example: "가족 체험 행사는 보호자 입장료가 없더라도 재료비와 회차 예약이 따로 있을 수 있습니다." },
    { title: "우천 예보가 있는 야외 축제의 취소 공지 찾는 법", summary: "날씨 앱보다 주최 측 공지와 행사장 채널을 먼저 확인하는 절차입니다.", category: "우천 확인", firstCheck: "주최 측 공지 채널과 우천 대체 장소", failurePoint: "포스터 일정만 보고 출발해 현장 취소나 시간 변경을 뒤늦게 알게 되는 경우", example: "같은 비 예보라도 공연은 취소되고 전시 부스는 실내로 운영되는 식으로 프로그램마다 대응이 다릅니다." },
    { title: "전시 현장권과 사전예매를 비교할 때 확인할 항목", summary: "가격보다 입장 가능 시간과 매진 기준을 먼저 비교하는 가이드입니다.", category: "예매", firstCheck: "현장권 판매 여부와 마지막 입장 시간", failurePoint: "사전예매 마감과 현장권 수량을 같은 의미로 이해하는 경우", example: "주말 전시는 현장권이 있어도 대기 인원이나 회차 제한으로 원하는 시간에 입장하지 못할 수 있습니다." },
    { title: "아이와 행사에 갈 때 대기 공간부터 확인해야 하는 이유", summary: "연령 제한, 회차, 화장실, 유모차 동선까지 확인하는 가족 방문 체크리스트입니다.", category: "가족 방문", firstCheck: "연령 제한과 보호자 동반 기준", failurePoint: "행사 내용만 보고 대기·휴식 공간과 회차 운영을 확인하지 않는 경우", example: "체험 시작 전 대기가 길면 아이의 식사·휴식 계획이 행사 만족도에 더 큰 영향을 줍니다." }
  ],
  housing: [
    { title: "청년 월세지원 신청 전 주소 증빙을 확인하는 순서", summary: "등본, 계약서, 전입신고 상태가 서로 맞는지 보는 방법입니다.", category: "신청서류", firstCheck: "계약서 주소와 주민등록 주소의 일치 여부", failurePoint: "계약은 했지만 전입신고 시점이나 세대 분리 기준을 확인하지 않는 경우", example: "주소지가 다르면 지원 대상 판단보다 먼저 어떤 서류로 현재 거주를 증명할지 정리해야 합니다." },
    { title: "전세·월세 계약서에서 지원 신청 전에 볼 항목", summary: "보증금, 월세, 계약 기간, 임대인 정보가 공고 기준과 맞는지 점검합니다.", category: "계약", firstCheck: "계약 기간과 보증금·월세 표기", failurePoint: "계약서 특약이나 공동임차 형태를 공고 기준과 대조하지 않는 경우", example: "월세 지원은 실제 납부 증빙이 필요할 수 있어 계약서 금액과 이체 내역이 달라지지 않게 관리해야 합니다." },
    { title: "가구·소득 기준을 읽을 때 혼동하기 쉬운 지점", summary: "본인 소득, 원가구, 독립가구 기준을 섞지 않고 확인하는 방법입니다.", category: "조건", firstCheck: "공고가 어떤 가구 기준을 쓰는지", failurePoint: "본인 소득만 확인하고 원가구 또는 재산 기준을 놓치는 경우", example: "같은 청년 지원이라도 나이, 혼인 여부, 전입 시점에 따라 보는 가구 범위가 달라질 수 있습니다." },
    { title: "임대주택 공고를 읽을 때 모집 세대수보다 먼저 볼 것", summary: "공급 유형, 지역 우선, 예비 입주자, 접수 창구를 순서대로 해석합니다.", category: "임대주택", firstCheck: "공급 유형과 지역 우선 기준", failurePoint: "모집 세대수만 보고 본인에게 해당하는 신청 단위를 확인하지 않는 경우", example: "예비 입주자 모집은 실제 입주 시점과 대기 순번 안내가 중요한 변수입니다." }
  ],
  business: [
    { title: "지원사업 공고문에서 제외 업종을 먼저 읽는 이유", summary: "지원 내용보다 대상 업종과 제외 조건을 먼저 확인하는 신청 전략입니다.", category: "공고 해석", firstCheck: "지원 제외 업종과 사업장 소재지", failurePoint: "지원 금액만 보고 업종 코드, 매출 기준, 사업자 등록 시점을 뒤늦게 확인하는 경우", example: "같은 사업이라도 프랜차이즈 가맹점, 휴·폐업 이력, 중복 수혜 여부가 판단에 영향을 줄 수 있습니다." },
    { title: "자부담과 승인 전 지출을 공고문에서 구분하는 법", summary: "보조율, 선집행 여부, 증빙 시점을 헷갈리지 않도록 정리합니다.", category: "정산", firstCheck: "자부담 비율과 승인 전 집행 가능 여부", failurePoint: "선정 전 결제한 비용을 나중에 정산할 수 있다고 가정하는 경우", example: "시설 개선 사업은 견적서, 계약서, 이체 증빙의 날짜 순서가 정산 기준에 영향을 줄 수 있습니다." },
    { title: "사업자 지원사업 기본 서류를 미리 준비하는 순서", summary: "사업자등록증, 매출·국세·지방세 증빙을 공고별로 다시 확인하는 방법입니다.", category: "신청서류", firstCheck: "발급일 제한이 있는 서류", failurePoint: "기존에 발급한 증명서를 그대로 쓰려다 유효 기간을 넘기는 경우", example: "온라인 신청 시스템은 파일명·용량·서명 누락으로도 제출이 막힐 수 있습니다." },
    { title: "마감일이 같은 공고를 동시에 준비할 때 우선순위", summary: "적합성, 서류 난이도, 자부담, 후속 정산 부담으로 순서를 정합니다.", category: "마감 관리", firstCheck: "사업장 조건과 제출 가능 서류", failurePoint: "지원 금액이 큰 공고만 보고 준비 시간과 정산 의무를 고려하지 않는 경우", example: "지원 규모가 작아도 서류가 이미 준비된 공고가 실제 신청 가능성은 더 높을 수 있습니다." }
  ],
  facilities: [
    { title: "공공시설 예약 전 취소 규정을 먼저 보는 방법", summary: "예약 가능 여부보다 취소 수수료와 노쇼 기준을 먼저 확인하는 가이드입니다.", category: "예약", firstCheck: "취소 가능 시각과 노쇼 제한", failurePoint: "예약만 완료하고 이용일 변경이나 환불 규정을 확인하지 않는 경우", example: "체육시설은 당일 취소가 불가하거나 다음 예약에 제한이 생길 수 있습니다." },
    { title: "공영주차장 이용 전 요금표에서 놓치기 쉬운 항목", summary: "기본 요금, 추가 요금, 할인 대상, 운영 시간을 나눠 보는 방법입니다.", category: "공영주차장", firstCheck: "운영 시간과 할인 적용 조건", failurePoint: "시간당 요금만 보고 야간 운영, 정기권, 감면 증빙을 확인하지 않는 경우", example: "같은 지역이라도 공영·민간 위탁 여부에 따라 할인 절차와 결제 수단이 다를 수 있습니다." },
    { title: "도서관 시설 이용 전에 좌석·휴관일을 확인하는 이유", summary: "열람실, 자료실, 문화 프로그램의 운영 시간이 서로 다를 수 있습니다.", category: "도서관", firstCheck: "시설별 운영 시간과 휴관일", failurePoint: "도서관 전체 개관 시간만 보고 원하는 공간이 열려 있다고 생각하는 경우", example: "시험 기간 좌석 예약은 현장 접수와 앱 예약의 규칙이 다르게 적용될 수 있습니다." },
    { title: "체육시설 이용권을 결제하기 전 확인할 네 가지", summary: "강습 회차, 환불, 락커, 주차 조건을 한 번에 비교합니다.", category: "체육시설", firstCheck: "강습 일정과 환불 기준", failurePoint: "월 이용료만 비교하고 보관함·주차·재등록 조건을 놓치는 경우", example: "수영장과 헬스장은 같은 시설 안에서도 휴장일과 강습 변경 규정이 다를 수 있습니다." }
  ]
};

function makeSupplementalGuide(site: SiteConfig, seed: SupplementSeed, index: number): Guide {
  const experience = getExperience(site.slug);
  return {
    slug: `desk-${site.slug}-${index + 1}`,
    title: seed.title,
    summary: seed.summary,
    category: seed.category,
    updatedAt: new Date().toISOString().slice(0, 10),
    readingTime: "6분",
    audience: experience.audience,
    keyChecks: [seed.firstCheck, seed.failurePoint, "공식 원문과 변경 공지"],
    body: [
      "## 한 줄 결론",
      `${seed.summary} 이 글은 결과를 단정하는 대신, ${experience.audience}이 실제로 멈추는 지점을 먼저 확인하도록 돕습니다.`,
      "## 먼저 확인할 기준",
      `${seed.firstCheck}부터 공식 원문에서 확인하세요. 공고나 운영 기준은 제목이 같아도 시행 시기와 기관에 따라 달라질 수 있습니다.`,
      "### 자주 놓치는 지점",
      `${seed.failurePoint} ${seed.example}`,
      "## 실제로 정리하는 순서",
      `- 공식 안내의 적용 기간과 접수 또는 이용 창구를 저장합니다.\n- 본인 상황과 관련된 예외·제외 조건을 따로 표시합니다.\n- 필요한 서류, 결제, 예약, 이동처럼 당일에 바꾸기 어려운 항목을 먼저 준비합니다.\n- 출발 또는 신청 직전에 변경 공지를 다시 확인합니다.`,
      "## 공식 출처를 다시 볼 때",
      `${experience.sourceFocus}에서 원문 날짜와 변경 공지를 확인해야 합니다. 이 페이지의 요약은 확인 순서를 돕는 자료이며, 최종 판단은 해당 기관의 최신 안내를 기준으로 합니다.`,
      "## 관련 질문",
      `같은 문제로 막혔다면 ${experience.primaryAction} 메뉴에서 관련 공지와 세부 가이드를 함께 확인하세요. 운영 데스크는 새 오류·정정 요청을 기록해 다음 업데이트에 반영합니다.`
    ],
    sourceLinks: [],
    nextReviewAt: "공식 공지 변경 시"
  };
}

export function getEditorialGuides(site: SiteConfig) {
  const seen = new Set<string>();
  const base = site.guides.filter((guide) => {
    if (seen.has(guide.slug)) return false;
    seen.add(guide.slug);
    return true;
  });

  if (base.length >= 12) return base;

  const additions = supplements[site.slug]
    .map((seed, index) => makeSupplementalGuide(site, seed, index))
    .filter((guide) => !seen.has(guide.slug));

  return [...base, ...additions];
}

export function populatedCategories(site: SiteConfig) {
  return site.categories.filter((category) => site.items.some((item) => item.category === category));
}
