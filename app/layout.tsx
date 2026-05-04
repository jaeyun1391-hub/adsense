import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdSense Info Network",
  description: "Five focused Korean information services built with Next.js.",
  other: {
    "google-adsense-account": "ca-pub-1619924526013992"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
