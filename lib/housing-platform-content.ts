import type { Guide, InfoItem, SiteConfig } from "@/lib/sites";

export const housingReviewDate = "2026-06-05";
export const housingNextReviewDate = "2026-07-05";

export function housingCategoryPath(site: SiteConfig, matcher: string) {
  const category = site.categories.find((item) => item.includes(matcher)) ?? site.categories[0];
  return {
    label: category,
    href: `/category/${encodeURIComponent(category)}`
  };
}

export function housingPillars(site: SiteConfig) {
  const rent = housingCategoryPath(site, "월세");
  const deposit = housingCategoryPath(site, "전세");
  const rental = housingCategoryPath(site, "임대");
  const docs = housingCategoryPath(site, "서류");

  return [
    {
      eyebrow: "월세 부담",
      title: "월세지원",
      description: "거주지, 소득, 계약서, 납부 증빙을 먼저 맞춰 보는 경로입니다.",
      href: rent.href,
      tone: "rent"
    },
    {
      eyebrow: "보증금 판단",
      title: "전세·보증금",
      description: "전세대출, 반환보증, 은행 상담 준비를 계약 전 순서로 봅니다.",
      href: deposit.href,
      tone: "deposit"
    },
    {
      eyebrow: "공공임대",
      title: "임대주택",
      description: "LH·SH·GH 공고의 공급 유형, 순위, 예비입주 흐름을 정리합니다.",
      href: rental.href,
      tone: "home"
    },
    {
      eyebrow: "보완 줄이기",
      title: "서류·계약",
      description: "등본, 계약서, 소득자료, 월세 이체내역을 제출 전 점검합니다.",
      href: docs.href,
      tone: "docs"
    }
  ];
}

export function housingPickItems(site: SiteConfig, slugs: string[]) {
  return slugs.map((slug) => site.items.find((item) => item.slug === slug)).filter(Boolean) as InfoItem[];
}

export function housingPickGuides(site: SiteConfig, slugs: string[]) {
  return slugs.map((slug) => site.guides.find((guide) => guide.slug === slug)).filter(Boolean) as Guide[];
}

export function housingCategoryMeta(label: string) {
  if (label.includes("월세")) {
    return {
      kicker: "월세 부담 점검",
      title: "월세지원은 납부 사실과 거주 기준을 같이 봐야 합니다",
      description:
        "월세지원은 신청자가 실제로 월세를 내고 있는지, 계약서와 주민등록 주소가 맞는지, 소득 기준을 증빙할 수 있는지가 핵심입니다.",
      checklist: ["월세 이체내역", "임대차계약서 주소", "주민등록 주소", "소득·가구 기준", "중복지원 제한"]
    };
  }

  if (label.includes("전세") || label.includes("보증금")) {
    return {
      kicker: "계약 전 확인",
      title: "전세·보증금 지원은 계약 전에 보증 가능성부터 봅니다",
      description:
        "전세대출과 보증금 지원은 계약 조건, 보증 가능 주택, 은행 상담 서류가 맞아야 실제 실행 가능성이 생깁니다.",
      checklist: ["보증금 기준", "재직·소득 자료", "반환보증 가능성", "은행 상담 질문", "계약 전 위험 신호"]
    };
  }

  if (label.includes("임대")) {
    return {
      kicker: "공고 읽기",
      title: "임대주택은 공급 유형과 순위 조건을 먼저 나눠야 합니다",
      description:
        "행복주택, 매입임대, 전세임대는 신청 창구와 입주자 선정 방식이 다릅니다. 공고의 공급 유형을 먼저 구분해야 합니다.",
      checklist: ["공급 유형", "1순위·2순위", "소득·자산 기준", "예비입주자 일정", "계약 가능 기간"]
    };
  }

  if (label.includes("지역")) {
    return {
      kicker: "지역별 비교",
      title: "지역별 주거지원은 접수 창구와 거주 기간 기준이 다릅니다",
      description:
        "시·도 사업과 구·군 사업이 함께 운영될 수 있으므로 거주지, 접수 기간, 예산 소진 가능성을 따로 확인해야 합니다.",
      checklist: ["시·도/구·군 사업 구분", "거주 기간", "신청 창구", "예산 소진 여부", "중복지원 제한"]
    };
  }

  return {
    kicker: "서류 보완 줄이기",
    title: "신청서류는 발급일과 표시 옵션이 결과를 바꿀 수 있습니다",
    description:
      "등본, 가족관계증명서, 소득자료, 계약서, 납부 증빙은 이름보다 내용과 기준일이 중요합니다.",
    checklist: ["발급일 제한", "주소 표시", "주민번호 표시", "계약서 선명도", "파일명 정리"]
  };
}

export function housingSourceGroups() {
  return [
    {
      title: "주거지원 통합 확인",
      links: [
        { label: "마이홈 주거복지", url: "https://www.myhome.go.kr/" },
        { label: "복지로", url: "https://www.bokjiro.go.kr/" },
        { label: "정부24", url: "https://www.gov.kr/" }
      ]
    },
    {
      title: "전세·보증금 확인",
      links: [
        { label: "주택도시기금", url: "https://nhuf.molit.go.kr/" },
        { label: "주택도시보증공사", url: "https://www.khug.or.kr/" },
        { label: "한국주택금융공사", url: "https://www.hf.go.kr/" }
      ]
    },
    {
      title: "공공임대 공고",
      links: [
        { label: "LH 청약플러스", url: "https://apply.lh.or.kr/" },
        { label: "서울주택도시공사", url: "https://www.i-sh.co.kr/" },
        { label: "경기주택도시공사", url: "https://www.gh.or.kr/" }
      ]
    }
  ];
}

export function housingUpdateLog() {
  return [
    "money1000.co.kr 홈을 청년 주거지원 탐색 허브 구조로 재구성했습니다.",
    "월세지원, 전세·보증금, 임대주택, 서류·계약 4개 핵심 경로를 첫 화면에서 바로 찾을 수 있도록 바꿨습니다.",
    "상세 글마다 대상자, 제외 조건, 신청 전 확인 순서, 서류 보완 사례, 공식 출처 확인 문단을 추가했습니다.",
    "신규 상세 글 30개와 신규 가이드 10개를 추가해 주거지원 기둥 글과 세부 글 구조를 만들었습니다.",
    "모든 money1000 상세 글과 가이드에 다음 검토 예정일, 읽는 시간, 핵심 체크 항목, 공식 출처 링크를 추가했습니다."
  ];
}
