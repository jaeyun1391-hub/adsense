import { headers } from "next/headers";
import { operationalDocuments } from "@/components/SiteExperience";
import { getEditorialGuides, populatedCategories } from "@/lib/experience";
import { getPublicRecords } from "@/lib/operations";
import { publicUrl } from "@/lib/seo";
import { sites, type SiteConfig } from "@/lib/sites";

export const dynamic = "force-dynamic";

type SitemapEntry = { url: string; lastModified: string };

function siteForHost(host: string) {
  const normalized = host.toLowerCase().split(":")[0].replace(/^www\./, "");
  return sites.find((site) => site.domainHint === normalized);
}

async function entriesForSite(site: SiteConfig): Promise<SitemapEntry[]> {
  const snapshot = await getPublicRecords(site);
  const guides = getEditorialGuides(site);
  const documents = operationalDocuments.filter((document) => document !== "adsense-playbook");
  const now = new Date().toISOString().slice(0, 10);
  return [
    { url: publicUrl(site), lastModified: now },
    { url: publicUrl(site, "/items"), lastModified: now },
    { url: publicUrl(site, "/guides"), lastModified: now },
    ...documents.map((document) => ({ url: publicUrl(site, "/" + document), lastModified: now })),
    ...populatedCategories(site).map((category) => ({ url: publicUrl(site, "/category/" + encodeURIComponent(category)), lastModified: now })),
    ...snapshot.records.map((record) => ({ url: publicUrl(site, "/items/" + record.slug), lastModified: record.updatedAt.slice(0, 10) || now })),
    ...guides.map((guide) => ({ url: publicUrl(site, "/guides/" + guide.slug), lastModified: guide.updatedAt.slice(0, 10) || now }))
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
${entries.map((entry) => `  <url><loc>${escapeXml(entry.url)}</loc><lastmod>${entry.lastModified}</lastmod></url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
