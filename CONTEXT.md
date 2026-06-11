# AWSOME-CV — contexto para agentes

## Agentes
- **Cursor**: `.cursor/rules/` + skill `/bootstrap`
- **Claude Code**: `CLAUDE.md` (raiz) → @CONTEXT.md + skill `/bootstrap`
- **Partilhado**: este ficheiro, `graphify-out/`, `rtk`

## Estrutura
| Path | Stack | Notas |
|------|-------|-------|
| `src/data/cv.{en,pt-pt,pt-br}.json` | JSON | Conteúdo do CV por idioma (fonte de verdade) |
| `src/data/ui.{locale}.json` | JSON | Strings da UI (flags, botões, meta) |
| `src/components/` | Astro | Hero, Experience, Certs, TopBar, etc. |
| `src/pages/{en,pt-pt,pt-br}/` | Astro | Rotas por locale; `/` redireciona por `Accept-Language` |
| `src/styles/global.css` | CSS | Temas classic + terminal |
| `src/styles/print.css` | CSS | Layout A4 ATS-friendly para PDF |
| `scripts/generate-pdf.mjs` | Node + Puppeteer | Gera `dist/pdf/renato-ruis-cv-{locale}.pdf` no build |
| `dist/` | estático | Output do build; deploy para Cloudflare Pages |

## Arranque local
```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # site + PDFs em dist/
npm run preview      # preview do build
npm run deploy       # build + wrangler pages deploy
```

## Onde procurar
| Tarefa | Ficheiro(s) |
|--------|-------------|
| Editar texto do CV | `src/data/cv.*.json` |
| Editar UI / bandeiras / botões | `src/data/ui.*.json` |
| Layout / SEO / hreflang | `src/layouts/Layout.astro` |
| Toggle terminal / lang switch | `src/components/TopBar.astro` |
| Hero + apelido Tim DevOps | `src/components/Hero.astro` |
| Estilos e easter-egg terminal | `src/styles/global.css` |
| PDF print layout | `src/styles/print.css` |
| Deploy Cloudflare | `package.json` script `deploy`, projeto `renato-cv` |

## Engagement
- Commits/PRs: só quando pedido
- Push main: nunca sem aprovação
- Secrets: nunca commitar .env; PDFs pessoais antigos ignorados no `.gitignore`
- Site live: https://cv.timdevops.com.br · repo: https://github.com/renatoruis/awsome-cv

## Graphify / RTK
- `graphify-out/graph.json` — **MISSING** (não construir automaticamente)
- RTK: prefixar comandos shell com `rtk`; responder em PT, conciso
