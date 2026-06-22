import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck
} from "lucide-react";
import { RichContent } from "@/components/RichContent";
import { SearchBox } from "@/components/SearchBox";
import { StructuredData } from "@/components/StructuredData";
import { examCategoryMeta, examNextReviewDate, examReviewDate, examSourceGroups } from "@/lib/exam-content";
import { localPath, publicUrl } from "@/lib/seo";
import type { Guide, InfoItem, SiteConfig } from "@/lib/sites";
import { siteStyle } from "@/lib/sites";

function pickItems(site: SiteConfig, slugs: string[], fallbackCount = 6) {
  const picked = slugs
    .map((slug) => site.items.find((item) => item.slug === slug))
    .filter(Boolean) as InfoItem[];
  const seen = new Set(picked.map((item) => item.slug));
  return [...picked, ...site.items.filter((item) => !seen.has(item.slug))].slice(0, fallbackCount);
}

function pickGuides(site: SiteConfig, slugs: string[], fallbackCount = 6) {
  const picked = slugs
    .map((slug) => site.guides.find((guide) => guide.slug === slug))
    .filter(Boolean) as Guide[];
  const seen = new Set(picked.map((guide) => guide.slug));
  return [...picked, ...site.guides.filter((guide) => !seen.has(guide.slug))].slice(0, fallbackCount);
}

function ExamShell({ site, children }: { site: SiteConfig; children: ReactNode }) {
  return (
    <div className="exam-platform" style={siteStyle(site)}>
      <header className="exam-topbar">
        <Link className="exam-brand" href={localPath(site)} aria-label={`${site.name} 홈`}>
          <span>일</span>
          <strong>{site.name}</strong>
        </Link>
        <nav className="exam-nav" aria-label="시험일정센터 주요 메뉴">
          <Link href={localPath(site, "/items")}>마감판</Link>
          <Link href={localPath(site, "/category/국가기술자격")}>국가기술</Link>
          <Link href={localPath(site, "/category/어학시험")}>어학</Link>
          <Link href={localPath(site, "/guides")}>준비 가이드</Link>
          <Link href={localPath(site, "/sources")}>공식 출처</Link>
        </nav>
        <span className="exam-review-mini">검토 {examReviewDate}</span>
      </header>
      {children}
      <footer className="exam-footer">
        <div>
          <strong>{site.name}</strong>
          <p>
            접수 마감, 시험장, 준비물, 성적 발표를 공식 접수처 기준으로 다시 읽는 수험생 일정 데스크 · 다음
            검토 {examNextReviewDate}
          </p>
        </div>
        <div className="exam-footer-links">
          <Link href={localPath(site, "/about")}>소개</Link>
          <Link href={localPath(site, "/editorial-policy")}>편집 기준</Link>
          <Link href={localPath(site, "/updates")}>점검 기록</Link>
          <Link href={localPath(site, "/contact")}>문의</Link>
        </div>
      </footer>
    </div>
  );
}

function BadgeList({ item }: { item: InfoItem }) {
  const badges = item.statusBadges?.length ? item.statusBadges : [item.category, item.region, "공식확인"];
  return (
    <div className="exam-badges">
      {badges.slice(0, 4).map((badge) => (
        <span key={badge}>{badge}</span>
      ))}
    </div>
  );
}

function ExamDeadlineRow({ site, item, index }: { site: SiteConfig; item: InfoItem; index: number }) {
  return (
    <Link className="exam-deadline-row" href={localPath(site, `/items/${item.slug}`)}>
      <span className="exam-row-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="exam-row-main">
        <strong>{item.title}</strong>
        <small>{item.applicationType ?? item.period}</small>
      </span>
      <span className="exam-row-status">
        <span>{item.category}</span>
        <span>{item.resultNote ?? "성적 발표 확인"}</span>
      </span>
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

function ExamCard({ site, item, compact = false }: { site: SiteConfig; item: InfoItem; compact?: boolean }) {
  return (
    <Link className={`exam-card ${compact ? "compact" : ""}`} href={localPath(site, `/items/${item.slug}`)}>
      <div className="exam-card-head">
        <span>{item.category}</span>
        <span>{item.region}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <BadgeList item={item} />
      <div className="exam-card-foot">
        <span>검토 {item.lastCheckedAt ?? item.updatedAt}</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}

function GuideTile({ site, guide }: { site: SiteConfig; guide: Guide }) {
  return (
    <Link className="exam-guide-tile" href={localPath(site, `/guides/${guide.slug}`)}>
      <span>{guide.category}</span>
      <h3>{guide.title}</h3>
      <p>{guide.summary}</p>
      <ArrowRight size={16} />
    </Link>
  );
}

function SourceDirectory() {
  return (
    <div className="exam-source-directory">
      {examSourceGroups().map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          {group.links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <ExternalLink size={14} />
            </a>
          ))}
        </section>
      ))}
    </div>
  );
}

export function ExamTextPage({
  site,
  title,
  intro,
  children,
  aside
}: {
  site: SiteConfig;
  title: string;
  intro: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <ExamShell site={site}>
      <main className="exam-container exam-report-page">
        <article className="exam-report exam-ops-page">
          <div className="exam-report-head">
            <div>
              <div className="exam-badges">
                <span>운영 문서</span>
                <span>검토 {examReviewDate}</span>
              </div>
              <h1>{title}</h1>
              <p>{intro}</p>
            </div>
          </div>
          <div className="exam-report-layout">
            <div className="exam-content">{children}</div>
            <aside className="exam-detail-aside">
              <div className="exam-aside-card">
                <strong>시험일정센터 운영 기준</strong>
                <p>{aside ?? site.disclaimer}</p>
              </div>
            </aside>
          </div>
          <div className="exam-content exam-ops-tail">
            <h2>시험 정보 확인 공통 기준</h2>
            <p>
              시험일정센터의 운영 문서는 시험일 하나를 보여주는 데서 끝나지 않습니다. 시험 정보는 접수 시작일,
              접수 마감, 추가 접수, 환불 마감, 시험장 공지, 수험표 출력, 응시자격 서류, 성적 발표, 성적표
              발급이 서로 연결되어 있기 때문입니다. 운영 페이지에서도 이 기준을 반복해서 설명하는 이유는
              방문자가 사이트의 역할과 한계를 분명히 이해하도록 하기 위해서입니다.
            </p>
            <p>
              특히 수험생은 검색 결과에 노출된 날짜만 보고 행동하기 쉽습니다. 하지만 공식 접수처의 현재 화면에는
              회차별 변경 공지, 접수 상태, 시험장 잔여석, 수험자 유의사항처럼 검색 결과에 보이지 않는 정보가
              따로 남아 있을 수 있습니다. 시험일정센터는 이런 정보를 대신 확정해 주는 곳이 아니라, 어떤 메뉴와
              문장을 다시 확인해야 하는지 안내하는 편집 자료실입니다.
            </p>
            <h2>공식 출처를 우선하는 이유</h2>
            <p>
              시험 일정은 정책, 시험장 사정, 안전 통제, 시스템 점검, 응시 인원에 따라 바뀔 수 있습니다.
              블로그 후기나 커뮤니티 글은 시험장 분위기나 공부 방법을 이해하는 데 도움이 될 수 있지만, 접수
              가능 여부와 응시 조건의 근거가 될 수는 없습니다. 그래서 모든 주요 글에는 공식 접수처와 확인일을
              함께 남기고, 실제 접수 전 원문 확인을 안내합니다.
            </p>
            <p>
              문의, 정정, 개인정보, 약관 문서도 같은 기준을 따릅니다. 사용자가 보내는 정정 요청은 공식 링크가
              있어야 빠르게 반영할 수 있고, 외부 접수처에서 입력하는 개인정보와 결제 정보는 해당 접수처의
              정책을 따릅니다. 이 구분이 분명해야 정보 사이트가 시험 주관기관이나 접수 대행 서비스처럼 오해받지
              않습니다.
            </p>
            <h2>사용자가 남겨야 할 확인 기록</h2>
            <p>
              시험 준비 과정에서는 단순히 봤다는 기억보다 무엇을 어떤 기준으로 확인했는지가 중요합니다. 시험명,
              회차, 확인일, 공식 접수처, 접수 마감, 시험장, 준비물, 성적 발표일을 한 줄로 남겨두면 다음에 같은
              시험을 다시 볼 때 변경 여부를 비교할 수 있습니다. 운영 문서에서 이 기록 방식을 반복해서 안내하는
              이유는 사이트 밖 공식 화면에서 최종 판단을 해야 하기 때문입니다.
            </p>
            <p>
              예를 들어 Q-Net 시험은 시행계획, 원서접수, 응시자격, 합격자 발표 메뉴가 나뉘어 있고, 상공회의소
              상시시험은 시험장 좌석과 프로그램 버전이 중요합니다. 어학시험은 시험일보다 성적 발표일과 제출처
              마감이 더 중요할 수 있습니다. 공공시험은 변경 공고와 면접·서류 제출 일정이 이어질 수 있으므로
              공고 파일 하나만 저장해서는 부족합니다.
            </p>
            <h2>정정 요청을 반영하는 방식</h2>
            <p>
              오래된 일정이나 잘못된 준비물이 확인되면 단순히 한 문장만 바꾸지 않습니다. 해당 글의 요약, 상세
              표, 공식 출처, 관련 가이드, 업데이트 기록까지 함께 보며 수험생 행동에 영향을 주는 항목이 없는지
              확인합니다. 접수 마감 변경, 시험장 변경, 신분증 기준 변경, 성적 발표일 변경처럼 실제 응시에
              영향을 주는 내용은 우선순위가 높습니다.
            </p>
            <p>
              반대로 개인의 합격 가능성, 특정 시험의 난이도 평가, 사설 강의 추천, 접수 대행 요청은 시험일정센터가
              처리하지 않습니다. 이 사이트의 역할은 수험생이 공식 출처에서 다시 확인할 기준을 정리하는 것이며,
              개별 판단과 행정 처리는 공식 주관기관 또는 접수처의 안내를 따라야 합니다.
            </p>
            <p>
              이 기준은 짧은 운영 문서에도 동일하게 적용됩니다. 문의 페이지는 정정 요청을 받는 방법을, 출처
              페이지는 공식 링크를 확인하는 순서를, 개인정보처리방침과 약관은 외부 접수처와 이 사이트의 책임
              범위를 설명합니다. 서로 다른 문서가 같은 원칙으로 연결되어 있어야 방문자가 사이트를 실제 운영되는
              시험 정보 자료실로 이해할 수 있습니다.
            </p>
          </div>
        </article>
      </main>
    </ExamShell>
  );
}

export function ExamHome({ site }: { site: SiteConfig }) {
  const deadlines = pickItems(site, [
    "qnet-regular-license-calendar",
    "korcham-computer-seat-open",
    "dataq-sqld-application",
    "toeic-score-submit-deadline",
    "local-gosi-application",
    "caregiver-cbt-calendar"
  ]);
  const categoryLeads = site.categories.map((category) => {
    const items = site.items.filter((item) => item.category === category);
    return { category, count: items.length, item: items[0] ?? site.items[0] };
  });
  const guides = pickGuides(site, [
    "deadline-minus-three-days",
    "official-score-submit-plan",
    "eligibility-document-rework",
    "exam-room-route-check",
    "constant-test-seat-watch",
    "id-card-name-match"
  ]);
  const reviewed = pickItems(site, [
    "qnet-eligibility-upload",
    "jlpt-application",
    "teps-regular-test",
    "ncs-public-agency-written",
    "fire-safety-manager-course-exam",
    "cosmetology-practical-seat"
  ]);

  return (
    <ExamShell site={site}>
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
      <main>
        <section className="exam-hero">
          <div className="exam-container exam-hero-grid">
            <div className="exam-hero-copy">
              <span className="exam-kicker">
                <CalendarDays size={18} />
                {examReviewDate} 수험생 일정 데스크
              </span>
              <h1>
                시험일보다
                <br />
                접수 마감과 성적 발표를
                <br />
                먼저 보세요.
              </h1>
              <p>
                시험일정센터는 시험명을 나열하는 대신 접수 마감, 시험장, 준비물, 성적 발표, 제출 마감을 한 흐름으로
                정리합니다. 접수 버튼을 누르기 전 공식 화면에서 다시 볼 항목을 먼저 좁혀줍니다.
              </p>
              <div className="exam-search-panel">
                <SearchBox siteSlug={site.slug} placeholder={site.searchPlaceholder} />
                <span>
                  <Search size={14} />
                  예: 컴활 실기 좌석, SQLD 발표일, 지방직 거주지 제한
                </span>
              </div>
            </div>

            <aside className="exam-desk-card" aria-label="접수 전 점검표">
              <div className="exam-desk-top">
                <span>Exam Desk</span>
                <strong>접수 전 5분 점검</strong>
              </div>
              {[
                ["접수", "시작일·마감일·추가접수 구분"],
                ["시험장", "잔여석·입실시간·대체 지역"],
                ["서류", "응시자격·신분증·수험표"],
                ["성적", "발표일·제출마감·유효기간"]
              ].map(([label, text]) => (
                <div key={label} className="exam-desk-line">
                  <span>{label}</span>
                  <strong>{text}</strong>
                  <CheckCircle2 size={16} />
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="exam-container exam-section">
          <div className="exam-section-head">
            <div>
              <span>Deadline Board</span>
              <h2>지금 먼저 확인할 접수판</h2>
            </div>
            <Link href={localPath(site, "/items")}>
              전체 마감판 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="exam-board">
            {deadlines.map((item, index) => (
              <ExamDeadlineRow key={item.slug} site={site} item={item} index={index} />
            ))}
          </div>
        </section>

        <section className="exam-section exam-path-section">
          <div className="exam-container">
            <div className="exam-section-head">
              <div>
                <span>Category Routes</span>
                <h2>시험 종류별로 확인 순서가 다릅니다</h2>
              </div>
            </div>
            <div className="exam-category-strip">
              {categoryLeads.map((entry) => (
                <Link key={entry.category} href={localPath(site, `/category/${entry.category}`)}>
                  <span>{entry.count}개 정리</span>
                  <h3>{entry.category}</h3>
                  <p>{examCategoryMeta(entry.category).checks[0]}</p>
                  <strong>확인 경로 보기</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="exam-container exam-section">
          <div className="exam-guide-layout">
            <div className="exam-guide-copy">
              <span>Preparation Notes</span>
              <h2>수험생이 실제로 놓치는 부분만 따로 묶었습니다</h2>
              <p>
                접수 마감, 시험장 선택, 성적 제출, 응시자격 서류처럼 시험 전후에 다시 열어봐야 하는 기준을
                짧은 가이드로 분리했습니다.
              </p>
            </div>
            <div className="exam-guide-grid">
              {guides.map((guide) => (
                <GuideTile key={guide.slug} site={site} guide={guide} />
              ))}
            </div>
          </div>
        </section>

        <section className="exam-section exam-source-section">
          <div className="exam-container exam-source-layout">
            <div>
              <span className="exam-kicker">
                <ShieldCheck size={18} />
                공식 출처 우선 정리
              </span>
              <h2>시험 정보는 접수처별 원문을 먼저 봅니다</h2>
              <p>
                블로그 요약이나 캡처보다 공식 접수처의 현재 공지, 수험자 유의사항, 마이페이지 접수 상태가 우선입니다.
                시험일정센터는 글마다 확인일과 공식 출처를 함께 남깁니다.
              </p>
            </div>
            <SourceDirectory />
          </div>
        </section>

        <section className="exam-container exam-section">
          <div className="exam-section-head">
            <div>
              <span>Recently Reviewed</span>
              <h2>최근 다시 점검한 시험 브리핑</h2>
            </div>
          </div>
          <div className="exam-card-grid">
            {reviewed.map((item) => (
              <ExamCard key={item.slug} site={site} item={item} compact />
            ))}
          </div>
        </section>
      </main>
    </ExamShell>
  );
}

export function ExamItemsIndex({ site }: { site: SiteConfig }) {
  return (
    <ExamShell site={site}>
      <main className="exam-container exam-page">
        <div className="exam-page-title">
          <span>All Exam Briefs</span>
          <h1>전체 시험 마감판</h1>
          <p>시험일 하나가 아니라 접수 마감, 시험장, 준비물, 성적 발표를 함께 확인하는 브리핑 목록입니다.</p>
        </div>
        <div className="exam-index-layout">
          <aside className="exam-filter-note">
            <strong>분야별 바로가기</strong>
            {site.categories.map((category) => (
              <Link key={category} href={localPath(site, `/category/${category}`)}>
                <span>{category}</span>
                <span>{site.items.filter((item) => item.category === category).length}</span>
              </Link>
            ))}
          </aside>
          <section className="exam-card-grid wide">
            {site.items.map((item) => (
              <ExamCard key={item.slug} site={site} item={item} />
            ))}
          </section>
        </div>
      </main>
    </ExamShell>
  );
}

export function ExamGuidesIndex({ site }: { site: SiteConfig }) {
  return (
    <ExamShell site={site}>
      <main className="exam-container exam-page">
        <div className="exam-page-title">
          <span>Guide Library</span>
          <h1>시험 준비 가이드</h1>
          <p>접수 직전, 시험장 선택, 신분증, 성적 제출처럼 수험생이 자주 실수하는 지점을 따로 정리했습니다.</p>
        </div>
        <section className="exam-category-editorial">
          <h2>가이드는 시험 종류보다 상황별로 읽는 편이 좋습니다</h2>
          <p>
            시험 준비 가이드는 특정 시험 하나를 소개하기보다 수험생이 반복해서 겪는 문제를 따로 분리한 문서입니다.
            접수 마감 3일 전에는 사진, 결제, 시험장, 서류 상태가 중요하고, 성적 제출이 필요한 경우에는 시험일보다
            발표일과 성적표 발급 방식이 중요합니다. 같은 가이드라도 컴활, 기사, 어학시험, 공공시험에 적용할 때
            확인하는 공식 메뉴가 달라질 수 있습니다.
          </p>
          <p>
            처음 보는 사용자는 전체 가이드를 순서대로 읽기보다 본인의 막힌 지점에서 시작하면 됩니다. 접수 버튼을
            누르기 전이라면 마감·환불·시험장 가이드를, 시험 전날이라면 신분증·수험표·이동 경로 가이드를, 시험을
            본 뒤라면 성적 발표·재접수·다음 회차 가이드를 먼저 보는 식입니다.
          </p>
          <p>
            모든 가이드는 공식 접수처의 현재 화면을 대신하지 않습니다. 대신 공식 화면에서 어떤 메뉴를 확인하고
            어떤 기록을 남겨야 하는지 알려주는 체크리스트입니다. 링크만 저장하는 것보다 확인일과 메뉴명을 함께
            적어두는 습관이 다음 회차 준비 시간을 줄입니다.
          </p>
        </section>
        <div className="exam-guide-grid wide">
          {site.guides.map((guide) => (
            <GuideTile key={guide.slug} site={site} guide={guide} />
          ))}
        </div>
      </main>
    </ExamShell>
  );
}

export function ExamCategory({ site, label, items }: { site: SiteConfig; label: string; items: InfoItem[] }) {
  const meta = examCategoryMeta(label);
  const guides = site.guides
    .filter((guide) => guide.category === label || meta.checks.some((check) => guide.summary.includes(check.slice(0, 8))))
    .slice(0, 4);

  return (
    <ExamShell site={site}>
      <main className="exam-container exam-page">
        <section className="exam-category-hero">
          <div>
            <div className="exam-badges">
              <span>{label}</span>
              <span>{items.length}개 브리핑</span>
              <span>검토 {examReviewDate}</span>
            </div>
            <h1>{meta.title}</h1>
            <p>{meta.summary}</p>
          </div>
          <aside className="exam-category-checks">
            <strong>이 카테고리에서 먼저 볼 것</strong>
            {meta.checks.map((check) => (
              <span key={check}>
                <CheckCircle2 size={15} />
                {check}
              </span>
            ))}
          </aside>
        </section>

        <section className="exam-category-editorial">
          <h2>{label}을 볼 때 시험일보다 먼저 확인할 것</h2>
          <p>
            {label} 카테고리는 시험명이 비슷해도 접수 방식과 준비 순서가 다를 수 있습니다. 시험일만 보고
            판단하면 접수 마감, 서류 승인, 시험장 선택, 성적 발표일을 놓치기 쉽습니다. 이 카테고리에서는
            시험별로 공식 접수처에서 다시 봐야 할 메뉴와 수험생이 실제로 행동해야 하는 순서를 먼저 정리합니다.
          </p>
          <p>
            처음 들어온 수험생이라면 아래 목록을 난이도 순서로 보지 말고, 본인에게 가장 급한 마감 기준으로
            보세요. 취업 제출용이면 성적 발표일과 제출처 마감을 먼저 보고, 필기·실기형 시험이면 실기 접수
            가능 회차와 준비물을 확인해야 합니다. 공공시험이나 전문자격처럼 서류가 따라오는 시험은 응시자격
            승인 상태가 시험 준비만큼 중요합니다.
          </p>
          <p>
            또한 같은 카테고리 안에서도 상시시험, 정기시험, 연 1회 시험, 기관별 채용 전형은 관리 방식이
            달라집니다. 상시시험은 좌석이 핵심이고, 정기시험은 회차와 접수 기간이 핵심이며, 공공시험은 변경 공고와
            가산점 등록이 중요합니다. 카테고리 페이지는 이런 차이를 먼저 보여주기 위한 입구입니다.
          </p>
          <p>
            목록의 각 글에는 공식 출처와 검토일을 표시하지만, 실제 접수 가능 여부는 접수처의 현재 화면에서 다시
            확인해야 합니다. 특히 마감이 가까운 시험은 검색 결과에 남아 있는 이전 회차 정보와 현재 회차 정보가
            섞일 수 있으므로, 글 제목보다 공식 링크와 접수 상태를 먼저 보세요.
          </p>
          <p>
            글 수가 적은 시험군도 목록만 덜렁 두지 않고, 접수 전 확인해야 할 순서와 다음 행동을 함께 남깁니다.
            시험 종류가 적어 보이는 카테고리일수록 한 번의 접수 누락이 다음 회차까지 이어질 수 있으므로, 공식
            공지와 마감 기록을 더 보수적으로 확인하는 편이 안전합니다. 특히 공공시험은 변경 공고가 뒤늦게
            올라오는 경우가 있어 접수 후에도 발표 메뉴를 다시 확인해야 합니다.
          </p>
          <div className="exam-category-note-grid">
            <div>
              <strong>접수 전</strong>
              <span>공식 접수처, 회차, 급수·종목, 추가 접수 여부를 확인합니다.</span>
            </div>
            <div>
              <strong>시험 전</strong>
              <span>수험표, 인정 신분증, 시험장, 입실 시간, 준비물을 다시 봅니다.</span>
            </div>
            <div>
              <strong>시험 후</strong>
              <span>성적 발표일, 성적표 발급, 제출처 마감, 다음 회차 계획을 기록합니다.</span>
            </div>
          </div>
        </section>

        <div className="exam-index-layout">
          <aside className="exam-filter-note">
            <strong>다른 분야</strong>
            {site.categories.map((category) => (
              <Link key={category} href={localPath(site, `/category/${category}`)}>
                <span>{category}</span>
                <span>{site.items.filter((item) => item.category === category).length}</span>
              </Link>
            ))}
          </aside>
          <section>
            <div className="exam-card-grid">
              {items.map((item) => (
                <ExamCard key={item.slug} site={site} item={item} />
              ))}
            </div>
            {guides.length ? (
              <div className="exam-related-guides">
                <h2>같이 보면 좋은 준비 가이드</h2>
                <div className="exam-guide-grid">
                  {guides.map((guide) => (
                    <GuideTile key={guide.slug} site={site} guide={guide} />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </ExamShell>
  );
}

function ExamFactGrid({ item }: { item: InfoItem }) {
  const facts = [
    { icon: <CalendarDays size={18} />, label: "일정 상태", value: item.scheduleStatus ?? item.period },
    { icon: <ClipboardList size={18} />, label: "접수 방식", value: item.applicationType ?? "공식 접수처 확인" },
    { icon: <FileCheck2 size={18} />, label: "서류·준비물", value: item.documentNote ?? "수험자 유의사항 확인" },
    { icon: <MapPin size={18} />, label: "시험장", value: item.venueNote ?? "시험장 공지 확인" },
    { icon: <FileText size={18} />, label: "성적 활용", value: item.resultNote ?? "성적 발표일 확인" },
    { icon: <AlertCircle size={18} />, label: "주의", value: item.deadlineRisk ?? "접수 마감 확인" }
  ];

  return (
    <div className="exam-fact-grid">
      {facts.map((fact) => (
        <div key={fact.label} className="exam-fact">
          <span>{fact.icon}</span>
          <small>{fact.label}</small>
          <strong>{fact.value}</strong>
        </div>
      ))}
    </div>
  );
}

function relatedItems(site: SiteConfig, current: InfoItem) {
  return site.items.filter((item) => item.slug !== current.slug && item.category === current.category).slice(0, 4);
}

export function ExamItemDetail({ site, item }: { site: SiteConfig; item: InfoItem }) {
  const related = relatedItems(site, item);
  return (
    <ExamShell site={site}>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.summary,
          dateModified: item.updatedAt,
          datePublished: item.updatedAt,
          author: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          publisher: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          mainEntityOfPage: publicUrl(site, `/items/${item.slug}`)
        }}
      />
      <main className="exam-container exam-report-page">
        <article className="exam-report">
          <div className="exam-report-head">
            <div>
              <BadgeList item={item} />
              <h1>{item.title}</h1>
              <p>{item.summary}</p>
              <div className="exam-editor-note">
                작성·검토: {site.name} 편집팀 · 검토 기준일 {item.updatedAt} · 다음 점검 {item.nextReviewAt}
              </div>
            </div>
            <a className="exam-source-button" href={item.sourceUrl} target="_blank" rel="noreferrer">
              공식 접수처 <ExternalLink size={15} />
            </a>
          </div>
          <ExamFactGrid item={item} />
          <div className="exam-report-layout">
            <div className="exam-content">
              <RichContent blocks={item.body} />
              <h2>자주 묻는 질문</h2>
              {item.faq.map((faq) => (
                <section key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </section>
              ))}
            </div>
            <aside className="exam-detail-aside">
              <div className="exam-aside-card">
                <strong>공식 출처</strong>
                {(item.sourceLinks ?? item.officialLinks ?? [{ label: item.source, url: item.sourceUrl }]).map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    <span>{link.label}</span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
              <div className="exam-aside-card">
                <strong>접수 전 체크</strong>
                {(item.keyChecks ?? []).slice(0, 5).map((check) => (
                  <span key={check}>
                    <CheckCircle2 size={14} />
                    {check}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </article>
        {related.length ? (
          <section className="exam-section">
            <div className="exam-section-head">
              <div>
                <span>Related Briefs</span>
                <h2>같은 분야에서 이어서 볼 글</h2>
              </div>
            </div>
            <div className="exam-card-grid">
              {related.map((relatedItem) => (
                <ExamCard key={relatedItem.slug} site={site} item={relatedItem} compact />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </ExamShell>
  );
}

export function ExamGuideDetail({ site, guide }: { site: SiteConfig; guide: Guide }) {
  return (
    <ExamShell site={site}>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          dateModified: guide.updatedAt,
          datePublished: guide.updatedAt,
          author: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          publisher: { "@type": "Organization", name: site.name, url: publicUrl(site) },
          mainEntityOfPage: publicUrl(site, `/guides/${guide.slug}`)
        }}
      />
      <main className="exam-container exam-report-page">
        <article className="exam-report guide">
          <div className="exam-report-head">
            <div>
              <div className="exam-badges">
                <span>{guide.category}</span>
                <span>검토 {guide.updatedAt}</span>
                <span>{guide.readingTime ?? "가이드"}</span>
              </div>
              <h1>{guide.title}</h1>
              <p>{guide.summary}</p>
            </div>
          </div>
          <div className="exam-report-layout">
            <div className="exam-content">
              <RichContent blocks={guide.body} />
            </div>
            <aside className="exam-detail-aside">
              <div className="exam-aside-card">
                <strong>이 가이드의 체크 포인트</strong>
                {(guide.keyChecks ?? []).map((check) => (
                  <span key={check}>
                    <CheckCircle2 size={14} />
                    {check}
                  </span>
                ))}
              </div>
              <div className="exam-aside-card">
                <strong>공식 출처</strong>
                {(guide.sourceLinks ?? []).map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    <span>{link.label}</span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </article>
      </main>
    </ExamShell>
  );
}

export function ExamSourcesPage({ site }: { site: SiteConfig }) {
  return (
    <ExamTextPage
      site={site}
      title="공식 출처 안내"
      intro="시험일정센터는 시험별 공식 접수처, 시행기관, 성적 발표 메뉴를 우선 기준으로 삼습니다."
      aside="시험 일정과 접수 조건은 검색 결과보다 공식 접수처의 현재 공지, 수험자 유의사항, 마이페이지 접수 상태가 우선입니다."
    >
      <h2>출처를 보는 기준</h2>
      <p>
        시험 정보는 날짜가 자주 바뀌고, 같은 시험명 안에서도 급수, 지역, 시험장, 회차에 따라 접수 가능 여부가
        달라질 수 있습니다. 그래서 시험일정센터는 원문 링크만 나열하지 않고 접수 전 실제로 다시 봐야 하는 메뉴를
        함께 표시합니다.
      </p>
      <p>
        공식 접수처의 시험일정, 원서접수, 수험자 유의사항, 수험표 출력, 합격자 발표, 성적표 발급 메뉴를 우선
        확인합니다. 블로그 후기와 커뮤니티 글은 시험장 분위기나 공부 경험을 이해하는 참고 자료로만 봅니다.
      </p>
      <SourceDirectory />
      <h2>공식 출처에서 다시 볼 항목</h2>
      <ul>
        <li>원서접수 시작일, 마감일, 추가 접수 여부, 환불 마감일</li>
        <li>시험장 위치, 입실 시간, 수험표 출력, 인정 신분증</li>
        <li>응시자격 서류 제출 기간, 승인 상태, 보완 요청 기준</li>
        <li>성적 발표일, 성적표 발급 방식, 기관 제출 가능 여부</li>
      </ul>
    </ExamTextPage>
  );
}
