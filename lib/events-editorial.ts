import type { Guide, InfoItem } from "@/lib/sites";

export const selectedEventItemSlugs = [
  "seoul-summer-beach-2026",
  "busan-sea-festival-2026",
  "seoul-garden-show-2026",
  "k-ballet-world-2026",
  "seoul-sculpture-festival-2026",
  "seoul-art-week-2026",
  "yeongdeungpo-beer-festival-2026",
  "seoul-walk-festival-2026",
  "busan-rock-festival-2026",
  "seoul-silvergrass-festival-2026",
  "busan-fireworks-festival-2026",
  "seoul-winter-festa-2026"
] as const;

export const selectedEventGuideSlugs = [
  "rainy-outdoor-event-decision",
  "free-event-real-cost",
  "advance-booking-vs-door-ticket",
  "festival-traffic-control-route",
  "family-event-waiting-plan",
  "night-event-return-home",
  "multi-venue-art-route",
  "festival-cancellation-notice",
  "summer-event-heat-safety",
  "official-event-page-reading"
] as const;

// Event copy is authored in events-content.ts. No shared paragraphs are appended here.
export function applyEventItemEditorial(item: InfoItem): InfoItem {
  return item;
}

export function applyEventGuideEditorial(guide: Guide): Guide {
  return guide;
}
