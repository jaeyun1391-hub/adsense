import fs from "node:fs";
import path from "node:path";
import ts from "../node_modules/typescript/lib/typescript.js";

const root = process.cwd();
const sourcePath = path.join(root, "lib", "exam-content.ts");
const sourceText = fs.readFileSync(sourcePath, "utf8");
const source = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const operations = JSON.parse(fs.readFileSync(path.join(root, "data", "operations.json"), "utf8"));
const errors = [];
const stringConstants = new Map();

for (const statement of source.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name) && declaration.initializer && (ts.isStringLiteral(declaration.initializer) || ts.isNoSubstitutionTemplateLiteral(declaration.initializer))) {
      stringConstants.set(declaration.name.text, declaration.initializer.text);
    }
  }
}

function fail(message) { errors.push(message); }

function findArray(name) {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        return declaration.initializer.elements.map((element) => ts.isCallExpression(element) ? element.arguments[0] : element).filter(ts.isObjectLiteralExpression);
      }
    }
  }
  return [];
}

function property(object, name) {
  return object.properties.find((entry) => ts.isPropertyAssignment(entry) && ((ts.isIdentifier(entry.name) && entry.name.text === name) || (ts.isStringLiteral(entry.name) && entry.name.text === name)))?.initializer;
}

function textValue(node) {
  if (!node) return "";
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node)) return stringConstants.get(node.text) ?? "";
  return "";
}

function strings(object, name) {
  const node = property(object, name);
  return node && ts.isArrayLiteralExpression(node) ? node.elements.map(textValue).filter(Boolean) : [];
}

function objectValue(object, name) {
  const node = property(object, name);
  return node && ts.isObjectLiteralExpression(node) ? node : undefined;
}

function arrayObjects(object, name) {
  const node = property(object, name);
  return node && ts.isArrayLiteralExpression(node) ? node.elements.filter(ts.isObjectLiteralExpression) : [];
}

function unique(values, label) {
  if (new Set(values).size !== values.length) fail(`${label} 중복이 있습니다.`);
}

function tokens(value) {
  return new Set(value.replace(/[\p{P}\p{S}]/gu, " ").split(/\s+/).filter((token) => token.length > 1));
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

const items = findArray("extraExamItems");
const guides = findArray("extraExamGuides");
if (items.length !== 12) fail(`시험 일정이 12건이 아닙니다: ${items.length}`);
if (guides.length !== 10) fail(`문제 해결 가이드가 10건이 아닙니다: ${guides.length}`);

const itemSlugs = items.map((item) => textValue(property(item, "slug")));
const itemTitles = items.map((item) => textValue(property(item, "title")));
const itemSummaries = items.map((item) => textValue(property(item, "summary")));
unique(itemSlugs, "일정 slug");
unique(itemTitles, "일정 제목");
unique(itemSummaries, "일정 설명");

const categories = new Map(["국가기술자격", "공인검정", "어학시험", "전문자격", "공공시험"].map((category) => [category, 0]));
const allBodies = [];

for (const item of items) {
  const slug = textValue(property(item, "slug"));
  const category = textValue(property(item, "category"));
  const body = strings(item, "body");
  const bodyText = body.join(" ");
  allBodies.push({ slug, body: bodyText });
  if (!slug || !textValue(property(item, "title")) || !textValue(property(item, "summary"))) fail(`${slug || "알 수 없는 일정"}: 기본 필드 누락`);
  if (bodyText.length < 1200) fail(`${slug}: 본문이 1,200자 미만입니다 (${bodyText.length}).`);
  if (body.filter((block) => block.startsWith("## ")).length < 5) fail(`${slug}: H2가 5개 미만입니다.`);
  if (arrayObjects(item, "officialLinks").length < 1) fail(`${slug}: 직접 공식 링크가 없습니다.`);
  const sourceUrl = textValue(property(item, "sourceUrl"));
  try {
    const parsed = new URL(sourceUrl);
    if (parsed.pathname === "/" && !parsed.search) fail(`${slug}: 기관 첫 화면만 연결되어 있습니다.`);
  } catch { fail(`${slug}: 공식 URL 형식이 잘못됐습니다.`); }
  const schema = objectValue(item, "examSchema");
  if (!schema) fail(`${slug}: Event 구조화 데이터 원본이 없습니다.`);
  else {
    for (const key of ["startDate", "locationName", "locationAddress", "organizerName"]) {
      if (!textValue(property(schema, key))) fail(`${slug}: examSchema ${key} 누락`);
    }
    if (!Number.isFinite(Date.parse(textValue(property(schema, "startDate"))))) fail(`${slug}: 시험 날짜 형식이 잘못됐습니다.`);
  }
  if (!categories.has(category)) fail(`${slug}: 정의되지 않은 카테고리 ${category}`);
  else categories.set(category, (categories.get(category) ?? 0) + 1);
}

for (const [category, count] of categories) if (count === 0) fail(`${category} 카테고리가 비어 있습니다.`);

const guideSlugs = guides.map((guide) => textValue(property(guide, "slug")));
const guideTitles = guides.map((guide) => textValue(property(guide, "title")));
const guideSummaries = guides.map((guide) => textValue(property(guide, "summary")));
unique(guideSlugs, "가이드 slug");
unique(guideTitles, "가이드 제목");
unique(guideSummaries, "가이드 설명");

for (const guide of guides) {
  const slug = textValue(property(guide, "slug"));
  const body = strings(guide, "body");
  const bodyText = body.join(" ");
  allBodies.push({ slug, body: bodyText });
  if (bodyText.length < 850) fail(`${slug}: 가이드 본문이 850자 미만입니다 (${bodyText.length}).`);
  if (body.filter((block) => block.startsWith("## ")).length < 5) fail(`${slug}: 가이드 H2가 5개 미만입니다.`);
  if (arrayObjects(guide, "sourceLinks").length < 1) fail(`${slug}: 가이드 공식 출처가 없습니다.`);
}

for (let i = 0; i < allBodies.length; i += 1) {
  for (let j = i + 1; j < allBodies.length; j += 1) {
    const score = similarity(allBodies[i].body, allBodies[j].body);
    if (score >= 0.8) fail(`${allBodies[i].slug} / ${allBodies[j].slug}: 본문 유사도 ${score.toFixed(2)}`);
  }
}

const sentences = allBodies.flatMap(({ body }) => body.split(/[.!?]\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length >= 45));
const sentenceCounts = new Map();
for (const sentence of sentences) sentenceCounts.set(sentence, (sentenceCounts.get(sentence) ?? 0) + 1);
for (const [sentence, count] of sentenceCounts) if (count >= 4) fail(`동일 문장이 ${count}회 반복됩니다: ${sentence.slice(0, 60)}`);

for (const phrase of ["Codex 정기", "6시간 주기", "검토 기준 데이터", "회차별 운영", "연 4~6회", "기관별 상시 공고", "공식 접수처에서 회차별 일정 확인", "2026-08-03"]) {
  if (sourceText.includes(phrase)) fail(`양산형·고정 문구가 남아 있습니다: ${phrase}`);
}

const records = operations.records.filter((record) => record.siteSlug === "exam");
if (records.length !== 12) fail(`운영 저장소 시험 기록이 12건이 아닙니다: ${records.length}`);
unique(records.map((record) => record.slug), "운영 저장소 slug");
for (const record of records) {
  if (!record.sourceUrl || !record.lastCheckedAt || !record.details?.["현재 상태"] || !record.details?.["다음 행동"]) fail(`${record.slug}: 운영 저장소 필수 필드 누락`);
  if (Date.parse(record.lastCheckedAt) > Date.now() + 300_000) fail(`${record.slug}: 미래 검토 시각이 기록되어 있습니다.`);
  if (!itemSlugs.includes(record.slug)) fail(`${record.slug}: 편집 콘텐츠와 운영 저장소가 연결되지 않습니다.`);
}
if (operations.revisions.filter((revision) => revision.recordId.startsWith("exam-")).length < 12) fail("시험 수정 이력이 12건 미만입니다.");
if (operations.collectionRuns.filter((run) => run.siteSlug === "exam" && run.state === "reviewed").length < 6) fail("검토 완료된 공식 출처 수집 기록이 6건 미만입니다.");
const applicationRun = operations.applicationRuns.find((run) => run.siteSlug === "exam" && run.status === "주의 필요");
if (!applicationRun) fail("실제 애드센스 반려 상태 기록이 없습니다.");
else if (!applicationRun.nextAction.includes("48시간")) fail("안정화 모드의 48시간 대기 절차가 기록되지 않았습니다.");

const viewSource = fs.readFileSync(path.join(root, "components", "SiteExperience.tsx"), "utf8");
for (const selector of ["exam-briefing", "exam-live-board", "exam-category-lead", "exam-guide-ledger", "exam-source-directory", "exam-record-detail", "exam-manual-grid"]) {
  if (!viewSource.includes(selector)) fail(`시험 사이트 전용 화면 구조가 없습니다: ${selector}`);
}
if (!viewSource.includes('site.slug === "exam" ? null')) fail("시험 운영 문서에 공용 문단이 다시 붙을 수 있습니다.");

if (errors.length) {
  console.error(`시험 사이트 감사 실패 (${errors.length}건)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`시험 사이트 감사 통과: 일정 ${items.length}건, 가이드 ${guides.length}건, 운영 기록 ${records.length}건, 빈 카테고리 0개, 유사도 0.80 이상 0쌍`);
