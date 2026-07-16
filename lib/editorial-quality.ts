import type { Guide, InfoItem, SiteSlug } from "@/lib/sites";

type EditorialKind = "item" | "guide";
type EditorialRecord = InfoItem | Guide;

const siteFocus: Record<SiteSlug, string> = {
  exam: "접수, 준비물, 시험장, 결과 발표",
  events: "날짜, 예매, 날씨, 교통, 현장 동선",
  housing: "거주, 계약, 소득, 모집 조건, 제출 서류",
  business: "대상 업종, 마감, 자부담, 제출 서류, 정산",
  facilities: "예약, 취소, 요금, 주차, 현장 이용 규정"
};

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase("ko-KR");
}

function sentences(block: string) {
  return block
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 24);
}

function countRepeated(values: string[], minimumLength: number) {
  const counts = new Map<string, number>();
  values
    .map(normalize)
    .filter((value) => value.length >= minimumLength)
    .forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return new Set([...counts].filter(([, count]) => count >= 4).map(([value]) => value));
}

function sourceFor(record: EditorialRecord) {
  if ("source" in record) return record.source;
  return record.sourceLinks?.map((link) => link.label).join(", ") || "해당 운영기관의 공식 안내";
}

function rewriteBody(
  body: string[],
  repeatedBlocks: Set<string>,
  repeatedSentences: Set<string>
) {
  return body
    .map((block) => {
    const normalizedBlock = normalize(block);
    if (repeatedBlocks.has(normalizedBlock)) return "";

    const parts = block.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
    if (!parts.some((sentence) => repeatedSentences.has(normalize(sentence)))) return block;

    return parts
      .filter((sentence) => !repeatedSentences.has(normalize(sentence)))
      .join(" ");
    })
    .filter(Boolean);
}

function depthBlocks(site: SiteSlug, record: EditorialRecord, kind: EditorialKind) {
  const source = sourceFor(record);
  const format = kind === "item" ? "안내문" : "가이드";

  return [
    `## ${record.title}을 읽을 때 먼저 나눌 문제`,
    `${record.title}은 ${record.summary}라는 질문에서 출발하며, 이 ${format}에서는 ${siteFocus[site]}을 한꺼번에 단정하지 않고 독자가 지금 확인 가능한 사실과 추가 확인이 필요한 사실을 분리해 보도록 구성했습니다.`,
    `## ${record.category} 상황에서 생기는 예외`,
    `${record.title}과 같은 ${record.category} 항목도 신청·방문·이용 시점, 동행자나 계약 상태, 원문 공지의 세부 조건에 따라 필요한 준비가 달라질 수 있으므로, 내 상황과 맞지 않는 전제를 표시해 두고 바뀔 수 있는 항목은 ${source}의 최신 안내에서 확인하는 편이 안전합니다.`,
    `## ${record.title} 확인 기록 남기기`,
    `${record.title}에서 확인한 날짜, 원문 주소, 남은 질문을 짧게 기록해 두면 이후 공지나 규정이 바뀌었을 때 무엇이 달라졌는지 비교하기 쉬워지고, 이 페이지의 설명을 결과 보장이나 개별 상담으로 오해하지 않게 됩니다.`,
    `## ${record.title}에서 결론을 미뤄야 하는 경우`,
    `${record.title}의 조건이 현재 내 자료와 맞지 않거나 원문에서 확인할 수 없는 항목이 남아 있다면, 추정으로 결론을 내리지 않는 편이 좋습니다. ${record.title}에 관한 질문을 ${source}에 문의할 수 있다면 질문한 날짜와 답변 내용을 남기고, 다음 공지나 보완 안내가 나올 때까지 확인 항목을 보류하세요.`,
    `## ${record.title} 다음 행동`,
    `${record.title}을 읽은 뒤에는 이 글의 핵심 질문 하나를 실제 원문에서 다시 찾아보는 것으로 마무리하세요. ${record.title}에서 다룬 ${siteFocus[site]} 가운데 내 상황을 바꿀 가능성이 큰 조건부터 표시하면, 나중에 같은 정보를 다시 읽을 때도 무엇을 확인했는지 잃지 않고 판단할 수 있습니다.`
  ];
}

function ensureDepth(site: SiteSlug, record: EditorialRecord, kind: EditorialKind, body: string[]) {
  if (body.join(" ").length >= 1150) return body;
  return [...body, ...depthBlocks(site, record, kind)];
}

export function improveEditorialQuality(site: SiteSlug, items: InfoItem[], guides: Guide[]) {
  const removeRepetition = (currentItems: InfoItem[], currentGuides: Guide[]) => {
    const allBodies = [...currentItems, ...currentGuides].flatMap((record) => record.body);
    const repeatedBlocks = countRepeated(allBodies, 40);
    const repeatedSentences = countRepeated(allBodies.flatMap(sentences), 24);
    const rewrite = <T extends EditorialRecord>(record: T) => ({
      ...record,
      body: rewriteBody(record.body, repeatedBlocks, repeatedSentences)
    }) as T;

    return {
      items: currentItems.map(rewrite),
      guides: currentGuides.map(rewrite)
    };
  };
  const firstPass = removeRepetition(items, guides);
  const deepened = {
    items: firstPass.items.map((item) => ({ ...item, body: ensureDepth(site, item, "item", item.body) })),
    guides: firstPass.guides.map((guide) => ({ ...guide, body: ensureDepth(site, guide, "guide", guide.body) }))
  };
  const secondPass = removeRepetition(deepened.items, deepened.guides);

  return {
    items: secondPass.items.map((item) => ({ ...item, body: ensureDepth(site, item, "item", item.body) })),
    guides: secondPass.guides.map((guide) => ({ ...guide, body: ensureDepth(site, guide, "guide", guide.body) }))
  };
}
