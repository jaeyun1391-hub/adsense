import type { Metadata } from "next";
import { SiteCategoryView } from "@/components/SiteExperience";
import { populatedCategories } from "@/lib/experience";
import { getPublicRecords } from "@/lib/operations";
import { pageMetadata } from "@/lib/page-metadata";
import { getSite, sites } from "@/lib/sites";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string; category: string }>;
};

export const revalidate = 300;

function categoryLabel(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function generateStaticParams() {
  return sites.flatMap((site) => populatedCategories(site).map((category) => ({ site: site.slug, category })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug, category } = await params;
  const site = getSite(slug);
  if (!site) return {};
  const label = categoryLabel(category);
  return pageMetadata(site, label + " 정보", site.name + "의 " + label + " 관련 공식 원문과 이용 전 확인 항목입니다.", "/category/" + encodeURIComponent(label));
}

export default async function CategoryPage({ params }: Props) {
  const { site: slug, category } = await params;
  const site = getSite(slug);
  if (!site) notFound();
  const label = categoryLabel(category);
  const snapshot = await getPublicRecords(site);
  if (!snapshot.records.some((record) => record.category === label)) notFound();
  return <SiteCategoryView site={site} category={label} />;
}
