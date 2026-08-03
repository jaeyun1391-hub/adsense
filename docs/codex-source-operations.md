# 공식 원문 검토 기록 기준

## 목적

이 문서는 다섯 사이트에서 어떤 공식 원문을 우선 확인하는지와, 검토한 사실을 공개 기록에 반영하는 기준을 정리한다. 공개 사이트는 실시간 상태를 보장하지 않으며, 각 글의 원문 링크와 마지막 검토일을 함께 표시한다.

## 편집 전 확인 순서

1. 공식 기관·운영기관·주최자·접수처의 원문만 근거로 사용한다. 검색 결과, 블로그, 커뮤니티, 재게시 기사, 제휴 페이지는 단독 근거로 쓰지 않는다.
2. 제목, 원문 URL, 적용 기간 또는 마감, 지역 또는 대상 범위, 제외 조건, 확인 시각을 직접 대조한다.
3. 원문에 없는 해석이나 결과 보장 문구를 제목·요약에 넣지 않는다. 조건이 불명확하면 공개하지 않는다.
4. 기존 원문이 바뀌면 같은 내용을 새 글로 복제하지 않고, 기존 글의 확인일·출처·설명을 수정한다.
5. 실제 검토 후 변경된 내용만 `data/operations.json`에 기록한다. 검토하지 않은 날짜나 횟수를 기록으로 만들지 않는다.

## 공개 기준

- `sourceId`는 아래 등록 원천 중 하나여야 한다.
- `sourceUrl`의 호스트는 해당 기관의 공식 도메인이어야 한다.
- 제목, 요약, 카테고리, 지역 또는 대상 범위, 기간, 출처명, 원문 URL, 갱신일, 확인일, 태그, 세부 항목이 모두 있어야 한다.
- 지원 가능성, 대출 승인, 합격, 예약 확정처럼 결과를 보장하는 문장을 쓰지 않는다.
- 원문과 내용이 달라졌거나 기간이 끝난 항목은 최신 목록에서 제외하거나 수정 이력을 남긴다.

## 등록 원천

| sourceId | 사이트 | 공식 원천 |
| --- | --- | --- |
| qnet-schedule | licensemoa.co.kr | Q-Net |
| visitkorea-events | conferenceinfo.co.kr | 한국관광공사 VisitKorea |
| myhome-youth | money1000.co.kr | 마이홈 |
| lh-notices | money1000.co.kr | LH 청약플러스 |
| bizinfo-support | business100.co.kr | 기업마당 |
| facility-reservations | publicguide.co.kr | 공공데이터포털 |

## 기록 원칙

- `collectionRuns`에는 실제 원문을 검토한 실행만 남긴다. 빈 로그로 운영 이력을 꾸미지 않는다.
- `applicationRuns`에는 애드센스 관리 화면에서 사람이 확인한 상태만 기록한다. 신청이나 계정 작업은 자동으로 처리하지 않는다.
- `updatedAt`은 운영 파일을 실제로 바꾼 시각이다. 단순 배포 시각으로 바꾸지 않는다.
- 이 파일과 운영 데이터에는 개인정보, API 키, 로그인 정보, 원문 전체 복사본을 넣지 않는다.

## 기록 예시

~~~json
{
  "id": "visitkorea-events-20260716-example",
  "siteSlug": "events",
  "sourceId": "visitkorea-events",
  "slug": "official-event-example",
  "title": "공식 공지에 나온 행사명",
  "summary": "공식 공지에서 확인한 일정과 방문 전 확인할 상태만 요약합니다.",
  "category": "지역 축제",
  "region": "서울",
  "period": "2026-07-18 ~ 2026-07-20",
  "sourceName": "한국관광공사 행사 정보",
  "sourceUrl": "https://korean.visitkorea.or.kr/",
  "status": "published",
  "updatedAt": "2026-07-16T01:00:00.000Z",
  "lastCheckedAt": "2026-07-16T01:00:00.000Z",
  "expiresAt": "2026-07-20T23:59:59.000Z",
  "tags": ["서울", "지역 축제"],
  "details": {
    "공식 원문": "https://korean.visitkorea.or.kr/",
    "확인 범위": "일정과 방문 상태"
  }
}
~~~
