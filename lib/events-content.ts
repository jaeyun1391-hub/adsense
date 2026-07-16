import type { Guide, InfoItem, SiteConfig } from "@/lib/sites";

function eventsDateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const eventsReviewDate = eventsDateAfter(0);
export const eventsNextReviewDate = eventsDateAfter(7);

type EventLink = {
  label: string;
  url: string;
};

type EventMeta = {
  eventDateStatus: string;
  venue: string;
  bookingType: string;
  priceNote: string;
  weatherRisk: string;
  trafficNote: string;
  familyFit: string;
  lastCheckedAt: string;
  officialLinks: EventLink[];
  statusBadges: string[];
  bestFor: string;
  editorNote: string;
  avoidNote: string;
  sourceCheck: string;
  eventSchema?: {
    startDate: string;
    endDate?: string;
    locationName: string;
  };
};

type EventSeed = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  region: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  meta: Omit<EventMeta, "lastCheckedAt" | "officialLinks"> & {
    officialLinks?: EventLink[];
  };
};

type EventGuideSeed = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  focus: string;
  checklist: string[];
};

const categoryDefaults: Record<string, Partial<EventMeta>> = {
  "축제": {
    bookingType: "행사별 사전예매와 현장 관람 조건 분리 확인",
    priceNote: "입장료와 체험비가 분리될 수 있어 프로그램표 확인 필요",
    weatherRisk: "야외 프로그램은 우천, 강풍, 폭염 공지 확인",
    trafficNote: "행사 종료 직후 대중교통과 임시 통제 구간 확인",
    familyFit: "동행자 연령과 체류 시간을 먼저 정한 뒤 방문 추천",
    statusBadges: ["우천확인", "교통통제", "현장혼잡"],
    bestFor: "야외 일정과 지역 이동을 함께 계획하는 방문자",
    avoidNote: "마지막 공연 직후 바로 귀가해야 한다면 혼잡도가 높을 수 있습니다."
  },
  "전시": {
    bookingType: "사전등록, 현장권, 마지막 입장 시간 확인",
    priceNote: "무료 전시라도 특별전, 굿즈, 주차비는 별도일 수 있음",
    weatherRisk: "실내 행사지만 이동 동선과 대기 줄은 날씨 영향 가능",
    trafficNote: "전시장 주차장 만차와 주변 대체 주차장 확인",
    familyFit: "아이 동반 시 체험 회차와 휴식 공간 확인",
    statusBadges: ["사전등록", "실내", "입장마감"],
    bestFor: "전시 관람 시간을 안정적으로 확보하려는 방문자",
    avoidNote: "입장 마감 직전에 도착하면 주요 부스 관람 시간이 부족할 수 있습니다."
  },
  "체험": {
    bookingType: "회차별 예약, 현장 선착순, 연령 제한 확인",
    priceNote: "재료비와 보호자 동반 비용이 따로 붙을 수 있음",
    weatherRisk: "야외 체험은 우천 시 실내 대체 여부 확인",
    trafficNote: "체험 시작 30분 전 도착 가능한 이동 시간 확보",
    familyFit: "초등 저학년 이하 동반은 대기 공간과 화장실 위치 확인",
    statusBadges: ["회차예약", "연령확인", "가족방문"],
    bestFor: "아이와 함께 짧은 회차형 프로그램을 찾는 방문자",
    avoidNote: "현장 선착순만 믿고 늦게 도착하면 체험 재료가 소진될 수 있습니다."
  },
  "가족 나들이": {
    bookingType: "입장권, 체험권, 동반자 기준 확인",
    priceNote: "입장권 외 식사, 관람차, 체험비를 따로 계산",
    weatherRisk: "폭염, 우천, 미세먼지 때 실내 대안 확인",
    trafficNote: "주차장에서 행사장까지 도보 거리와 유모차 이동 확인",
    familyFit: "유아, 초등, 부모 동반 여부에 따라 추천 동선 분리",
    statusBadges: ["가족방문", "편의시설", "대체동선"],
    bestFor: "아이 또는 부모님과 반나절 코스를 짜는 방문자",
    avoidNote: "휴식 공간이 적은 행사는 장시간 체류보다 짧은 방문이 현실적입니다."
  },
  "무료 행사": {
    bookingType: "무료입장 여부와 사전 예약 필요 여부 확인",
    priceNote: "입장 무료와 체험 무료는 다를 수 있어 비용 범위 분리",
    weatherRisk: "야외 무료 공연은 우천 취소 공지 확인",
    trafficNote: "무료 행사는 입장 집중 시간이 빨라 대중교통 우선 검토",
    familyFit: "비용 부담은 낮지만 대기와 화장실 위치 확인 필요",
    statusBadges: ["무료입장", "예약확인", "혼잡주의"],
    bestFor: "입장료 부담 없이 짧게 둘러볼 행사를 찾는 방문자",
    avoidNote: "무료라는 이유만으로 늦게 출발하면 입장 대기와 자리 부족이 생길 수 있습니다."
  }
};

const slugMeta: Record<string, Partial<EventMeta>> = {
  "seoul-book-fair-visit": {
    venue: "서울 주요 전시장",
    eventDateStatus: "연례 도서전 공식 공지에서 회차별 일정 확인",
    bookingType: "사전등록, 현장권, 강연 프로그램 예약을 분리 확인",
    editorNote: "책 구매보다 강연과 부스 동선을 먼저 정해야 만족도가 높습니다.",
    sourceCheck: "공식 홈페이지의 관람 안내와 프로그램표를 함께 확인하세요."
  },
  "busan-fireworks-guide": {
    venue: "부산 광안리 일대",
    eventDateStatus: "하반기 공식 일정과 교통 통제 공지 확인",
    bookingType: "일반 관람 구역과 유료 좌석 공지 분리 확인",
    editorNote: "관람 위치보다 귀가 동선이 더 중요하게 작동하는 대형 야간 행사입니다.",
    sourceCheck: "부산문화관광축제조직위원회와 부산시 교통 공지를 함께 확인하세요."
  },
  "seoul-design-festival": {
    venue: "서울 전시장",
    eventDateStatus: "공식 전시 일정과 사전등록 기간 확인",
    editorNote: "브랜드 부스와 강연 프로그램을 먼저 고르면 현장 체류 시간을 줄일 수 있습니다.",
    sourceCheck: "공식 홈페이지의 티켓 안내, 입장 마감, 참가 브랜드 공지를 대조하세요."
  },
  "bexco-exhibition": {
    venue: "부산 BEXCO",
    eventDateStatus: "BEXCO 행사 캘린더에서 전시장 홀과 개최일 확인",
    trafficNote: "전시장 홀 위치와 주변 주차장 만차 가능성을 함께 확인",
    editorNote: "같은 벡스코 행사라도 홀 위치에 따라 이동 시간과 주차장이 달라집니다.",
    sourceCheck: "BEXCO 공식 일정표와 개별 전시 공식 페이지를 함께 확인하세요."
  },
  "suncheon-garden": {
    venue: "순천만국가정원",
    eventDateStatus: "정원 운영 시간과 시즌 행사 공지 확인",
    familyFit: "가족 나들이는 관람차, 휴식 공간, 식사 동선을 먼저 확인",
    editorNote: "반나절 이상 머무르는 공간이라 입장권보다 체력 배분이 더 중요합니다.",
    sourceCheck: "순천만국가정원 공식 운영 안내와 행사 공지를 확인하세요."
  },
  "goyang-flower": {
    venue: "고양 꽃전시관 및 일산호수공원 일대",
    eventDateStatus: "공식 꽃박람회 개최 기간과 사전예매 공지 확인",
    editorNote: "꽃 전시는 낮 시간 사진 수요가 몰려 오전 입장이 비교적 안정적입니다.",
    sourceCheck: "공식 홈페이지에서 입장권, 프로그램, 주차 안내를 함께 보세요."
  }
};

function sourceLinks(seed: EventSeed | InfoItem): EventLink[] {
  const links = [
    { label: seed.source, url: seed.sourceUrl },
    { label: "대한민국 구석구석", url: "https://korean.visitkorea.or.kr/" },
    { label: "문화포털", url: "https://www.culture.go.kr/" }
  ];
  return links.filter((link, index, list) => list.findIndex((item) => item.url === link.url) === index);
}

function createEventItem(seed: EventSeed): InfoItem {
  return {
    slug: seed.slug,
    title: seed.title,
    summary: seed.summary,
    category: seed.category,
    region: seed.region,
    period: seed.meta.eventDateStatus,
    source: seed.source,
    sourceUrl: seed.sourceUrl,
    updatedAt: eventsReviewDate,
    tags: seed.tags,
    details: {
      "장소": seed.meta.venue,
      "예매": seed.meta.bookingType,
      "비용": seed.meta.priceNote,
      "방문 주의": seed.meta.avoidNote
    },
    body: [],
    faq: [],
    ...seed.meta,
    lastCheckedAt: eventsReviewDate,
    officialLinks: seed.meta.officialLinks ?? sourceLinks(seed)
  };
}

export const extraEventItems: InfoItem[] = [
  createEventItem({
    slug: "gwanghwamun-square-weekend",
    title: "광화문광장 주말 무료 행사 확인",
    summary: "광화문광장 주말 프로그램을 무료입장, 현장 혼잡, 우천 변경 기준으로 정리했습니다.",
    category: "무료 행사",
    region: "서울",
    source: "광화문광장",
    sourceUrl: "https://gwanghwamun.seoul.go.kr/",
    tags: ["광화문", "무료", "주말"],
    meta: {
      eventDateStatus: "광장 공식 프로그램 공지에서 주말 일정 확인",
      venue: "서울 광화문광장",
      bookingType: "대부분 자유 관람이나 일부 체험은 사전 신청 가능",
      priceNote: "입장 무료, 체험 부스와 주변 소비는 별도",
      weatherRisk: "우천, 폭염, 집회·교통 통제 공지 확인",
      trafficNote: "광화문역, 경복궁역, 시청역 분산 이동 권장",
      familyFit: "유모차 이동은 가능하지만 행사 밀집 시간은 피하는 편이 좋음",
      statusBadges: ["무료입장", "도심행사", "교통확인"],
      bestFor: "서울 도심에서 짧게 들를 무료 행사를 찾는 방문자",
      editorNote: "도심 광장은 행사보다 현장 통제와 인파 변화가 더 빨리 바뀝니다.",
      avoidNote: "집회나 교통 통제가 겹치는 날은 같은 행사라도 체감 혼잡이 크게 올라갑니다.",
      sourceCheck: "광화문광장 공지와 서울시 교통 안내를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "hangang-park-free-program",
    title: "한강공원 무료 프로그램 방문 전 체크",
    summary: "한강공원 무료 공연과 체험을 날씨, 돗자리 가능 여부, 귀가 동선 기준으로 정리했습니다.",
    category: "무료 행사",
    region: "서울",
    source: "서울시 한강사업본부",
    sourceUrl: "https://hangang.seoul.go.kr/",
    tags: ["한강", "무료공연", "야외"],
    meta: {
      eventDateStatus: "공원별 프로그램 공지에서 운영일 확인",
      venue: "서울 한강공원 일대",
      bookingType: "자유 관람 중심, 일부 프로그램은 사전 접수 가능",
      priceNote: "입장 무료이나 주차, 매점, 대여 비용은 별도",
      weatherRisk: "우천, 강풍, 폭염 때 프로그램 취소 가능",
      trafficNote: "행사 종료 후 지하철역까지 도보 시간을 넉넉히 계산",
      familyFit: "아이 동반은 화장실, 그늘, 물품 보관 위치를 먼저 확인",
      statusBadges: ["무료입장", "우천확인", "야외"],
      bestFor: "저녁 산책과 짧은 야외 공연을 함께 보고 싶은 방문자",
      editorNote: "한강 행사는 이동 거리가 길어 가장 가까운 역만 보고 출발하면 피곤해지기 쉽습니다.",
      avoidNote: "폭염 특보나 강풍 예보가 있는 날은 실내 대안을 먼저 정하세요.",
      sourceCheck: "한강공원 공식 공지에서 공원명, 장소, 취소 기준을 확인하세요."
    }
  }),
  createEventItem({
    slug: "seoul-culture-portal-free-weekend",
    title: "서울문화포털 무료 주말 행사 찾기",
    summary: "서울문화포털에서 무료 전시와 공연을 고를 때 확인해야 할 예약, 연령, 장소 기준입니다.",
    category: "무료 행사",
    region: "서울",
    source: "서울문화포털",
    sourceUrl: "https://culture.seoul.go.kr/",
    tags: ["서울", "무료전시", "문화포털"],
    meta: {
      eventDateStatus: "서울문화포털 행사 목록에서 회차별 일정 확인",
      venue: "서울시 공공문화공간",
      bookingType: "행사별 예약, 선착순, 자유 관람 여부 확인",
      priceNote: "무료 표기라도 일부 체험 재료비가 있을 수 있음",
      weatherRisk: "실내외 장소에 따라 우천 영향 분리 확인",
      trafficNote: "자치구별 장소가 흩어져 있어 지도 위치 확인 필요",
      familyFit: "연령 제한과 보호자 동반 여부를 먼저 확인",
      statusBadges: ["무료입장", "예약확인", "실내대안"],
      bestFor: "주말 비용 부담을 줄이면서 문화공간을 찾는 방문자",
      editorNote: "포털 목록은 시작점이고, 최종 조건은 각 운영기관 페이지에서 다시 봐야 합니다.",
      avoidNote: "무료 키워드만 보고 선택하면 예약 마감 행사에 걸릴 수 있습니다.",
      sourceCheck: "서울문화포털 목록과 개별 기관 공지를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "busan-weekend-free-culture",
    title: "부산 주말 무료 문화행사 확인",
    summary: "부산 지역 무료 문화행사를 해변, 공원, 공연장별 이동 기준으로 정리했습니다.",
    category: "무료 행사",
    region: "부산",
    source: "비짓부산",
    sourceUrl: "https://www.visitbusan.net/",
    tags: ["부산", "무료", "주말"],
    meta: {
      eventDateStatus: "비짓부산과 행사 공식 공지에서 운영일 확인",
      venue: "부산 주요 관광·문화 공간",
      bookingType: "자유 관람과 사전 신청 프로그램 분리 확인",
      priceNote: "입장 무료 행사도 교통비, 주차비, 체험비는 별도",
      weatherRisk: "해변·야외 공연은 바람과 우천 공지 확인",
      trafficNote: "해운대, 광안리, 원도심은 귀가 시간 혼잡 확인",
      familyFit: "해변 행사는 아이 동반 시 귀가와 식사 동선을 먼저 정리",
      statusBadges: ["무료입장", "해변동선", "귀가확인"],
      bestFor: "부산 여행 중 비용 부담을 줄일 짧은 일정을 찾는 방문자",
      editorNote: "부산은 같은 무료 행사라도 해변과 원도심의 이동 피로도가 다릅니다.",
      avoidNote: "막차 시간이 빠듯한 야간 무료 공연은 마지막까지 보기 어렵습니다.",
      sourceCheck: "비짓부산 행사 안내와 주최 측 공지를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "daejeon-free-science-weekend",
    title: "대전 과학 무료 체험 주말 코스",
    summary: "대전 과학 관련 무료 체험을 회차, 연령, 실내 대안 기준으로 정리했습니다.",
    category: "무료 행사",
    region: "대전",
    source: "대전광역시 관광",
    sourceUrl: "https://www.daejeon.go.kr/tou/",
    tags: ["대전", "과학", "무료체험"],
    meta: {
      eventDateStatus: "대전 관광·기관 공지에서 프로그램 회차 확인",
      venue: "대전 과학문화 공간",
      bookingType: "회차별 선착순 또는 사전 접수 여부 확인",
      priceNote: "입장 무료라도 특별 체험 재료비 확인",
      weatherRisk: "실내 체험은 안정적이나 이동 구간 우천 확인",
      trafficNote: "기관 간 거리가 있어 한나절에 1~2곳만 추천",
      familyFit: "초등 동반은 체험 난이도와 소요 시간을 먼저 확인",
      statusBadges: ["무료체험", "연령확인", "회차예약"],
      bestFor: "아이와 교육형 주말 일정을 찾는 가족",
      editorNote: "과학 체험은 무료보다 회차 정원이 더 빨리 마감되는지 봐야 합니다.",
      avoidNote: "예약 없이 여러 체험을 이어 붙이면 대기 시간이 길어질 수 있습니다.",
      sourceCheck: "대전 관광 안내와 각 과학기관 공지를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "suwon-free-museum-day",
    title: "수원 무료 전시·박물관 방문 노트",
    summary: "수원 지역 무료 전시와 박물관 방문을 휴관일, 주차, 주변 동선 기준으로 정리했습니다.",
    category: "무료 행사",
    region: "경기",
    source: "수원문화재단",
    sourceUrl: "https://www.swcf.or.kr/",
    tags: ["수원", "무료전시", "박물관"],
    meta: {
      eventDateStatus: "수원문화재단과 시설별 공지에서 운영일 확인",
      venue: "수원 문화시설 및 전시공간",
      bookingType: "자유 관람, 해설 예약, 체험 접수 구분",
      priceNote: "상설 무료와 특별 유료 프로그램 분리 확인",
      weatherRisk: "실내 중심이나 화성 일대 이동은 우천 영향 가능",
      trafficNote: "행궁동 혼잡 시간과 공영주차장 만차 가능성 확인",
      familyFit: "역사·전시 코스는 초등 이상 동반에 비교적 적합",
      statusBadges: ["무료전시", "휴관확인", "주차주의"],
      bestFor: "비용 부담 없이 반나절 역사·전시 코스를 찾는 방문자",
      editorNote: "수원은 행사장보다 주변 보행 동선과 주차 대안이 만족도를 좌우합니다.",
      avoidNote: "주말 오후 행궁동 혼잡 시간에는 차량 이동이 비효율적일 수 있습니다.",
      sourceCheck: "수원문화재단 안내와 개별 시설 공지를 확인하세요."
    }
  }),
  createEventItem({
    slug: "sejong-lake-park-free-event",
    title: "세종호수공원 무료 행사 체크",
    summary: "세종호수공원 무료 행사를 돗자리, 주차, 야간 귀가 기준으로 정리했습니다.",
    category: "무료 행사",
    region: "세종",
    source: "세종특별자치시 관광",
    sourceUrl: "https://www.sejong.go.kr/tour.do",
    tags: ["세종", "호수공원", "무료"],
    meta: {
      eventDateStatus: "세종시 관광·문화 공지에서 행사일 확인",
      venue: "세종호수공원 일대",
      bookingType: "자유 관람 중심, 일부 체험은 사전 신청 가능",
      priceNote: "입장 무료이나 주차와 주변 소비는 별도",
      weatherRisk: "호수공원 야외 행사는 바람과 우천 공지 확인",
      trafficNote: "공원 주차장 위치와 행사장까지 도보 거리 확인",
      familyFit: "가족 방문은 화장실, 그늘, 휴식 구역을 먼저 확인",
      statusBadges: ["무료입장", "공원행사", "우천확인"],
      bestFor: "공원 산책과 무료 공연을 함께 보고 싶은 가족",
      editorNote: "넓은 공원 행사는 행사장 위치를 정확히 찍고 출발해야 걷는 시간을 줄입니다.",
      avoidNote: "돗자리 가능 여부를 모르면 현장 체류가 불편할 수 있습니다.",
      sourceCheck: "세종시 공식 관광·문화 공지에서 장소 세부 위치를 확인하세요."
    }
  }),
  createEventItem({
    slug: "gangneung-beach-free-busking",
    title: "강릉 해변 무료 공연 방문 전 확인",
    summary: "강릉 해변 무료 공연을 날씨, 주차, 숙박 동선 기준으로 점검합니다.",
    category: "무료 행사",
    region: "강원",
    source: "강릉시 문화관광",
    sourceUrl: "https://www.gn.go.kr/tour/",
    tags: ["강릉", "해변", "무료공연"],
    meta: {
      eventDateStatus: "강릉시 관광 공지와 행사별 안내에서 운영일 확인",
      venue: "강릉 해변 및 관광지 일대",
      bookingType: "자유 관람 중심, 특정 공연은 좌석 제한 확인",
      priceNote: "공연 관람은 무료일 수 있으나 주차·숙박·식사 비용 별도",
      weatherRisk: "해변 공연은 강풍, 우천, 파도 영향 확인",
      trafficNote: "해변 주차장 만차와 숙소까지 귀가 동선 확인",
      familyFit: "아이 동반은 바람, 모래, 야간 체류 시간을 고려",
      statusBadges: ["무료공연", "해변행사", "강풍확인"],
      bestFor: "강릉 여행 중 저녁 무료 공연을 곁들이려는 방문자",
      editorNote: "해변 공연은 분위기는 좋지만 날씨 영향을 가장 직접적으로 받습니다.",
      avoidNote: "숙소가 멀다면 공연 종료 후 택시 대기 시간이 길어질 수 있습니다.",
      sourceCheck: "강릉시 문화관광 공지와 주최 측 안내를 함께 보세요."
    }
  }),
  createEventItem({
    slug: "jeju-local-market-festival",
    title: "제주 지역 장터형 행사 방문 기준",
    summary: "제주 장터형 행사를 렌터카 이동, 우천, 현장 결제 기준으로 정리했습니다.",
    category: "축제",
    region: "제주",
    source: "비짓제주",
    sourceUrl: "https://www.visitjeju.net/",
    tags: ["제주", "장터", "여행"],
    meta: {
      eventDateStatus: "비짓제주 행사 안내에서 지역별 운영일 확인",
      venue: "제주 지역 행사장",
      bookingType: "자유 방문 중심, 일부 체험 사전 접수 가능",
      priceNote: "입장 무료라도 체험, 식음료, 주차 비용 별도",
      weatherRisk: "제주 날씨와 바람에 따른 운영 변경 확인",
      trafficNote: "렌터카 주차장과 대중교통 막차 시간 확인",
      familyFit: "가족 여행은 화장실, 그늘, 이동 시간을 먼저 확인",
      statusBadges: ["지역축제", "현장결제", "날씨확인"],
      bestFor: "제주 여행 중 짧은 지역 행사를 끼워 넣는 방문자",
      editorNote: "제주는 같은 거리라도 날씨와 주차 상황에 따라 체감 이동 시간이 달라집니다.",
      avoidNote: "비행기 시간 직전에 장터형 행사를 넣으면 이동 변수가 큽니다.",
      sourceCheck: "비짓제주 행사 안내와 주최 측 SNS 공지를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "cheongju-culture-market",
    title: "청주 문화마켓 주말 방문 노트",
    summary: "청주 문화마켓형 행사를 작가 부스, 체험비, 주차 기준으로 정리했습니다.",
    category: "체험",
    region: "충북",
    source: "청주시 문화관광",
    sourceUrl: "https://www.cheongju.go.kr/tour/index.do",
    tags: ["청주", "마켓", "체험"],
    meta: {
      eventDateStatus: "청주시 문화관광 공지에서 행사일 확인",
      venue: "청주 문화공간 및 마켓 행사장",
      bookingType: "자유 관람과 체험 예약 분리 확인",
      priceNote: "관람은 무료라도 체험비와 굿즈 구매 비용 별도",
      weatherRisk: "실외 마켓은 우천 시 부스 운영 변경 가능",
      trafficNote: "행사장 주변 공영주차장과 도보 이동 확인",
      familyFit: "아이와 함께라면 체험 소요 시간과 대기 줄 확인",
      statusBadges: ["체험", "마켓", "주차확인"],
      bestFor: "작가 부스와 짧은 체험을 함께 보는 방문자",
      editorNote: "마켓형 행사는 부스별 운영 시간이 달라 관심 부스를 먼저 정하는 편이 좋습니다.",
      avoidNote: "현장 결제 수단이 제한될 수 있어 카드와 간편결제를 함께 준비하세요.",
      sourceCheck: "청주시 문화관광 공지와 행사 주최 안내를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "daegu-street-concert",
    title: "대구 거리공연 행사 체크",
    summary: "대구 거리공연을 공연 시간, 우천 변경, 귀가 동선 중심으로 정리했습니다.",
    category: "축제",
    region: "대구",
    source: "대구문화예술진흥원",
    sourceUrl: "https://dgfc.or.kr/",
    tags: ["대구", "거리공연", "야간"],
    meta: {
      eventDateStatus: "대구문화예술진흥원과 주최 공지에서 회차 확인",
      venue: "대구 도심 공연 공간",
      bookingType: "자유 관람 중심, 일부 좌석제 공연 확인",
      priceNote: "관람 무료라도 주변 주차와 식음료 비용 별도",
      weatherRisk: "우천, 폭염, 강풍 때 공연 장소 변경 가능",
      trafficNote: "동성로·중앙로 일대 보행 혼잡과 막차 확인",
      familyFit: "야간 공연은 아이 동반 시 귀가 시간을 먼저 정리",
      statusBadges: ["거리공연", "우천확인", "야간"],
      bestFor: "저녁 시간대 가볍게 공연을 보고 싶은 방문자",
      editorNote: "거리공연은 시작 시간보다 실제 관람 가능한 자리 확보가 중요합니다.",
      avoidNote: "소음이나 긴 대기가 부담스럽다면 실내 공연을 대안으로 두세요.",
      sourceCheck: "대구문화예술진흥원과 주최 측 공지를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "gwangju-street-art-day",
    title: "광주 거리예술 행사 방문 기준",
    summary: "광주 거리예술 행사를 공연 위치, 보행 동선, 우천 변경 기준으로 정리했습니다.",
    category: "축제",
    region: "광주",
    source: "광주문화재단",
    sourceUrl: "https://www.gjcf.or.kr/",
    tags: ["광주", "거리예술", "공연"],
    meta: {
      eventDateStatus: "광주문화재단과 행사 공식 공지에서 운영일 확인",
      venue: "광주 도심 문화공간",
      bookingType: "자유 관람 중심, 일부 프로그램 예약 여부 확인",
      priceNote: "관람 무료 행사라도 체험과 주변 소비 비용 별도",
      weatherRisk: "거리 공연은 우천 시 장소 변경 또는 취소 가능",
      trafficNote: "공연 위치가 여러 곳이면 도보 이동 시간을 먼저 계산",
      familyFit: "아이 동반은 공연 소리 크기와 휴식 공간 확인",
      statusBadges: ["거리예술", "무료가능", "우천확인"],
      bestFor: "도심 산책과 공연을 함께 보려는 방문자",
      editorNote: "거리예술은 한 장소에 머무르기보다 이동하며 보는 구조가 많습니다.",
      avoidNote: "한 공연을 끝까지 봐야 하는 일정이라면 회차 시간을 정확히 확인하세요.",
      sourceCheck: "광주문화재단 공지와 개별 행사 안내를 함께 보세요."
    }
  }),
  createEventItem({
    slug: "incheon-open-port-night",
    title: "인천 개항장 야간 행사 동선",
    summary: "인천 개항장 야간 행사를 조명, 도보 이동, 귀가 교통 기준으로 정리했습니다.",
    category: "축제",
    region: "인천",
    source: "인천투어",
    sourceUrl: "https://itour.incheon.go.kr/",
    tags: ["인천", "개항장", "야간"],
    meta: {
      eventDateStatus: "인천투어와 주최 측 공지에서 야간 운영일 확인",
      venue: "인천 개항장 일대",
      bookingType: "자유 관람과 프로그램 예약 분리 확인",
      priceNote: "거리 관람은 무료 가능, 체험·전시·식음료는 별도",
      weatherRisk: "야간 우천 시 보행 동선과 사진 촬영 조건 확인",
      trafficNote: "인천역, 차이나타운, 개항장 이동 동선 확인",
      familyFit: "야간 방문은 아이 동반 시 귀가 시간을 짧게 잡는 편이 좋음",
      statusBadges: ["야간행사", "도보동선", "교통확인"],
      bestFor: "인천 도심 야간 산책과 행사를 묶어보려는 방문자",
      editorNote: "개항장은 골목 이동이 많아 지도 저장이 실제 체류 시간을 줄여줍니다.",
      avoidNote: "비 오는 밤에는 계단과 골목 이동이 불편할 수 있습니다.",
      sourceCheck: "인천투어 행사 안내와 주최 측 공지를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "jeonju-hanok-village-performance",
    title: "전주 한옥마을 공연 행사 확인",
    summary: "전주 한옥마을 공연과 체험을 보행 혼잡, 주차, 주변 관광 연계 기준으로 정리했습니다.",
    category: "가족 나들이",
    region: "전북",
    source: "전주시 문화관광",
    sourceUrl: "https://tour.jeonju.go.kr/",
    tags: ["전주", "한옥마을", "공연"],
    meta: {
      eventDateStatus: "전주시 문화관광과 행사 공식 공지에서 일정 확인",
      venue: "전주 한옥마을 일대",
      bookingType: "자유 관람, 체험 예약, 공연 회차 분리 확인",
      priceNote: "공연 관람은 무료 가능, 한복·체험·식사 비용 별도",
      weatherRisk: "비 오는 날은 골목 이동과 야외 공연 변경 확인",
      trafficNote: "한옥마을 주변 주차장 만차와 셔틀 여부 확인",
      familyFit: "가족 방문은 휴식 공간과 식사 시간을 먼저 확보",
      statusBadges: ["가족방문", "보행혼잡", "주차확인"],
      bestFor: "전주 여행 중 공연과 골목 산책을 함께 하려는 방문자",
      editorNote: "한옥마을 행사는 행사 자체보다 주변 보행 혼잡이 더 큰 변수가 됩니다.",
      avoidNote: "차량으로 행사장 바로 앞까지 이동하려는 일정은 피하는 편이 좋습니다.",
      sourceCheck: "전주시 문화관광과 행사 주최 안내를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "ulsan-river-family-market",
    title: "울산 강변 가족 마켓 행사",
    summary: "울산 강변 마켓 행사를 가족 방문, 현장 결제, 우천 변경 기준으로 정리했습니다.",
    category: "가족 나들이",
    region: "울산",
    source: "울산문화관광",
    sourceUrl: "https://tour.ulsan.go.kr/",
    tags: ["울산", "마켓", "가족"],
    meta: {
      eventDateStatus: "울산문화관광과 행사 주최 공지에서 운영일 확인",
      venue: "울산 강변 및 공원형 행사장",
      bookingType: "자유 방문 중심, 체험 부스 사전 신청 여부 확인",
      priceNote: "입장 무료 가능, 체험·먹거리·주차 비용 별도",
      weatherRisk: "강변 행사는 바람과 우천 시 부스 운영 변경 가능",
      trafficNote: "행사장 입구와 주차장 위치를 지도에 저장",
      familyFit: "아이 동반은 화장실과 그늘 위치를 먼저 확인",
      statusBadges: ["가족방문", "마켓", "우천확인"],
      bestFor: "가족과 가볍게 걷고 먹거리 부스를 둘러보려는 방문자",
      editorNote: "마켓형 행사는 무료 관람과 소비 비용을 분리해 보는 것이 현실적입니다.",
      avoidNote: "현장 결제 줄이 긴 시간대에는 아이 동반 체류가 어려울 수 있습니다.",
      sourceCheck: "울산문화관광 안내와 주최 측 공지를 함께 확인하세요."
    }
  }),
  createEventItem({
    slug: "suncheon-garden-night-walk",
    title: "순천만 국가정원 야간 산책 체크",
    summary: "순천만 국가정원 야간 방문을 입장 시간, 관람차, 귀가 동선 기준으로 정리했습니다.",
    category: "가족 나들이",
    region: "전남",
    source: "순천만국가정원",
    sourceUrl: "https://scbay.suncheon.go.kr/",
    tags: ["순천", "국가정원", "야간"],
    meta: {
      eventDateStatus: "순천만국가정원 공식 운영시간과 시즌 행사 확인",
      venue: "순천만국가정원",
      bookingType: "입장권, 관람차, 프로그램 예약 여부 확인",
      priceNote: "입장권과 관람차·체험 비용 분리 확인",
      weatherRisk: "우천, 폭염, 야간 냉방·방한 준비 확인",
      trafficNote: "폐장 시간 전 귀가 교통편과 주차장 위치 확인",
      familyFit: "아이와 부모님 동반은 이동 거리와 휴식 지점 확인",
      statusBadges: ["야간산책", "가족방문", "입장마감"],
      bestFor: "정원 산책과 사진 촬영을 여유 있게 하려는 방문자",
      editorNote: "정원형 행사는 보고 싶은 구역을 줄이는 것이 만족도를 높입니다.",
      avoidNote: "폐장 직전 입장은 이동 거리에 비해 관람 시간이 짧습니다.",
      sourceCheck: "순천만국가정원 공식 운영시간과 행사 공지를 확인하세요."
    }
  })
];

function createGuide(seed: EventGuideSeed): Guide {
  return {
    slug: seed.slug,
    title: seed.title,
    summary: seed.summary,
    category: seed.category,
    updatedAt: eventsReviewDate,
    readingTime: "6분 읽기",
    audience: seed.focus,
    keyChecks: seed.checklist,
    sourceLinks: [
      { label: "대한민국 구석구석", url: "https://korean.visitkorea.or.kr/" },
      { label: "문화포털", url: "https://www.culture.go.kr/" }
    ],
    nextReviewAt: eventsNextReviewDate,
    body: guideBody(seed)
  };
}

export const extraEventGuides: Guide[] = [
  createGuide({
    slug: "event-rain-outdoor-decision",
    title: "우천 시 야외행사 판단법",
    summary: "비 예보가 있는 날 야외 행사를 갈지 말지 결정할 때 보는 공식 공지와 대체 기준입니다.",
    category: "날씨",
    focus: "우천, 강풍, 폭염 때 방문 여부를 정해야 하는 방문자",
    checklist: ["주최 측 취소 공지", "실내 대체 프로그램", "우산 반입 가능 여부", "귀가 교통"]
  }),
  createGuide({
    slug: "free-family-event-check",
    title: "아이와 무료행사 갈 때 확인할 것",
    summary: "무료입장 행사라도 아이와 함께라면 연령 제한, 체험비, 대기 공간을 먼저 봐야 합니다.",
    category: "가족",
    focus: "아이와 비용 부담 낮은 행사를 찾는 보호자",
    checklist: ["연령 제한", "보호자 동반", "체험 재료비", "화장실과 휴식 공간"]
  }),
  createGuide({
    slug: "exhibition-ticket-compare",
    title: "전시회 현장권과 사전예매 비교",
    summary: "전시회 방문 전 현장권, 사전예매, 무료등록의 차이를 비교하는 기준입니다.",
    category: "예매",
    focus: "전시장 입장 시간을 안정적으로 잡고 싶은 방문자",
    checklist: ["마지막 입장", "환불 기한", "QR 티켓", "현장 대기"]
  }),
  createGuide({
    slug: "festival-traffic-control",
    title: "축제 교통통제 확인법",
    summary: "대형 축제 전 임시주차장, 셔틀, 보행 통제 구간을 확인하는 순서입니다.",
    category: "교통",
    focus: "차량 또는 대중교통으로 대형 축제를 방문하는 사람",
    checklist: ["임시주차장", "셔틀버스", "보행 통제", "귀가 막차"]
  }),
  createGuide({
    slug: "regional-festival-stay-route",
    title: "지역 축제 숙박 동선 잡는 법",
    summary: "지역 축제와 숙박을 함께 잡을 때 행사장 거리, 체크인, 귀가 시간을 맞추는 방법입니다.",
    category: "여행",
    focus: "타지역 축제를 1박 일정으로 보려는 방문자",
    checklist: ["숙소 거리", "체크인 시간", "야간 귀가", "다음 날 이동"]
  }),
  createGuide({
    slug: "free-event-extra-cost",
    title: "무료입장 행사 추가비용 확인법",
    summary: "무료입장 행사에서 실제로 돈이 드는 체험, 주차, 보관, 식음료 항목을 분리합니다.",
    category: "비용",
    focus: "무료 행사에서 예상 밖 지출을 줄이고 싶은 방문자",
    checklist: ["체험비", "주차비", "물품 보관", "식음료"]
  }),
  createGuide({
    slug: "night-event-return-plan",
    title: "야간행사 귀가 계획",
    summary: "야간 공연과 불꽃축제에서 마지막 프로그램 이후 귀가 시간을 줄이는 기준입니다.",
    category: "교통",
    focus: "밤 늦게 끝나는 행사에 가는 방문자",
    checklist: ["막차 시간", "대체 역", "택시 승차 위치", "동행자 만남 장소"]
  }),
  createGuide({
    slug: "event-cancel-update-source",
    title: "행사 취소·변경 공지 찾는 법",
    summary: "행사 당일 취소, 장소 변경, 회차 축소 공지를 어디서 확인해야 하는지 정리합니다.",
    category: "공식출처",
    focus: "출발 직전 최신 공지를 확인해야 하는 방문자",
    checklist: ["공식 홈페이지", "주최 SNS", "예매처 알림", "지자체 공지"]
  })
];

function metaFor(item: InfoItem): EventMeta {
  const defaults = categoryDefaults[item.category] ?? categoryDefaults["축제"];
  const overrides = slugMeta[item.slug] ?? {};

  return {
    eventDateStatus: item.eventDateStatus ?? overrides.eventDateStatus ?? defaults.eventDateStatus ?? item.period,
    venue: item.venue ?? overrides.venue ?? defaults.venue ?? `${item.region} 행사장`,
    bookingType: item.bookingType ?? overrides.bookingType ?? defaults.bookingType ?? "공식 안내에서 예매 방식 확인",
    priceNote: item.priceNote ?? overrides.priceNote ?? defaults.priceNote ?? "입장료와 체험비 분리 확인",
    weatherRisk: item.weatherRisk ?? overrides.weatherRisk ?? defaults.weatherRisk ?? "출발 전 날씨 공지 확인",
    trafficNote: item.trafficNote ?? overrides.trafficNote ?? defaults.trafficNote ?? "대중교통과 주차 동선 확인",
    familyFit: item.familyFit ?? overrides.familyFit ?? defaults.familyFit ?? "동행자 기준으로 체류 시간 확인",
    lastCheckedAt: item.lastCheckedAt ?? eventsReviewDate,
    officialLinks: item.officialLinks ?? overrides.officialLinks ?? sourceLinks(item),
    statusBadges: item.statusBadges ?? overrides.statusBadges ?? defaults.statusBadges ?? ["공식확인"],
    bestFor: item.audience ?? overrides.bestFor ?? defaults.bestFor ?? `${item.region}에서 ${item.category} 일정을 찾는 방문자`,
    editorNote:
      item.eventLead ??
      overrides.editorNote ??
      `${item.title}은 ${item.region} 지역 ${item.category} 정보라서 날짜보다 예매, 이동, 현장 변수를 함께 보는 편이 안전합니다.`,
    avoidNote:
      item.eventCaution ??
      overrides.avoidNote ??
      defaults.avoidNote ??
      "공식 공지 확인 없이 출발하면 입장 방식이나 운영 시간이 달라질 수 있습니다.",
    sourceCheck:
      overrides.sourceCheck ??
      `${item.source} 공식 안내에서 개최일, 장소, 입장 방식, 변경 공지를 다시 확인하세요.`,
    eventSchema: overrides.eventSchema
  };
}

function bodyFor(item: InfoItem, meta: EventMeta) {
  const sourceLabel = meta.officialLinks.map((link) => link.label).slice(0, 2).join(", ");
  return [
    "## 한 줄 판단",
    `${item.title}은 ${meta.bestFor}에게 먼저 맞는 행사입니다. ${meta.editorNote}`,
    `${item.region} 지역에서 ${item.category} 일정을 찾을 때는 행사 소개 문구보다 방문 조건을 먼저 보는 편이 안전합니다. 이 글은 홍보성 추천보다 실제로 현장에서 문제가 되는 예매, 비용, 날씨, 교통, 동행자 변수를 순서대로 확인하도록 구성했습니다.`,
    "## 일정·장소·입장 방식",
    `${item.title}의 기준 일정은 "${meta.eventDateStatus}"입니다. 장소는 ${meta.venue}로 정리했고, 방문 전에는 ${item.source}에서 장소 세부 표기와 회차별 운영 여부를 다시 확인해야 합니다.`,
    `${item.title}의 예매 방식은 "${meta.bookingType}"입니다. 사전예매, 현장권, 무료입장, 선착순 접수는 서로 다른 의미라서 같은 행사 안에서도 프로그램별로 나누어 봐야 합니다.`,
    `공식 공지가 여러 곳에 나뉘어 있다면 먼저 행사명과 날짜가 같은지 확인하고, 그다음 예매처 화면의 회차와 행사장 안내의 입장 시간을 대조하세요. 포털형 목록에는 아직 예전 회차가 남아 있는 경우가 있어 제목만 보고 판단하면 헷갈릴 수 있습니다.`,
    "## 방문 적합 대상",
    `${item.title}은 ${meta.bestFor}에게 적합하지만, 모든 방문자에게 같은 만족도를 주는 행사는 아닙니다. 짧게 둘러볼 사람, 아이와 함께 움직이는 가족, 전시 관람 시간을 충분히 잡으려는 사람, 야간 귀가를 걱정하는 사람은 확인해야 할 기준이 다릅니다.`,
    `동행자가 있다면 출발 전에 관람 목적을 하나로 맞추는 편이 좋습니다. ${item.category} 행사는 현장에 도착한 뒤 각자 보고 싶은 구역이 갈리면 이동 시간이 늘어나고, 예약 회차나 마지막 입장 시간을 놓치기 쉽습니다.`,
    "## 비용과 무료 범위",
    `${item.title}의 비용 확인 포인트는 "${meta.priceNote}"입니다. 무료라고 적힌 행사는 입장료만 무료인 경우가 있어 체험 재료비, 주차비, 물품 보관료, 식음료 비용을 별도로 계산하는 편이 안전합니다.`,
    `무료 행사라면 무료의 범위를 문장 그대로 읽어야 합니다. 무료입장은 행사장에 들어가는 비용이 없다는 뜻일 수 있고, 체험 부스·특별전·좌석 예약·기념품·주차는 별도일 수 있습니다. 유료 행사라면 취소 수수료와 환불 마감도 예매 전 확인하세요.`,
    `가족이나 단체로 움직이면 1인당 금액보다 부대비용이 더 커질 수 있습니다. ${meta.venue} 주변의 식사, 이동, 보관, 주차 비용까지 예상하면 현장에서 결정을 서두르지 않아도 됩니다.`,
    "## 날씨와 현장 변수",
    `${item.region} 지역 ${item.category} 행사는 날씨와 현장 공지의 영향을 받습니다. 이 글에서 우선 보는 변수는 "${meta.weatherRisk}"이며, 출발 직전 공식 공지에 취소·축소·장소 변경 안내가 없는지 확인해야 합니다.`,
    `${meta.avoidNote} 특히 동행자가 있거나 장거리 이동이라면 행사 하나만 보고 출발하지 말고, 주변 실내 대안 또는 짧게 머무를 대체 장소를 함께 정해 두세요.`,
    `우천 공지는 행사 전날 밤보다 당일 오전에 바뀌는 경우가 있습니다. 야외 무대, 푸드존, 체험 부스, 퍼레이드처럼 야외 비중이 큰 프로그램은 전체 행사 개최 여부와 별개로 개별 취소가 생길 수 있습니다.`,
    `폭염과 강풍도 비만큼 중요합니다. 그늘이 적거나 대기 줄이 긴 행사는 실제 체류 시간이 짧아질 수 있으므로 물, 모자, 보조 배터리, 아이 동반 시 휴식 지점을 미리 준비하는 편이 좋습니다.`,
    "## 교통과 귀가 동선",
    `${item.title} 방문 전 교통 메모는 "${meta.trafficNote}"입니다. 행사장에 갈 때보다 끝난 뒤 이동이 더 어려운 경우가 많으므로 마지막 프로그램을 볼지, 한 회차 일찍 이동할지를 미리 정하는 편이 좋습니다.`,
    `차량으로 이동한다면 행사장 바로 앞 주차장만 보지 말고 만차 이후의 대체 주차장과 도보 거리를 함께 확인하세요. 대중교통을 이용한다면 가장 가까운 역보다 행사 종료 후 사람이 분산되는 역이 더 편할 수 있습니다.`,
    `야간 행사라면 막차 시간, 택시 승차 지점, 동행자 만남 장소를 미리 정해 두세요. 현장에서는 통신이 느려지거나 길이 통제되어 지도 앱의 안내가 실제 동선과 다를 수 있습니다.`,
    "## 아이·가족 동반 기준",
    `${item.title}의 가족 방문 기준은 "${meta.familyFit}"입니다. 아이와 함께라면 행사 내용보다 화장실, 휴식 공간, 그늘, 유모차 이동, 대기 줄을 먼저 보는 편이 실제 만족도에 더 크게 작동합니다.`,
    `아이 동반 방문자는 체험 난이도와 연령 제한을 먼저 확인해야 합니다. 보호자 동반이 필요한 회차인지, 재입장이 가능한지, 소리가 큰 공연이나 긴 대기 줄이 있는지도 가족 만족도에 영향을 줍니다.`,
    `부모님과 함께 가는 경우에는 계단, 보행 거리, 앉을 곳, 화장실 위치가 더 중요합니다. ${item.title}처럼 행사장이 넓거나 관람 구역이 나뉘는 일정은 모든 프로그램을 보려고 하기보다 핵심 구역을 줄이는 편이 현실적입니다.`,
    "## 방문 전날 체크 순서",
    [
      `- ${item.source}에서 행사명과 날짜가 같은 공지인지 확인합니다.`,
      `- ${meta.bookingType} 조건을 보고 예약, 현장권, 무료입장 중 어떤 방식인지 표시합니다.`,
      `- ${meta.priceNote} 항목을 기준으로 입장료와 추가 비용을 나눕니다.`,
      `- ${meta.weatherRisk} 관련 공지가 올라왔는지 확인합니다.`,
      `- ${meta.trafficNote}에 맞춰 도착 시간과 귀가 시간을 정합니다.`
    ].join("\n"),
    "## 보완 사례",
    `${item.title}을 볼 때 가장 흔한 실수는 “행사가 열린다”는 사실만 확인하고 방문 조건을 건너뛰는 것입니다. 예를 들어 무료 공연이라도 좌석이 선착순이면 도착 시간이 결과를 바꾸고, 전시회라면 마지막 입장 시간이 관람 가능 시간을 결정합니다.`,
    `또 다른 실수는 공식 출처 하나만 보고 끝내는 것입니다. 주최 측 공지에는 전체 일정이 있고, 예매처에는 회차와 마감 상태가 있으며, 행사장 공지에는 주차와 입장 동선이 따로 올라오는 경우가 있습니다. 세 곳의 정보가 어긋나면 가장 최근 공지를 우선 확인하세요.`,
    "## 이런 경우에는 방문을 미루는 편이 낫습니다",
    `${meta.bookingType} 조건이 명확하지 않거나, ${meta.weatherRisk} 공지가 행사 직전까지 불안정하거나, ${meta.trafficNote} 때문에 귀가 시간이 지나치게 길어진다면 방문을 미루는 선택도 필요합니다. 특히 아이나 고령자와 함께라면 행사 자체보다 안전한 이동이 우선입니다.`,
    `공식 공지에서 취소·변경 안내가 불명확한데 현장까지 거리가 멀다면 전화 문의나 예매처 알림을 한 번 더 확인하세요. 검색 결과의 짧은 요약만 믿고 움직이면 이미 마감된 회차나 변경 전 장소로 이동할 수 있습니다.`,
    "## 현장 도착 후 확인할 것",
    `${item.title} 현장에 도착했다면 먼저 안내판, 입구 동선, 회차별 대기 줄을 확인하세요. 온라인에서 본 정보와 현장 운영이 달라질 수 있고, 특히 ${item.category} 행사는 안전 통제나 인파 분산 때문에 입구가 바뀌는 일이 있습니다.`,
    `입장 후에는 전체 프로그램을 다 보려고 하기보다 먼저 보고 싶은 구역을 두세 곳으로 줄이는 편이 좋습니다. ${meta.venue} 안에서 이동 거리가 길어지면 예매한 회차를 놓치거나 귀가 시간이 밀릴 수 있습니다.`,
    "## 함께 비교하면 좋은 대안",
    `${item.title}만 단독으로 보기보다 같은 ${item.region} 지역의 실내 공간, 무료 전시, 짧은 산책 코스를 함께 비교해 두면 일정이 흔들릴 때 대응하기 쉽습니다. 야외 행사는 날씨가, 실내 전시는 입장 마감과 대기 줄이 변수가 되므로 성격이 다른 대안을 하나씩 준비해 두세요.`,
    `대안 장소를 고를 때는 유명도보다 이동 시간이 중요합니다. 행사장 주변 10~20분 거리에서 갈 수 있는 곳을 골라야 실제로 쓸 수 있는 대안이 됩니다. 멀리 떨어진 후보는 계획표에는 좋아 보여도 당일에는 이동 부담이 커질 수 있습니다.`,
    "## 방문 후 기록해 둘 내용",
    `${item.title}을 실제로 방문했다면 예매 방식, 도착 시간, 혼잡했던 구간, 추가 비용, 귀가 동선을 짧게 기록해 두세요. 다음에 비슷한 ${item.category} 행사를 고를 때 같은 실수를 줄일 수 있고, 가족이나 지인에게 설명할 때도 더 정확한 기준이 됩니다.`,
    `특히 무료 행사에서는 실제로 무료였던 범위와 현장에서 돈이 든 항목을 나눠 적어 두면 좋습니다. 전시나 체험 행사는 마지막 입장 시간과 회차 대기 시간을 기록해 두면 다음 방문 계획을 세울 때 도움이 됩니다.`,
    "## 공식 출처 확인",
    `${item.title}은 ${sourceLabel} 기준으로 다시 확인할 수 있습니다. 이 페이지의 확인일은 ${meta.lastCheckedAt}이며, 다음 점검 전이라도 주최 측 공지가 바뀌면 실제 운영 조건이 달라질 수 있습니다.`,
    `출발 전 마지막으로 ${item.source}에서 "${item.title}", "${item.region}", "${item.category}" 키워드를 함께 확인하세요. 검색 결과 요약보다 공식 페이지의 공지, 예매 화면, 첨부 안내가 우선입니다.`,
    "## 최종 정리",
    `${item.title}은 ${item.region}에서 ${item.category} 일정을 찾는 방문자에게 검토할 만한 선택지입니다. 다만 방문 만족도는 행사명보다 ${meta.bookingType}, ${meta.priceNote}, ${meta.weatherRisk}, ${meta.trafficNote}을 얼마나 미리 확인했는지에 따라 달라집니다.`
  ];
}

function faqFor(item: InfoItem, meta: EventMeta) {
  return [
    {
      question: `${item.title}은 당일 바로 가도 괜찮나요?`,
      answer: `${meta.bookingType} 기준을 먼저 봐야 합니다. 자유 관람처럼 보여도 일부 프로그램은 사전 신청이나 선착순 마감이 있을 수 있습니다.`
    },
    {
      question: `${item.title}이 무료 행사인지 어떻게 확인하나요?`,
      answer: `${meta.priceNote} 항목을 공식 안내에서 다시 확인하세요. 입장 무료와 체험 무료는 다른 의미일 수 있습니다.`
    },
    {
      question: `비가 오면 ${item.title} 일정이 바뀔 수 있나요?`,
      answer: `${meta.weatherRisk} 조건 때문에 변경될 수 있습니다. 출발 직전 주최 측 홈페이지와 예매처 알림을 함께 확인하는 편이 안전합니다.`
    },
    {
      question: `${item.title}에 아이와 함께 가도 괜찮나요?`,
      answer: `${meta.familyFit} 기준을 먼저 확인하세요. 체험 회차, 대기 공간, 화장실, 유모차 이동 가능 여부가 실제 방문 만족도에 영향을 줍니다.`
    },
    {
      question: `${item.title} 방문 전 공식 출처는 어디를 보면 되나요?`,
      answer: `${meta.officialLinks.map((link) => link.label).slice(0, 2).join(", ")}를 먼저 확인하는 편이 좋습니다. 일정과 예매, 교통 안내가 서로 다른 페이지에 나뉘어 있을 수 있습니다.`
    }
  ];
}

export function enhanceEventItem(item: InfoItem): InfoItem {
  const meta = metaFor(item);
  const summary = `"${item.title}"은 ${meta.bookingType}이 핵심입니다. ${item.region} 방문 전 ${meta.trafficNote}와 ${meta.weatherRisk}을 같이 확인하세요.`;

  return {
    ...item,
    summary,
    period: meta.eventDateStatus,
    updatedAt: eventsReviewDate,
    nextReviewAt: eventsNextReviewDate,
    readingTime: item.readingTime ?? "6분 읽기",
    audience: meta.bestFor,
    keyChecks: [meta.bookingType, meta.priceNote, meta.weatherRisk, meta.trafficNote],
    sourceLinks: meta.officialLinks,
    details: {
      "장소": meta.venue,
      "일정 상태": meta.eventDateStatus,
      "예매·입장": meta.bookingType,
      "비용 범위": meta.priceNote,
      "날씨 변수": meta.weatherRisk,
      "교통 메모": meta.trafficNote
    },
    body: bodyFor(item, meta),
    faq: faqFor(item, meta),
    ...meta
  };
}

function guideBody(seed: EventGuideSeed) {
  return [
    "## 먼저 판단할 것",
    `${seed.title}은 ${seed.focus}를 위한 방문 기준입니다. 행사는 제목만 보고 고르면 실제 현장에서 대기, 비용, 이동 문제가 생기기 쉬워서 출발 전 확인 순서를 분리해 두는 편이 좋습니다.`,
    "## 공식 공지부터 보는 이유",
    `행사 정보는 블로그 후기보다 공식 공지의 변경 속도가 더 중요합니다. ${seed.title}을 적용할 때는 주최 측 홈페이지, 예매처 알림, 지자체 문화관광 공지를 먼저 보고 개인 후기는 분위기 확인용으로만 참고하세요.`,
    "## 현장에서 자주 막히는 부분",
    `${seed.summary} 특히 같은 행사라도 날짜, 회차, 날씨, 동행자에 따라 확인해야 할 항목이 달라집니다. 전날 저장한 정보가 당일 오전에 바뀔 수 있으므로 출발 직전 한 번 더 확인하는 루틴이 필요합니다.`,
    "## 체크리스트",
    seed.checklist.map((item) => `- ${item}을 확인했습니다.`).join("\n"),
    "## 기록해 둘 내용",
    `${seed.title}을 실제 일정에 적용했다면 행사명, 방문일, 예매 여부, 주차 또는 대중교통 경로, 취소 공지 확인 채널을 한 줄로 저장해 두세요. 다음에 비슷한 행사를 고를 때 같은 실수를 줄일 수 있습니다.`
  ];
}

export function enhanceEventGuide(guide: Guide): Guide {
  const summary = `${guide.title}: ${guide.category} 상황에서 공식 공지, 예매 방식, 현장 변수를 어떤 순서로 볼지 정리한 방문 기준입니다.`;
  const eventBody = guideBody({
    slug: guide.slug,
    title: guide.title,
    summary,
    category: guide.category,
    focus: guide.audience ?? `${guide.category} 기준이 필요한 행사 방문자`,
    checklist: guide.keyChecks ?? ["공식 공지", "예매 방식", "현장 변수", "귀가 동선"]
  });

  return {
    ...guide,
    summary,
    updatedAt: eventsReviewDate,
    nextReviewAt: eventsNextReviewDate,
    readingTime: guide.readingTime ?? "6분 읽기",
    audience: guide.audience ?? `${guide.category} 기준이 필요한 행사 방문자`,
    keyChecks: guide.keyChecks ?? ["공식 공지", "예매 방식", "현장 변수", "귀가 동선"],
    sourceLinks: guide.sourceLinks ?? [
      { label: "대한민국 구석구석", url: "https://korean.visitkorea.or.kr/" },
      { label: "문화포털", url: "https://www.culture.go.kr/" }
    ],
    body: [...eventBody, ...guide.body]
  };
}

export const eventsSiteOverrides: Partial<SiteConfig> = {
  name: "전국행사노트",
  headline: "이번 주말 행사, 날짜보다 방문 조건부터 확인하세요",
  description: "전국 축제, 전시, 무료 행사를 예매, 날씨, 교통, 가족 동반 기준으로 다시 정리하는 행사 방문 편집노트입니다.",
  identity: "전국행사노트는 행사명보다 방문자가 실제로 확인해야 할 일정, 예매, 비용, 교통, 날씨 변수를 먼저 정리합니다.",
  nav: [
    { label: "이번 주", href: "/events/items" },
    { label: "무료 행사", href: "/events/category/무료 행사" },
    { label: "우천 대안", href: "/events/guides/event-rain-outdoor-decision" },
    { label: "출처", href: "/events/sources" }
  ],
  categories: ["축제", "전시", "체험", "가족 나들이", "무료 행사"],
  searchPlaceholder: "지역, 무료, 우천, 아이동반, 전시 키워드 검색",
  visualText: "날짜, 예매, 교통, 날씨를 함께 보는 행사 방문 데스크",
  disclaimer: "행사 일정과 운영 조건은 주최 측 사정, 날씨, 현장 통제에 따라 달라질 수 있습니다. 방문 전 공식 안내를 다시 확인하세요."
};
