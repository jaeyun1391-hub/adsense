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
  highSimilarityPairs: number;
  highestSimilarity: number;
  highSimilaritySamples: string[];
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

type SimilarityDocument = {
  label: string;
  text: string;
};

function tokenSet(value: string) {
  return new Set(
    normalized(value)
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 2)
  );
}

function jaccard(left: Set<string>, right: Set<string>) {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  left.forEach((token) => {
    if (right.has(token)) intersection += 1;
  });
  return intersection / (left.size + right.size - intersection);
}

function highSimilarityPairs(documents: SimilarityDocument[], threshold = 0.8) {
  const prepared = documents.map((document) => ({ ...document, tokens: tokenSet(document.text) }));
  const pairs: Array<{ left: string; right: string; score: number }> = [];
  for (let leftIndex = 0; leftIndex < prepared.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < prepared.length; rightIndex += 1) {
      const score = jaccard(prepared[leftIndex].tokens, prepared[rightIndex].tokens);
      if (score >= threshold) pairs.push({ left: prepared[leftIndex].label, right: prepared[rightIndex].label, score });
    }
  }
  return pairs.sort((left, right) => right.score - left.score);
}

export function getEditorialAudits(): SiteQualityAudit[] {
  return sites.map((site) => {
    const guides = getEditorialGuides(site);
    const itemBodies = site.items.map((item) => item.body.join(" "));
    const guideBodies = guides.map((guide) => guide.body.join(" "));
    const repeats = repeatedSentences([...site.items.flatMap((item) => item.body), ...guides.flatMap((guide) => guide.body)]);
    const similarityPairs = highSimilarityPairs([
      ...site.items.map((item) => ({ label: item.title, text: [item.title, item.summary, ...item.body].join(" ") })),
      ...guides.map((guide) => ({ label: guide.title, text: [guide.title, guide.summary, ...guide.body].join(" ") }))
    ]);
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
      repeatedSentenceSamples: repeats.slice(0, 3).map((entry) => entry.sample),
      highSimilarityPairs: similarityPairs.length,
      highestSimilarity: similarityPairs[0]?.score ?? 0,
      highSimilaritySamples: similarityPairs.slice(0, 3).map((pair) => `${pair.left} / ${pair.right} (${Math.round(pair.score * 100)}%)`)
    };
  });
}
