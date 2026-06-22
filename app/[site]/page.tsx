import type { Metadata } from "next";
import { ExamHome } from "@/components/ExamPlatform";
import { EventsHome } from "@/components/EventsPlatform";
import { HousingHome } from "@/components/HousingPlatform";
import { ReferenceSiteHome } from "@/components/ReferenceSitePlatform";
import { getSite, sites } from "@/lib/sites";
import { publicUrl, siteKeywords } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string }>;
};

export function generateStaticParams() {
  return sites.map((site) => ({ site: site.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) return {};

  return {
    title: `${site.name} - ${site.headline}`,
    description: site.description,
    metadataBase: new URL(publicUrl(site)),
    alternates: {
      canonical: "/"
    },
    keywords: siteKeywords(site),
    openGraph: {
      title: site.name,
      description: site.description,
      url: publicUrl(site),
      siteName: site.name,
      locale: "ko_KR",
      type: "website"
    }
  };
}

export default async function SiteHome({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  if (site.slug === "housing") {
    return <HousingHome site={site} />;
  }

  if (site.slug === "events") {
    return <EventsHome site={site} />;
  }

  if (site.slug === "exam") {
    return <ExamHome site={site} />;
  }

  return <ReferenceSiteHome site={site} />;
}
