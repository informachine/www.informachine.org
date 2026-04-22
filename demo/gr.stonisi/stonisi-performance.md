# stonisi.gr — Performance architecture

**"Blazing fast. No exceptions."**
Targets and tactics for the PayloadCMS + Azure build.

---

## 1. Targets (mobile-first, real users)

Core Web Vitals budgets, measured on real user 4G, 75th percentile:

| Metric | Budget | Note |
|---|---|---|
| Largest Contentful Paint (LCP) | ≤ 2.0 s | Hero headline text, not the image. |
| Interaction to Next Paint (INP) | ≤ 150 ms | All interactive controls, including the hero slider. |
| Cumulative Layout Shift (CLS) | ≤ 0.02 | Every image and ad slot has reserved geometry. |
| Total page weight (article, above the fold) | ≤ 180 KB gzipped | Target; 250 KB is the hard budget. |
| Time to Interactive | ≤ 3.0 s on 4G mid-tier mobile | — |
| JavaScript budget | ≤ 40 KB gzipped of first-party JS | Third-party ad/consent scripts measured separately. |

Monitoring: real-user data via `web-vitals` library pushed to Umami or a lightweight RUM endpoint. Do not rely on lab scores alone.

---

## 2. Font strategy

- **Two families, one request.** Source Serif 4 and Source Sans 3, loaded together via the Google Fonts `css2` endpoint with `display=swap` and `subset=greek,greek-ext` — the subset parameter strips Latin-extended, Cyrillic, and Vietnamese from the payload.
- **Self-host in production.** Fetch the WOFF2 files once, serve from the same origin under a `/assets/fonts/` path with `Cache-Control: public, max-age=31536000, immutable`. Removes the third-party handshake and cookie-trip.
- **Preload the critical weights only.** `<link rel="preload" as="font" type="font/woff2" crossorigin>` for Source Serif 4 400 and 600, and Source Sans 3 500 and 700 — four files total, subset to Greek.
- **Variable fonts where worth it.** Source Serif 4 and Source Sans 3 both ship as variable; variable is smaller than multiple static weights once three or more weights are used.
- **`font-display: swap` on every face.** Never block first paint waiting for a font.

**Budget:** ≤ 90 KB total for fonts, Greek subset, four weights.

---

## 3. Image pipeline

- **Format:** AVIF primary, WebP fallback, JPEG as the final fallback for very old clients. `<picture>` with three `<source>` elements.
- **Sizes and `srcset`:** every image declares at least four widths (480, 768, 1024, 1600). The CMS generates them at upload time (Payload media hooks) and stores them on Azure Blob behind the CDN.
- **Intrinsic dimensions:** `width` and `height` attributes on every `<img>` so aspect ratio reserves layout space. Eliminates image-CLS.
- **Lazy by default except the hero:** `loading="lazy" decoding="async"` on every image below the fold. The hero gets `fetchpriority="high"` and is not lazy.
- **Hero video:** `<video>` with `preload="metadata"`, `playsinline`, `muted`, `autoplay`, `loop`, and a `poster` JPEG that's loaded instantly. The video file itself is a 720p AV1/H.264, ≤ 3 seconds, ≤ 600 KB. Under `prefers-reduced-motion: reduce`, the video is replaced by the poster (CSS hides the video element).
- **CDN:** Azure Front Door with image transformations at the edge. Cache responses for 30 days, purge on publish.

**Budget:** above-the-fold image LCP ≤ 120 KB.

---

## 4. CSS delivery

- **Single bundled stylesheet,** ≤ 18 KB gzipped. Currently `stonisi.css` is ~8 KB gzipped and covers every template.
- **Critical CSS inlined** in the document `<head>` for first paint: masthead, hero, above-the-fold card styles. Target: ≤ 6 KB inline. The remainder loads with `<link rel="stylesheet">` (non-blocking once the critical pass has painted).
- **No CSS-in-JS** and no build-time utility frameworks that ship large base sheets. CSS custom properties do the design-token work.
- **No `@import` in production CSS** — it's an extra round-trip.

---

## 5. JavaScript delivery

- **First-party JS:** `stonisi.js` is small and hand-written. Covers the mobile menu, hero slider, TTS, and reading-focus mode. Served with `defer` — never `async` on this file, because `defer` preserves document order and executes after parsing.
- **Third-party JS:** deferred after first paint. Consent platform loaded last. Analytics (Umami or GA) loaded after user-interaction or after the `load` event.
- **No bundler footprint in the critical path.** If a bundler is introduced later (Vite/Turbopack for a Payload front-end), ensure tree-shaking is real and that the article page loads the article chunk only.
- **Web Speech API for TTS.** No library needed; the browser provides it. If a fallback is wanted, prefer a small, open-source library like [speak-tts](https://www.npmjs.com/package/speak-tts) (~4 KB) or a pure ESM wrapper.

**Budget:** ≤ 40 KB first-party JS, gzipped.

---

## 6. Ad delivery (revenue-critical, performance-respected)

- **Reserved geometry.** Every slot has a fixed min-height per breakpoint — CSS enforces it. No CLS from ads.
- **Lazy by viewport.** Below-the-fold ads use `loading="lazy"` (iframes) or an IntersectionObserver to request the creative only when the slot is 200 px from entering the viewport.
- **Script isolation.** Ad scripts run in their own iframe (`<iframe sandbox>` where compatible) or use header bidding via Prebid's delayed mode. No ad script is in the critical render path.
- **Opacity dampened.** The prototype applies `opacity: 0.82` to ad containers with a `:hover` escalator to 1.0 — a gentle visual cue that respects reading without hiding the advertisement.
- **Consent-first.** No ad request fires before the consent signal; this is a GDPR hard line.

---

## 7. Caching and CDN

- **Static assets** (`/assets/*`): `Cache-Control: public, max-age=31536000, immutable`. Filenames are content-hashed.
- **HTML pages**: `Cache-Control: public, max-age=60, stale-while-revalidate=600, stale-if-error=86400`. Fast enough that a publish is visible within a minute; resilient if origin is down.
- **API responses from Payload**: short `max-age` with `stale-while-revalidate`. Cache at the edge.
- **Service worker (later phase):** an offline-first shell for articles already read. Not Phase 3, but the architecture allows it.

---

## 8. Third-party discipline

Every third-party script is a performance tax. Current allowlist and expected tax:

| Provider | Purpose | Budget |
|---|---|---|
| Consent platform | Required | ≤ 30 KB |
| Umami or GA | Analytics | ≤ 3 KB (Umami) / ≤ 18 KB (GA) |
| Ad exchange | Revenue | Deferred; out of critical path |
| Facebook/Instagram/X embeds | Editorial | Load on-demand (click-to-load) only |

Commitment: **no script** runs before the first visible paint unless it is the consent platform.

---

## 9. Azure-specific guidance

- **Azure Static Web Apps** or **Azure Front Door + Blob Storage** for the static artefacts. Static Web Apps includes global distribution and hosts the Payload admin UI easily.
- **PayloadCMS on App Service** or **Container Apps**, scaled to zero overnight if traffic supports it.
- **Azure CDN rules:** rewrite old URLs on redirect, set the cache headers above, enable Brotli compression (on by default at the edge).
- **Image transforms at the edge:** Azure Front Door rules + Image Processor, or a Cloudflare-style transform worker. Avoid runtime Node image processing; it's slow and a single point of failure.
- **Static pre-rendering:** generate category and popular article pages as static HTML at build/publish time. Only infrequent pages render at the edge.

---

## 10. What to measure, always

- Lighthouse in CI, mobile Moto G4 profile, as a regression guard — fail the build on >10% score degradation.
- Real-user LCP, INP and CLS per template, per device class.
- Time-to-first-ad-impression (so the commercial team can see performance and yield in the same dashboard).
- Bundle size per route (byte budget test runs in CI).

---

## 11. The single most important habit

Before any feature lands, ask two questions:

1. What does it cost in bytes?
2. What does it cost in time to paint?

If the answer to either is "I'm not sure", it is not ready to ship.
