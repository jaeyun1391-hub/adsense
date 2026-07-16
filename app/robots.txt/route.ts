import { headers } from "next/headers";
import { sites } from "@/lib/sites";
import { publicUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function siteForHost(host: string) {
  const normalized = host.toLowerCase().split(":")[0].replace(/^www\./, "");
  return sites.find((site) => site.domainHint === normalized);
}

export async function GET() {
  const host = (await headers()).get("host") ?? "";
  const site = siteForHost(host);
  const sitemapLines = site
    ? [`Sitemap: ${publicUrl(site, "/sitemap.xml")}`]
    : sites.map((siteItem) => `Sitemap: ${publicUrl(siteItem, "/sitemap.xml")}`);

  return new Response(["User-Agent: *", "Allow: /", "Disallow: /ops", "", ...sitemapLines, ""].join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
