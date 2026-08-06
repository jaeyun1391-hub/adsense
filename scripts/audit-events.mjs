import fs from "node:fs";
import path from "node:path";
import ts from "../node_modules/typescript/lib/typescript.js";

const root = process.cwd();
const sourcePath = path.join(root, "lib", "events-content.ts");
const sourceText = fs.readFileSync(sourcePath, "utf8");
const source = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const operations = JSON.parse(fs.readFileSync(path.join(root, "data", "operations.json"), "utf8"));
const errors = [];

function fail(message) {
  errors.push(message);
}

function findArray(name) {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        return declaration.initializer.elements.map((element) => {
          if (ts.isCallExpression(element)) return element.arguments[0];
          return element;
        }).filter(ts.isObjectLiteralExpression);
      }
    }
  }
  return [];
}

function property(object, name) {
  return object.properties.find((entry) => ts.isPropertyAssignment(entry) && ((ts.isIdentifier(entry.name) && entry.name.text === name) || (ts.isStringLiteral(entry.name) && entry.name.text === name)))?.initializer;
}

function textValue(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : "";
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

const items = findArray("extraEventItems");
const guides = findArray("extraEventGuides");
if (items.length !== 12) fail(`행사 수가 12건이 아닙니다: ${items.length}`);
if (guides.length !== 10) fail(`가이드 수가 10건이 아닙니다: ${guides.length}`);

const itemSlugs = items.map((item) => textValue(property(item, "slug")));
const itemTitles = items.map((item) => textValue(property(item, "title")));
const sourceUrls = items.map((item) => textValue(property(item, "sourceUrl")));
unique(itemSlugs, "행사 slug");
unique(itemTitles, "행사 제목");
unique(sourceUrls, "행사 공식 URL");

const categories = new Map(["축제", "전시·예술", "체험·가족", "야간 행사", "무료 행사"].map((category) => [category, 0]));
const allBodies = [];

for (const item of items) {
  const slug = textValue(property(item, "slug"));
  const category = textValue(property(item, "category"));
  const body = strings(item, "body");
  const bodyText = body.join(" ");
  allBodies.push({ slug, body: bodyText });
  if (!slug || !textValue(property(item, "title")) || !textValue(property(item, "summary"))) fail(`${slug || "알 수 없는 행사"}: 기본 필드 누락`);
  if (bodyText.length < 1200) fail(`${slug}: 본문이 1,200자 미만입니다 (${bodyText.length}).`);
  if (body.filter((block) => block.startsWith("## ")).length < 5) fail(`${slug}: H2가 5개 미만입니다.`);
  if (arrayObjects(item, "sourceLinks").length < 1 || arrayObjects(item, "officialLinks").length < 1) fail(`${slug}: 직접 공식 링크가 없습니다.`);
  const sourceUrl = textValue(property(item, "sourceUrl"));
  try {
    const parsed = new URL(sourceUrl);
    if (parsed.pathname === "/" && !parsed.search) fail(`${slug}: 기관 첫 화면만 연결되어 있습니다.`);
  } catch {
    fail(`${slug}: 공식 URL 형식이 잘못됐습니다.`);
  }
  const schema = objectValue(item, "eventSchema");
  if (!schema) {
    fail(`${slug}: Event schema 자료가 없습니다.`);
  } else {
    for (const key of ["startDate", "locationName", "locationAddress", "organizerName"]) {
      if (!textValue(property(schema, key))) fail(`${slug}: Event schema ${key} 누락`);
    }
    const start = Date.parse(textValue(property(schema, "startDate")));
    const endValue = textValue(property(schema, "endDate"));
    const end = Date.parse(endValue || textValue(property(schema, "startDate")));
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) fail(`${slug}: Event schema 날짜가 잘못됐습니다.`);
  }
  if (!categories.has(category)) fail(`${slug}: 정의되지 않은 카테고리 ${category}`);
  else categories.set(category, (categories.get(category) ?? 0) + 1);
}

for (const [category, count] of categories) {
  if (count === 0) fail(`${category} 카테고리가 비어 있습니다.`);
}

const guideSlugs = guides.map((guide) => textValue(property(guide, "slug")));
const guideTitles = guides.map((guide) => textValue(property(guide, "title")));
unique(guideSlugs, "가이드 slug");
unique(guideTitles, "가이드 제목");

for (const guide of guides) {
  const slug = textValue(property(guide, "slug"));
  const body = strings(guide, "body");
  const bodyText = body.join(" ");
  allBodies.push({ slug, body: bodyText });
  if (bodyText.length < 750) fail(`${slug}: 가이드 본문이 750자 미만입니다 (${bodyText.length}).`);
  if (body.filter((block) => block.startsWith("## ")).length < 4) fail(`${slug}: 가이드 H2가 4개 미만입니다.`);
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
for (const [sentence, count] of sentenceCounts) {
  if (count >= 4) fail(`동일 문장이 ${count}회 반복됩니다: ${sentence.slice(0, 60)}`);
}

for (const phrase of ["Codex 정기", "6시간 주기", "검토 기준 데이터", "방문 전 일정, 장소"]) {
  if (sourceText.includes(phrase)) fail(`생성형 공통 문구가 남아 있습니다: ${phrase}`);
}

const records = operations.records.filter((record) => record.siteSlug === "events");
if (records.length !== 12) fail(`운영 저장소 행사 기록이 12건이 아닙니다: ${records.length}`);
unique(records.map((record) => record.slug), "운영 저장소 slug");
for (const record of records) {
  if (!record.startDate || !record.endDate || !record.sourceUrl || !record.lastCheckedAt) fail(`${record.slug}: 운영 저장소 필수 필드 누락`);
  if (!itemSlugs.includes(record.slug)) fail(`${record.slug}: 편집 콘텐츠와 운영 저장소가 연결되지 않습니다.`);
}
if (operations.revisions.filter((revision) => revision.recordId.startsWith("event-")).length < 12) fail("행사 수정 이력이 12건 미만입니다.");
if (operations.collectionRuns.filter((run) => run.siteSlug === "events" && run.state === "reviewed").length < 2) fail("검토 완료된 공식 출처 수집 기록이 2건 미만입니다.");

const routeSource = fs.readFileSync(path.join(root, "components", "SiteExperience.tsx"), "utf8");
if (routeSource.includes('"adsense-playbook"')) fail("승인 운영 문서가 공개 라우트 목록에 남아 있습니다.");
for (const selector of ["events-desk", "events-calendar-band", "events-category-links", "events-index-head"]) {
  if (!routeSource.includes(selector)) fail(`행사 전용 화면 구조가 없습니다: ${selector}`);
}

if (errors.length) {
  console.error(`행사 사이트 감사 실패 (${errors.length}건)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`행사 사이트 감사 통과: 행사 ${items.length}건, 가이드 ${guides.length}건, 운영 기록 ${records.length}건, 빈 카테고리 0개, 유사도 0.80 이상 0쌍`);
