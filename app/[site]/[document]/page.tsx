import type { Metadata } from "next";
import { SiteDocumentView, isOperationalDocument, operationalDocuments } from "@/components/SiteExperience";
import { documentDescription, documentLabel } from "@/lib/experience";
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
    documentDescription(document, site.name),
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
