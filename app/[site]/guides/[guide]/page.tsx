import type { Metadata } from "next";
import { SiteGuideDetailView } from "@/components/SiteExperience";
import { getEditorialGuides } from "@/lib/experience";
import { pageMetadata } from "@/lib/page-metadata";
import { getSite, sites } from "@/lib/sites";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string; guide: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return sites.flatMap((site) => getEditorialGuides(site).map((guide) => ({ site: site.slug, guide: guide.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug, guide: guideSlug } = await params;
  const site = getSite(slug);
  if (!site) return {};
  const guide = getEditorialGuides(site).find((candidate) => candidate.slug === guideSlug);
  if (!guide) return {};
  return pageMetadata(site, guide.title, guide.summary, "/guides/" + guide.slug);
}

export default async function GuideDetailPage({ params }: Props) {
  const { site: slug, guide: guideSlug } = await params;
  const site = getSite(slug);
  if (!site) notFound();
  const guide = getEditorialGuides(site).find((candidate) => candidate.slug === guideSlug);
  if (!guide) notFound();
  return <SiteGuideDetailView site={site} guide={guide} />;
}
