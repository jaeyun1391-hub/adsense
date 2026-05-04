# Vercel Deployment

## 1. Import Project

1. Open https://vercel.com/new
2. Import `jaeyun1391-hub/adsense`
3. Keep the framework preset as `Next.js`
4. Use the default install and build settings:
   - Install command: `pnpm install`
   - Build command: `pnpm build`
   - Output directory: leave empty
5. Click `Deploy`

## 2. Add Domains

Add these domains to the same Vercel project:

- `licensemoa.co.kr`
- `conferenceinfo.co.kr`
- `money1000.co.kr`
- `business100.co.kr`
- `publicguide.co.kr`

Also add the `www` version if Vercel asks you to configure it:

- `www.licensemoa.co.kr`
- `www.conferenceinfo.co.kr`
- `www.money1000.co.kr`
- `www.business100.co.kr`
- `www.publicguide.co.kr`

## 3. DNS

At the domain registrar, follow Vercel's DNS instructions. Usually:

- Apex domain: `A` record to Vercel's IP
- `www`: `CNAME` record to Vercel's target

Use the exact values shown in Vercel because they can vary by account and project.

## 4. Verify

After DNS propagation, check:

- `https://licensemoa.co.kr`
- `https://licensemoa.co.kr/sitemap.xml`
- `https://licensemoa.co.kr/robots.txt`

Repeat for each domain. Each domain's sitemap should contain only that domain's URLs.

## 5. Search Console and AdSense

1. Add each domain to Google Search Console.
2. Submit `/sitemap.xml` for each domain.
3. Wait for indexing.
4. Add each site in AdSense after pages are crawled.
