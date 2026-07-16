import type { Metadata } from "next";
import { SiteItemDetailView } from "@/components/SiteExperience";
import { getPublicRecord } from "@/lib/operations";
import { pageMetadata } from "@/lib/page-metadata";
import { getSite, sites } from "@/lib/sites";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string; item: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return sites.flatMap((site) => site.items.map((item) => ({ site: site.slug, item: item.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug, item: itemSlug } = await params;
  const site = getSite(slug);
  if (!site) return {};
  const record = await getPublicRecord(site, itemSlug);
  if (!record) return {};
  return pageMetadata(site, record.title, record.summary, "/items/" + record.slug);
}

export default async function ItemDetailPage({ params }: Props) {
  const { site: slug, item: itemSlug } = await params;
  const site = getSite(slug);
  if (!site) notFound();
  const record = await getPublicRecord(site, itemSlug);
  if (!record) notFound();
  return <SiteItemDetailView site={site} slug={itemSlug} />;
}
