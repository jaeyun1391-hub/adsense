import type { Metadata } from "next";
import { SiteDocumentView, isOperationalDocument, operationalDocuments } from "@/components/SiteExperience";
import { documentLabel } from "@/lib/experience";
import { pageMetadata } from "@/lib/page-metadata";
import { getSite, sites } from "@/lib/sites";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ site: string; document: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return sites.flatMap((site) => operationalDocuments.map((document) => ({ site: site.slug, document })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug, document } = await params;
  const site = getSite(slug);
  if (!site || !isOperationalDocument(document)) return {};
  return pageMetadata(
    site,
    documentLabel(document),
    site.name + "의 공개 운영 기준, 출처 원칙, 정정 및 문의 절차를 안내합니다.",
    "/" + document,
    document === "adsense-playbook"
  );
}

export default async function OperationalDocumentPage({ params }: Props) {
  const { site: slug, document } = await params;
  const site = getSite(slug);
  if (!site || !isOperationalDocument(document)) notFound();
  return <SiteDocumentView site={site} document={document} />;
}
