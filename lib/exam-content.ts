import type { Guide, InfoItem, SiteConfig } from "@/lib/sites";

export const examReviewDate = "2026-08-03";
export const examNextReviewDate = "공식 공지 변경 시";

type ExamLink = {
  label: string;
  url: string;
};

type ExamMeta = {
  examType: string;
  scheduleStatus: string;
  applicationType: string;
  deadlineRisk: string;
  documentNote: string;
  venueNote: string;
  resultNote: string;
  officialCheck: string;
  bestFor: string;
  caution: string;
  statusBadges: string[];
  officialLinks: ExamLink[];
  lastCheckedAt: string;
};

type ExamSeed = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  region: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  meta: Omit<ExamMeta, "officialLinks" | "lastCheckedAt"> & {
    officialLinks?: ExamLink[];
  };
};

type ExamGuideSeed = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  focus: string;
  checklist: string[];
};

const categoryDefaults: Record<string, Partial<ExamMeta>> = {
  국가기술자격: {
    examType: "필기·실기 또는 작업형 회차가 이어지는 자격시험",
    scheduleStatus: "Q-Net 또는 주관기관 회차표에서 접수 시작일과 시험일 확인",
    applicationType: "정기시험, 상시시험, 필기·실기 접수 창구를 분리해 확인",
    deadlineRisk: "필기 합격 후 실기 접수 가능 기간과 응시자격 서류 제출 기한을 놓치기 쉬움",
    documentNote: "응시자격, 졸업·경력 증빙, 수험표, 인정 신분증을 시험별로 확인",
    venueNote: "시험장 잔여 좌석, 작업형 장비, 프로그램 버전, 입실 시간을 함께 확인",
    resultNote: "필기 합격 유효기간과 실기 접수 가능 회차를 캘린더에 따로 기록",
    officialCheck: "공식 회차 공고, 수험자 유의사항, 시험장 안내, 합격자 발표 메뉴를 함께 봅니다.",
    bestFor: "필기와 실기를 이어서 준비하거나 응시자격 서류가 필요한 수험생",
    caution: "시험일만 저장하면 실기 접수나 서류 제출을 놓칠 수 있습니다.",
    statusBadges: ["필기·실기", "서류심사", "시험장확인"]
  },
  공인검정: {
    examType: "등급, 급수, 성적 활용처가 중요한 공인검정",
    scheduleStatus: "주관기관 공지에서 원서접수 시작 시간과 성적 발표일 확인",
    applicationType: "정기 회차, 추가 접수, 고사장 마감 상태를 따로 확인",
    deadlineRisk: "인기 고사장 조기 마감, 사진 규격 오류, 급수 선택 착오가 잦음",
    documentNote: "접수 사진, 본인 인증, 인정 신분증, 급수별 응시 시간을 확인",
    venueNote: "고사장 선택은 접수 초반에 마감될 수 있어 대체 지역을 함께 저장",
    resultNote: "제출처가 요구하는 등급, 유효기간, 성적표 발급 방식을 먼저 확인",
    officialCheck: "공식 접수 화면의 고사장, 환불 규정, 성적 확인 메뉴를 함께 봅니다.",
    bestFor: "취업, 승진, 졸업 요건에 맞는 등급과 제출 시점을 맞춰야 하는 수험생",
    caution: "원하는 급수보다 제출처가 인정하는 급수를 먼저 확인해야 합니다.",
    statusBadges: ["급수확인", "고사장마감", "성적활용"]
  },
  어학시험: {
    examType: "성적 발표일과 제출 마감 역산이 중요한 어학시험",
    scheduleStatus: "공식 시험 일정표에서 정기 접수, 추가 접수, 성적 발표일 확인",
    applicationType: "정기 접수와 특별·추가 접수 비용, 시험센터 잔여 좌석 확인",
    deadlineRisk: "시험일은 맞아도 성적 발표가 제출 마감보다 늦으면 활용이 어려움",
    documentNote: "영문 이름, 생년월일, 인정 신분증, 사진·서명 기준을 확인",
    venueNote: "센터별 입실 시간, 주차, 대중교통, 음향·좌석 환경 후기를 참고하되 공식 안내 우선",
    resultNote: "성적 발표일, 성적표 출력 가능일, 기관 제출 방식을 따로 기록",
    officialCheck: "시험 주관처의 접수 내역, 성적 발표 일정, 성적표 발급 안내를 함께 봅니다.",
    bestFor: "취업·교환학생·졸업 요건 때문에 성적 제출 마감이 정해진 수험생",
    caution: "시험일보다 성적 발표일과 제출 방식이 실제 일정의 기준입니다.",
    statusBadges: ["성적발표", "센터확인", "신분증"]
  },
  전문자격: {
    examType: "응시자격과 서류 제출이 중요한 전문자격 시험",
    scheduleStatus: "공식 시행계획 공고에서 원서접수, 서류 제출, 시험일, 발표일 확인",
    applicationType: "연 1회 또는 제한 회차 운영이 많아 접수 기간을 별도 알림으로 관리",
    deadlineRisk: "응시자격 증빙, 교육 이수, 실습 확인서가 늦어 접수가 막히는 경우가 있음",
    documentNote: "학력, 경력, 교육 이수, 실습, 면허 관련 증빙을 시험별로 확인",
    venueNote: "지역별 시험장 배정 방식과 수험표 출력 기간을 미리 확인",
    resultNote: "합격 기준, 과락 기준, 자격증 발급 절차를 발표일 전부터 확인",
    officialCheck: "시행계획 공고, 응시자격 안내, 제출 서류 양식, 합격자 발표 메뉴를 함께 봅니다.",
    bestFor: "학력·경력·교육 이수 조건을 갖춘 뒤 자격 취득을 준비하는 수험생",
    caution: "공부 시작보다 응시 가능 여부 확인이 먼저입니다.",
    statusBadges: ["응시자격", "서류제출", "발표확인"]
  },
  공공시험: {
    examType: "원서접수와 전형 일정이 이어지는 공공기관·공무원 시험",
    scheduleStatus: "채용 공고와 원서접수 시스템에서 접수, 필기, 발표, 면접 일정을 함께 확인",
    applicationType: "지역, 직렬, 기관별 공고가 달라 원서접수처와 공고문을 같이 저장",
    deadlineRisk: "거주지 제한, 가산점 등록, 서류 제출, 면접 일정이 따로 움직일 수 있음",
    documentNote: "응시 자격, 가산점, 자격증, 주민등록, 경력 증빙 기준을 확인",
    venueNote: "필기 시험장 배정 공지와 입실 시간을 시험 전 주에 다시 확인",
    resultNote: "필기 발표와 면접·서류 제출 마감이 짧게 이어질 수 있어 발표일 알림 필요",
    officialCheck: "모집공고, 변경공고, 원서접수 내역, 합격자 발표 메뉴를 함께 봅니다.",
    bestFor: "공무원, 공공기관, 지역 제한 시험을 준비하는 응시자",
    caution: "시험 공고와 접수 시스템 공지가 서로 다른 메뉴에 있을 수 있습니다.",
    statusBadges: ["공고확인", "가산점", "전형일정"]
  }
};

const slugMeta: Record<string, Partial<ExamMeta>> = {
  "computer-level1-practical": {
    scheduleStatus: "상공회의소 자격평가사업단에서 상시 실기 시험장과 잔여 좌석 확인",
    applicationType: "상시 실기 접수, 시험장별 프로그램 버전과 시간대 확인",
    venueNote: "희망 지역 좌석이 없을 수 있어 인근 시험장을 함께 검색",
    resultNote: "실기 결과 발표 예정일과 재접수 가능 시점을 함께 기록"
  },
  "computer-level2-written": {
    applicationType: "상시 필기 접수, 시험장 좌석과 필기 합격 후 실기 연결 확인",
    deadlineRisk: "필기 합격만 보고 실기 접수 가능 기간을 놓치기 쉬움"
  },
  "engineer-information-processing-written": {
    documentNote: "기사 응시자격 서류 제출 대상인지 먼저 확인",
    deadlineRisk: "원서접수 후 응시자격 서류심사 기한을 놓치면 응시가 어려울 수 있음"
  },
  "engineer-information-processing-practical": {
    resultNote: "필기 합격 유효기간 안에 실기 회차를 몇 번 볼 수 있는지 계산",
    deadlineRisk: "실기 접수는 회차별 마감이 빠르게 닫힐 수 있음"
  },
  "history-advanced": {
    scheduleStatus: "국사편찬위원회 회차 공지에서 접수 시작 시간과 고사장 마감 확인",
    resultNote: "심화 등급이 필요한 제출처라면 필요한 인증 등급을 먼저 확인"
  },
  "toeic-regular-test": {
    scheduleStatus: "YBM 정기시험 일정표에서 시험일, 추가 접수, 성적 발표일 확인",
    resultNote: "제출 마감일이 있으면 성적 발표일 기준으로 회차를 고르는 편이 안전"
  },
  "public-recruit-basic": {
    scheduleStatus: "기관 채용 공고와 변경 공고를 함께 저장",
    officialCheck: "채용 공고, NCS 필기 안내, 서류 제출 공지, 면접 일정 공지를 따로 확인합니다."
  }
};

function linksFor(seed: Pick<InfoItem, "source" | "sourceUrl">): ExamLink[] {
  return [
    { label: seed.source, url: seed.sourceUrl },
    { label: "정부24", url: "https://www.gov.kr/" },
    { label: "Q-Net", url: "https://www.q-net.or.kr/" }
  ].filter((link, index, list) => list.findIndex((item) => item.url === link.url) === index);
}

function metaFor(item: InfoItem): ExamMeta {
  const categoryMeta = categoryDefaults[item.category] ?? categoryDefaults.국가기술자격;
  const override = slugMeta[item.slug] ?? {};
  return {
    examType: "공식 일정 확인이 필요한 자격·검정 시험",
    scheduleStatus: "공식 접수처에서 회차별 일정 확인",
    applicationType: "정기 접수와 추가 접수 여부 확인",
    deadlineRisk: "접수 마감과 성적 발표일을 함께 확인해야 합니다.",
    documentNote: "인정 신분증과 제출 서류를 시험별로 확인합니다.",
    venueNote: "시험장 위치와 입실 시간을 확인합니다.",
    resultNote: "성적 발표일과 활용처 제출 마감을 함께 기록합니다.",
    officialCheck: "공식 접수처의 공지, 수험자 유의사항, 발표 메뉴를 확인합니다.",
    bestFor: "시험 일정과 준비물을 동시에 관리해야 하는 수험생",
    caution: "일정은 주관기관 사정에 따라 바뀔 수 있습니다.",
    statusBadges: ["접수확인", "준비물", "공식출처"],
    ...categoryMeta,
    ...override,
    officialLinks: override.officialLinks ?? linksFor(item),
    lastCheckedAt: examReviewDate
  };
}

function createExamItem(seed: ExamSeed): InfoItem {
  return {
    slug: seed.slug,
    title: seed.title,
    summary: seed.summary,
    category: seed.category,
    region: seed.region,
    period: seed.meta.scheduleStatus,
    source: seed.source,
    sourceUrl: seed.sourceUrl,
    updatedAt: examReviewDate,
    tags: seed.tags,
    details: {
      "시험 유형": seed.meta.examType,
      "접수 확인": seed.meta.applicationType,
      "마감 리스크": seed.meta.deadlineRisk,
      "준비 서류": seed.meta.documentNote
    },
    body: [],
    faq: [],
    ...seed.meta,
    officialLinks: seed.meta.officialLinks ?? linksFor(seed),
    lastCheckedAt: examReviewDate
  };
}

export const extraExamItems: InfoItem[] = [
  createExamItem({
    slug: "qnet-regular-license-calendar",
    title: "Q-Net 정기 기사·산업기사 회차표 읽기",
    summary: "기사·산업기사 정기시험을 필기 접수, 응시자격 서류, 실기 연결 순서로 확인하는 방법입니다.",
    category: "국가기술자격",
    region: "전국",
    source: "한국산업인력공단 Q-Net",
    sourceUrl: "https://www.q-net.or.kr/",
    tags: ["Q-Net", "기사", "산업기사"],
    meta: {
      examType: "정기 기사·산업기사 회차형 시험",
      scheduleStatus: "Q-Net 정기시험 시행계획과 회차별 원서접수 공지 확인",
      applicationType: "필기 접수, 응시자격 서류심사, 실기 접수를 별도 일정으로 관리",
      deadlineRisk: "필기 접수만 저장하면 응시자격 서류 제출과 실기 접수 알림을 놓치기 쉽습니다.",
      documentNote: "졸업예정, 경력, 학점은행 등 응시자격 증빙 대상인지 먼저 확인",
      venueNote: "필기와 실기 시험장이 다를 수 있어 회차별 시험장 공지를 따로 확인",
      resultNote: "필기 합격 후 실기 접수 가능한 회차를 캘린더에 미리 표시",
      officialCheck: "Q-Net 시행계획, 원서접수, 응시자격 자가진단, 합격자 발표 메뉴를 함께 봅니다.",
      bestFor: "기사·산업기사 시험을 처음 준비하면서 회차표가 복잡하게 느껴지는 수험생",
      caution: "회차표는 시험일보다 접수 시작일과 서류 제출 기한을 먼저 봐야 합니다.",
      statusBadges: ["정기시험", "서류심사", "실기연결"]
    }
  }),
  createExamItem({
    slug: "qnet-eligibility-upload",
    title: "Q-Net 응시자격 서류 온라인 제출 확인",
    summary: "응시자격 서류심사 대상자가 접수 후 어떤 증빙을 언제까지 확인해야 하는지 정리했습니다.",
    category: "국가기술자격",
    region: "전국",
    source: "한국산업인력공단 Q-Net",
    sourceUrl: "https://www.q-net.or.kr/",
    tags: ["응시자격", "서류심사", "Q-Net"],
    meta: {
      examType: "응시자격 증빙이 필요한 국가기술자격",
      scheduleStatus: "Q-Net 응시자격 서류심사 안내에서 제출 기간과 승인 상태 확인",
      applicationType: "원서접수 후 온라인 제출, 방문 제출, 기관 연계 확인 여부 분리",
      deadlineRisk: "시험 공부를 하고도 서류 미승인 상태면 응시가 제한될 수 있습니다.",
      documentNote: "졸업증명서, 경력증명서, 학점 이수 내역, 재직 증빙의 발급일 기준 확인",
      venueNote: "시험장보다 서류 승인 상태를 먼저 확인한 뒤 수험표 출력",
      resultNote: "서류 승인 여부와 필기 합격 유효기간을 같이 저장",
      officialCheck: "Q-Net 마이페이지의 서류심사 상태와 공지사항을 함께 확인합니다.",
      bestFor: "기사·산업기사 응시자격이 애매하거나 경력·학력 증빙을 준비하는 수험생",
      caution: "서류 제출 완료와 심사 승인 완료는 다릅니다.",
      statusBadges: ["서류제출", "승인확인", "발급일"]
    }
  }),
  createExamItem({
    slug: "korcham-computer-seat-open",
    title: "상공회의소 컴활 실기 좌석 열리는 시간 확인",
    summary: "컴퓨터활용능력 실기 상시시험을 시험장 잔여석, 프로그램 버전, 발표일 기준으로 점검합니다.",
    category: "국가기술자격",
    region: "전국",
    source: "대한상공회의소 자격평가사업단",
    sourceUrl: "https://license.korcham.net/",
    tags: ["컴활", "실기", "상시시험"],
    meta: {
      examType: "상시 실기형 사무자격 시험",
      scheduleStatus: "상공회의소 자격평가사업단에서 지역·시험장별 잔여석 확인",
      applicationType: "상시 접수, 시험장별 날짜와 시간대 선택",
      deadlineRisk: "원하는 시험장은 접수 초반에 마감될 수 있어 대체 지역이 필요합니다.",
      documentNote: "인정 신분증, 수험표, 시험 프로그램 버전, 계정 로그인 기준 확인",
      venueNote: "시험장별 프로그램 버전과 교통 시간을 함께 확인",
      resultNote: "실기 결과 발표 예정일과 다음 재응시 가능 시점을 캘린더에 기록",
      officialCheck: "상공회의소 접수 화면의 시험장, 버전, 수험자 유의사항을 확인합니다.",
      bestFor: "컴활 실기 좌석을 빠르게 잡아야 하는 취업 준비생",
      caution: "상시시험은 '언제든 가능'이 아니라 시험장 좌석이 남아 있을 때만 가능합니다.",
      statusBadges: ["상시시험", "잔여석", "버전확인"]
    }
  }),
  createExamItem({
    slug: "dataq-sqld-application",
    title: "SQLD 시험 접수와 성적 발표 확인",
    summary: "SQLD 정기시험을 데이터자격검정 접수, 고사장, 성적 발표 기준으로 확인합니다.",
    category: "공인검정",
    region: "전국",
    source: "데이터자격검정",
    sourceUrl: "https://www.dataq.or.kr/",
    tags: ["SQLD", "데이터자격", "성적발표"],
    meta: {
      examType: "데이터 분야 공인 민간자격 검정",
      scheduleStatus: "데이터자격검정 공지에서 원서접수, 수험표, 시험일, 결과 발표일 확인",
      applicationType: "정기 접수와 고사장 선택을 회차별로 확인",
      deadlineRisk: "수도권 고사장 조기 마감과 수험표 출력 기간을 놓치기 쉽습니다.",
      documentNote: "본인 인증, 사진, 인정 신분증, 수험표 출력 기준 확인",
      venueNote: "고사장 위치와 입실 시간을 시험 전 다시 확인",
      resultNote: "성적 발표일과 자격증 발급 가능 시점을 함께 기록",
      officialCheck: "데이터자격검정의 시험일정, 원서접수, 수험자 안내를 확인합니다.",
      bestFor: "데이터 직무 준비로 SQLD 성적 제출 일정을 맞춰야 하는 수험생",
      caution: "합격 여부보다 성적 확인 가능일이 제출 마감에 맞는지 봐야 합니다.",
      statusBadges: ["데이터자격", "고사장", "발표일"]
    }
  }),
  createExamItem({
    slug: "dataq-adsp-application",
    title: "ADsP 데이터분석준전문가 일정 확인",
    summary: "ADsP 접수와 고사장, 성적 발표, 자격증 발급 흐름을 한 번에 확인하는 체크입니다.",
    category: "공인검정",
    region: "전국",
    source: "데이터자격검정",
    sourceUrl: "https://www.dataq.or.kr/",
    tags: ["ADsP", "데이터분석", "공인검정"],
    meta: {
      examType: "데이터 분석 분야 공인 민간자격 검정",
      scheduleStatus: "데이터자격검정 회차별 시행 일정과 결과 발표일 확인",
      applicationType: "정기 접수, 고사장 선택, 수험표 출력 기간을 따로 기록",
      deadlineRisk: "성적 발표일이 포트폴리오·입사지원 마감보다 늦을 수 있습니다.",
      documentNote: "인정 신분증과 수험표, 사진 정보 일치 여부 확인",
      venueNote: "고사장 확정 후 교통과 입실 시간을 시험 전날 재확인",
      resultNote: "합격자 발표와 자격 취득 확인서 발급 가능 시점 확인",
      officialCheck: "데이터자격검정 공지와 마이페이지 접수 내역을 함께 봅니다.",
      bestFor: "데이터 직무 입문 자격을 일정 안에 확보하려는 준비생",
      caution: "접수 완료 후에도 수험표 출력과 고사장 공지가 남아 있습니다.",
      statusBadges: ["ADsP", "수험표", "성적확인"]
    }
  }),
  createExamItem({
    slug: "kpc-gtq-application",
    title: "GTQ 그래픽기술자격 접수 전 체크",
    summary: "GTQ 시험 접수 전 급수, 프로그램 버전, 실기 시험장 조건을 확인하는 기준입니다.",
    category: "공인검정",
    region: "전국",
    source: "한국생산성본부 자격",
    sourceUrl: "https://license.kpc.or.kr/",
    tags: ["GTQ", "그래픽", "실기"],
    meta: {
      examType: "프로그램 버전과 실기 환경이 중요한 그래픽 자격",
      scheduleStatus: "KPC 자격 사이트에서 정기시험 일정과 접수 기간 확인",
      applicationType: "급수, 프로그램, 시험장, 수험표 출력을 분리해 확인",
      deadlineRisk: "급수 선택과 프로그램 버전 확인을 놓치면 연습 환경이 달라질 수 있습니다.",
      documentNote: "신분증, 수험표, 실기 프로그램 버전, 저장 방식 안내 확인",
      venueNote: "시험장 PC 환경과 입실 시간을 공식 안내에서 확인",
      resultNote: "성적 발표일과 자격증 발급 가능 시점을 저장",
      officialCheck: "KPC 시험일정, 접수 안내, 수험자 유의사항을 확인합니다.",
      bestFor: "디자인·사무 실무 자격을 준비하는 수험생",
      caution: "실기 시험은 시험장 환경과 프로그램 버전이 체감 난이도에 영향을 줍니다.",
      statusBadges: ["실기환경", "급수선택", "프로그램"]
    }
  }),
  createExamItem({
    slug: "tax-accounting-application",
    title: "전산세무·전산회계 시험 접수 확인",
    summary: "전산세무회계 자격시험을 급수, 접수 기간, 고사장, 성적 발표 순서로 점검합니다.",
    category: "공인검정",
    region: "전국",
    source: "한국세무사회 국가공인자격시험",
    sourceUrl: "https://license.kacpta.or.kr/",
    tags: ["전산세무", "전산회계", "회계자격"],
    meta: {
      examType: "회계 실무 급수형 공인검정",
      scheduleStatus: "한국세무사회 자격시험 일정에서 접수, 시험일, 발표일 확인",
      applicationType: "급수별 접수, 고사장 선택, 수험표 출력 여부 확인",
      deadlineRisk: "원하는 급수와 고사장 조합이 빠르게 마감될 수 있습니다.",
      documentNote: "신분증, 수험표, 프로그램 사용 유의사항을 시험 전 확인",
      venueNote: "고사장 위치와 입실 시간을 전날 다시 확인",
      resultNote: "성적 발표 후 자격증 신청 가능 절차를 함께 확인",
      officialCheck: "한국세무사회 자격시험 공지와 접수 내역을 함께 확인합니다.",
      bestFor: "회계·세무 실무 자격을 취업 제출용으로 준비하는 수험생",
      caution: "급수별 시험 시간과 고사장이 달라질 수 있습니다.",
      statusBadges: ["회계자격", "급수", "고사장"]
    }
  }),
  createExamItem({
    slug: "jlpt-application",
    title: "JLPT 일본어능력시험 접수 확인",
    summary: "JLPT 접수와 수험표, 시험장, 성적 발표를 제출 마감 기준으로 역산합니다.",
    category: "어학시험",
    region: "전국",
    source: "JLPT 일본어능력시험",
    sourceUrl: "https://www.jlpt.or.kr/",
    tags: ["JLPT", "일본어", "성적표"],
    meta: {
      examType: "연 2회 중심으로 운영되는 일본어 능력 검정",
      scheduleStatus: "JLPT 공식 일정에서 접수 기간, 시험일, 성적 발표일 확인",
      applicationType: "급수 선택, 접수 지역, 수험표 출력 기간을 따로 확인",
      deadlineRisk: "일본 유학·취업 제출용이면 성적 발표일이 제출 마감에 맞는지 먼저 봐야 합니다.",
      documentNote: "영문·한글 이름, 생년월일, 신분증, 사진 정보 일치 확인",
      venueNote: "시험장 배정 공지와 입실 시간을 시험 전 재확인",
      resultNote: "성적 조회일과 성적증명서 발급 가능 시점 확인",
      officialCheck: "JLPT 공식 사이트의 접수 안내, 수험표, 성적 조회 공지를 확인합니다.",
      bestFor: "일본어 성적을 학교·회사·비자 관련 서류에 제출해야 하는 수험생",
      caution: "시험 횟수가 많지 않아 접수 누락의 영향이 큽니다.",
      statusBadges: ["연2회", "급수", "성적표"]
    }
  }),
  createExamItem({
    slug: "teps-regular-test",
    title: "TEPS 정기시험 성적 제출 역산",
    summary: "TEPS 시험일보다 성적 발표일과 제출처 마감을 먼저 맞추는 일정 관리 기준입니다.",
    category: "어학시험",
    region: "전국",
    source: "TEPS",
    sourceUrl: "https://www.teps.or.kr/",
    tags: ["TEPS", "어학성적", "제출마감"],
    meta: {
      examType: "정기 어학 성적 검정",
      scheduleStatus: "TEPS 공식 일정에서 접수 마감, 시험일, 성적 발표일 확인",
      applicationType: "정기 접수, 추가 접수 비용, 시험센터 선택 확인",
      deadlineRisk: "대학원·공공기관 제출 마감보다 성적 발표가 늦을 수 있습니다.",
      documentNote: "신분증, 영문 이름, 접수 정보, 성적표 발급 방식을 확인",
      venueNote: "시험센터 위치와 입실 시간을 전날 다시 확인",
      resultNote: "성적 발표일과 성적표 제출 가능 형태를 제출처 기준으로 확인",
      officialCheck: "TEPS 시험일정과 성적 확인 안내를 함께 봅니다.",
      bestFor: "대학원, 공공기관, 장학 신청 등 성적 제출 마감이 있는 수험생",
      caution: "접수 가능 여부보다 성적을 언제 받을 수 있는지가 중요합니다.",
      statusBadges: ["어학성적", "발표일", "제출마감"]
    }
  }),
  createExamItem({
    slug: "ibt-toefl-score-plan",
    title: "TOEFL iBT 성적 리포팅 일정 확인",
    summary: "TOEFL iBT 응시 전 시험일, 성적 확인, 기관 리포팅 소요 시간을 분리해 봅니다.",
    category: "어학시험",
    region: "전국",
    source: "ETS TOEFL",
    sourceUrl: "https://www.ets.org/toefl.html",
    tags: ["TOEFL", "iBT", "리포팅"],
    meta: {
      examType: "해외 기관 제출이 많은 국제 어학시험",
      scheduleStatus: "ETS 계정에서 시험 가능일, 시험장, 성적 확인 예정 시점 확인",
      applicationType: "시험장 응시와 재택 응시 조건, 변경·취소 규정 확인",
      deadlineRisk: "지원 기관 리포팅 소요 시간을 계산하지 않으면 제출 마감에 늦을 수 있습니다.",
      documentNote: "여권 등 인정 신분증, 영문 이름, 계정 정보 일치 여부 확인",
      venueNote: "시험장 입실 기준과 장비·보안 규정을 공식 안내에서 확인",
      resultNote: "점수 확인일, 리포팅 신청, 기관 수신 예상 기간을 따로 기록",
      officialCheck: "ETS 계정의 시험 예약, 신분증 규정, 점수 리포팅 안내를 확인합니다.",
      bestFor: "해외 대학·기관 제출용 영어 성적이 필요한 응시자",
      caution: "점수를 보는 날과 기관이 점수를 받는 날은 다를 수 있습니다.",
      statusBadges: ["국제시험", "리포팅", "신분증"]
    }
  }),
  createExamItem({
    slug: "local-gosi-application",
    title: "지방직 공무원 원서접수 일정 확인",
    summary: "지방직 공무원 접수 전 거주지 제한, 직렬, 가산점, 필기 발표 일정을 함께 확인합니다.",
    category: "공공시험",
    region: "전국",
    source: "지방자치단체 인터넷원서접수센터",
    sourceUrl: "https://local.gosi.go.kr/",
    tags: ["지방직", "공무원", "거주지제한"],
    meta: {
      examType: "지역·직렬별 공무원 공개경쟁 시험",
      scheduleStatus: "지방자치단체 인터넷원서접수센터와 지자체 공고에서 일정 확인",
      applicationType: "지역, 직렬, 응시 자격, 원서접수 내역을 분리 확인",
      deadlineRisk: "거주지 제한과 가산점 등록 기준일을 놓치기 쉽습니다.",
      documentNote: "주민등록, 자격증, 가산점, 장애·저소득 구분 증빙 확인",
      venueNote: "필기 시험장 공지는 접수 후 별도 발표될 수 있어 재확인 필요",
      resultNote: "필기 발표 후 면접 등록, 서류 제출, 최종 발표 일정을 이어서 기록",
      officialCheck: "원서접수센터 공지와 각 지자체 시험 공고를 함께 봅니다.",
      bestFor: "지방직 공무원 시험을 지역 조건과 함께 준비하는 수험생",
      caution: "지역 선택은 단순 선호가 아니라 거주지 제한 기준과 함께 봐야 합니다.",
      statusBadges: ["지방직", "거주지", "가산점"]
    }
  }),
  createExamItem({
    slug: "cyber-gosi-open-competitive",
    title: "국가공무원 공개경쟁채용 일정 확인",
    summary: "국가공무원 원서접수와 필기, 면접, 합격자 발표를 전형 흐름으로 관리합니다.",
    category: "공공시험",
    region: "전국",
    source: "사이버국가고시센터",
    sourceUrl: "https://www.gosi.kr/",
    tags: ["국가공무원", "공채", "공개경쟁"],
    meta: {
      examType: "국가공무원 공개경쟁채용 시험",
      scheduleStatus: "사이버국가고시센터 시험공고와 연간 일정에서 접수·필기·면접 확인",
      applicationType: "직급, 직렬, 지역 구분, 가산점 등록 기준 확인",
      deadlineRisk: "필기 이후 면접 등록과 서류 제출 일정이 짧게 이어질 수 있습니다.",
      documentNote: "응시 자격, 가산점, 신분증, 면접 서류 제출 기준 확인",
      venueNote: "시험장 공고와 입실 시간을 시험 전 다시 확인",
      resultNote: "필기 발표, 면접 일정, 최종 발표를 한 캘린더에 연결",
      officialCheck: "사이버국가고시센터 공고, 변경 공고, 합격자 발표 메뉴를 함께 봅니다.",
      bestFor: "국가직 공무원 시험 전형 일정을 체계적으로 관리하려는 수험생",
      caution: "연간 일정표만 저장하지 말고 변경 공고를 함께 확인해야 합니다.",
      statusBadges: ["국가직", "변경공고", "전형관리"]
    }
  }),
  createExamItem({
    slug: "ncs-public-agency-written",
    title: "공공기관 필기 전형 일정 관리",
    summary: "공공기관 채용에서 서류 발표, 필기 전형, 면접 일정을 공고 기준으로 연결해 봅니다.",
    category: "공공시험",
    region: "전국",
    source: "공공기관 채용정보시스템",
    sourceUrl: "https://job.alio.go.kr/",
    tags: ["공공기관", "NCS", "필기전형"],
    meta: {
      examType: "기관별 채용 공고에 따라 운영되는 필기 전형",
      scheduleStatus: "채용 공고와 기관 채용 홈페이지에서 서류·필기·면접 일정 확인",
      applicationType: "기관별 지원서 접수, 필기 대상자 발표, 수험표 출력 확인",
      deadlineRisk: "서류 합격자 발표 후 필기까지 준비 시간이 짧을 수 있습니다.",
      documentNote: "자격증, 우대사항, 교육사항, 경력 증빙 기준을 공고에서 확인",
      venueNote: "필기 장소와 입실 시간은 대상자 발표 후 별도 공지될 수 있음",
      resultNote: "필기 발표 후 면접 안내와 증빙 제출 일정을 바로 확인",
      officialCheck: "잡알리오 공고와 기관 채용 페이지의 변경 공지를 함께 봅니다.",
      bestFor: "NCS 필기와 직무 필기를 병행하는 공공기관 지원자",
      caution: "잡알리오 요약보다 기관 채용 페이지의 첨부 공고가 우선입니다.",
      statusBadges: ["NCS", "기관공고", "필기전형"]
    }
  }),
  createExamItem({
    slug: "caregiver-cbt-calendar",
    title: "요양보호사 CBT 시험 일정 확인",
    summary: "요양보호사 CBT 시험을 교육 이수, 시험장 예약, 합격 발표 순서로 확인합니다.",
    category: "전문자격",
    region: "전국",
    source: "한국보건의료인국가시험원",
    sourceUrl: "https://www.kuksiwon.or.kr/",
    tags: ["요양보호사", "CBT", "국시원"],
    meta: {
      examType: "보건의료 인력 자격 CBT 시험",
      scheduleStatus: "국시원 공지와 원서접수 메뉴에서 CBT 시험 가능일 확인",
      applicationType: "교육 이수 여부, 시험장 예약, 응시표 출력 기준 확인",
      deadlineRisk: "교육기관 수료 확인과 시험장 예약 가능일을 따로 봐야 합니다.",
      documentNote: "교육 이수, 신분증, 응시표, 시험장 유의사항 확인",
      venueNote: "CBT 시험장 위치와 입실 시간을 시험 전 다시 확인",
      resultNote: "합격자 발표와 자격증 발급 절차를 이어서 확인",
      officialCheck: "국시원 시험 공지, 원서접수, 합격자 조회 메뉴를 함께 봅니다.",
      bestFor: "요양보호사 교육 수료 후 시험 가능일을 확인하는 응시자",
      caution: "교육기관 안내와 국시원 접수 가능일이 다를 수 있습니다.",
      statusBadges: ["CBT", "교육이수", "응시표"]
    }
  }),
  createExamItem({
    slug: "fire-safety-manager-course-exam",
    title: "소방안전관리자 강습·시험 일정 확인",
    summary: "소방안전관리자 자격 취득 전 강습교육, 시험, 수첩 발급 절차를 구분합니다.",
    category: "전문자격",
    region: "전국",
    source: "한국소방안전원",
    sourceUrl: "https://www.kfsi.or.kr/",
    tags: ["소방안전관리자", "강습교육", "시험"],
    meta: {
      examType: "강습교육과 시험이 연결되는 안전관리 자격",
      scheduleStatus: "한국소방안전원 교육·시험 공지에서 지역별 일정 확인",
      applicationType: "강습교육 신청, 시험 접수, 수첩 발급 절차를 따로 확인",
      deadlineRisk: "교육 수강 가능일과 시험 가능일이 원하는 지역에서 맞지 않을 수 있습니다.",
      documentNote: "교육 신청 정보, 신분증, 수료 기준, 시험 유의사항 확인",
      venueNote: "교육장과 시험장이 다를 수 있어 지역과 시간을 별도로 확인",
      resultNote: "시험 합격 후 자격 수첩 발급 또는 확인 절차를 저장",
      officialCheck: "한국소방안전원 교육 일정, 시험 안내, 자격 발급 메뉴를 함께 봅니다.",
      bestFor: "건물 관리, 안전관리 업무를 위해 자격 취득 일정이 필요한 응시자",
      caution: "시험만 보는 구조가 아니라 교육 일정까지 함께 봐야 합니다.",
      statusBadges: ["강습교육", "시험", "발급절차"]
    }
  }),
  createExamItem({
    slug: "youth-counselor-license",
    title: "청소년상담사 시험 일정 확인",
    summary: "청소년상담사 시험을 응시자격, 필기, 면접, 자격연수 흐름으로 정리합니다.",
    category: "전문자격",
    region: "전국",
    source: "한국산업인력공단 Q-Net",
    sourceUrl: "https://www.q-net.or.kr/",
    tags: ["청소년상담사", "전문자격", "면접"],
    meta: {
      examType: "필기·면접·연수 흐름이 있는 전문자격",
      scheduleStatus: "Q-Net 시행계획과 공지에서 필기, 면접, 발표 일정 확인",
      applicationType: "급수별 응시자격, 필기 접수, 면접 대상자 확인",
      deadlineRisk: "필기 합격 후 면접과 연수 안내를 놓치면 취득 일정이 밀릴 수 있습니다.",
      documentNote: "학력·경력 응시자격 증빙과 면접 서류 기준 확인",
      venueNote: "필기와 면접 장소가 다를 수 있어 각각 확인",
      resultNote: "필기·면접 발표와 자격연수 안내를 이어서 기록",
      officialCheck: "Q-Net 시행계획, 응시자격, 면접 안내, 합격자 발표를 함께 봅니다.",
      bestFor: "상담 관련 학력·경력 조건을 갖춘 뒤 자격 취득을 준비하는 응시자",
      caution: "필기 합격만으로 끝나는 시험이 아니므로 다음 절차를 같이 봐야 합니다.",
      statusBadges: ["필기", "면접", "자격연수"]
    }
  }),
  createExamItem({
    slug: "cosmetology-practical-seat",
    title: "미용사 실기 시험 일정 확인",
    summary: "미용사 실기 시험을 상시·정기 접수, 준비물, 시험장 기준으로 확인합니다.",
    category: "국가기술자격",
    region: "전국",
    source: "한국산업인력공단 Q-Net",
    sourceUrl: "https://www.q-net.or.kr/",
    tags: ["미용사", "실기", "준비물"],
    meta: {
      examType: "준비물과 작업형 평가가 중요한 국가기술자격",
      scheduleStatus: "Q-Net에서 종목별 실기 접수 가능일과 시험장 확인",
      applicationType: "실기 원서접수, 시험장 선택, 준비물 공지 확인",
      deadlineRisk: "준비물 목록과 위생 기준을 늦게 확인하면 시험 당일 감점 위험이 생깁니다.",
      documentNote: "신분증, 수험표, 종목별 준비물, 복장·위생 기준 확인",
      venueNote: "시험장 이동 시간과 준비물 반입 기준을 전날 재확인",
      resultNote: "합격자 발표일과 자격증 발급 절차를 함께 기록",
      officialCheck: "Q-Net 종목별 수험자 유의사항과 실기 준비물 목록을 확인합니다.",
      bestFor: "작업형 실기 시험을 준비하며 준비물 누락이 걱정되는 수험생",
      caution: "실기 시험은 일정만큼 준비물과 현장 규정이 중요합니다.",
      statusBadges: ["작업형", "준비물", "시험장"]
    }
  })
];

function bodyFor(item: InfoItem, meta: ExamMeta) {
  const sourceLabel = meta.officialLinks.map((link) => link.label).slice(0, 2).join(", ");
  return [
    "## 한 줄 결론",
    `${item.title}은 ${meta.examType}입니다. ${item.region} 기준으로 시험을 찾는다면 시험일보다 ${meta.applicationType}, ${meta.deadlineRisk}, ${meta.resultNote}을 먼저 확인해야 합니다.`,
    `시험 정보는 검색 결과의 날짜 요약만으로 판단하기 어렵습니다. 같은 시험명이라도 회차, 지역, 급수, 시험장, 접수 방식에 따라 실제로 할 일이 달라집니다. 이 글은 ${item.source}의 공식 안내를 다시 확인하기 전, 수험생이 어떤 순서로 볼지 정리한 브리핑입니다.`,
    "## 이 글이 필요한 사람",
    `${meta.bestFor}에게 특히 유용합니다. 이미 시험명을 정했다면 접수 버튼을 누르기 전에 본인에게 필요한 등급, 활용처 제출 마감, 인정 신분증, 시험장 접근성을 한 번 더 점검하세요.`,
    `아직 시험명을 고르는 중이라면 ${item.category} 안에서 비슷한 시험을 비교할 때도 같은 기준을 적용할 수 있습니다. 단순히 난이도나 응시료만 비교하지 말고, 성적이 언제 나오고 그 성적을 어디에 제출할 수 있는지까지 봐야 실제 일정이 맞습니다.`,
    "## 접수 전 확인 순서",
    `첫째, 공식 접수처에서 현재 열려 있는 회차와 접수 시작·마감 시간을 확인합니다. ${meta.scheduleStatus} 상태를 먼저 보고, 접수 가능 회차가 없으면 다음 공지 예정 시점을 캘린더에 남깁니다.`,
    `둘째, 본인에게 맞는 급수·직렬·종목을 확정합니다. ${meta.deadlineRisk} 때문에 제목만 보고 접수하면 나중에 성적 활용이나 응시 자격에서 다시 막힐 수 있습니다.`,
    `셋째, 시험장과 입실 시간을 봅니다. ${meta.venueNote} 인기 시험장은 같은 지역 안에서도 좌석이 빠르게 줄어들 수 있으므로 가능한 지역을 두세 곳 열어두는 편이 안전합니다.`,
    "## 서류와 본인 확인",
    `${meta.documentNote} 시험장에서 인정되지 않는 신분증, 이름 표기 불일치, 사진 규격 오류는 공부량과 무관하게 응시를 어렵게 만들 수 있습니다. 접수 화면의 개인정보와 신분증 표기가 같은지 확인하세요.`,
    "응시자격 서류가 필요한 시험은 접수 완료만으로 끝나지 않습니다. 서류 제출, 접수 상태, 승인 상태가 각각 다를 수 있으므로 마이페이지나 접수내역 화면에서 최종 승인 여부까지 확인해야 합니다.",
    "## 시험장과 당일 준비",
    `${item.title}은 시험장 환경이 실제 체감 난이도에 영향을 줄 수 있습니다. 처음 가는 고사장이라면 대중교통, 주차 가능성, 도보 이동 시간, 입실 마감 시간을 별도로 저장하세요.`,
    "수험표 출력이 필요한지, 모바일 수험표가 인정되는지, 필기구나 계산기 같은 물품 기준이 있는지도 확인해야 합니다. 작업형·실기형 시험은 프로그램 버전, 준비물 목록, 반입 금지 물품을 전날 다시 보는 것이 좋습니다.",
    "## 성적 발표와 제출 마감",
    `${meta.resultNote} 시험을 보는 목적이 취업, 졸업, 승진, 공공기관 지원이라면 시험일보다 성적 발표일이 더 중요할 수 있습니다. 제출처가 요구하는 성적 유효기간과 제출 방식도 함께 확인하세요.`,
    "성적표가 바로 출력되는 시험과 며칠 뒤 조회되는 시험, 기관 제출용 리포팅이 따로 필요한 시험은 일정 관리 방식이 다릅니다. 제출처 마감일에서 성적 발표일과 발급 소요 시간을 거꾸로 빼서 가능한 회차를 고르는 편이 안전합니다.",
    "## 자주 생기는 실수",
    `${meta.caution} 또 접수 후 변경·취소 가능 기간을 모르면 시험장 변경이나 환불이 어려워질 수 있습니다. 접수 완료 화면을 캡처하되, 캡처만 믿지 말고 마이페이지에서 상태가 정상인지 다시 확인하세요.`,
    "비슷한 이름의 시험을 동시에 준비할 때는 일정표에 시험일 하나만 적지 말고 접수 마감, 환불 마감, 수험표 출력, 성적 발표, 제출 마감을 다른 색으로 나누어 적어두세요. 이렇게 해두면 접수 실수보다 일정 충돌을 먼저 발견할 수 있습니다.",
    "## 공식 출처에서 다시 볼 항목",
    `${meta.officialCheck} 이 페이지의 확인일은 ${meta.lastCheckedAt}이며, 다음 정기 검토 전이라도 주관기관 공지가 바뀌면 실제 일정이 달라질 수 있습니다.`,
    `${item.title} 관련 최신 정보는 ${sourceLabel}에서 다시 확인하세요. 검색 결과의 요약, 블로그 후기, 커뮤니티 글은 참고가 될 수 있지만 접수 가능 여부와 응시 조건의 최종 기준은 공식 접수처입니다.`,
    "## 개인 메모 예시",
    `메모는 "시험명: ${item.title} / 확인일: ${meta.lastCheckedAt} / 접수처: ${item.source} / 접수 마감: 직접 확인 / 시험장: 직접 확인 / 성적 발표: 직접 확인 / 제출처 마감: 직접 확인"처럼 남기면 좋습니다.`,
    "이런 방식으로 적어두면 다음 회차를 다시 볼 때 무엇이 바뀌었는지 비교할 수 있습니다. 특히 여러 시험을 동시에 준비하는 수험생은 링크만 저장하는 것보다 확인한 메뉴명과 날짜를 함께 적어두는 편이 훨씬 실용적입니다."
  ];
}

function faqFor(item: InfoItem, meta: ExamMeta) {
  return [
    {
      question: `${item.title}은 시험일만 확인하면 되나요?`,
      answer: `아닙니다. ${meta.applicationType}과 ${meta.resultNote}을 함께 봐야 합니다. 접수 마감과 성적 발표일이 실제 일정 판단의 기준이 될 수 있습니다.`
    },
    {
      question: `접수 전에 가장 먼저 볼 것은 무엇인가요?`,
      answer: `${meta.officialCheck} 특히 응시자격, 급수, 시험장, 수험자 유의사항은 접수 전에 확인하는 편이 안전합니다.`
    },
    {
      question: `준비물은 어디서 확인해야 하나요?`,
      answer: `${item.source}의 수험자 유의사항과 접수 내역을 확인하세요. ${meta.documentNote}`
    },
    {
      question: `성적 제출용으로 준비할 때 주의할 점은 무엇인가요?`,
      answer: `${meta.resultNote} 제출처가 요구하는 유효기간과 발급 방식을 먼저 확인한 뒤 시험 회차를 선택해야 합니다.`
    },
    {
      question: `이 페이지 정보만으로 접수해도 되나요?`,
      answer: `이 페이지는 확인 순서를 정리한 편집 자료입니다. 실제 접수와 응시 가능 여부는 반드시 ${meta.officialLinks[0]?.label ?? item.source}의 최신 공지를 기준으로 판단해야 합니다.`
    }
  ];
}

export function enhanceExamItem(item: InfoItem): InfoItem {
  const meta = metaFor(item);
  const body = bodyFor(item, meta);
  return {
    ...item,
    summary: `${item.title}: ${meta.applicationType}과 ${meta.resultNote}을 함께 확인해야 하는 ${item.category} 브리핑입니다.`,
    period: meta.scheduleStatus,
    updatedAt: examReviewDate,
    nextReviewAt: examNextReviewDate,
    readingTime: "7분 읽기",
    audience: meta.bestFor,
    keyChecks: [meta.applicationType, meta.deadlineRisk, meta.documentNote, meta.resultNote],
    sourceLinks: meta.officialLinks,
    details: {
      "시험 유형": meta.examType,
      "일정 상태": meta.scheduleStatus,
      "접수 방식": meta.applicationType,
      "마감 리스크": meta.deadlineRisk,
      "서류·준비물": meta.documentNote,
      "성적 활용": meta.resultNote
    },
    body,
    faq: faqFor(item, meta),
    ...meta
  };
}

const extraGuideSeeds: ExamGuideSeed[] = [
  {
    slug: "deadline-minus-three-days",
    title: "시험 접수 마감 3일 전 점검표",
    summary: "원서접수 마감 직전에 놓치기 쉬운 시험장, 사진, 결제, 서류 상태를 확인하는 루틴입니다.",
    category: "접수",
    focus: "접수 마감이 가까워져 실수를 줄여야 하는 수험생",
    checklist: ["접수처 로그인", "시험장 잔여석", "사진·신분증", "결제 완료", "접수 상태"]
  },
  {
    slug: "exam-room-route-check",
    title: "시험장 선택 전 이동 경로 확인법",
    summary: "시험장 거리보다 입실 가능 시간, 대중교통, 주차, 대체 경로를 먼저 보는 기준입니다.",
    category: "시험장",
    focus: "처음 가는 고사장을 선택해야 하는 수험생",
    checklist: ["입실 마감", "첫차·주차", "도보 거리", "대체 역", "시험 전날 재확인"]
  },
  {
    slug: "official-score-submit-plan",
    title: "성적 제출 마감일에서 시험일 역산하기",
    summary: "취업·졸업·교환학생 제출 마감에 맞춰 시험일과 성적 발표일을 거꾸로 계산하는 방법입니다.",
    category: "성적",
    focus: "성적을 특정 마감일까지 제출해야 하는 수험생",
    checklist: ["제출처 마감", "성적 발표일", "성적표 발급", "기관 제출 방식", "재응시 여유"]
  },
  {
    slug: "eligibility-document-rework",
    title: "응시자격 서류 보완 요청 줄이는 법",
    summary: "학력·경력·교육 이수 증빙을 제출할 때 발급일, 이름, 기간 기준을 맞추는 절차입니다.",
    category: "서류",
    focus: "응시자격 심사나 전문자격 서류가 필요한 수험생",
    checklist: ["발급일", "이름 일치", "경력 기간", "원본·스캔", "승인 상태"]
  },
  {
    slug: "constant-test-seat-watch",
    title: "상시시험 좌석 찾는 루틴",
    summary: "컴활, 워드, 일부 CBT 시험처럼 상시 접수형 시험에서 원하는 좌석을 찾는 기준입니다.",
    category: "일정 관리",
    focus: "상시시험을 빠르게 예약해야 하는 수험생",
    checklist: ["희망 지역", "대체 시험장", "시간대", "취소석 확인", "결과 발표일"]
  },
  {
    slug: "refund-before-apply",
    title: "시험 환불 마감과 변경 가능 기간 확인",
    summary: "시험 접수 후 취소·환불·시험장 변경이 가능한 기간을 미리 기록하는 방법입니다.",
    category: "접수",
    focus: "일정 변경 가능성이 있는 상태에서 접수하는 수험생",
    checklist: ["환불 마감", "변경 가능 기간", "추가 접수 비용", "결제 수단", "접수 취소 내역"]
  },
  {
    slug: "id-card-name-match",
    title: "시험 신분증과 접수 이름 일치 확인",
    summary: "인정 신분증, 영문 이름, 생년월일, 사진 규격을 시험 전 미리 맞추는 기준입니다.",
    category: "준비물",
    focus: "어학시험이나 국제시험처럼 이름 표기가 중요한 응시자",
    checklist: ["인정 신분증", "영문 이름", "생년월일", "사진 규격", "접수 정보"]
  },
  {
    slug: "after-fail-next-round",
    title: "불합격 후 다음 회차 다시 잡는 순서",
    summary: "불합격 확인 뒤 재접수 가능일, 약점 과목, 성적표 활용 가능성을 정리하는 방법입니다.",
    category: "일정 관리",
    focus: "다음 회차를 빠르게 준비해야 하는 수험생",
    checklist: ["성적표 저장", "재접수 가능일", "약점 과목", "시험장 선택", "학습 기간"]
  }
];

function guideBody(seed: ExamGuideSeed) {
  return [
    "## 먼저 정할 기준",
    `${seed.title}은 ${seed.focus}를 위한 실전형 체크리스트입니다. 시험 정보는 날짜만 보면 간단해 보이지만 실제로는 접수 마감, 준비물, 시험장, 성적 발표, 제출 마감이 서로 연결되어 있습니다.`,
    `이 가이드를 읽을 때는 본인이 준비하는 시험이 정기시험인지, 상시시험인지, 필기·실기가 이어지는 시험인지, 성적 제출용 어학시험인지 먼저 구분하세요. 같은 "시험 일정"이라도 시험 유형이 달라지면 가장 먼저 확인해야 할 메뉴가 달라집니다.`,
    "## 공식 화면에서 확인할 것",
    "검색 결과의 요약 문구보다 공식 접수처의 현재 화면을 먼저 봐야 합니다. 시험 일정은 회차별로 바뀔 수 있고, 추가 접수나 환불 기준은 같은 시험 안에서도 기간에 따라 달라질 수 있습니다.",
    "공식 화면에서는 시험일정 메뉴만 보지 말고 원서접수, 수험자 유의사항, 수험표 출력, 응시자격, 합격자 발표, 성적표 발급 메뉴를 함께 확인하세요. 많은 실수는 시험일을 몰라서가 아니라 접수 이후 단계가 따로 있다는 점을 놓쳐서 생깁니다.",
    "## 체크리스트",
    seed.checklist.map((item) => `- ${item}을 확인했습니다.`).join("\n"),
    "## 마감 기준을 나누는 방법",
    "마감일은 하나가 아닙니다. 원서접수 마감, 결제 마감, 환불 마감, 시험장 변경 가능 기간, 서류 제출 마감, 성적 제출 마감이 각각 다를 수 있습니다. 일정표에는 시험일만 적지 말고 이 마감들을 다른 색으로 나누어 적어두는 편이 좋습니다.",
    "특히 취업, 졸업, 교환학생, 공공기관 지원처럼 제출처가 정해진 시험은 성적 발표일이 실제 기준입니다. 시험일이 제출 마감보다 빠르더라도 성적표가 늦게 나오면 활용하지 못할 수 있습니다. 발표일과 발급 가능일을 제출처 기준으로 거꾸로 계산하세요.",
    "## 시험 유형별 적용 예시",
    "국가기술자격은 필기 접수와 실기 접수를 분리해서 봐야 합니다. 필기 합격 후 실기 원서접수 기간이 별도로 열리고, 응시자격 서류 승인 여부가 남아 있을 수 있습니다. 기사·산업기사처럼 자격 요건이 있는 시험은 원서접수 완료 화면만으로 안심하면 안 됩니다.",
    "상시시험은 이름 때문에 언제든 볼 수 있다고 오해하기 쉽지만, 실제로는 시험장 좌석이 남아 있는 날짜만 선택할 수 있습니다. 컴퓨터활용능력 실기나 일부 CBT 시험은 희망 지역 좌석이 없을 수 있으므로 대체 시험장과 시간대를 함께 저장해 두는 것이 현실적입니다.",
    "어학시험은 시험센터와 신분증, 영문 이름, 성적표 발급 방식이 중요합니다. 기관 리포팅이 필요한 시험은 내가 점수를 확인하는 날과 제출처가 점수를 받는 날이 다를 수 있으므로, 접수 전 제출 방식까지 확인해야 합니다.",
    "공공시험은 공고문과 원서접수 시스템이 따로 움직일 수 있습니다. 변경 공고, 가산점 등록, 필기 장소 공지, 면접 서류 제출이 분리되어 나오므로 공고 파일 하나만 저장하지 말고 발표 메뉴와 접수 내역을 함께 확인하세요.",
    "## 보완 요청을 줄이는 기록법",
    "시험 준비 기록은 링크 모음으로 끝내지 않는 것이 좋습니다. 링크는 시간이 지나면 메뉴가 바뀌거나 공지가 내려갈 수 있습니다. 확인한 날짜, 메뉴명, 회차, 시험장, 접수 상태, 성적 발표 예정일을 한 줄로 남기면 다음에 다시 확인할 때 훨씬 빠릅니다.",
    "응시자격 서류가 있는 시험은 제출한 파일명과 발급일을 따로 적어두세요. 보완 요청이 왔을 때 어떤 서류를 다시 발급해야 하는지 바로 알 수 있고, 같은 실수를 다음 회차에서 반복하지 않을 수 있습니다.",
    "## 시험 전날 다시 볼 것",
    "시험 전날에는 공부 범위보다 행정 정보를 먼저 확인하는 시간이 필요합니다. 수험표 출력 여부, 인정 신분증, 입실 시간, 시험장 주소, 교통편, 준비물, 반입 금지 물품을 다시 보세요. 시험장 변경이나 공지 수정이 없는지도 공식 접수처에서 확인하는 편이 안전합니다.",
    "모바일 캡처만 믿는 것도 위험할 수 있습니다. 일부 시험은 출력 수험표를 요구하거나, 모바일 화면을 인정하지 않을 수 있습니다. 수험자 유의사항에 적힌 방식을 기준으로 준비하세요.",
    "## 실제 메모 방식",
    `메모에는 시험명, 확인일, 공식 접수처, 접수 마감, 시험장, 준비물, 성적 발표일을 한 줄로 남기세요. ${seed.title}을 적용할 때는 링크만 저장하지 말고 어떤 메뉴에서 어떤 기준을 확인했는지 적어야 다음 회차에 비교할 수 있습니다.`,
    "## 자주 생기는 실수",
    "접수 완료 문자만 보고 안심하는 경우가 많지만, 시험장 변경 공지나 수험표 출력 기간, 서류 승인 상태가 나중에 따로 열릴 수 있습니다. 마감이 가까운 시험일수록 접수 내역 화면을 다시 확인하는 습관이 필요합니다.",
    "또한 여러 시험을 한 달 안에 몰아서 접수하면 발표일과 제출 마감이 겹칠 수 있습니다. 같은 날 두 시험을 보는 것보다 더 위험한 것은 성적 발표일이 필요한 제출 마감 뒤로 밀리는 경우입니다. 일정이 빠듯할수록 시험일보다 발표일을 먼저 비교하세요.",
    "## 업데이트 기준",
    `이 가이드는 ${examReviewDate} 기준으로 다시 정리했습니다. 시험 접수와 성적 발표 기준은 주관기관 사정에 따라 바뀔 수 있으므로 실제 접수 전에는 공식 사이트에서 현재 공지를 확인하세요.`
  ];
}

export const extraExamGuides: Guide[] = extraGuideSeeds.map((seed) => ({
  slug: seed.slug,
  title: seed.title,
  summary: seed.summary,
  category: seed.category,
  updatedAt: examReviewDate,
  body: [],
  readingTime: "6분 읽기",
  audience: seed.focus,
  keyChecks: seed.checklist,
  sourceLinks: [
    { label: "Q-Net", url: "https://www.q-net.or.kr/" },
    { label: "정부24", url: "https://www.gov.kr/" }
  ],
  nextReviewAt: examNextReviewDate
}));

export function enhanceExamGuide(guide: Guide): Guide {
  const checklist = guide.keyChecks?.length
    ? guide.keyChecks
    : ["공식 접수처", "접수 마감", "시험장", "준비물", "성적 발표"];
  const body = guideBody({
    slug: guide.slug,
    title: guide.title,
    summary: guide.summary,
    category: guide.category,
    focus: guide.audience ?? `${guide.category} 기준을 확인해야 하는 수험생`,
    checklist
  });

  return {
    ...guide,
    summary: `${guide.title}: 시험 접수와 성적 활용 사이에서 놓치기 쉬운 기준을 정리한 수험생용 가이드입니다.`,
    updatedAt: examReviewDate,
    nextReviewAt: examNextReviewDate,
    readingTime: guide.readingTime ?? "6분 읽기",
    audience: guide.audience ?? `${guide.category} 기준을 확인해야 하는 수험생`,
    keyChecks: checklist,
    sourceLinks: guide.sourceLinks ?? [
      { label: "Q-Net", url: "https://www.q-net.or.kr/" },
      { label: "정부24", url: "https://www.gov.kr/" }
    ],
    body
  };
}

export const examSiteOverrides: Partial<SiteConfig> = {
  name: "시험일정센터",
  headline: "시험일보다 접수 마감과 성적 발표를 먼저 확인하세요",
  description:
    "국가기술자격, 공인검정, 어학시험, 전문자격, 공공시험을 접수 마감·준비물·성적 발표 기준으로 다시 정리하는 수험생 일정 데스크입니다.",
  identity:
    "시험일정센터는 시험명을 나열하기보다 수험생이 실제로 놓치기 쉬운 접수 마감, 시험장, 서류, 성적 발표, 제출 마감을 함께 관리하도록 돕습니다.",
  nav: [
    { label: "마감판", href: "/exam/items" },
    { label: "국가기술자격", href: "/exam/category/국가기술자격" },
    { label: "어학·검정", href: "/exam/category/어학시험" },
    { label: "준비물", href: "/exam/guides/id-card-name-match" },
    { label: "출처", href: "/exam/sources" }
  ],
  categories: ["국가기술자격", "공인검정", "어학시험", "전문자격", "공공시험"],
  searchPlaceholder: "컴활, Q-Net, 토익, 응시자격, 성적 발표 검색",
  visualText: "접수 마감, 시험장, 성적 발표를 함께 보는 수험생 일정 데스크",
  disclaimer:
    "시험 일정, 접수 기간, 준비물, 성적 발표일은 주관기관 사정에 따라 바뀔 수 있습니다. 실제 접수와 응시는 반드시 공식 접수처의 최신 공지를 기준으로 확인하세요."
};

export function examCategoryMeta(label: string) {
  const meta = categoryDefaults[label] ?? categoryDefaults.국가기술자격;
  return {
    title: `${label} 일정 읽는 법`,
    summary: meta.officialCheck ?? "공식 접수처에서 회차별 일정을 다시 확인합니다.",
    checks: [meta.applicationType, meta.deadlineRisk, meta.documentNote, meta.resultNote].filter(Boolean) as string[]
  };
}

export function examSourceGroups() {
  return [
    {
      title: "국가기술자격",
      links: [
        { label: "Q-Net", url: "https://www.q-net.or.kr/" },
        { label: "대한상공회의소 자격평가사업단", url: "https://license.korcham.net/" },
        { label: "한국산업인력공단", url: "https://www.hrdkorea.or.kr/" }
      ]
    },
    {
      title: "공인검정·어학",
      links: [
        { label: "데이터자격검정", url: "https://www.dataq.or.kr/" },
        { label: "YBM TOEIC", url: "https://exam.toeic.co.kr/" },
        { label: "JLPT", url: "https://www.jlpt.or.kr/" },
        { label: "TEPS", url: "https://www.teps.or.kr/" }
      ]
    },
    {
      title: "공공시험·전문자격",
      links: [
        { label: "사이버국가고시센터", url: "https://www.gosi.kr/" },
        { label: "지방자치단체 인터넷원서접수센터", url: "https://local.gosi.go.kr/" },
        { label: "한국보건의료인국가시험원", url: "https://www.kuksiwon.or.kr/" },
        { label: "한국소방안전원", url: "https://www.kfsi.or.kr/" }
      ]
    }
  ];
}
