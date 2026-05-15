import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { InfoItem, SiteConfig } from "@/lib/sites";

export function ItemCard({ item }: { site: SiteConfig; item: InfoItem }) {
  return (
    <Link className="card" href={`/items/${item.slug}`}>
      <div className="tag-row">
        <span className="tag">{item.category}</span>
        <span className="tag">{item.region}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="meta-row muted">
        <span>
          <CalendarDays size={14} /> {item.period}
        </span>
        <span>
          <MapPin size={14} /> {item.source}
        </span>
      </div>
    </Link>
  );
}
