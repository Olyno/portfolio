# olyno.dev — The Universe Portfolio

Portfolio of [Olyno](https://github.com/Olyno): idea starter, open-source enthusiast and full-stack
developer. One continuous WebGL flight driven by scroll — built with SvelteKit 2, Svelte 5 (runes),
three.js, GSAP-grade hand-rolled motion, Lenis smooth scroll, Paraglide i18n and Tailwind.

## What makes it tick

- **`src/lib/three/universe.ts`** — the whole site is one camera path through a 3D scene:
  starfield (custom shaders with distance-fade) → repo constellation (instanced orbs sized by ⭐,
  hover with raycasting + live tooltips) → contribution terrain (365 real GitHub days as 3D bars,
  hover for exact counts) → contact vortex with brass ring. Section anchors remap scroll position to
  path position via keyframes, so DOM and camera stay in lockstep.
- **`src/lib/github.ts`** — baked snapshot ships in the bundle (instant paint, works offline), then
  revalidates live against the GitHub REST API.
- **`messages/*.json` + Paraglide** — EN/FR; the switch re-keys the UI (`{#key localeVersion}`),
  cookie-persisted, no reload.
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
