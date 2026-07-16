import { headers } from "next/headers";

const icons: Record<string, { color: string; path: string }> = {
  "licensemoa.co.kr": { color: "#e87932", path: "M8 8h16v16H8zM11 12h10M11 16h7M11 20h9" },
  "conferenceinfo.co.kr": { color: "#cf4b18", path: "M7 10h18v15H7zM11 7v6M21 7v6M10 17h4M17 17h4M10 21h4" },
  "money1000.co.kr": { color: "#0d6b5b", path: "M7 15 16 7l9 8v10H7zM12 25v-6h8v6" },
  "business100.co.kr": { color: "#1f5fd9", path: "M7 11h18v14H7zM12 11V8h8v3M7 16h18M14 16v3h4v-3" },
  "publicguide.co.kr": { color: "#087b72", path: "M7 9h18v16H7zM11 9V6h10v3M11 14h10M11 19h6" }
};

export async function GET() {
  const host = ((await headers()).get("host") ?? "").toLowerCase().split(":")[0].replace(/^www\./, "");
  const icon = icons[host] ?? icons["business100.co.kr"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${icon.color}"/><path d="${icon.path}" fill="none" stroke="#fff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return new Response(svg, { headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=86400" } });
}
