import { headers } from "next/headers";
import { sites, type SiteConfig } from "@/lib/sites";
import { publicUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function siteForHost(host: string) {
  const normalized = host.toLowerCase().split(":")[0].replace(/^www\./, "");
  return sites.find((site) => site.domainHint === normalized);
}

function urlsForSite(site: SiteConfig) {
  return [
    publicUrl(site),
    publicUrl(site, "/items"),
    publicUrl(site, "/guides"),
    publicUrl(site, "/about"),
    publicUrl(site, "/editorial-policy"),
    publicUrl(site, "/sources"),
    publicUrl(site, "/updates"),
    publicUrl(site, "/contact"),
    publicUrl(site, "/privacy"),
    publicUrl(site, "/terms"),
    ...site.categories.map((category) => publicUrl(site, `/category/${encodeURIComponent(category)}`)),
    ...site.items.map((item) => publicUrl(site, `/items/${item.slug}`)),
    ...site.guides.map((guide) => publicUrl(site, `/guides/${guide.slug}`))
  ];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const host = (await headers()).get("host") ?? "";
  const site = siteForHost(host);
  const urls = site ? urlsForSite(site) : sites.flatMap(urlsForSite);
  const lastModified = "2026-05-26";

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastModified}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}
