import type { Metadata } from "next";
import { SiteItemsView } from "@/components/SiteExperience";
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
  return pageMetadata(site, "전체 정보", site.name + "에서 확인할 수 있는 공식 원문 기반 정보와 편집 기록입니다.", "/items");
}

export default async function ItemsPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return <SiteItemsView site={site} />;
}
