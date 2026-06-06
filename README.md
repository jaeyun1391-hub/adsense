# adsense

## 소개

`adsense`는 Google AdSense 승인 준비를 위해 제작한 Next.js 기반 정보형 멀티사이트 프로젝트입니다.
하나의 코드베이스에서 여러 주제의 정보 사이트를 운영할 수 있도록 구성했으며, 각 사이트는 독립적인 주제와 탐색 구조, 상세 콘텐츠, 가이드 페이지, 정책 페이지를 제공합니다.

배포 주소: https://adsense-pi.vercel.app

## 운영 사이트

- `licensemoa.co.kr`: 시험일정센터
- `conferenceinfo.co.kr`: 전국행사노트
- `money1000.co.kr`: 청년주거도움
- `business100.co.kr`: 사장님지원캘린더
- `publicguide.co.kr`: 공공시설가이드

## 주요 기능

- Next.js 기반 멀티사이트 라우팅 구조
- 사이트별 주제, 브랜딩, 컬러, 내비게이션 설정
- 정보성 상세 페이지와 가이드 콘텐츠 제공
- 검색과 카테고리 탐색을 고려한 콘텐츠 구성
- 사이트별 canonical URL, sitemap, robots.txt 생성
- 개인정보처리방침, 이용약관, 문의, 출처 안내 페이지 제공
- AdSense 계정 확인을 위한 메타 태그 적용
- Vercel 배포 환경 지원

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Lucide React
- Vercel

## 사용 방법

1. 저장소를 클론합니다.

```bash
git clone https://github.com/jaeyun1391-hub/adsense.git
cd adsense
```

2. 패키지를 설치합니다.

```bash
pnpm install
```

3. 개발 서버를 실행합니다.

```bash
pnpm dev
```

4. 브라우저에서 로컬 주소를 확인합니다.

```text
http://localhost:3000
```

## 빌드 및 검사

```bash
pnpm build
pnpm lint
pnpm typecheck
```

## 프로젝트 구조

```text
app/          Next.js App Router 페이지
components/   공통 UI 컴포넌트
docs/         프로젝트 관련 문서
lib/          사이트 설정과 콘텐츠 데이터
proxy.ts      도메인별 요청 처리
```

## 라이선스

MIT License
