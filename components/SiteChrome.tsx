import Link from "next/link";
import { Home } from "lucide-react";
import type { SiteConfig } from "@/lib/sites";
import { sitePath } from "@/lib/seo";

export function SiteChrome({ site, children }: { site: SiteConfig; children: React.ReactNode }) {
  const Icon = site.icon;

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" href="/" aria-label={`${site.name} 홈`}>
            <span className="brand-mark" aria-hidden="true">
              <Icon size={19} />
            </span>
            <span>{site.name}</span>
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            <Link href="/">
              <Home size={15} />
              홈
            </Link>
            {site.nav.map((item) => (
              <Link key={item.href} href={sitePath(site, item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <strong>{site.name}</strong>
            <p>{site.identity}</p>
            <p>{site.disclaimer}</p>
          </div>
          <div className="footer-links">
            <Link href="/about">소개</Link>
            <Link href="/sources">출처 안내</Link>
            <Link href="/contact">문의하기</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/terms">이용약관</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
