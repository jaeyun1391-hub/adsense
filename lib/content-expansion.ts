import type { Guide, InfoItem, SiteSlug } from "@/lib/sites";

const updatedAt = "2026-05-04";

type ItemSeed = {
  slug: string;
  title: string;
  category: string;
  region: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  checkpoint: string;
};

type GuideSeed = {
  slug: string;
  title: string;
  category: string;
  focus: string;
};

function periodFor(site: SiteSlug) {
  switch (site) {
    case "exam":
      return "공식 회차별 공지";
    case "events":
      return "행사별 개최 기간 확인";
    case "housing":
      return "공고별 신청 기간 확인";
    case "business":
      return "모집공고별 마감 확인";
    case "facilities":
      return "시설별 운영시간 확인";
  }
}

function summaryFor(site: SiteSlug, seed: ItemSeed) {
  switch (site) {
    case "exam":
      return `${seed.title}을 준비하는 수험생이 접수, 시험일, 준비물, 성적 활용 시점을 함께 확인할 수 있도록 정리했습니다.`;
    case "events":
      return `${seed.title} 방문 전 일정, 장소, 예약 여부, 교통과 현장 혼잡 포인트를 확인할 수 있도록 정리했습니다.`;
    case "housing":
      return `${seed.title}을 알아보는 청년이 자격 조건, 신청 서류, 공식 확인처를 먼저 점검할 수 있도록 정리했습니다.`;
    case "business":
      return `${seed.title} 신청을 검토하는 사업자가 대상, 지원 내용, 서류, 마감일을 빠르게 확인할 수 있도록 정리했습니다.`;
    case "facilities":
      return `${seed.title} 이용 전 운영시간, 예약 방식, 요금, 감면 여부를 확인할 수 있도록 정리했습니다.`;
  }
}

function bodyFor(site: SiteSlug, seed: ItemSeed) {
  switch (site) {
    case "exam":
      return [
        `${seed.title}은 시험명만 보고 접수하기보다 응시 자격, 접수 마감, 시험일, 결과 발표일을 한 번에 확인해야 합니다. 특히 제출 마감이 있는 시험은 실제 시험일보다 성적이 나오는 날짜가 더 중요할 수 있습니다.`,
        `접수 전에는 ${seed.checkpoint}을 먼저 확인하세요. 공식 접수처의 공지사항, 환불 기준, 신분증 규정도 함께 봐야 시험 당일 문제가 생길 가능성을 줄일 수 있습니다.`
      ];
    case "events":
      return [
        `${seed.title}은 개최 기간만 보고 방문하면 현장 대기, 입장 마감, 교통 통제 같은 변수를 놓칠 수 있습니다. 방문 목적에 맞춰 프로그램 시간표와 예약 필요 여부를 먼저 확인하는 편이 좋습니다.`,
        `방문 전에는 ${seed.checkpoint}을 체크하세요. 야외 행사는 날씨와 안전 공지가, 실내 전시는 입장 마감과 혼잡 시간대가 실제 만족도를 크게 좌우합니다.`
      ];
    case "housing":
      return [
        `${seed.title}은 사업 이름이 비슷해도 나이, 소득, 거주지, 임대차계약 조건이 다르게 적용될 수 있습니다. 공고문을 볼 때는 대상 조건과 제외 조건을 먼저 분리해서 읽는 것이 좋습니다.`,
        `신청 전에는 ${seed.checkpoint}을 확인하세요. 주거지원은 서류 발급일, 주소 일치, 월세 납부 증빙처럼 작은 항목에서 보완 요청이 자주 생깁니다.`
      ];
    case "business":
      return [
        `${seed.title}은 지원 규모보다 신청 대상과 제외 조건을 먼저 확인해야 합니다. 업종, 업력, 매출, 세금 체납 여부, 이미 받은 지원사업과의 중복 여부가 심사에 영향을 줄 수 있습니다.`,
        `신청 전에는 ${seed.checkpoint}을 점검하세요. 예산 소진형 사업은 모집 기간 중에도 조기 마감될 수 있으므로 사전 회원가입과 기본 서류 준비가 중요합니다.`
      ];
    case "facilities":
      return [
        `${seed.title}은 같은 공공시설이라도 지역과 운영기관에 따라 예약 방식, 요금, 휴관일이 달라질 수 있습니다. 방문 전 공식 페이지에서 오늘 운영 여부를 확인하는 것이 가장 안전합니다.`,
        `이용 전에는 ${seed.checkpoint}을 살펴보세요. 공공시설은 감면 대상, 취소 기한, 노쇼 제한이 있는 경우가 많아 예약 전 조건 확인이 필요합니다.`
      ];
  }
}

function detailsFor(site: SiteSlug, seed: ItemSeed): Record<string, string> {
  switch (site) {
    case "exam":
      return {
        "확인 항목": "접수 기간, 시험일, 합격 발표일, 환불 기준",
        "준비 포인트": seed.checkpoint,
        "추천 확인 시점": "접수 시작 전과 시험 3일 전"
      };
    case "events":
      return {
        "확인 항목": "개최 기간, 장소, 입장료, 예약 여부",
        "방문 포인트": seed.checkpoint,
        "추천 확인 시점": "방문 전날과 출발 직전"
      };
    case "housing":
      return {
        "확인 항목": "나이, 소득, 거주지, 계약 조건, 신청 서류",
        "준비 포인트": seed.checkpoint,
        "추천 확인 시점": "공고 확인 직후와 접수 직전"
      };
    case "business":
      return {
        "확인 항목": "대상 업종, 지원 내용, 자부담, 제출 서류",
        "준비 포인트": seed.checkpoint,
        "추천 확인 시점": "모집 시작일과 마감 3일 전"
      };
    case "facilities":
      return {
        "확인 항목": "운영시간, 휴관일, 요금, 예약 방식",
        "이용 포인트": seed.checkpoint,
        "추천 확인 시점": "예약 전과 방문 당일"
      };
  }
}

function faqFor(site: SiteSlug) {
  switch (site) {
    case "exam":
      return [
        { question: "일정이 바뀔 수 있나요?", answer: "네. 시험 주관기관 사정에 따라 접수, 시험장, 발표 일정이 바뀔 수 있어 공식 공지를 다시 확인해야 합니다." },
        { question: "접수 전에 가장 먼저 볼 것은 무엇인가요?", answer: "응시 자격과 성적 활용 기한을 먼저 확인한 뒤 접수 마감일과 시험장을 선택하는 것이 좋습니다." }
      ];
    case "events":
      return [
        { question: "방문 전 무엇을 확인해야 하나요?", answer: "운영 시간, 입장 마감, 예약 여부, 주차와 대중교통, 우천 시 변경 공지를 확인하는 것이 좋습니다." },
        { question: "무료 행사도 비용이 생길 수 있나요?", answer: "입장은 무료여도 체험, 주차, 일부 프로그램은 유료일 수 있으므로 공식 안내를 확인하세요." }
      ];
    case "housing":
      return [
        { question: "공고마다 조건이 다른가요?", answer: "네. 나이, 소득, 자산, 거주지, 임대차계약 조건이 사업별로 다르게 적용될 수 있습니다." },
        { question: "서류는 미리 준비해도 되나요?", answer: "가능하지만 발급일 제한이 있는 서류는 접수 직전에 다시 발급해야 할 수 있습니다." }
      ];
    case "business":
      return [
        { question: "모집 기간 안이면 항상 신청 가능한가요?", answer: "아닙니다. 예산 소진형 사업은 모집 기간 중에도 조기 마감될 수 있습니다." },
        { question: "자부담이 꼭 있나요?", answer: "사업별로 다릅니다. 현금 지원, 바우처, 대출, 컨설팅에 따라 자부담과 정산 방식이 달라집니다." }
      ];
    case "facilities":
      return [
        { question: "예약 없이 이용할 수 있나요?", answer: "시설별로 다릅니다. 현장 이용, 선착순 예약, 추첨제가 섞여 있으므로 공식 예약 페이지를 확인하세요." },
        { question: "감면 혜택은 자동 적용되나요?", answer: "일부는 자동 적용되지만 현장 증빙이 필요한 시설도 있습니다. 예약 전 감면 조건을 확인하세요." }
      ];
  }
}

function makeItem(site: SiteSlug, seed: ItemSeed): InfoItem {
  return {
    slug: seed.slug,
    title: seed.title,
    summary: summaryFor(site, seed),
    category: seed.category,
    region: seed.region,
    period: periodFor(site),
    source: seed.source,
    sourceUrl: seed.sourceUrl,
    updatedAt,
    tags: seed.tags,
    details: detailsFor(site, seed),
    body: bodyFor(site, seed),
    faq: faqFor(site)
  };
}

function guideBody(site: SiteSlug, seed: GuideSeed) {
  switch (site) {
    case "exam":
      return [
        `${seed.title}은 시험을 처음 준비하는 사람이 일정 실수를 줄이기 위한 기준입니다. ${seed.focus}을 먼저 정리하면 접수 후 변경이나 환불 문제를 줄일 수 있습니다.`,
        "시험 정보는 블로그 후기보다 공식 접수처 공지와 시험 안내문을 기준으로 확인해야 합니다. 후기는 준비 난이도를 파악하는 보조 자료로만 활용하는 편이 안전합니다.",
        "일정표에는 시험일뿐 아니라 접수 마감, 환불 마감, 성적 발표, 서류 제출 마감까지 함께 기록하세요."
      ];
    case "events":
      return [
        `${seed.title}은 행사장을 더 편하게 이용하기 위한 방문 기준입니다. ${seed.focus}을 먼저 확인하면 현장 대기와 이동 스트레스를 줄일 수 있습니다.`,
        "행사 정보는 개최일만으로 충분하지 않습니다. 회차별 프로그램, 입장 마감, 주차 통제, 우천 변경 여부를 함께 확인해야 실제 방문 계획이 완성됩니다.",
        "가족 방문이나 장거리 이동이라면 대체 일정과 주변 편의시설까지 확인해 두는 것이 좋습니다."
      ];
    case "housing":
      return [
        `${seed.title}은 주거지원 신청 전 탈락 가능성을 낮추기 위한 기준입니다. ${seed.focus}을 먼저 확인하면 서류 보완과 조건 착오를 줄일 수 있습니다.`,
        "주거정책은 이름이 비슷해도 중앙정부와 지자체 조건이 다를 수 있습니다. 공고문, 신청 페이지, 상담 창구의 안내를 함께 확인하세요.",
        "신청 전에는 계약서, 주소, 소득 자료, 납부 증빙이 서로 맞는지 점검하는 것이 중요합니다."
      ];
    case "business":
      return [
        `${seed.title}은 사업자가 지원사업을 검토할 때 시간을 아끼기 위한 기준입니다. ${seed.focus}을 먼저 보면 신청 가능성이 낮은 공고를 빠르게 걸러낼 수 있습니다.`,
        "지원사업은 금액보다 대상 조건, 제외 업종, 자부담, 정산 방식이 중요합니다. 공고문을 읽을 때 이 네 가지를 먼저 표시해 두세요.",
        "마감 임박 공고는 서류 준비 시간이 부족할 수 있으므로 기본 서류 묶음을 미리 준비해 두는 것이 좋습니다."
      ];
    case "facilities":
      return [
        `${seed.title}은 공공시설을 헛걸음 없이 이용하기 위한 기준입니다. ${seed.focus}을 먼저 확인하면 예약 실패와 현장 이용 제한을 줄일 수 있습니다.`,
        "공공시설은 운영기관마다 규칙이 다릅니다. 운영시간, 휴관일, 예약 방식, 취소 기한, 감면 증빙을 같은 화면에서 확인하는 습관이 필요합니다.",
        "단체 이용이나 장비가 필요한 경우에는 온라인 예약만 믿지 말고 시설에 한 번 더 문의하는 편이 안전합니다."
      ];
  }
}

function makeGuide(site: SiteSlug, seed: GuideSeed): Guide {
  return {
    slug: seed.slug,
    title: seed.title,
    summary: `${seed.focus}을 기준으로 ${seed.title}을 실무적으로 정리한 가이드입니다.`,
    category: seed.category,
    updatedAt,
    body: guideBody(site, seed)
  };
}

const examSeeds: ItemSeed[] = [
  ["computer-level1-practical", "컴퓨터활용능력 1급 실기 일정", "국가기술자격", "전국", "대한상공회의소 자격평가사업단", "https://license.korcham.net/", ["컴활", "실기", "상시시험"], "실기 프로그램 버전과 시험장 잔여 좌석"],
  ["computer-level2-written", "컴퓨터활용능력 2급 필기 일정", "국가기술자격", "전국", "대한상공회의소 자격평가사업단", "https://license.korcham.net/", ["컴활", "필기", "사무자격"], "필기 합격 후 실기 접수 가능 시점"],
  ["word-processor-written", "워드프로세서 필기 일정", "국가기술자격", "전국", "대한상공회의소 자격평가사업단", "https://license.korcham.net/", ["워드프로세서", "필기"], "상시 시험장과 접수 가능 날짜"],
  ["engineer-information-processing-written", "정보처리기사 필기 일정", "국가기술자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["정보처리기사", "기사", "필기"], "응시 자격 서류 제출 필요 여부"],
  ["engineer-information-processing-practical", "정보처리기사 실기 일정", "국가기술자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["정보처리기사", "실기"], "필기 합격 유효기간과 실기 원서접수"],
  ["engineer-electric-written", "전기기사 필기 일정", "국가기술자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["전기기사", "필기"], "관련학과 또는 경력 응시 자격"],
  ["engineer-electric-practical", "전기기사 실기 일정", "국가기술자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["전기기사", "실기"], "작업형 여부와 준비물 안내"],
  ["industrial-safety-written", "산업안전기사 필기 일정", "국가기술자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["산업안전기사", "안전"], "응시 자격과 회차별 시험장"],
  ["history-advanced", "한국사능력검정시험 심화", "공인검정", "전국", "국사편찬위원회", "https://www.historyexam.go.kr/", ["한국사", "심화"], "원서접수 시작 시간과 고사장 마감"],
  ["history-basic", "한국사능력검정시험 기본", "공인검정", "전국", "국사편찬위원회", "https://www.historyexam.go.kr/", ["한국사", "기본"], "제출처가 요구하는 인증 등급"],
  ["toeic-speaking", "TOEIC Speaking 정기시험", "어학시험", "전국", "YBM 한국TOEIC위원회", "https://www.toeicswt.co.kr/", ["토익스피킹", "어학"], "성적 발표일과 제출 마감일"],
  ["opic-regular", "OPIc 정기시험", "어학시험", "전국", "멀티캠퍼스 OPIc", "https://www.opic.or.kr/", ["OPIc", "어학"], "시험센터 위치와 신분증 규정"],
  ["hsk-regular", "HSK 정기시험", "어학시험", "전국", "HSK 한국사무국", "https://www.hsk.or.kr/", ["HSK", "중국어"], "급수별 시험 시간과 성적 발표"],
  ["realtor-first", "공인중개사 1차 시험", "전문자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["공인중개사", "1차"], "1차와 2차 동시 접수 여부"],
  ["realtor-second", "공인중개사 2차 시험", "전문자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["공인중개사", "2차"], "합격 기준과 과락 기준"],
  ["social-worker-level1", "사회복지사 1급 시험", "전문자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["사회복지사", "1급"], "응시 자격 증빙서류"],
  ["vocational-counselor-level2", "직업상담사 2급 시험", "국가기술자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["직업상담사", "2급"], "필기와 실기 회차 연결"],
  ["distribution-manager", "유통관리사 시험", "공인검정", "전국", "대한상공회의소 자격평가사업단", "https://license.korcham.net/", ["유통관리사", "상공회의소"], "등급별 시험 과목과 접수일"],
  ["logistics-manager", "물류관리사 시험", "전문자격", "전국", "한국산업인력공단 Q-Net", "https://www.q-net.or.kr/", ["물류관리사", "전문자격"], "연 1회 시험 여부와 원서접수"],
  ["nursing-assistant", "간호조무사 시험", "전문자격", "전국", "한국보건의료인국가시험원", "https://www.kuksiwon.or.kr/", ["간호조무사", "보건"], "응시 자격과 교육 이수 기준"],
  ["caregiver", "요양보호사 시험", "전문자격", "전국", "한국보건의료인국가시험원", "https://www.kuksiwon.or.kr/", ["요양보호사", "보건"], "CBT 시험장과 교육기관 수료"],
  ["kbs-korean", "KBS한국어능력시험", "공인검정", "전국", "KBS한국어진흥원", "https://www.klt.or.kr/", ["KBS한국어", "국어"], "접수 마감과 성적 활용처"],
  ["maekyung-test", "매경TEST", "공인검정", "전국", "매경TEST", "https://exam.mk.co.kr/", ["경제", "매경TEST"], "등급 기준과 성적 발표일"],
  ["tesat", "TESAT 경제이해력검증시험", "공인검정", "전국", "한국경제신문 TESAT", "https://www.tesat.or.kr/", ["경제", "TESAT"], "정기시험 회차와 접수 상태"],
  ["local-public-officer-9", "지방직 공무원 9급 필기", "공공시험", "전국", "지방자치단체 인터넷원서접수센터", "https://local.gosi.go.kr/", ["공무원", "지방직"], "지역별 원서접수와 거주지 제한"]
].map(([slug, title, category, region, source, sourceUrl, tags, checkpoint]) => ({
  slug,
  title,
  category,
  region,
  source,
  sourceUrl,
  tags,
  checkpoint
})) as ItemSeed[];

const eventSeeds: ItemSeed[] = [
  ["seoul-design-festival", "서울 디자인 페스티벌 방문 가이드", "전시", "서울", "디자인하우스", "https://designfestival.co.kr/", ["디자인", "전시"], "사전등록과 입장 마감 시간"],
  ["seoul-cafe-show", "서울 카페쇼 일정 확인", "전시", "서울", "서울카페쇼", "https://www.cafeshow.com/", ["카페", "박람회"], "비즈니스 데이와 일반 관람일 구분"],
  ["seoul-illustration-fair", "서울 일러스트레이션 페어", "전시", "서울", "서울일러스트레이션페어", "https://seoulillustrationfair.co.kr/", ["일러스트", "굿즈"], "현장 티켓과 작가 부스 위치"],
  ["busan-film-festival", "부산국제영화제 방문 준비", "축제", "부산", "부산국제영화제", "https://www.biff.kr/", ["영화제", "부산"], "상영작 예매와 극장 간 이동"],
  ["bexco-exhibition", "부산 벡스코 전시 일정", "전시", "부산", "BEXCO", "https://www.bexco.co.kr/", ["벡스코", "전시"], "전시장 홀과 주차 혼잡"],
  ["daegu-chimac", "대구 치맥 페스티벌", "축제", "대구", "대구치맥페스티벌", "https://www.chimacfestival.com/", ["음식", "야외"], "야외 좌석과 대중교통"],
  ["gwangju-biennale", "광주 비엔날레 관람 노트", "전시", "광주", "광주비엔날레", "https://www.gwangjubiennale.org/", ["비엔날레", "미술"], "전시관별 관람 동선"],
  ["jeju-fire-festival", "제주 들불축제 확인", "축제", "제주", "제주특별자치도", "https://www.visitjeju.net/", ["제주", "야외"], "날씨와 안전 공지"],
  ["gangneung-coffee", "강릉 커피축제 방문 팁", "축제", "강원", "강릉시 문화관광", "https://www.gn.go.kr/tour/", ["커피", "강릉"], "체험 프로그램과 주차장"],
  ["chuncheon-mime", "춘천 마임축제 일정", "축제", "강원", "춘천마임축제", "https://www.mimefestival.com/", ["공연", "춘천"], "공연 회차와 야외 프로그램"],
  ["incheon-pentaport", "인천 펜타포트 락 페스티벌", "축제", "인천", "인천펜타포트", "https://pentaport.co.kr/", ["음악", "야외"], "입장 팔찌와 귀가 교통"],
  ["suwon-hwaseong", "수원화성문화제 방문", "축제", "경기", "수원문화재단", "https://www.swcf.or.kr/", ["수원", "문화제"], "행궁동 혼잡과 보행 동선"],
  ["goyang-flower", "고양국제꽃박람회", "축제", "경기", "고양국제꽃박람회", "https://flower.or.kr/", ["꽃", "가족"], "사전예매와 관람 동선"],
  ["paju-booksori", "파주 북소리 행사", "축제", "경기", "파주시 문화관광", "https://tour.paju.go.kr/", ["책", "파주"], "출판단지 이동과 프로그램 예약"],
  ["bucheon-comics", "부천국제만화축제", "축제", "경기", "한국만화영상진흥원", "https://www.komacon.kr/", ["만화", "가족"], "전시와 체험 프로그램"],
  ["andong-maskdance", "안동국제탈춤페스티벌", "축제", "경북", "안동축제관광재단", "https://www.maskdance.com/", ["안동", "전통"], "공연 시간표와 야간 이동"],
  ["jinju-lantern", "진주 남강유등축제", "축제", "경남", "진주문화관광재단", "https://www.jjcf.or.kr/", ["진주", "야간"], "야간 관람과 교통 통제"],
  ["boryeong-mud", "보령 머드축제", "축제", "충남", "보령축제관광재단", "https://www.mudfestival.or.kr/", ["보령", "체험"], "체험권과 샤워시설"],
  ["damyang-bamboo", "담양 대나무축제", "축제", "전남", "담양군 문화관광", "https://tour.damyang.go.kr/", ["담양", "자연"], "주차와 주변 관광 연계"],
  ["namwon-chunhyang", "남원 춘향제", "축제", "전북", "남원시 문화관광", "https://www.namwon.go.kr/tour/", ["남원", "전통"], "공연장 위치와 야간 행사"],
  ["cheongju-craft", "청주 공예비엔날레", "전시", "충북", "청주공예비엔날레", "https://www.okcj.org/", ["공예", "전시"], "전시장 동선과 체험 예약"],
  ["suncheon-garden", "순천만 국가정원 행사", "가족 나들이", "전남", "순천만국가정원", "https://scbay.suncheon.go.kr/", ["정원", "가족"], "입장권과 관람차 이용"],
  ["pohang-fireworks", "포항 불빛축제", "축제", "경북", "포항문화재단", "https://phcf.or.kr/", ["포항", "불꽃"], "관람 위치와 귀가 동선"],
  ["tongyeong-music", "통영국제음악제", "축제", "경남", "통영국제음악재단", "https://timf.org/", ["음악", "공연"], "공연 예매와 공연장 위치"],
  ["ulsan-whale", "울산 고래축제", "축제", "울산", "울산남구문화원", "https://www.ulsanwhale.com/", ["울산", "가족"], "프로그램 시간과 체험 부스"]
].map(([slug, title, category, region, source, sourceUrl, tags, checkpoint]) => ({
  slug,
  title,
  category,
  region,
  source,
  sourceUrl,
  tags,
  checkpoint
})) as ItemSeed[];

const housingSeeds: ItemSeed[] = [
  ["seoul-youth-rent", "서울 청년월세지원", "월세지원", "서울", "서울주거포털", "https://housing.seoul.go.kr/", ["서울", "월세"], "거주지와 소득 기준"],
  ["gyeonggi-housing-cost", "경기 청년 주거비 지원", "월세지원", "경기", "경기민원24", "https://gg24.gg.go.kr/", ["경기", "주거비"], "주민등록지와 신청 기간"],
  ["busan-youth-rent", "부산 청년 월세지원", "월세지원", "부산", "부산청년플랫폼", "https://young.busan.go.kr/", ["부산", "월세"], "부산 거주 요건과 임대차계약"],
  ["incheon-youth-housing", "인천 청년 주거지원", "지역별 지원", "인천", "인천청년포털", "https://www.incheon.go.kr/youth/", ["인천", "청년"], "지역 사업 중복지원 여부"],
  ["daegu-jeonse-support", "대구 청년 전세 지원", "전세·보증금", "대구", "대구청년안방", "https://youthdream.daegu.go.kr/", ["대구", "전세"], "보증금 기준과 대출 가능성"],
  ["gwangju-housing-benefit", "광주 청년 주거급여 안내", "지역별 지원", "광주", "광주청년정책플랫폼", "https://www.gwangju.go.kr/youth/", ["광주", "주거급여"], "가구 기준과 소득 산정"],
  ["daejeon-deposit-support", "대전 청년 임차보증금 지원", "전세·보증금", "대전", "대전청년포털", "https://www.daejeonyouthportal.kr/", ["대전", "보증금"], "협약 은행과 보증 조건"],
  ["ulsan-housing-cost", "울산 청년가구 주거비 지원", "지역별 지원", "울산", "울산청년정책플랫폼", "https://www.ulsan.go.kr/s/young/", ["울산", "주거비"], "가구 구성과 신청 서류"],
  ["sejong-youth-home", "세종 청년 주거지원", "지역별 지원", "세종", "세종청년희망내일센터", "https://www.sjhope.or.kr/", ["세종", "청년"], "세종 거주 요건"],
  ["lh-youth-jeonse", "LH 청년전세임대", "임대주택", "전국", "LH 청약플러스", "https://apply.lh.or.kr/", ["LH", "전세임대"], "순위 조건과 물건 가능 여부"],
  ["lh-happy-house", "LH 행복주택 청년", "임대주택", "전국", "LH 청약플러스", "https://apply.lh.or.kr/", ["행복주택", "청약"], "소득과 자산 기준"],
  ["sh-youth-safe-house", "SH 청년안심주택", "임대주택", "서울", "서울주택도시공사", "https://www.i-sh.co.kr/", ["SH", "청년안심주택"], "공급 유형과 임대 조건"],
  ["gh-happy-house", "GH 경기행복주택", "임대주택", "경기", "경기주택도시공사", "https://www.gh.or.kr/", ["GH", "행복주택"], "지역과 순위 요건"],
  ["youth-butteomok-loan", "청년 버팀목 전세대출", "전세·보증금", "전국", "주택도시기금", "https://nhuf.molit.go.kr/", ["버팀목", "전세대출"], "보증금과 소득 기준"],
  ["sme-youth-jeonse", "중소기업 취업청년 전월세보증금대출", "전세·보증금", "전국", "주택도시기금", "https://nhuf.molit.go.kr/", ["중소기업", "전세대출"], "재직 조건과 기업 요건"],
  ["separate-housing-benefit", "청년 주거급여 분리지급", "월세지원", "전국", "복지로", "https://www.bokjiro.go.kr/", ["주거급여", "분리지급"], "부모 가구와 분리 거주 기준"],
  ["deposit-return-guarantee", "전세보증금 반환보증 확인", "전세·보증금", "전국", "주택도시보증공사", "https://www.khug.or.kr/", ["반환보증", "전세"], "보증 가능 주택과 가입 기한"],
  ["move-in-confirm-date", "전입신고와 확정일자", "신청서류", "전국", "정부24", "https://www.gov.kr/", ["전입신고", "확정일자"], "전입일과 계약서 정보"],
  ["lease-contract-check", "임대차계약서 체크", "신청서류", "전국", "정부24", "https://www.gov.kr/", ["계약서", "서류"], "주소와 임대인 정보 일치"],
  ["rent-payment-proof", "월세 납부 증빙 준비", "신청서류", "전국", "정부24", "https://www.gov.kr/", ["월세", "증빙"], "이체 내역과 계약 금액 일치"],
  ["income-certificate", "소득금액증명 발급", "신청서류", "전국", "국세청 홈택스", "https://www.hometax.go.kr/", ["소득", "홈택스"], "귀속연도와 발급일 기준"],
  ["health-insurance-proof", "건강보험료 납부확인서", "신청서류", "전국", "국민건강보험", "https://www.nhis.or.kr/", ["건강보험료", "소득"], "가구원과 납부 기간"],
  ["family-certificate", "가족관계증명서 준비", "신청서류", "전국", "전자가족관계등록시스템", "https://efamily.scourt.go.kr/", ["가족관계", "서류"], "상세증명서 필요 여부"],
  ["resident-register-options", "주민등록등본 발급 옵션", "신청서류", "전국", "정부24", "https://www.gov.kr/", ["등본", "정부24"], "주소 변동과 주민번호 표시"],
  ["median-income-rule", "중위소득 기준 읽기", "신청서류", "전국", "복지로", "https://www.bokjiro.go.kr/", ["중위소득", "조건"], "가구원 수와 적용 비율"]
].map(([slug, title, category, region, source, sourceUrl, tags, checkpoint]) => ({
  slug,
  title,
  category,
  region,
  source,
  sourceUrl,
  tags,
  checkpoint
})) as ItemSeed[];

const businessSeeds: ItemSeed[] = [
  ["general-management-fund", "소상공인 일반경영안정자금", "정책자금", "전국", "소상공인정책자금", "https://ols.semas.or.kr/", ["정책자금", "운전자금"], "직접대출과 대리대출 구분"],
  ["growth-promotion-fund", "성장촉진자금 신청 확인", "정책자금", "전국", "소상공인정책자금", "https://ols.semas.or.kr/", ["성장촉진", "정책자금"], "업력과 매출 기준"],
  ["emergency-management-fund", "긴급경영안정자금", "정책자금", "전국", "소상공인정책자금", "https://ols.semas.or.kr/", ["긴급", "경영안정"], "재해 또는 경기 악화 증빙"],
  ["youth-employment-fund", "청년고용연계자금", "정책자금", "전국", "소상공인정책자금", "https://ols.semas.or.kr/", ["청년고용", "자금"], "청년 근로자 고용 조건"],
  ["restart-special-fund", "재도전특별자금", "정책자금", "전국", "소상공인정책자금", "https://ols.semas.or.kr/", ["재도전", "정책자금"], "재창업과 채무조정 요건"],
  ["smart-store-tech", "스마트상점 기술보급", "창업지원", "전국", "소상공인24", "https://www.sbiz24.kr/", ["스마트상점", "기술"], "공급기술과 자부담"],
  ["online-market-support", "소상공인 온라인 판로지원", "교육·컨설팅", "전국", "소상공인24", "https://www.sbiz24.kr/", ["온라인", "판로"], "지원 채널과 상품 적합성"],
  ["traditional-market-support", "전통시장 지원사업", "지역지원", "지역별", "소상공인시장진흥공단", "https://www.semas.or.kr/", ["전통시장", "상인"], "상인회 참여 조건"],
  ["local-creator", "로컬크리에이터 지원", "창업지원", "전국", "K-Startup", "https://www.k-startup.go.kr/", ["로컬", "창업"], "지역성 평가 항목"],
  ["pre-startup-package", "예비창업패키지", "창업지원", "전국", "K-Startup", "https://www.k-startup.go.kr/", ["예비창업", "사업화"], "사업자등록 이력"],
  ["early-startup-package", "초기창업패키지", "창업지원", "전국", "K-Startup", "https://www.k-startup.go.kr/", ["초기창업", "사업화"], "창업 3년 이내 기준"],
  ["startup-university", "창업중심대학 사업", "창업지원", "전국", "K-Startup", "https://www.k-startup.go.kr/", ["창업중심대학", "지원"], "주관기관별 모집 분야"],
  ["new-business-academy", "신사업창업사관학교", "창업지원", "전국", "소상공인24", "https://www.sbiz24.kr/", ["신사업", "교육"], "교육과 점포체험 과정"],
  ["incubator-move-in", "창업보육센터 입주", "창업지원", "지역별", "창업보육센터네트워크시스템", "https://www.bi.go.kr/", ["보육센터", "입주"], "입주 업종과 공간 조건"],
  ["local-store-improvement", "지자체 경영환경 개선", "지역지원", "지역별", "기업마당", "https://www.bizinfo.go.kr/", ["경영환경", "지역"], "사업장 소재지와 견적서"],
  ["old-sign-replacement", "노후 간판 교체 지원", "업종별 지원", "지역별", "기업마당", "https://www.bizinfo.go.kr/", ["간판", "시설개선"], "사전 승인과 디자인 기준"],
  ["store-safety-check", "점포 안전점검 지원", "업종별 지원", "지역별", "기업마당", "https://www.bizinfo.go.kr/", ["안전점검", "점포"], "점검 대상 시설"],
  ["tax-labor-consulting", "세무·노무 상담 지원", "교육·컨설팅", "전국", "소상공인24", "https://www.sbiz24.kr/", ["세무", "노무"], "상담 분야와 예약 방식"],
  ["live-commerce-training", "라이브커머스 교육", "교육·컨설팅", "전국", "소상공인24", "https://www.sbiz24.kr/", ["라이브커머스", "교육"], "실습 장비와 상품 준비"],
  ["smartstore-training", "스마트스토어 교육", "교육·컨설팅", "전국", "소상공인24", "https://www.sbiz24.kr/", ["스마트스토어", "교육"], "상품 등록 실습 여부"],
  ["delivery-app-training", "배달앱 활용 교육", "교육·컨설팅", "전국", "소상공인24", "https://www.sbiz24.kr/", ["배달앱", "음식점"], "수수료와 광고 실습"],
  ["export-voucher-basic", "수출바우처 초보 사업자", "창업지원", "전국", "수출지원기반활용사업", "https://www.exportvoucher.com/", ["수출", "바우처"], "수출 준비도와 자부담"],
  ["brand-design-support", "브랜드 개발 지원", "지역지원", "지역별", "기업마당", "https://www.bizinfo.go.kr/", ["브랜드", "디자인"], "결과물 범위와 공급기관"],
  ["energy-cost-support", "소상공인 에너지 비용 지원", "지역지원", "지역별", "기업마당", "https://www.bizinfo.go.kr/", ["에너지", "비용"], "사용량 증빙과 사업장 요건"],
  ["business-closure-restart", "폐업 점포 재도전 장려", "업종별 지원", "전국", "소상공인24", "https://www.sbiz24.kr/", ["폐업", "재도전"], "폐업 사실과 재창업 계획"]
].map(([slug, title, category, region, source, sourceUrl, tags, checkpoint]) => ({
  slug,
  title,
  category,
  region,
  source,
  sourceUrl,
  tags,
  checkpoint
})) as ItemSeed[];

const facilitySeeds: ItemSeed[] = [
  ["library-card", "공공도서관 회원증 발급", "도서관", "전국", "공공도서관 각 기관", "https://www.data4library.kr/", ["도서관", "회원증"], "거주지와 신분증 기준"],
  ["library-seat", "도서관 열람실 좌석 예약", "도서관", "전국", "공공도서관 각 기관", "https://www.data4library.kr/", ["열람실", "좌석"], "좌석 예약 앱과 이용 시간"],
  ["library-request-book", "도서관 희망도서 신청", "도서관", "전국", "공공도서관 각 기관", "https://www.data4library.kr/", ["희망도서", "대출"], "신청 제한과 선정 기준"],
  ["library-interloan", "도서관 상호대차 이용", "도서관", "전국", "공공도서관 각 기관", "https://www.data4library.kr/", ["상호대차", "대출"], "수령 도서관과 대기 기간"],
  ["public-badminton", "공공 배드민턴장 예약", "체육시설", "전국", "공공서비스예약", "https://www.gov.kr/", ["배드민턴", "체육"], "코트 예약과 준비물"],
  ["public-futsal", "공공 풋살장 예약", "체육시설", "전국", "공공서비스예약", "https://www.gov.kr/", ["풋살", "대관"], "우천 취소와 환불 기준"],
  ["public-pool", "공공 수영장 자유수영", "체육시설", "전국", "공공서비스예약", "https://www.gov.kr/", ["수영장", "자유수영"], "수영모와 입장 마감"],
  ["public-gym", "공공 헬스장 이용", "체육시설", "전국", "공공서비스예약", "https://www.gov.kr/", ["헬스장", "운동"], "월 이용권과 감면 대상"],
  ["culture-quarter-class", "문화센터 분기 강좌", "문화센터", "전국", "정부24", "https://www.gov.kr/", ["문화센터", "강좌"], "접수 시작일과 재료비"],
  ["resident-center-program", "주민자치센터 프로그램", "문화센터", "전국", "정부24", "https://www.gov.kr/", ["주민자치", "강좌"], "지역 주민 우선 접수"],
  ["lifelong-learning", "평생학습관 강좌", "문화센터", "전국", "국가평생학습포털", "https://www.lifelongedu.go.kr/", ["평생학습", "교육"], "수강 신청과 수료 기준"],
  ["parking-fee", "공영주차장 요금 확인", "공영주차장", "전국", "공공데이터포털", "https://www.data.go.kr/", ["주차", "요금"], "시간당 요금과 일 최대 요금"],
  ["parking-season-ticket", "공영주차장 정기권 신청", "공영주차장", "전국", "지자체 시설관리공단", "https://www.gov.kr/", ["정기권", "주차"], "추첨 방식과 대기 순번"],
  ["resident-priority-parking", "거주자우선주차 신청", "공영주차장", "전국", "지자체 시설관리공단", "https://www.gov.kr/", ["거주자우선", "주차"], "주소지와 차량 등록 기준"],
  ["youth-center-rental", "청소년수련관 시설 예약", "예약시설", "전국", "정부24", "https://www.gov.kr/", ["청소년수련관", "대관"], "이용 목적과 보호자 기준"],
  ["women-center-class", "여성회관 프로그램", "문화센터", "전국", "정부24", "https://www.gov.kr/", ["여성회관", "강좌"], "대상 제한과 수강료"],
  ["toy-library", "육아종합지원센터 장난감 대여", "예약시설", "전국", "중앙육아종합지원센터", "https://central.childcare.go.kr/", ["장난감", "육아"], "회원 가입과 대여 기간"],
  ["shared-childcare-space", "공동육아나눔터 이용", "예약시설", "전국", "가족센터", "https://www.familynet.or.kr/", ["육아", "공동육아"], "이용 대상과 예약 방식"],
  ["public-camping", "공공 캠핑장 예약", "예약시설", "전국", "숲나들e", "https://www.foresttrip.go.kr/", ["캠핑", "예약"], "성수기 추첨과 취소 수수료"],
  ["forest-lodge", "자연휴양림 예약", "예약시설", "전국", "숲나들e", "https://www.foresttrip.go.kr/", ["휴양림", "숙박"], "예약 추첨과 입실 시간"],
  ["public-theater-rental", "공공 공연장 대관", "예약시설", "전국", "정부24", "https://www.gov.kr/", ["공연장", "대관"], "대관 심사와 장비 사용"],
  ["museum-free-day", "미술관 무료 관람일", "문화센터", "전국", "문화포털", "https://www.culture.go.kr/", ["미술관", "무료"], "무료 대상과 휴관일"],
  ["museum-education", "박물관 교육 프로그램", "문화센터", "전국", "문화포털", "https://www.culture.go.kr/", ["박물관", "교육"], "연령 제한과 회차 예약"],
  ["public-bike", "공공자전거 이용", "예약시설", "전국", "정부24", "https://www.gov.kr/", ["공공자전거", "교통"], "대여소 위치와 반납 규칙"],
  ["tool-library", "생활공구 대여소 이용", "예약시설", "전국", "정부24", "https://www.gov.kr/", ["생활공구", "대여"], "대여 가능 품목과 보증금"]
].map(([slug, title, category, region, source, sourceUrl, tags, checkpoint]) => ({
  slug,
  title,
  category,
  region,
  source,
  sourceUrl,
  tags,
  checkpoint
})) as ItemSeed[];

const typedGuideSeeds: Record<SiteSlug, GuideSeed[]> = {
  exam: [
    { slug: "exam-photo-rule", title: "시험 접수 사진 규격 확인법", category: "접수", focus: "사진 규격과 본인 확인 기준" },
    { slug: "exam-ticket-print", title: "수험표 출력이 필요한 시험 구분", category: "준비물", focus: "수험표와 신분증 준비" },
    { slug: "exam-score-deadline", title: "성적 발표일 기준으로 시험 고르는 법", category: "일정", focus: "제출 마감일 역산" },
    { slug: "exam-practical-gap", title: "필기와 실기 사이 준비기간 잡는 법", category: "일정", focus: "회차 간격과 실기 접수" },
    { slug: "exam-traffic", title: "시험장 선택 전 교통 확인법", category: "시험장", focus: "입실 시간과 이동 경로" },
    { slug: "exam-refund", title: "시험 환불 마감일 확인법", category: "접수", focus: "환불 가능 기간" },
    { slug: "exam-id-card", title: "시험 신분증 규정 점검", category: "준비물", focus: "인정 신분증 범위" },
    { slug: "exam-result-validity", title: "자격시험 성적 유효기간 관리", category: "성적", focus: "성적 활용처와 유효기간" }
  ],
  events: [
    { slug: "indoor-family-event", title: "아이와 갈 만한 실내 행사 고르는 법", category: "가족", focus: "연령대와 체험 난이도" },
    { slug: "free-event-cost", title: "무료 행사 추가 비용 확인법", category: "비용", focus: "체험료와 주차비" },
    { slug: "festival-shuttle", title: "축제 셔틀버스 확인법", category: "교통", focus: "셔틀 시간표와 승하차 위치" },
    { slug: "exhibition-last-entry", title: "전시 입장 마감 시간 확인법", category: "전시", focus: "입장 마감과 관람 소요시간" },
    { slug: "rain-cancel-check", title: "우천 시 행사 취소 확인 루틴", category: "날씨", focus: "공식 공지와 안전 안내" },
    { slug: "event-food", title: "행사장 식사 동선 잡는 법", category: "방문", focus: "주변 식당과 현장 부스" },
    { slug: "event-ticket", title: "행사 예매권과 현장권 비교", category: "예매", focus: "사전 예매 혜택과 환불" },
    { slug: "event-crowd-time", title: "혼잡 시간대를 피하는 행사 방문법", category: "방문", focus: "입장 피크와 귀가 피크" }
  ],
  housing: [
    { slug: "contract-before-apply", title: "주거지원 신청 전 계약서 확인법", category: "서류", focus: "계약서 주소와 금액" },
    { slug: "separate-household", title: "부모와 별도 거주 기준 이해하기", category: "조건", focus: "가구 기준과 독립 거주" },
    { slug: "loan-consult-question", title: "전세대출 상담 전 준비할 질문", category: "전세", focus: "은행 상담 체크리스트" },
    { slug: "rental-priority", title: "임대주택 공고 순위 읽는 법", category: "임대주택", focus: "1순위와 2순위 조건" },
    { slug: "rent-support-docs", title: "월세지원 탈락을 줄이는 서류 점검", category: "서류", focus: "납부 증빙과 발급일" },
    { slug: "income-household", title: "가구 소득 기준 확인법", category: "조건", focus: "가구원 수와 소득 산정" },
    { slug: "duplicate-support", title: "주거지원 중복 신청 확인법", category: "조건", focus: "중복 제한과 예외" },
    { slug: "address-proof", title: "주소 증빙 서류 맞추는 법", category: "서류", focus: "등본과 계약서 주소" }
  ],
  business: [
    { slug: "direct-vs-agency-loan", title: "직접대출과 대리대출 차이", category: "정책자금", focus: "신청 창구와 심사 흐름" },
    { slug: "credit-before-fund", title: "정책자금 신청 전 신용 상태 확인", category: "정책자금", focus: "연체와 제한 조건" },
    { slug: "self-payment", title: "지원사업 자부담 계산법", category: "공고 해석", focus: "자부담률과 부가세" },
    { slug: "facility-approval", title: "시설개선 사업 사전승인 주의사항", category: "시설개선", focus: "공사 전 승인" },
    { slug: "business-plan-summary", title: "사업계획서 요약문 작성법", category: "창업지원", focus: "문제와 해결책 정리" },
    { slug: "excluded-industries", title: "지원 제외 업종 확인법", category: "공고 해석", focus: "업종코드와 실제 영업" },
    { slug: "settlement-docs", title: "지원금 정산 서류 준비", category: "서류", focus: "증빙과 결과보고" },
    { slug: "deadline-routine", title: "모집공고 마감 관리 루틴", category: "일정", focus: "마감 3일 전 점검" }
  ],
  facilities: [
    { slug: "closed-day-check", title: "공공시설 휴관일 확인법", category: "운영시간", focus: "정기 휴관과 임시 휴관" },
    { slug: "no-show-limit", title: "공공 예약시설 노쇼 제한 피하기", category: "예약", focus: "취소 기한과 제한" },
    { slug: "discount-proof", title: "감면 대상 증빙 준비", category: "요금", focus: "감면 자격과 증빙" },
    { slug: "kids-facility", title: "아이와 공공시설 이용 전 체크", category: "가족", focus: "연령 제한과 안전" },
    { slug: "parking-alternative", title: "주차장 만차 대체 경로 잡기", category: "주차", focus: "대체 주차장과 도보 이동" },
    { slug: "equipment-check", title: "대관 장비 사전 확인법", category: "대관", focus: "마이크와 프로젝터" },
    { slug: "public-class-refund", title: "공공 강좌 환불 기준 읽기", category: "강좌", focus: "개강 전후 환불" },
    { slug: "reservation-open", title: "예약 오픈 시간을 놓치지 않는 법", category: "예약", focus: "선착순과 추첨제" }
  ]
};

export const expandedItems: Record<SiteSlug, InfoItem[]> = {
  exam: examSeeds.map((seed) => makeItem("exam", seed)),
  events: eventSeeds.map((seed) => makeItem("events", seed)),
  housing: housingSeeds.map((seed) => makeItem("housing", seed)),
  business: businessSeeds.map((seed) => makeItem("business", seed)),
  facilities: facilitySeeds.map((seed) => makeItem("facilities", seed))
};

export const expandedGuides: Record<SiteSlug, Guide[]> = {
  exam: typedGuideSeeds.exam.map((seed) => makeGuide("exam", seed)),
  events: typedGuideSeeds.events.map((seed) => makeGuide("events", seed)),
  housing: typedGuideSeeds.housing.map((seed) => makeGuide("housing", seed)),
  business: typedGuideSeeds.business.map((seed) => makeGuide("business", seed)),
  facilities: typedGuideSeeds.facilities.map((seed) => makeGuide("facilities", seed))
};
