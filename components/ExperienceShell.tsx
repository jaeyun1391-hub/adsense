import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  GraduationCap,
  House,
  Landmark,
  MapPinned,
  Search
} from "lucide-react";
import type { ReactNode } from "react";
import { getExperience, publicOperator } from "@/lib/experience";
import type { SiteConfig } from "@/lib/sites";

type ExperienceShellProps = {
  site: SiteConfig;
  active?: "home" | "items" | "guides" | "documents" | "search";
  children: ReactNode;
};

function Navigation({ site, active }: Pick<ExperienceShellProps, "site" | "active">) {
  const experience = getExperience(site.slug);
  return (
    <nav className="experience-nav" aria-label={`${site.name} 주요 메뉴`}>
      <Link className={active === "home" ? "is-active" : undefined} href="/">
        홈
      </Link>
      {experience.navigation.map((item) => (
        <Link key={item.href} className={active === "items" && item.href === "/items" ? "is-active" : undefined} href={item.href}>
          {item.label}
        </Link>
      ))}
      <Link className={active === "search" ? "is-active" : undefined} href="/search">
        <Search size={15} aria-hidden="true" />
        검색
      </Link>
    </nav>
  );
}

function ExamHeader({ site, active }: Pick<ExperienceShellProps, "site" | "active">) {
  return (
    <header className="exam-header">
      <div className="experience-width exam-header-row">
        <Link className="exam-brand" href="/" aria-label={`${site.name} 홈`}>
          <span className="exam-brand-icon"><GraduationCap size={20} /></span>
          <span><b>{site.name}</b><small>접수·준비·발표 일정실</small></span>
        </Link>
        <Navigation site={site} active={active} />
        <span className="exam-live"><CircleCheck size={14} /> 일정 점검 데스크</span>
      </div>
    </header>
  );
}

function EventsHeader({ site, active }: Pick<ExperienceShellProps, "site" | "active">) {
  return (
    <header className="events-header">
      <div className="experience-width events-header-top">
        <p>WEEKEND FIELD NOTE / KOREA</p>
        <span>행사 변경 공지는 공식 채널을 다시 확인합니다.</span>
      </div>
      <div className="experience-width events-header-main">
        <Link className="events-brand" href="/" aria-label={`${site.name} 홈`}>
          <CalendarDays size={22} /> <span>{site.name}</span>
        </Link>
        <Navigation site={site} active={active} />
      </div>
    </header>
  );
}

function HousingHeader({ site, active }: Pick<ExperienceShellProps, "site" | "active">) {
  return (
    <header className="housing-header">
      <div className="experience-width housing-header-row">
        <Link className="housing-brand" href="/" aria-label={`${site.name} 홈`}>
          <span><House size={20} /></span>
          <b>{site.name}</b>
        </Link>
        <p>Housing decision desk</p>
        <Navigation site={site} active={active} />
      </div>
    </header>
  );
}

function BusinessHeader({ site, active }: Pick<ExperienceShellProps, "site" | "active">) {
  return (
    <header className="business-header">
      <div className="experience-width business-header-row">
        <Link className="business-brand" href="/" aria-label={`${site.name} 홈`}>
          <BriefcaseBusiness size={21} />
          <span>{site.name}<small>지원사업 관제</small></span>
        </Link>
        <Navigation site={site} active={active} />
        <Link className="business-ops-link" href="/updates">운영 로그 <ArrowUpRight size={14} /></Link>
      </div>
    </header>
  );
}

function FacilitiesHeader({ site, active }: Pick<ExperienceShellProps, "site" | "active">) {
  return (
    <header className="facilities-header">
      <div className="experience-width facilities-header-row">
        <Link className="facilities-brand" href="/" aria-label={`${site.name} 홈`}>
          <span><MapPinned size={20} /></span>
          <b>{site.name}</b>
        </Link>
        <Navigation site={site} active={active} />
        <Link className="facilities-contact" href="/contact">시설 정정 요청</Link>
      </div>
    </header>
  );
}

function Header({ site, active }: Pick<ExperienceShellProps, "site" | "active">) {
  const frame = getExperience(site.slug).frame;
  if (frame === "exam") return <ExamHeader site={site} active={active} />;
  if (frame === "events") return <EventsHeader site={site} active={active} />;
  if (frame === "housing") return <HousingHeader site={site} active={active} />;
  if (frame === "business") return <BusinessHeader site={site} active={active} />;
  return <FacilitiesHeader site={site} active={active} />;
}

function Footer({ site }: { site: SiteConfig }) {
  const experience = getExperience(site.slug);
  return (
    <footer className={`experience-footer experience-footer--${experience.frame}`}>
      <div className="experience-width experience-footer-grid">
        <section>
          <p className="footer-kicker">{experience.deskName}</p>
          <h2>{site.name}</h2>
          <p>{experience.descriptor}</p>
        </section>
        <section>
          <h3>운영 정보</h3>
          <address>
            운영자 {publicOperator.name} · {publicOperator.organization}<br />
            <a href={`mailto:${publicOperator.email}`}>{publicOperator.email}</a><br />
            <a href={`tel:${publicOperator.phone.replace(/-/g, "")}`}>{publicOperator.phone}</a><br />
            {publicOperator.address}
          </address>
        </section>
        <section className="footer-docs">
          <h3>운영 문서</h3>
          <Link href="/about">소개</Link>
          <Link href="/editorial-policy">편집 기준</Link>
          <Link href="/sources">출처 정책</Link>
          <Link href="/updates">업데이트</Link>
          <Link href="/contact">문의</Link>
          <Link href="/privacy">개인정보</Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/copyright">저작권</Link>
          <Link href="/youth-policy">청소년 보호</Link>
          <Link href="/email-collection">이메일 수집 거부</Link>
        </section>
      </div>
      <div className="experience-width footer-bottom">
        <span>© {new Date().getFullYear()} {publicOperator.organization}. All rights reserved.</span>
        <span>정보 변경 가능성이 있는 항목은 공식 원문을 최종 기준으로 합니다.</span>
      </div>
    </footer>
  );
}

export function ExperienceShell({ site, active = "home", children }: ExperienceShellProps) {
  const experience = getExperience(site.slug);
  return (
    <div className={`experience experience--${experience.frame}`}>
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <Header site={site} active={active} />
      <main id="main-content">{children}</main>
      <Footer site={site} />
    </div>
  );
}
