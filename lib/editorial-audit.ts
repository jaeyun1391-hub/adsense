import { getEditorialGuides } from "@/lib/experience";
import { sites, type SiteSlug } from "@/lib/sites";

export type SiteQualityAudit = {
  siteSlug: SiteSlug;
  siteName: string;
  itemCount: number;
  guideCount: number;
  shortItems: number;
  shortGuides: number;
  emptyCategories: number;
  duplicateTitles: number;
  duplicateDescriptions: number;
  missingSourceLinks: number;
  missingReviewDates: number;
  repeatedSentences: number;
  repeatedSentenceSamples: string[];
};

function normalized(value: string) {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase("ko-KR");
}

function duplicateCount(values: string[]) {
  const counts = new Map<string, number>();
  values.filter(Boolean).map(normalized).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.values()].filter((count) => count > 1).length;
}

function repeatedSentences(blocks: string[]) {
  const counts = new Map<string, { count: number; sample: string }>();
  blocks
    .flatMap((block) => block.split(/(?<=[.!?])\s+/))
    .map((sentence) => ({ raw: sentence.trim(), normalized: normalized(sentence) }))
    .filter((sentence) => sentence.normalized.length > 24)
    .forEach((sentence) => {
      const current = counts.get(sentence.normalized);
      counts.set(sentence.normalized, { count: (current?.count ?? 0) + 1, sample: current?.sample ?? sentence.raw });
    });
  return [...counts.values()].filter((entry) => entry.count >= 4);
}

export function getEditorialAudits(): SiteQualityAudit[] {
  return sites.map((site) => {
    const guides = getEditorialGuides(site);
    const itemBodies = site.items.map((item) => item.body.join(" "));
    const guideBodies = guides.map((guide) => guide.body.join(" "));
    const repeats = repeatedSentences([...site.items.flatMap((item) => item.body), ...guides.flatMap((guide) => guide.body)]);
    return {
      siteSlug: site.slug,
      siteName: site.name,
      itemCount: site.items.length,
      guideCount: guides.length,
      shortItems: itemBodies.filter((body) => body.length < 1000).length,
      shortGuides: guideBodies.filter((body) => body.length < 1000).length,
      emptyCategories: site.categories.filter((category) => !site.items.some((item) => item.category === category)).length,
      duplicateTitles: duplicateCount([...site.items.map((item) => item.title), ...guides.map((guide) => guide.title)]),
      duplicateDescriptions: duplicateCount([...site.items.map((item) => item.summary), ...guides.map((guide) => guide.summary)]),
      missingSourceLinks: site.items.filter((item) => !item.source || !item.sourceUrl).length,
      missingReviewDates: [...site.items, ...guides].filter((content) => !content.updatedAt).length,
      repeatedSentences: repeats.length,
      repeatedSentenceSamples: repeats.slice(0, 3).map((entry) => entry.sample)
    };
  });
}
