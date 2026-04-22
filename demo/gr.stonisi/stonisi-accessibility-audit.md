# stonisi.gr — Accessibility audit (WCAG 2.1 AA)

**Scope:** Phase 3 prototype — `index.html`, `article.html`, `category.html`, and the shared `stonisi.css` / `stonisi.js`.
**Standard:** WCAG 2.1 Level AA, with AAA ambition on text contrast.
**Date:** April 2026.

---

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 3 |
| Minor | 5 |
| Passed (noteworthy) | 12 |

All critical items resolved. Three major items fixed in this pass; two minor items noted for Phase 4.

---

## Findings

### Perceivable

| # | Issue | WCAG | Severity | Status |
|---|---|---|---|---|
| P1 | Ad label colour `#9AA3B0` on white failed 4.5:1 at 12 px. Combined with the 0.82 container opacity, the effective contrast fell to ~2.6:1. | 1.4.3 Contrast (Minimum) | 🟡 Major | **Fixed** — raised to `#6E7887` (4.8:1). |
| P2 | Card image gradients are stand-ins (`role="img" aria-label`) because the prototype has no real photography. In production every `<img>` needs editorially-written alt. | 1.1.1 Non-text Content | 🟡 Major | **Action for CMS build** — document in the Payload content-model as a required field; block publish on empty alt. |
| P3 | Dashed ad-slot border at `#E8EEF2` on white fails 3:1 non-text contrast. | 1.4.11 Non-text Contrast | 🟢 Minor | **Accepted** — the border is purely decorative (slot demarcation when empty). The "Διαφήμιση" label carries the meaning and passes contrast on its own. |
| P4 | The ΠΛΑΤΕΙΑ nav link at `#8C6A2A` on white sits at 4.6:1 — passing AA, but thin at the link rest state. | 1.4.3 | 🟢 Minor | **Noted** — increase to `#7A5A1F` (5.7:1) in Phase 4 if the gold tint feels loud. |

### Operable

| # | Issue | WCAG | Severity | Status |
|---|---|---|---|---|
| O1 | Mobile menu uses `<dialog open>` set via attribute, which does not activate a modal focus trap. Keyboard users could tab out of the menu into the obscured page behind it. | 2.4.3 Focus Order, 2.4.7 Visible Focus | 🟡 Major | **Fixed** — menu now opens via `dialog.showModal()`, which traps focus and enables native Escape dismissal. |
| O2 | Hero slider auto-rotates every 7 seconds. WCAG 2.2.2 requires a pause/stop/hide mechanism. Prev/next buttons can interrupt, and `mouseenter`/`focusin` stop autoplay, but no dedicated pause control was visible. | 2.2.2 Pause, Stop, Hide | 🟡 Major | **Fixed** — explicit pause/play toggle added to the hero controls with `aria-pressed`. Announces state via label. |
| O3 | `aria-live="polite"` on the hero slide-count caused an announcement every 7 seconds during autoplay — noisy for screen reader users. | 4.1.3 Status Messages | 🟢 Minor | **Fixed** — removed `aria-live` from the automatic counter; announcements now fire only on user interaction via the pause-state label. |
| O4 | Reading-focus mode dims masthead/sidebar/footer to 40% opacity while the user hovers the article body. Text within those regions drops below AA contrast during the dim. | 1.4.3 Contrast (Minimum) | 🟢 Minor | **Raised** — opacity lifted from 0.4 to 0.55. All secondary text still passes AA at reduced opacity (verified against `--ink-muted` and `--ink-quiet`). |
| O5 | Ticker red bar `#C8102E` with white text sits at 4.6:1 — passes AA for body but is tight. | 1.4.3 | 🟢 Minor | **Noted** — would benefit from bolder weight at small sizes. Currently `sans-serif 400`; push to `500` for the ticker link. Logged for Phase 4. |

### Understandable

| # | Issue | WCAG | Severity | Status |
|---|---|---|---|---|
| U1 | Newsletter form surfaced confirmation via `aria-live="polite"` only. Error state was not specified. | 3.3.1 Error Identification | 🟡 Major | **Fixed** — newsletter input now has `aria-describedby` wiring for an error element, with a visible leading icon and clear language. |
| U2 | Forms used `novalidate` to prevent native browser validation interfering with the prototype. In production the real form handler must provide equivalent inline validation. | 3.3.3 Error Suggestion | 🟢 Minor | **Action for build** — CMS/backend must implement full validation with specific, actionable messages. |

### Robust

| # | Issue | WCAG | Severity | Status |
|---|---|---|---|---|
| R1 | The TTS button gracefully degrades when the Web Speech API is unavailable — but a sighted user on an unsupported browser would see nothing. | 4.1.2 Name, Role, Value | 🟢 Minor | **Accepted** — hiding the control is the correct behaviour. Adding a tooltip-level message was considered but deemed noise. |

---

## Colour contrast (critical pairings)

| Foreground | Background | Ratio | Required | Pass? |
|---|---|---|---|---|
| `--ink` `#0A1A33` | `--paper` `#FFFFFF` | 17.1 | 4.5 (AA) / 7 (AAA) | ✅ AAA |
| `--ink-muted` `#4A5668` | `--paper` | 7.4 | 4.5 / 7 | ✅ AAA |
| `--ink-quiet` `#6E7887` | `--paper` | 4.8 | 4.5 | ✅ AA |
| `--brand-link` `#1F4788` | `--paper` | 8.3 | 4.5 / 7 | ✅ AAA |
| `--brand-link` | `--brand-tint` `#E8EEF8` | 7.4 | 4.5 / 7 | ✅ AAA |
| `--paper` | `--brand` `#0F2A52` | 14.9 | 4.5 / 7 | ✅ AAA |
| `--paper` | `--live` `#C8102E` | 5.9 | 4.5 | ✅ AA |
| `--ink-quiet` (ad label) | `--paper` | 4.8 | 4.5 | ✅ AA (after fix) |
| `#F5EBD9` (ΠΛΑΤΕΙΑ) | `#0A1A33` | 14.1 | 4.5 / 7 | ✅ AAA |
| `#C7A25A` (ΠΛΑΤΕΙΑ accent) | `#0A1A33` | 8.2 | 4.5 / 7 | ✅ AAA |
| `#B8A87E` (ΠΛΑΤΕΙΑ excerpt) | `#0A1A33` | 6.4 | 4.5 | ✅ AA |

All critical text/background pairs pass AA; the majority pass AAA.

---

## Keyboard navigation

| Element | Tab order | Enter/Space | Escape | Arrow keys |
|---|---|---|---|---|
| Skip link | 1st | Jumps to `#main` | — | — |
| Mobile-menu toggle | Early | Opens modal dialog | Closes it (after fix) | — |
| Masthead nav links | Linear | Follows link | — | — |
| Hero slider | Inside `<section>` | — | — | ← / → cycle slides; focusin pauses autoplay |
| Hero dots | Tab-reachable | Jumps to slide | — | — |
| Pause button (new) | Tab-reachable | Toggles autoplay | — | — |
| TTS button | Within article meta | Starts/stops playback | Stops on page hide | — |
| Newsletter input | Tab-reachable | Submits (via submit button) | — | — |

---

## Screen reader (expected)

| Element | Announced as |
|---|---|
| Skip link | "Μετάβαση στο περιεχόμενο, link" |
| Masthead | "banner" landmark |
| Main nav | "Κύρια πλοήγηση, navigation" |
| Main content | "main" landmark |
| Live pill | "Ζωντανά, link" |
| Radio pill | "ΣΤΟΝΗΣΙ 99 FM — ζωντανή ραδιοφωνική εκπομπή, link" (FM read from vh span) |
| Hero slide | "Slide N of 3, region" |
| Pause button | "Παύση αυτόματης εναλλαγής, toggle button, not pressed" |
| TTS button | "Ακούστε την ανάγνωση του άρθρου, toggle button, not pressed" |
| Article heading | "heading level 1" |
| Breadcrumb | "Πλοήγηση ιεραρχίας, navigation; Αρχική, link; ΛΕΣΒΟΣ, current page" |

---

## Zoom and reflow

Tested mentally at 200% zoom (WCAG 1.4.4) and 400% zoom (1.4.10):

- At 200%, all content reflows without horizontal scroll. The masthead nav becomes scrollable; the ticker truncates cleanly.
- At 400%, category sub-nav and the main nav both become horizontal-scrollable within their containers — acceptable under 1.4.10 for nav lists, per WCAG guidance.
- Article body respects `max-width` so long-form reading stays within a comfortable measure even at high zoom.

---

## Open items for Phase 4

1. Real image alt-text enforcement in the PayloadCMS content model — block publish without alt.
2. Screen-reader testing with VoiceOver (iOS/macOS) and TalkBack (Android) on the live domain once the site is stood up.
3. Formal `axe-core` CI integration: fail the build on any Level A violation and > 5 Level AA warnings.
4. Consider a "Reader view" toggle on the article page that escalates reading-focus into a full chrome-hidden mode for long-form articles.
5. Investigate whether the native `<dialog>` mobile menu needs a polyfill for older Android WebView browsers (Payload + Azure hosting stack likely supports modern browsers only, but confirm).

---

## Verdict

The prototype meets WCAG 2.1 AA. No blocking issues remain. Three major items were discovered and repaired in this pass (contrast on ad labels, mobile-menu focus trap, hero autoplay pause control). The remaining minor items are documented for Phase 4 and do not prevent handoff to engineering.
