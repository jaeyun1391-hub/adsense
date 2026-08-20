import type { Guide, InfoItem } from "@/lib/sites";

export const selectedExamItemSlugs = [
  "dataq-dasp-61-application-2026",
  "dataq-dap-66-application-2026",
  "bigdata-analyst-13-written-2026",
  "sqld-62-exam-2026",
  "sqlp-55-exam-2026",
  "adsp-50-score-review-2026",
  "history-79-result-2026",
  "history-80-application-2026",
  "toeic-577-special-application-2026",
  "jlpt-second-application-2026",
  "realtor-37-vacancy-2026",
  "local-government-7grade-2026"
] as const;

export const selectedExamGuideSlugs = [
  "exam-application-order",
  "score-deadline-backplanning",
  "dataq-payment-two-hours",
  "vacancy-additional-application",
  "id-card-rule-check",
  "exam-site-change-window",
  "refund-cutoff-comparison",
  "qualification-document-review",
  "same-day-exam-conflict",
  "official-notice-change-log"
] as const;

export function applyExamItemEditorial(item: InfoItem): InfoItem {
  return item;
}

export function applyExamGuideEditorial(guide: Guide): Guide {
  return guide;
}
