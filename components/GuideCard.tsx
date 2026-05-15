import Link from "next/link";
import type { Guide, SiteConfig } from "@/lib/sites";

export function GuideCard({ guide }: { site: SiteConfig; guide: Guide }) {
  return (
    <Link className="card" href={`/guides/${guide.slug}`}>
      <div className="tag-row">
        <span className="tag">{guide.category}</span>
        <span className="tag">업데이트 {guide.updatedAt}</span>
      </div>
      <h3>{guide.title}</h3>
      <p>{guide.summary}</p>
    </Link>
  );
}
