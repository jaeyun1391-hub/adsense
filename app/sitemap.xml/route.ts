import { headers } from "next/headers";
import { operationalDocuments } from "@/components/SiteExperience";
import { getEditorialGuides, populatedCategories } from "@/lib/experience";
import { getPublicRecords } from "@/lib/operations";
import { publicUrl } from "@/lib/seo";
import { sites, type SiteConfig } from "@/lib/sites";

export const dynamic = "force-dynamic";

type SitemapEntry = { url: string; lastModified?: string };

function siteForHost(host: string) {
  const normalized = host.toLowerCase().split(":")[0].replace(/^www\./, "");
  return sites.find((site) => site.domainHint === normalized);
}

async function entriesForSite(site: SiteConfig): Promise<SitemapEntry[]> {
  const snapshot = await getPublicRecords(site);
  const guides = getEditorialGuides(site);
  const documents = operationalDocuments;
  const contentDates = [...snapshot.records, ...guides]
    .map((content) => content.updatedAt)
    .filter(Boolean)
    .sort();
  const pageLastModified = contentDates.at(-1);
  return [
    { url: publicUrl(site), lastModified: pageLastModified },
    { url: publicUrl(site, "/items"), lastModified: pageLastModified },
    { url: publicUrl(site, "/guides"), lastModified: pageLastModified },
    ...documents.map((document) => ({ url: publicUrl(site, "/" + document) })),
    ...populatedCategories(site).map((category) => ({ url: publicUrl(site, "/category/" + encodeURIComponent(category)) })),
    ...snapshot.records.map((record) => ({ url: publicUrl(site, "/items/" + record.slug), lastModified: record.updatedAt || pageLastModified })),
    ...guides.map((guide) => ({ url: publicUrl(site, "/guides/" + guide.slug), lastModified: guide.updatedAt || pageLastModified }))
  ];
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const host = (await headers()).get("host") ?? "";
  const site = siteForHost(host);
  const entries = (await Promise.all((site ? [site] : sites).map(entriesForSite))).flat();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url><loc>${escapeXml(entry.url)}</loc>${entry.lastModified ? `<lastmod>${escapeXml(entry.lastModified)}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
