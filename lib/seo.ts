import type { SiteConfig } from "@/lib/sites";

export function siteOrigin(site: SiteConfig) {
  return `https://${site.domainHint}`;
}

export function publicUrl(site: SiteConfig, path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin(site)}${normalizedPath}`;
}

export function localPath(site: SiteConfig, path = "/") {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${site.slug}${normalizedPath}`;
}

export function siteKeywords(site: SiteConfig) {
  return [
    site.name,
    ...site.categories,
    ...site.items.flatMap((item) => item.tags),
    "신청",
    "일정",
    "가이드",
    "공식 출처"
  ].slice(0, 18);
}
