import type { Metadata } from "next";
import { SiteHome as ExperienceHome } from "@/components/SiteExperience";
import { pageMetadata } from "@/lib/page-metadata";
import { getSite, sites } from "@/lib/sites";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return sites.map((site) => ({ site: site.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) return {};

  return pageMetadata(site, site.name, site.description);
}

export default async function SiteHome({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return <ExperienceHome site={site} />;
}
