import type { Metadata } from "next";
import type { SiteConfig } from "@/lib/sites";
import { publicUrl, siteKeywords } from "@/lib/seo";

export function pageMetadata(site: SiteConfig, title: string, description: string, path = "/", noIndex = false): Metadata {
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  return {
    title: fullTitle,
    description,
    metadataBase: new URL(publicUrl(site)),
    alternates: { canonical: path },
    keywords: siteKeywords(site),
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: publicUrl(site, path),
      siteName: site.name,
      locale: "ko_KR",
      type: "website",
      images: [{ url: publicUrl(site, "/opengraph-image"), width: 1200, height: 630, alt: site.name }]
    }
  };
}
