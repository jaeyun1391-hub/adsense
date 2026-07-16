# Codex 공식 정보 운영 방식

## 목적

이 프로젝트는 데이터베이스나 배포 서버의 쓰기 권한에 의존하지 않는다. 공식 정보의 검토 결과와 운영 이력은 data/operations.json에 버전 관리하며, Codex 정기 작업이 변경 사항을 커밋하고 배포한다. 따라서 공개 화면에는 마지막으로 배포된 검토 결과만 보인다.

## 한 번의 정기 작업 순서

1. data/operations.json과 이 문서를 읽고, 각 원천의 최근 수집 이력과 갱신 주기를 확인한다.
2. 공식 원천 페이지 또는 공개 API만 확인한다. 검색 결과, 블로그, 커뮤니티, 재게시 기사, 제휴 페이지는 원천으로 사용하지 않는다.
3. 새 항목 또는 변경 항목은 원문 URL, 제목, 적용 기간 또는 마감, 지역 또는 대상 범위, 확인 시각을 대조한다.
4. 아래 공개 기준을 모두 만족하는 항목만 records에 published 상태로 추가 또는 수정한다.
5. 수집을 했지만 공개할 항목이 없으면 해당 원천의 하루 첫 점검에만 collectionRuns의 reviewed 또는 skipped 로그를 남긴다. 오류는 failed로 기록하고 기존 공개 항목을 지우지 않는다.
6. 만료일이 지난 항목은 stale로 변경하고 revisions에 이유와 이전 스냅샷을 남긴다.
7. 새 항목, 공식 변경, 만료 처리, 오류, 하루 첫 점검 로그처럼 운영 파일이 실제로 바뀔 때만 타입 검사, 린트, 빌드를 실행한 뒤 커밋하고 main에 푸시한다. 변경이 없으면 커밋하지 않는다.

## 공개 기준

- sourceId는 아래 등록 원천 중 하나여야 한다.
- sourceUrl의 호스트는 해당 원천의 공식 도메인이어야 한다.
- 제목, 요약, 카테고리, 지역 또는 대상 범위, 기간, 출처명, 원문 URL, 갱신일, 확인일, 태그, 세부 항목이 모두 있어야 한다.
- 지원 가능성, 대출 승인, 합격, 예약 확정처럼 결과를 보장하는 문장을 쓰지 않는다.
- 원문에 없는 해석을 제목이나 요약에 넣지 않는다. 조건이 불명확하면 공개하지 않고 다음 점검 후보로 남긴다.
- 같은 항목의 원문이 바뀌면 새 글을 복제하지 않고 기존 항목을 수정하며 revisions에 이력을 남긴다.

## 등록 원천

| sourceId | 사이트 | 공식 원천 | 기본 점검 주기 |
| --- | --- | --- | --- |
| qnet-schedule | licensemoa.co.kr | Q-Net | 12시간 |
| visitkorea-events | conferenceinfo.co.kr | 한국관광공사 VisitKorea | 3시간 |
| myhome-youth | money1000.co.kr | 마이홈 | 6시간 |
| lh-notices | money1000.co.kr | LH 청약플러스 | 6시간 |
| bizinfo-support | business100.co.kr | 기업마당 | 3시간 |
| facility-reservations | publicguide.co.kr | 공공데이터포털 | 6시간 |

## 운영 이력 규칙

- collectionRuns에는 공식 원문을 실제로 확인한 실행만 기록한다.
- applicationRuns는 애드센스 관리 화면에서 사람이 확인한 상태만 기록한다. Codex는 신청이나 계정 작업을 자동으로 실행하지 않는다.
- updatedAt은 운영 파일을 실제로 바꾼 시각이다. 단순 배포 시각으로 바꾸지 않는다.
- 이 파일은 공개 사이트의 정보 원천이므로 개인정보, API 키, 로그인 정보, 원문 전체 복사본을 넣지 않는다.

## 데이터 예시

~~~
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
