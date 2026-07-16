import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "공식 원문 기반 정보 데스크";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const designs: Record<string, { name: string; eyebrow: string; color: string; paper: string; statement: string }> = {
  exam: { name: "시험일정센터", eyebrow: "EXAM OPERATIONS DESK", color: "#16243a", paper: "#f7f0df", statement: "접수부터 결과 발표까지\n한 흐름으로 점검" },
  events: { name: "전국행사노트", eyebrow: "WEEKEND FIELD NOTE", color: "#ce4817", paper: "#fff8f2", statement: "날짜·지역·우천·예매를\n먼저 읽는 행사 데스크" },
  housing: { name: "청년주거도움", eyebrow: "HOUSING DECISION DESK", color: "#0c6a5a", paper: "#f5fbf7", statement: "내 상황에 맞는\n주거지원 확인 순서" },
  business: { name: "사장님지원캘린더", eyebrow: "SUPPORT DESK", color: "#245bd4", paper: "#f5f8ff", statement: "공고 제목보다\n조건부터 살펴보기" },
  facilities: { name: "공공시설가이드", eyebrow: "PUBLIC FACILITY FINDER", color: "#087b72", paper: "#f2fbf9", statement: "예약·취소·요금·주차까지\n이용 동선으로 비교" }
};

export default async function OpenGraphImage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  const design = designs[site] ?? designs.business;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: design.paper, color: design.color, padding: "72px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", border: "3px solid " + design.color, padding: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25, letterSpacing: 2 }}><span>{design.eyebrow}</span><span>COLOJISTER</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}><div style={{ fontSize: 68, fontWeight: 800 }}>{design.name}</div><div style={{ whiteSpace: "pre-wrap", fontSize: 47, lineHeight: 1.26 }}>{design.statement}</div></div>
        <div style={{ display: "flex", fontSize: 23 }}>공식 원문 · 확인 순서 · 편집 기록</div>
      </div>
    </div>,
    size
  );
}
