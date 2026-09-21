# olyno.dev — Field Survey, No. 2017→∞

Portfolio of [Olyno](https://github.com/Olyno): idea starter, open-source enthusiast and full-stack
developer. An editorial "field survey" of an open-source life — numbered plates, live GitHub data,
print-shop typography — built with SvelteKit 2, Svelte 5 (runes), Lenis smooth scroll, Paraglide
i18n and Tailwind 4 (light + dark themes).

## What makes it tick

- **`src/components/`** — five plates: Hero (banner artwork + typewriter), About (spec-sheet),
  Projects (PatchBay flagship + 2026 field-log timeline + live repo archive), Activity (contribution
  heatmap), Contact (click-to-reveal email — the address never appears in static HTML).
- **`src/lib/github.ts`** — baked snapshot ships in the bundle (instant paint, works offline), then
  revalidates live against the GitHub REST API.
- **`src/lib/theme.ts` + `app.html` boot script** — light/dark with no flash-of-wrong-theme; choice
  persisted in `localStorage`.
- **`messages/*.json` + Paraglide** — EN/FR; the switch re-keys the UI (`{#key localeVersion}`),
  cookie-persisted, no reload.
- **⌘K command palette** — grouped navigation, curated links, and live repo search.
- **SEO** — SSR-prerendered real content, JSON-LD Person schema, OG/Twitter cards, `robots.txt`,
  `sitemap.xml`, PWA.

## Dev

```sh
pnpm install
pnpm dev        # vite dev + paraglide compile on save
pnpm build      # static adapter → build/
pnpm check      # svelte-check
pnpm test       # playwright
```

## Deploy

Push to `master` → GitHub Actions builds and publishes `build/` to `gh-pages` at
[olyno.dev](https://olyno.dev).
