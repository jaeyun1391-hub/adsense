"use client";

import Link from "next/link";
import { ArrowRight, FileText, Home, Landmark, ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";
import type { PublishedRecord } from "@/lib/operations";

type PathId = "rent" | "rental" | "deposit" | "documents";

const paths: Record<PathId, {
  label: string;
  icon: typeof ReceiptText;
  title: string;
  question: string;
  steps: string[];
  categories: string[];
}> = {
  rent: {
    label: "월세",
    icon: ReceiptText,
    title: "계약과 납부 기록부터 맞춰봅니다",
    question: "월세지원 공고를 보려는데 계약서와 이체 내역이 준비되어 있나요?",
    steps: ["계약서의 주소·기간·월세를 확인", "월별 이체 내역을 계약 내용과 비교", "가구·소득 기준과 기준일 확인", "현재 공고의 제출 방식 확인"],
    categories: ["월세지원"]
  },
  rental: {
    label: "임대주택",
    icon: Home,
    title: "공급 유형과 다음 발표를 함께 봅니다",
    question: "공고의 주택 유형과 서류제출 대상자 발표 일정을 분리해 보셨나요?",
    steps: ["모집 단위와 공급 지역 표시", "순위·소득·자산 표의 해당 행 확인", "신청 이후 발표·서류 일정 저장", "예비입주 안내를 별도 기록"],
    categories: ["임대주택"]
  },
  deposit: {
    label: "전세·보증금",
    icon: Landmark,
    title: "계약 전 상담에 필요한 사실을 적습니다",
    question: "계약일과 잔금일 전에 주택·보증금·예상 일정이 정리되어 있나요?",
    steps: ["후보 주택과 보증금 정보 정리", "계약·잔금·입주 예정일 구분", "은행·보증기관에 물을 질문 작성", "계약 특약과 법률 판단은 별도 확인"],
    categories: ["전세·보증금"]
  },
  documents: {
    label: "서류",
    icon: FileText,
    title: "공고별 발급 기준으로 다시 묶습니다",
    question: "등본·계약서·소득자료를 공고별 기준으로 나누어 두셨나요?",
    steps: ["발급일 제한과 표시 옵션 확인", "주소 관련 문서를 나란히 비교", "제출용 파일과 보관용 원본 분리", "접수번호와 제출 시각 저장"],
    categories: ["신청서류"]
  }
};

export function HousingPathFinder({ records }: { records: PublishedRecord[] }) {
  const [selected, setSelected] = useState<PathId>("rent");
  const path = paths[selected];
  const related = useMemo(
    () => records.filter((record) => path.categories.includes(record.category)).slice(0, 3),
    [path.categories, records]
  );
  const Icon = path.icon;

  return (
    <section className="housing-pathfinder" aria-label="주거지원 확인 경로">
      <div className="housing-path-tabs" role="tablist" aria-label="현재 확인할 문제">
        {(Object.keys(paths) as PathId[]).map((key) => {
          const item = paths[key];
          const ItemIcon = item.icon;
          return <button key={key} type="button" className={selected === key ? "is-active" : undefined} onClick={() => setSelected(key)}><ItemIcon size={17} />{item.label}</button>;
        })}
      </div>
      <div className="housing-path-panel">
        <header><span><Icon size={18} /> 현재 경로</span><h2>{path.title}</h2><p>{path.question}</p></header>
        <ol>{path.steps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span></li>)}</ol>
        <aside>
          <p>관련 기록</p>
          {related.map((record) => <Link key={record.id} href={`/items/${record.slug}`}><span>{record.category}</span>{record.title}<ArrowRight size={15} /></Link>)}
          {!related.length ? <span className="housing-path-empty">이 경로의 편집 기록을 준비하고 있습니다.</span> : null}
        </aside>
      </div>
    </section>
  );
}
