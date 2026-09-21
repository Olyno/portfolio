# Lessons

## 2026-09-21 — portfolio rebuild

- **i18n default is Paraglide**, not typesafe-i18n, for all new work (reference setup:
  `kimi-code-improved/patchbay/patchbay-ee` — `project.inlang/settings.json` copied verbatim,
  flat-key `messages/{en,fr}.json`, `@inlang/paraglide-js` vite plugin, generated `src/lib/paraglide`
  is gitignored and excluded from svelte-check).
- **Custom domain reality**: `olyno.dev` is fronted by a **Vercel project** (x-vercel-cache header).
  The GH Actions workflow only publishes `gh-pages`. After pushing, `gh-pages` is new but the live
  domain served a 16-day-old cache — a Vercel redeploy/cache-refresh is required from Olyno's
  Vercel dashboard (no CLI/token available in this environment).
- **Tailwind is pinned to 3.3**: `min-h-14`, `min-h-44`, `min-w-56` (3.4 spacing-scale names) silently
  emit no CSS. Use arbitrary values (`min-h-[3.5rem]`) or bump Tailwind to 3.4+.
- **Svelte 5 runes**: never name a local `state` (collides with the `$state` rune → "Cannot use
  'state' as a store" / TDZ errors). Message catalogs `m.*()` are non-reactive reads — key the UI on
  a `localeVersion` store (`{#key}`) for live language switching without reload.
- **three.js additive point systems need a distance-fade in the vertex shader**
  (`smoothstep(near,far,-mv.z)` + hard `gl_PointSize` cap), otherwise points balloon into white
  balls as the camera flies through them. Sprites (nebulae) can't be capped per-screen — removed.
- **Headless browser QA trap**: a running `vite preview` serves a snapshot of `build/` — after
  rebuilds, **restart the preview server** and unregister the PWA service worker before trusting
  screenshots; stale bundles caused an entire false-positive bug hunt.
- **`edit` tool**: anchored edits need a fresh `read` of the exact region; tags from earlier in a
  long session silently corrupt files (happened 4×). Full `write` rewrites are safer for components
  that changed repeatedly.
- **Feedback round 2 (2026-09-21):** Olyno rejected the 3D background as "too abstract for a
  portfolio" and the hero/nav had a contrast failure in BOTH themes. Lesson: art direction beats
  tech flex — the WebGL Survey was deleted entirely (`Stage.svelte`, `universe.ts`, `three` dep);
  the site now reads as pure editorial print-survey (banner art + solid nav band + heavier veil).
  Nav band: always near-solid `var(--plate)` gradient, never transparent over art. Hero veil:
  plate-color bottom ramp reaching ~plate at 0-16% + left horizontal scrim 62%→28%→transparent;
  text blocks must sit on ≥80% plate coverage.
- **Official brand marks**: don't hand-draw approximations of logos (the X path was "not the
  official one"). Extract the provided raster (flatten white → threshold → trim → 8-bit alpha) and
  render via CSS `mask-image` + `bg-current` — theme-tinted, crisp, exact.
- **`vite preview` snapshots `build/` at start** — every rebuild mid-QA serves 404s for new hashed
  chunks while old pages keep working; looked like a hydration bug three times. Restart it with
  every verification round.
- **Feedback round 3 (2026-09-21):** "text too far left" had a hidden root cause — `max-w-shell`
  was used in 7 components but NEVER defined (Tailwind v4 unknown utility → silently no CSS → full
  bleed). Define it via `@theme { --container-shell: 78rem; }`. Theme separation: dark plate pushed
  to #07090d vs light #f6efdf. Avatar: a design must *compose* the portrait (220px framed plate +
  caption), not staple a 72px ring to a corner. Brand icons: ship the official artwork as real
  `<img>` pairs (black/white), not span/mask approximations, until asked otherwise.
