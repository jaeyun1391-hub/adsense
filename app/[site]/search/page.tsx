import type { Metadata } from "next";
import { SiteItemsView } from "@/components/SiteExperience";
import { getPublicRecords } from "@/lib/operations";
import { pageMetadata } from "@/lib/page-metadata";
import { getSite, sites } from "@/lib/sites";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string }>;
  searchParams: Promise<{ q?: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return sites.map((site) => ({ site: site.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) return {};
  return pageMetadata(site, "검색", site.name + " 내부에서 공식 원문과 편집 자료를 검색합니다.", "/search", true);
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { site: slug } = await params;
  const { q = "" } = await searchParams;
  const site = getSite(slug);
  if (!site) notFound();
  const snapshot = await getPublicRecords(site);
  const normalized = q.trim().toLowerCase();
  const records = normalized
    ? snapshot.records.filter((record) => [record.title, record.summary, record.category, record.region, record.sourceName, ...record.tags].join(" ").toLowerCase().includes(normalized))
    : snapshot.records;
  const heading = q ? '"' + q + '" 검색 결과' : "전체 검색";
  return <SiteItemsView site={site} heading={heading} records={records} />;
}
