# AWSOME-CV

Multilingual CV landing page for [Renato Ruis](https://www.linkedin.com/in/renatoruis/) — Senior DevOps Engineer · Kubestronaut.

**Live:** [cv.timdevops.com.br](https://cv.timdevops.com.br)

## Features

- 3 languages: [English](https://cv.timdevops.com.br/en/), [Português (PT)](https://cv.timdevops.com.br/pt-pt/), [Português (BR)](https://cv.timdevops.com.br/pt-br/) — root redirects by browser language
- Two themes: **recruiter mode** (clean/classic) and **terminal mode** (kubectl-flavored)
- ATS-friendly PDF per locale, generated at build time from the same content (single source of truth)
- SEO: hreflang, OpenGraph, JSON-LD `Person`, sitemap

## Stack

- [Astro](https://astro.build) (static output)
- Puppeteer (PDF generation via `@media print` stylesheet)
- Cloudflare Pages (hosting + custom domain)

## Structure

- `src/data/cv.{en,pt-pt,pt-br}.json` — all CV content per locale
- `src/data/ui.{locale}.json` — UI strings
- `src/components/` — page sections (hero terminal, experience, certs, etc.)
- `src/styles/print.css` — A4 print layout used for the PDFs
- `scripts/generate-pdf.mjs` — renders `dist/pdf/renato-ruis-cv-{locale}.pdf`

## Develop

```bash
npm install
npm run dev          # local dev server
npm run build        # build site + generate PDFs into dist/
npm run preview      # preview the build
```

## Deploy

```bash
npm run deploy       # build + wrangler pages deploy dist --project-name renato-cv
```

Custom domain `cv.timdevops.com.br` is attached to the Cloudflare Pages project.
