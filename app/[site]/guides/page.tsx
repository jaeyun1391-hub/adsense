import type { Metadata } from "next";
import { SiteGuidesView } from "@/components/SiteExperience";
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
  return pageMetadata(site, "문제 해결 가이드", site.name + " 이용자가 실제로 막히는 순서를 풀어 쓴 편집형 가이드입니다.", "/guides");
}

export default async function GuidesPage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  return <SiteGuidesView site={site} />;
}
