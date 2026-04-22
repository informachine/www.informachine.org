# stonisi.gr — Design tokens & moodboard

**Phase 2 of 5.** Prepared for Ilia Giannakakis. April 2026.

The companion [style guide](./stonisi-style-guide.html) renders every token below in the browser with real Greek editorial content.

---

## 1. Direction

Navy-led, white-bodied, typographically restrained. The brand mark's deep navy (taken from the horizontal ΣΤΟΝΗΣΙ wordmark) anchors the palette; the rest of the system is built to defer to it. The reference for craft is Kathimerini — serious, calm, dense but never shouty — but stonisi.gr's voice is its own: regional, unhurried, warmer under the surface than a national broadsheet would be.

Typography does the most work. The system uses two families — an editorial serif for headlines and long-form reading, and a matching sans for UI, metadata and captions — both chosen because they render monotonic Greek with confidence at every size the site asks of them.

---

## 2. Colour

### 2.1 Palette

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0A1A33` | Primary text; near-black navy, 17:1 on paper — AAA |
| `--ink-muted` | `#4A5668` | Secondary text, bylines, timestamps — 7.4:1, AAA |
| `--ink-quiet` | `#6E7887` | Tertiary text, captions — 4.8:1, AA |
| `--brand` | `#0F2A52` | Masthead, section labels, primary chrome |
| `--brand-link` | `#1F4788` | Default link colour — 8.3:1, AAA |
| `--brand-hover` | `#0F2A52` | Link hover / pressed |
| `--brand-tint` | `#E8EEF8` | Pale blue surfaces (section bands, cards) |
| `--brand-tint-2` | `#C9D6EC` | Hairline accents, dividers on tint |
| `--paper` | `#FFFFFF` | Body background |
| `--paper-warm` | `#FAFAFB` | Alternate band background |
| `--rule` | `#DCE2EA` | Default 1 px divider |
| `--rule-strong` | `#B6BFCD` | Emphasised rule, tabular borders |
| `--live` | `#C8102E` | Live / breaking indicator only — always paired with a dot icon and a visible label |
| `--success` | `#1F6B4A` | Confirmation (e.g. newsletter opt-in) |
| `--warn` | `#8C5A00` | Caution, moderation notices |

Red is the single non-blue accent. It exists exclusively for live-news signalling, where editorial convention outweighs palette purity. It is always accompanied by an icon and a label so that colour is never the sole carrier of meaning (WCAG 1.4.1).

### 2.2 Dark mode (planned)

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#FFFFFF` | `#0B1524` |
| `--ink` | `#0A1A33` | `#EAEFF7` |
| `--brand-link` | `#1F4788` | `#8FB4E8` |
| `--rule` | `#DCE2EA` | `#22314A` |

Dark mode is a first-class target, not an inverted post-hoc pass. Phase 3 will bring it into the prototype.

### 2.3 Contrast summary

Every text/background pair in the system is tested for WCAG 2.1 AA. The table below captures the critical pairings.

| Foreground | Background | Ratio | Grade |
|---|---|---|---|
| `--ink` | `--paper` | 17.1 | AAA |
| `--ink-muted` | `--paper` | 7.4 | AAA |
| `--ink-quiet` | `--paper` | 4.8 | AA |
| `--brand-link` | `--paper` | 8.3 | AAA |
| `--brand-link` | `--brand-tint` | 7.4 | AAA |
| `--paper` | `--brand` | 14.9 | AAA |
| `--live` | `--paper` | 5.9 | AA |

---

## 3. Typography

### 3.1 Families

**Primary (editorial serif).** `"Source Serif 4", "Noto Serif", Georgia, serif`

Adobe's open-source Source Serif 4. Comprehensive monotonic Greek, calm modern proportions, optical sizes that hold up from 14 px metadata to a 72 px hero. It sits in the same family of editorial serifs as Copernicus (Anthropic's native face) and Tiempos — inherited warmth, restrained contrast, no "look at me" flourish.

**Secondary (UI sans).** `"Source Sans 3", "Noto Sans", -apple-system, Segoe UI, sans-serif`

The sibling to Source Serif 4, designed to pair with it at every weight. Used for navigation, section chips, timestamps, captions, form controls, buttons, ad labels — anywhere the serif would feel like ornament.

**Tabular (numerics only).** `"Source Sans 3"` with `font-variant-numeric: tabular-nums` on scores, election tables, financial data.

**Considered alternative pairing.** Literata (serif) + Commissioner (sans) — slightly more personality, both Google Fonts with excellent Greek. Kept on the bench as a change I'd propose only if Phase 3 reveals Source Serif reads too neutrally in hero placements.

### 3.2 Weights used

- Serif: 400 regular, 600 semibold, 700 bold — used sparingly.
- Sans: 400 regular, 500 medium, 600 semibold — "bold" is reserved for live/breaking markers.

### 3.3 Type scale

Mobile-first, 17 px base, 1.25 modular scale. Desktop scales up on the hero and lead sizes only; body stays constant across breakpoints because body legibility does not benefit from growing with the viewport.

| Token | Mobile (px / rem) | Desktop (px / rem) | Role |
|---|---|---|---|
| `--fs-micro` | 12 / 0.75 | 12 / 0.75 | Legal, ad labels |
| `--fs-meta` | 13 / 0.8125 | 13 / 0.8125 | Timestamps, bylines |
| `--fs-caption` | 14 / 0.875 | 15 / 0.9375 | Image captions |
| `--fs-body` | 17 / 1.0625 | 18 / 1.125 | Body copy |
| `--fs-standfirst` | 19 / 1.1875 | 21 / 1.3125 | Article standfirst |
| `--fs-h4` | 20 / 1.25 | 22 / 1.375 | Card headlines, section sub-heads |
| `--fs-h3` | 24 / 1.5 | 28 / 1.75 | Section heads in article |
| `--fs-h2` | 30 / 1.875 | 36 / 2.25 | Secondary hero |
| `--fs-h1` | 38 / 2.375 | 48 / 3 | Article headline |
| `--fs-display` | 44 / 2.75 | 64 / 4 | Home hero only |

### 3.4 Line height and measure

- **Body reading:** `line-height: 1.6` — Greek glyphs carry taller accents than Latin and reward the extra leading.
- **Headlines:** `line-height: 1.15`.
- **Measure:** 62–72 characters per line on long-form body; enforced via `max-width` on the article column.

### 3.5 Language attributes

```html
<html lang="el">
```

Quoted material in other languages is wrapped with an explicit `lang` attribute so screen readers switch pronunciation. Dates and numbers are rendered with the `Intl.DateTimeFormat('el-GR')` formatter.

---

## 4. Spacing

A 4 px atomic step, doubling and widening on a modular rhythm. Use tokens, never arbitrary values.

| Token | Value | Use |
|---|---|---|
| `--sp-0` | 0 | Resets |
| `--sp-1` | 4 px | Hairline separations |
| `--sp-2` | 8 px | Chip padding, form inner |
| `--sp-3` | 12 px | Card inner tight |
| `--sp-4` | 16 px | Default card padding, mobile gutters |
| `--sp-5` | 24 px | Block gaps, paragraph separation |
| `--sp-6` | 32 px | Section spacing inside a page |
| `--sp-7` | 48 px | Major region spacing |
| `--sp-8` | 64 px | Hero top/bottom |
| `--sp-9` | 96 px | Rare — landing-page breathers |
| `--sp-10` | 128 px | Editorial pause between sections |

---

## 5. Radius and elevation

### 5.1 Radius

| Token | Value | Use |
|---|---|---|
| `--r-xs` | 2 px | Inputs, chips on dense surfaces |
| `--r-sm` | 4 px | Buttons, section labels |
| `--r-md` | 6 px | Cards |
| `--r-lg` | 10 px | Modals, sheets |
| `--r-pill` | 9999 px | Live indicator, tag pills |

Radius is kept small throughout. Large radii read as consumer-app playfulness; stonisi.gr is a newspaper.

### 5.2 Shadow / elevation

Shadows are reserved for overlays (modals, menus, toasts). Cards and article surfaces rely on rules and tint bands, not shadows — this is a typographic site, not a material one.

| Token | Value | Use |
|---|---|---|
| `--sh-sm` | `0 1px 2px rgba(10,26,51,.06)` | Sticky masthead |
| `--sh-md` | `0 4px 12px rgba(10,26,51,.08)` | Menu dropdown |
| `--sh-lg` | `0 12px 32px rgba(10,26,51,.14)` | Modal, offcanvas |

---

## 6. Motion

All motion respects `prefers-reduced-motion: reduce` — when set, durations collapse to zero and easings default to linear.

| Token | Value |
|---|---|
| `--dur-instant` | 80 ms |
| `--dur-fast` | 160 ms |
| `--dur-base` | 240 ms |
| `--dur-slow` | 400 ms |
| `--ease-standard` | `cubic-bezier(.2, 0, 0, 1)` |
| `--ease-emphasised` | `cubic-bezier(.3, 0, 0, 1)` |

No decorative scroll animations. Transitions are reserved for hover/focus state changes, menu reveal, and live-blog update insertion.

---

## 7. Layout and breakpoints

| Breakpoint | Min width | Columns | Gutter |
|---|---|---|---|
| `sm` | 0 | 1 | 16 px |
| `md` | 768 px | 8 | 20 px |
| `lg` | 1024 px | 12 | 24 px |
| `xl` | 1280 px | 12 | 24 px |
| `xxl` | 1536 px | 12 | 24 px |

- **Article measure max:** 680 px.
- **Homepage content width max:** 1240 px.
- **Masthead full bleed** above 1536 px with content capped.

---

## 8. Core components (token sketch)

Phase 3 will specify full props, states, and HTML for each. Phase 2 names them and says what tokens they consume.

### 8.1 Section chip (ΛΕΣΒΟΣ, ΚΟΙΝΩΝΙΑ, ΟΙΚΟΝΟΜΙΑ, ΑΘΛΗΤΙΣΜΟΣ, ΠΟΛΙΤΙΣΜΟΣ, ΑΠΟΨΕΙΣ)

- Font: sans 600, letterspacing +0.04 em, uppercase (Greek uppercase as set in the source).
- Size: 13 / 0.8125 rem.
- Padding: `--sp-2` vertical, `--sp-3` horizontal.
- Radius: `--r-sm`.
- Variants: *solid* (navy on paper), *outline* (brand border on paper), *inverse* (paper on navy).

### 8.2 Article card

- Headline: serif 600, `--fs-h4`, `--ink`.
- Kicker (section): sans 600, `--fs-meta`, `--brand-link`, uppercase.
- Meta: sans 400, `--fs-meta`, `--ink-muted`.
- Image: 16:9 default, 4:5 for "opinion" cards, 1:1 for multimedia.
- No shadow, no rounded image corners — a 1 px `--rule` separates cards on desktop; on mobile cards stack with `--sp-5` gap.

### 8.3 Masthead

- Sticky at ≥768 px; compact 56 px height once scrolled.
- Tier 1 (top strip): logo, search, weather pill, newsletter CTA, account.
- Tier 2: top-level nav (ΛΕΣΒΟΣ · ΚΟΙΝΩΝΙΑ · ΟΙΚΟΝΟΜΙΑ · ΑΘΛΗΤΙΣΜΟΣ · ΠΟΛΙΤΙΣΜΟΣ · ΑΠΟΨΕΙΣ) plus overflow menu for secondary sections.
- Mobile: tier 1 only; tier 2 collapses into a panel menu.

### 8.4 Live indicator

- 8 px pill dot, `--live` on `--paper`, with a "ΖΩΝΤΑΝΑ" label in sans 600 uppercase.
- Slow pulse (1.6 s, `--ease-standard`), suppressed under reduced motion.
- Always accompanied by a visible text label — colour never carries the meaning alone.

### 8.5 Newsletter inline module

- Full-bleed horizontal band on `--brand-tint`.
- Serif H3 invitation, sans standfirst, email input + subscribe button.
- Appears once per article page (below content, before comments), and once on the homepage (mid-page).
- Success state uses `--success` and announces via `aria-live="polite"`.

### 8.6 Ad slot

Reserved geometry. Three slot sizes in the initial inventory, each with a minimum height reserved per breakpoint so a missing creative never causes layout shift.

| Slot | Mobile | Tablet | Desktop |
|---|---|---|---|
| Masthead leaderboard | 100 px | 100 px | 250 px |
| Sidebar MPU | — | — | 600 px |
| In-article MPU | 280 px | 280 px | 280 px |

Every slot carries a persistent "Διαφήμιση" label in sans 600, `--fs-micro`, above the creative.

### 8.7 Button

Three variants: primary (solid navy), secondary (outline navy), quiet (text-only brand-link). Minimum 44 × 44 px target. Focus ring is a 2 px `--brand-link` outline with 2 px offset.

### 8.8 Form input

Single line, `--r-xs`, `--rule-strong` border, 44 px minimum height. Label always visible above input (never a stand-alone placeholder). Error messages live below the field, in `--live` with a leading icon.

---

## 9. Accessibility checklist (for Phase 3 prototype)

- [ ] Every text/background pair passes AA; AAA on body copy.
- [ ] Visible focus ring on every interactive element.
- [ ] Skip-link to `<main>` as the first focusable element.
- [ ] Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`; no duplicate `role="main"`.
- [ ] Heading order without skips; one `<h1>` per page.
- [ ] `html lang="el"` set; quoted foreign material has its own `lang`.
- [ ] Every image has editorial alt text; decorative images `alt=""`.
- [ ] 44 × 44 minimum touch target.
- [ ] Live region on the live-blog update stream.
- [ ] `prefers-reduced-motion` respected.
- [ ] Dark mode validated independently.

---

## 10. Decision log — Phase 2, iteration 1

| Decision | Status | Note |
|---|---|---|
| Red accent for live / breaking only | **Confirmed** | Used for live feeds, breaking alerts, "happening now" signalling. Always paired with icon + label. |
| Hero scale | **Leaning smaller** | Reduce `--fs-display` to around 44 px desktop / 38 px mobile. |
| Hero must support video as well as static | **Added requirement** | Homepage hero is a module that can host a muted, looping, lazily-loaded video clip or a static image. Respects `prefers-reduced-motion` (still frame fallback). Gives the homepage a "living organism" feel without compromising performance or accessibility. |
| Standfirst breathing room from H1 | **Deferred to Phase 3** | Ilia flagged that the standfirst currently sits too close to the title. Phase 3 will add a typographic pause — likely a short horizontal rule (48 px `--brand-tint-2`, 2 px high) with `--sp-5` above and below, plus a slight weight/italic adjustment. |
| Font pairing | **Open — comparison ready** | Four candidates staged side-by-side in `stonisi-font-comparison.html`: A (Source Serif 4 + Source Sans 3), B (Literata + Commissioner), C (GFS Didot + Source Serif 4 + Source Sans 3), D (Lora + Inter). Awaiting Ilia's selection. |

## 11. What Phase 3 inherits

Phase 3 produces the clickable, mobile-first HTML/CSS prototype. It will:

- Use the selected font pairing (A, B, C, or D) from the comparison page.
- Apply the smaller hero scale with a video-capable hero module (muted, autoplay, loop; reduced-motion fallback).
- Fix the H1 → standfirst relationship with a typographic pause rule.
- Implement the homepage (masthead, hero, category strips, newsletter module, sidebar MPU, in-article MPU demo, footer) and an article page (full typography stack, related-articles rail, in-article MPU, newsletter placement).
- Pass automated a11y scans (axe-core) against the five core templates with zero Level A violations.
- Be delivered as static HTML/CSS ready to be ported into a PayloadCMS front-end on Azure.
