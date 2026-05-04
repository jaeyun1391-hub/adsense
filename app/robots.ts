import type { MetadataRoute } from "next";
import { publicUrl } from "@/lib/seo";
import { sites } from "@/lib/sites";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: sites.map((site) => publicUrl(site, "/sitemap.xml"))
  };
}
