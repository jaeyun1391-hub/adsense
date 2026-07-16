import { redirect } from "next/navigation";

export const metadata = {
  title: "운영자 로그인",
  robots: { index: false, follow: false }
};

export default function RootPage() {
  redirect("/ops/login");
}
