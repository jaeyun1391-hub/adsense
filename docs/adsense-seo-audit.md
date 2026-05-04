# AdSense SEO Audit

Audit date: 2026-05-04

## Official Criteria Used

Google AdSense readiness guidance emphasizes:

- Unique, original, relevant content
- Clear and easy-to-use navigation
- A complete, live site rather than a template or under-construction page
- Sufficient text content for users and ad crawlers
- Compliance with Google Publisher Policies

References:

- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/12169212
- https://support.google.com/adsense/answer/81904
- https://support.google.com/adsense/answer/48182

## Technical SEO Status

Status: Pass

- Site-specific titles and descriptions are implemented.
- Canonical URLs now point to the intended production domains.
- Open Graph metadata is implemented on main content pages.
- Search result pages are marked `noindex, follow`.
- `sitemap.xml` includes all five intended domains and no `example.com` URLs.
- `robots.txt` allows crawling and lists the five sitemap URLs.
- Article, FAQ, Breadcrumb, Website, and Organization structured data are present where useful.
- Privacy policy, terms, about, contact, and source pages are available for every site.
- Production build passes.

## AdSense Readiness Status

Status: Expanded MVP ready

The sites are structurally suitable for review and now include an expanded MVP content set. Each domain has enough route depth to avoid looking like a blank template, but real-world approval readiness still improves if the operator verifies every source and keeps the content fresh after deployment.

Current implementation:

- 30 substantial detail pages per site
- 10 original guide pages per site
- 53 sitemap URLs per domain
- About, sources, contact, privacy, and terms pages per site

Recommended before final application:

- Manually review all generated pages for factual freshness
- Replace sample operational emails with working inboxes
- Confirm every official source URL is still reachable
- Add more fully hand-edited pages to the first site submitted

Longer-term target:

- 50 substantial detail pages per site
- 15 to 20 original guide pages per site
- All detail pages should include source links, update dates, FAQ, and original interpretation
- Avoid publishing pages that only repeat official text

## Site-by-Site Notes

### 시험일정센터

Strong fit. Search intent is clear and evergreen. Expand with national certifications, language tests, public recruitment exams, and monthly schedule guides.

### 전국행사노트

Strong fit if data freshness is maintained. Expand by region and event type. Avoid publishing outdated event pages without clear year/date context.

### 청년주거도움

Strong fit but policy-sensitive. Every page should carry official source links and clear disclaimers because users may make financial or housing decisions.

### 사장님지원캘린더

Strong fit. Needs frequent updates because support programs close quickly. Mark expired pages clearly instead of deleting everything.

### 공공시설가이드

Good fit for local search. Expand with regional pages and facility-type guides. Add operating-hour update dates prominently.

## Before AdSense Submission

- Replace domain hints with purchased domains.
- Confirm the built-in AdSense account meta tag uses `ca-pub-1619924526013992`.
- Deploy each domain publicly with HTTPS.
- Submit each domain to Google Search Console.
- Submit sitemap for each domain.
- Wait until pages are indexed and receiving normal crawl activity.
- Apply for AdSense review only after content expansion is complete.
