import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Landmark,
  Layers3,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { publicUrl } from "@/lib/seo";
import type { Guide, InfoItem, SiteConfig, SiteSlug } from "@/lib/sites";
import { siteStyle } from "@/lib/sites";

type RefProfile = {
  label: string;
  heroTitle: string;
  heroText: string;
  primaryPath: string;
  primaryLabel: string;
  secondaryPath: string;
  secondaryLabel: string;
  themeNote: string;
  railTitle: string;
  railText: string;
  processTitle: string;
  processText: string;
  proofTitle: string;
  proofText: string;
  steps: string[];
  signals: string[];
  useCases: string[];
};

const profiles: Record<Exclude<SiteSlug, "housing">, RefProfile> = {
  exam: {
    label: "학습 허브형 시험 일정 센터",
    heroTitle: "시험 접수부터 성적 제출까지 한 번에 이어보는 일정 로드맵",
    heroText:
      "licensemoa는 시험명을 나열하는 대신 접수 마감, 준비물, 발표일, 성적 활용처를 하나의 흐름으로 정리합니다. 수험생이 다음 행동을 바로 정할 수 있도록 공식 접수처 기준으로 재검토한 글을 우선 배치했습니다.",
    primaryPath: "/guides",
    primaryLabel: "준비 가이드 보기",
    secondaryPath: "/items",
    secondaryLabel: "시험 일정 전체",
    themeNote: "클래스형 탐색 구조",
    railTitle: "지금 먼저 확인할 시험",
    railText: "마감일과 발표일을 함께 봐야 하는 시험을 우선 보여줍니다.",
    processTitle: "수험생 확인 순서",
    processText: "응시 목적을 정한 뒤 접수, 시험장, 성적 제출 기준을 차례로 확인합니다.",
    proofTitle: "성적 제출 전에 보는 공식 기준",
    proofText: "성적표, 유효기간, 인정 신분증, 환불 마감처럼 놓치기 쉬운 기준을 글마다 분리했습니다.",
    steps: ["응시 목적 선택", "접수처 공지 확인", "시험장·준비물 점검", "성적 발표일 역산"],
    signals: ["검토일 표시", "공식 접수처 링크", "성적 활용 기준", "시험장 체크리스트"],
    useCases: ["취업 제출", "졸업 요건", "공공기관 지원", "자격증 갱신"]
  },
  events: {
    label: "전국 행사 큐레이션 매거진",
    heroTitle: "이번 주말 어디 갈지보다 먼저 봐야 할 방문 조건",
    heroText:
      "conferenceinfo는 축제와 전시를 단순 추천하지 않고, 예매 여부, 입장 마감, 주차·셔틀, 우천 변경 가능성까지 묶어 방문 판단에 필요한 정보를 큐레이션합니다.",
    primaryPath: "/items",
    primaryLabel: "행사 큐레이션 보기",
    secondaryPath: "/guides",
    secondaryLabel: "방문 가이드",
    themeNote: "콘텐츠 레일형 편집 구조",
    railTitle: "방문 전 많이 보는 정보",
    railText: "행사 성격별로 다른 확인 포인트를 가로 레일로 묶었습니다.",
    processTitle: "방문 계획 순서",
    processText: "일정, 동선, 예매, 현장 변수 순서로 보면 실패 확률이 줄어듭니다.",
    proofTitle: "현장 변수가 있는 행사 점검",
    proofText: "비, 혼잡, 매진, 교통 통제처럼 행사 당일 바뀔 수 있는 내용을 공식 채널 중심으로 정리합니다.",
    steps: ["관람 목적 선택", "예매·입장 마감 확인", "교통·주차 동선 점검", "당일 공지 재확인"],
    signals: ["방문 전날 점검", "공식 주최 링크", "우천·취소 안내", "가족 방문 체크"],
    useCases: ["전시 관람", "가족 체험", "야외 축제", "주말 나들이"]
  },
  business: {
    label: "사업자 지원금 판단 센터",
    heroTitle: "내 사업장에 맞는 지원사업을 조건부터 차분히 걸러보세요",
    heroText:
      "business100은 공고 제목보다 대상 업종, 자부담, 정산 의무, 마감 3일 전 준비 여부를 먼저 보여줍니다. 정책자금과 지원사업을 신청 전 판단 흐름으로 다시 정리했습니다.",
    primaryPath: "/guides",
    primaryLabel: "신청 판단 기준",
    secondaryPath: "/items",
    secondaryLabel: "지원사업 전체",
    themeNote: "서비스형 판단 구조",
    railTitle: "사업자가 먼저 보는 공고",
    railText: "자금, 판로, 시설개선, 컨설팅을 신청 난이도 기준으로 다시 묶었습니다.",
    processTitle: "신청 전 판단 순서",
    processText: "업종 제외 여부, 자부담, 증빙, 정산 의무를 먼저 확인해야 합니다.",
    proofTitle: "공고문에서 바로 확인할 항목",
    proofText: "지원금 규모보다 대상 제외, 공급기관, 결과보고 기준이 더 중요한 사업을 따로 표시합니다.",
    steps: ["업종·사업자 상태 확인", "자부담·정산 방식 확인", "필수 서류 준비", "마감 3일 전 제출 점검"],
    signals: ["정책자금 출처", "정산 서류 기준", "마감 루틴", "과장 표현 제거"],
    useCases: ["운전자금", "시설개선", "온라인 판로", "창업 패키지"]
  },
  facilities: {
    label: "공공시설 이용 절차 가이드",
    heroTitle: "예약, 감면, 주차, 취소 기준까지 실제 방문 순서로 확인하세요",
    heroText:
      "publicguide는 공공시설을 목록으로만 보여주지 않고 이용 전 문의해야 할 기준, 예약 실패 시 대안, 현장 증빙까지 절차와 사례 중심으로 정리합니다.",
    primaryPath: "/items",
    primaryLabel: "시설 이용 정보",
    secondaryPath: "/guides",
    secondaryLabel: "이용 전 가이드",
    themeNote: "프로세스·사례형 기관 구조",
    railTitle: "예약 전에 많이 막히는 지점",
    railText: "도서관, 체육시설, 문화센터, 공영주차장을 실제 이용 단계별로 묶었습니다.",
    processTitle: "방문 전 처리 순서",
    processText: "운영시간보다 예약 조건, 감면 증빙, 취소 기준을 먼저 확인하는 구조입니다.",
    proofTitle: "현장 확인이 필요한 기준",
    proofText: "신분증, 감면 서류, 보증금, 장비 반입처럼 시설별로 달라지는 규칙을 글마다 분리했습니다.",
    steps: ["이용 목적 확인", "예약·추첨 방식 확인", "감면·증빙 준비", "현장 이용 규칙 점검"],
    signals: ["기관 링크 제공", "취소 기준 정리", "현장 준비물", "대안 경로 안내"],
    useCases: ["도서관 이용", "체육시설 예약", "문화강좌 신청", "공영주차장 이용"]
  }
};

function profileFor(site: SiteConfig): RefProfile {
  if (site.slug === "housing") {
    throw new Error("Housing uses HousingPlatform");
  }

  return profiles[site.slug];
}

function homeHref(path: string) {
  return path === "/" ? "." : path.replace(/^\//, "");
}

function categoryPicks(site: SiteConfig) {
  return site.categories.slice(0, 4).map((category) => {
    const items = site.items.filter((item) => item.category === category);
    return {
      category,
      count: items.length,
      item: items[0] ?? site.items[0]
    };
  });
}

function featuredItems(site: SiteConfig) {
  const byCategory = categoryPicks(site)
    .map((pick) => pick.item)
    .filter(Boolean);
  const seen = new Set<string>();
  return [...byCategory, ...site.items].filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function featuredGuides(site: SiteConfig) {
  const priorityWords: Record<SiteSlug, string[]> = {
    exam: ["처음", "로드맵", "일정", "서류", "성적"],
    events: ["주말", "가족", "우천", "환불", "교통"],
    housing: [],
    business: ["자금", "서류", "정산", "마감", "공고"],
    facilities: ["예약", "감면", "가족", "주차", "취소"]
  };
  const words = priorityWords[site.slug];
  return [...site.guides].sort((a, b) => {
    const aScore = words.some((word) => a.title.includes(word) || a.summary.includes(word)) ? -1 : 0;
    const bScore = words.some((word) => b.title.includes(word) || b.summary.includes(word)) ? -1 : 0;
    return aScore - bScore;
  });
}

function RefItemCard({ item, index }: { item: InfoItem; index: number }) {
  return (
    <Link className="ref-card ref-item-card" href={`items/${item.slug}`} prefetch={false}>
      <div className="ref-thumb" aria-hidden="true">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{item.category}</strong>
      </div>
      <div className="ref-card-body">
        <div className="ref-meta">
          <span>{item.region}</span>
          <span>{item.readingTime ?? "검토 글"}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <span className="ref-card-link">
          자세히 보기 <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}

function RefGuideRow({ guide }: { guide: Guide }) {
  return (
    <Link className="ref-guide-row" href={`guides/${guide.slug}`} prefetch={false}>
      <span className="ref-guide-icon" aria-hidden="true">
        <BookOpenCheck size={19} />
      </span>
      <span>
        <strong>{guide.title}</strong>
        <small>{guide.summary}</small>
      </span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

function ProfileIcon({ site }: { site: SiteConfig }) {
  if (site.slug === "exam") return <GraduationCap size={24} />;
  if (site.slug === "events") return <CalendarDays size={24} />;
  if (site.slug === "business") return <Building2 size={24} />;
  return <Landmark size={24} />;
}

export function ReferenceSiteHome({ site }: { site: SiteConfig }) {
  const profile = profileFor(site);
  const picks = categoryPicks(site);
  const items = featuredItems(site);
  const guides = featuredGuides(site);
  const leadItems = items.slice(0, 8);
  const latestItems = items.slice(8, 14);
  const leadGuides = guides.slice(0, 6);

  return (
    <div className={`ref-platform ref-${site.slug}`} style={siteStyle(site)}>
      <SiteChrome site={site}>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: publicUrl(site),
            description: site.description,
            potentialAction: {
              "@type": "SearchAction",
              target: publicUrl(site, "/search?q={search_term_string}"),
              "query-input": "required name=search_term_string"
            }
          }}
        />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: publicUrl(site),
            description: site.identity,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "editorial inquiry",
              email: `contact@${site.domainHint}`,
              availableLanguage: "Korean"
            }
          }}
        />
        <main>
          <section className="ref-hero">
            <div className="container ref-hero-grid">
              <div className="ref-hero-copy">
                <span className="ref-kicker">
                  <ProfileIcon site={site} />
                  {profile.label}
                </span>
                <h1>{profile.heroTitle}</h1>
                <p>{profile.heroText}</p>
                <div className="ref-actions">
                  <Link className="ref-button" href={homeHref(profile.primaryPath)} prefetch={false}>
                    {profile.primaryLabel} <ArrowRight size={16} />
                  </Link>
                  <Link className="ref-button ghost" href={homeHref(profile.secondaryPath)} prefetch={false}>
                    {profile.secondaryLabel}
                  </Link>
                </div>
              </div>
              <aside className="ref-hero-panel" aria-label="홈 검색과 운영 지표">
                <div className="ref-panel-top">
                  <span>{profile.themeNote}</span>
                  <strong>{site.domainHint}</strong>
                </div>
                <SearchBox siteSlug={site.slug} placeholder={site.searchPlaceholder} />
                <div className="ref-stat-grid">
                  {site.stats.map((stat) => (
                    <div key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div className="ref-mini-source">
                  <ShieldCheck size={16} />
                  <span>검토 기준일 2026년 6월 5일 · 공식 출처 우선 정리</span>
                </div>
              </aside>
            </div>
          </section>

          <section className="ref-section ref-path-section">
            <div className="container">
              <div className="ref-section-head">
                <div>
                  <span>START HERE</span>
                  <h2>내 상황에 맞는 첫 경로</h2>
                </div>
                <Link href="search" className="ref-text-link" prefetch={false}>
                  검색으로 찾기 <Search size={15} />
                </Link>
              </div>
              <div className="ref-path-grid">
                {picks.map((pick, index) => (
                  <Link
                    key={pick.category}
                    className="ref-path-card"
                    href={`category/${encodeURIComponent(pick.category)}`}
                    prefetch={false}
                  >
                    <span className="ref-path-num">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{pick.category}</h3>
                    <p>{pick.item?.summary ?? site.description}</p>
                    <strong>{pick.count}개 글 정리</strong>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="ref-section">
            <div className="container">
              <div className="ref-section-head">
                <div>
                  <span>CURATION</span>
                  <h2>{profile.railTitle}</h2>
                  <p>{profile.railText}</p>
                </div>
                <Link href="items" className="ref-text-link" prefetch={false}>
                  전체 글 <ArrowRight size={15} />
                </Link>
              </div>
              <div className="ref-rail" aria-label="추천 글">
                {leadItems.map((item, index) => (
                  <RefItemCard key={item.slug} item={item} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="ref-section ref-process-section">
            <div className="container ref-process-grid">
              <div className="ref-process-copy">
                <span>PROCESS</span>
                <h2>{profile.processTitle}</h2>
                <p>{profile.processText}</p>
                <div className="ref-signal-list">
                  {profile.signals.map((signal) => (
                    <span key={signal}>
                      <CheckCircle2 size={15} /> {signal}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ref-step-list">
                {profile.steps.map((step, index) => (
                  <div key={step} className="ref-step">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="ref-section">
            <div className="container ref-guide-grid">
              <div className="ref-guide-panel">
                <span>GUIDES</span>
                <h2>처음 보는 사람을 위한 판단 기준</h2>
                <p>각 글을 읽기 전에 먼저 보면 좋은 가이드입니다. 단순 설명보다 실제 확인 순서를 중심으로 구성했습니다.</p>
                <Link className="ref-button ghost" href="guides" prefetch={false}>
                  가이드 전체 보기 <FileText size={15} />
                </Link>
              </div>
              <div className="ref-guide-list">
                {leadGuides.map((guide) => (
                  <RefGuideRow key={guide.slug} guide={guide} />
                ))}
              </div>
            </div>
          </section>

          <section className="ref-section ref-proof-section">
            <div className="container ref-proof-grid">
              <div>
                <span>TRUST CHECK</span>
                <h2>{profile.proofTitle}</h2>
                <p>{profile.proofText}</p>
              </div>
              <div className="ref-proof-cards">
                {profile.useCases.map((useCase, index) => (
                  <div key={useCase} className="ref-proof-card">
                    {index % 4 === 0 ? <ClipboardList size={22} /> : null}
                    {index % 4 === 1 ? <FileCheck2 size={22} /> : null}
                    {index % 4 === 2 ? <MapPinned size={22} /> : null}
                    {index % 4 === 3 ? <Layers3 size={22} /> : null}
                    <strong>{useCase}</strong>
                    <span>공식 기준과 실제 확인 순서를 함께 검토</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="ref-section">
            <div className="container">
              <div className="ref-section-head">
                <div>
                  <span>RECENT REVIEW</span>
                  <h2>새로 보강한 글</h2>
                  <p>짧은 요약만 남기지 않고 제외 조건, 준비 순서, 공식 출처 확인을 추가했습니다.</p>
                </div>
              </div>
              <div className="ref-latest-grid">
                {latestItems.map((item, index) => (
                  <RefItemCard key={item.slug} item={item} index={index + 8} />
                ))}
              </div>
            </div>
          </section>

          <section className="ref-section ref-final-note">
            <div className="container">
              <div className="ref-note-panel">
                <Sparkles size={20} />
                <div>
                  <strong>운영 기준</strong>
                  <p>
                    이 사이트는 공식 기관 공지, 접수·예약 화면, 사용자 준비 단계에서 자주 빠지는 항목을 함께 검토해
                    편집합니다. 최종 신청, 접수, 방문 판단은 각 운영기관의 최신 공지를 기준으로 확인해야 합니다.
                  </p>
                </div>
                <a href={publicUrl(site)} target="_blank" rel="noreferrer">
                  라이브 도메인 <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </section>
        </main>
      </SiteChrome>
    </div>
  );
}
