import type { Metadata } from "next";
import { OpsLoginForm } from "@/components/OpsLoginForm";

export const metadata: Metadata = { title: "운영자 로그인", robots: { index: false, follow: false } };

export default function OpsLoginPage() {
  return <main className="ops-login"><section><p>COLOJISTER</p><h1>운영 보드</h1><span>공개 사이트의 수집·신청 상태를 관리하는 비공개 화면입니다.</span><OpsLoginForm /></section></main>;
}
