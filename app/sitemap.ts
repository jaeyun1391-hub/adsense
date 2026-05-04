import type { MetadataRoute } from "next";
import { sites } from "@/lib/sites";
import { publicUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const site of sites) {
    routes.push(
      { url: publicUrl(site), lastModified: new Date("2026-05-04") },
      { url: publicUrl(site, "/items"), lastModified: new Date("2026-05-04") },
      { url: publicUrl(site, "/guides"), lastModified: new Date("2026-05-04") },
      { url: publicUrl(site, "/about"), lastModified: new Date("2026-05-04") },
      { url: publicUrl(site, "/sources"), lastModified: new Date("2026-05-04") },
      { url: publicUrl(site, "/contact"), lastModified: new Date("2026-05-04") },
      { url: publicUrl(site, "/privacy"), lastModified: new Date("2026-05-04") },
      { url: publicUrl(site, "/terms"), lastModified: new Date("2026-05-04") }
    );

    for (const category of site.categories) {
      routes.push({
        url: publicUrl(site, `/category/${encodeURIComponent(category)}`),
        lastModified: new Date("2026-05-04")
      });
    }

    for (const item of site.items) {
      routes.push({
        url: publicUrl(site, `/items/${item.slug}`),
        lastModified: new Date(item.updatedAt)
      });
    }

    for (const guide of site.guides) {
      routes.push({
        url: publicUrl(site, `/guides/${guide.slug}`),
        lastModified: new Date(guide.updatedAt)
      });
    }
  }

  return routes;
}
