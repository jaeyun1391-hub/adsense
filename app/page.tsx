import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sites, siteStyle } from "@/lib/sites";

export default function NetworkHome() {
  return (
    <main className="site-shell">
      <section className="hero">
        <div className="container">
          <span className="eyebrow">Next.js 정보형 사이트 네트워크</span>
          <h1>애드센스 승인 신청을 위한 5개 정보 서비스</h1>
          <p className="lead">
            각 사이트는 독립적인 주제, 탐색 구조, 상세 페이지, 가이드 콘텐츠, 정책 페이지를 갖도록 구성했습니다.
            실제 도메인 연결 시에는 같은 코드베이스를 공유하면서도 서로 다른 서비스처럼 운영할 수 있습니다.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid">
          {sites.map((site) => {
            const Icon = site.icon;
            return (
              <Link key={site.slug} className="card" href={`/${site.slug}`} style={siteStyle(site)}>
                <span className="brand-mark">
                  <Icon size={19} />
                </span>
                <h3>{site.name}</h3>
                <p>{site.description}</p>
                <div className="meta-row">
                  <span className="tag">{site.domainHint}</span>
                  <span className="tag">
                    보기 <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
