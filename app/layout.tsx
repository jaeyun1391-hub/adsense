import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://licensemoa.co.kr"),
  title: {
    default: "콜로지스터 정보 데스크",
    template: "%s"
  },
  description: "공식 원문과 실제 이용 순서를 함께 정리하는 정보 서비스입니다.",
  other: { "google-adsense-account": "ca-pub-1619924526013992" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
