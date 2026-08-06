import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { sites } from "@/lib/sites";
import "./globals.css";
import "./experience.css";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host")?.toLowerCase().split(":")[0].replace(/^www\./, "") ?? "";
  const site = sites.find((candidate) => candidate.domainHint === host);
  return {
    metadataBase: site ? new URL(`https://${site.domainHint}`) : undefined,
    title: { default: site?.name ?? "콜로지스터 정보 서비스", template: "%s" },
    description: site?.description ?? "공식 원문과 실제 이용 순서를 함께 정리하는 정보 서비스입니다.",
    other: { "google-adsense-account": "ca-pub-1619924526013992" }
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1619924526013992"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
