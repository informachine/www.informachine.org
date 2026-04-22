# stonisi.gr — Design critique

**Scope:** Phase 3 prototype after iteration 2 — `index.html`, `article.html`, `category.html`.
**Stage:** Late refinement. Close to handoff but with room for one more pass.
**Reviewer:** Independent critical read against the established principles in `stonisi-design-tokens.md`.

---

## Overall impression

The prototype has a confident editorial voice. The navy-and-white palette reads as "serious newspaper" without becoming corporate, and the single red accent earns its place by staying restricted to live/breaking. The new ΠΛΑΤΕΙΑ ribbon is the standout moment — a real design decision rather than a safe one, and the palette shift works.

The biggest opportunity: **density.** The homepage currently does a lot of things between the hero and the main content grid — editor's picks, latest news, a leaderboard ad, and the featured block — before the reader has oriented themselves. A tighter edit of that sequence would feel more Kathimerini-like and less all-things-at-once.

---

## Usability

| Finding | Severity | Recommendation |
|---|---|---|
| The hero controls present seven interactive elements for three slides (prev, next, pause, three dots, count). That is more control surface than the content warrants — and on mobile it risks wrapping. | 🟡 Moderate | Reduce to three controls on mobile — pause + dots. Keep prev/next on desktop only. The count can stay as a text element, no longer interactive. |
| The Live pill and Radio pill in the masthead are visually near-identical (both are dot-led pills on navy) and sit adjacent. A reader could conflate them. | 🟡 Moderate | Differentiate. Options: replace the radio-pill dot with a broadcast-wave icon; swap the border colour to gold; or merge the two into a single "In-air / Live" control that expands on click. |
| Editor's picks, Latest news, and the Featured grid all appear stacked vertically above the fold on desktop. This is three section-shaped things in a row without differentiation in rhythm. | 🟡 Moderate | Either: a) reorder to Hero → Featured → Latest → Editor picks (so the editor's judgement is a follow-on to the day's news), or b) convert Editor's picks to a horizontal-scroll "stripe" on mobile and a compact row on desktop to distinguish it visually. |
| ΠΛΑΤΕΙΑ lands between ΚΟΙΝΩΝΙΑ/ΟΙΚΟΝΟΜΙΑ and ΑΠΟΨΕΙΣ — a middle position that is functional but undersells it. A print-quality quarterly deserves a more prominent moment. | 🟡 Moderate | Place ΠΛΑΤΕΙΑ as the *last* full-bleed section before the footer, as an "end-note" for readers who've finished the day's news. Or promote it to directly-below-the-fold on issue-release weeks (CMS flag). |
| On the article page, the TTS button sits in the meta row alongside date, reading-time, and share — it reads as one of many small affordances rather than the meaningful one it is. | 🟢 Minor | Consider promoting TTS to its own inline block above the lead image, with a short label: "Ακούστε αυτό το άρθρο · 5 λεπτά". Reserved for desktop; stays small on mobile. |
| The "Latest" section uses an olive-branch-style left border on each card, which reads as slightly old-blog at the current size. | 🟢 Minor | Try a denser single-column list with only a timestamp as the leading eyebrow — no card chrome. More wire-service, less card grid. |

---

## Visual hierarchy

**What draws the eye first on the homepage.** The hero headline, correctly. Secondary is the red breaking ticker — appropriate because it's time-sensitive and deliberately contrasts with everything else. Tertiary is the first row of editor-pick card titles, which is fine.

**Reading flow.** On desktop, the flow is top-down and clear. On mobile, the flow holds as long as the hero slider does not wrap its controls — this is the dial to watch.

**Emphasis.** Section heads use a 2 px underline with a serif title — strong and consistent. The newsletter module, ΠΛΑΤΕΙΑ ribbon, and hero each have distinct treatments, so the page has rhythm rather than feeling like one long grid. Good.

**Where hierarchy slips.** The featured headline on the homepage is rendered at `var(--fs-h2)` via inline style. It's a one-off override outside the design system — the right direction (a featured card *should* be bigger) but the wrong way to reach it.

---

## Consistency

| Element | Issue | Recommendation |
|---|---|---|
| Featured card styling | Inline styles override `--fs-h4` to reach `--fs-h2` | Introduce `.card--featured` variant with its own type scale. Document in tokens as a proper component. |
| "See all" link | Some instances use the `.see-all` class; others repeat the same rules inline. | Hoist all "see all" links to use the class. Remove the inline duplicates. |
| Section padding scales | Sections use `clamp(32px, 4.5vw, 48px)`; the editor-picks and latest use the same clamp but the newsletter band still uses a static `padding`. | Align all full-bleed sections to one clamp. Add `.band` utility. |
| Card hover | `.card` uses a padding-and-negative-margin trick to get a hover background. It works, but at tight grid gaps it could cause sibling-edge clipping. | Test at 2-column mobile layouts; if any bleed appears, switch to `::before` pseudo-element fill instead. |
| Opinion card avatars vs pick-card absence of avatars | Opinion cards show initials avatars; pick-cards don't, but pick-cards *also* show a named byline in metadata. Slight asymmetry. | Either give pick-cards a tiny author avatar strip (consistent), or drop avatars from opinion cards (also consistent). Choose one and apply everywhere. |

---

## Accessibility (summary — full detail in the a11y audit)

- **Contrast.** All critical text/background pairs pass AA, most pass AAA. After iteration 2, the ad label contrast was raised from 2.6:1 (with opacity) to 4.8:1.
- **Touch targets.** All interactive elements are ≥ 44 × 44 CSS px. Verified on the masthead, hero controls, pagination, and the TTS button.
- **Text readability.** Body copy at 17 / 18 px, line-height 1.6–1.7, measure capped at 62 characters. Appropriate for Greek.
- **Focus.** Visible ring on every interactive element; mobile menu now traps focus via `dialog.showModal()`.

---

## What works well

- The typographic hierarchy is the prototype's strongest asset. Source Serif 4 at every scale feels native to Greek and carries the reading load with confidence.
- The restrained single-accent red for live/breaking is both on-brand and WCAG-correct (never carries meaning alone).
- The ΠΛΑΤΕΙΑ palette-shift is genuinely memorable — a moment of design that readers will remember, which is unusual for a regional news site.
- The category template shows real restraint: a clear hero, a scrollable topic filter, a strong featured block, then a dense but readable grid. This will scale to every category without redesign.
- The newsletter module is calm, legible, and doesn't try to be clever — appropriate for an editorial product where the subscription is a soft ask.
- The reading-focus mode is tasteful: subtle, reversible, respects reduced-motion.
- The performance architecture is named and budgeted before a single line of production code is written. This discipline tends to hold.

---

## Priority recommendations

1. **Simplify the hero controls.** Seven interactive elements for three slides is one or two too many. On mobile in particular, the row risks wrapping. Aim for three controls: a pause/play toggle, three dots, and keyboard left/right. Drop the arrows on ≤ 640 px.
2. **Differentiate Live and Radio pills.** They are currently visual twins in a prime location. Give the radio pill a distinct iconography (broadcast wave or 99 FM monogram) so readers never confuse "live news coverage" with "live radio stream".
3. **Reorder the above-the-fold stack.** Hero → Featured → Latest → Editor's picks. Keep ΠΛΑΤΕΙΑ prominent, ideally as the terminal full-bleed section before the footer or immediately below the fold during issue-launch weeks.
4. **Promote the featured card to a proper variant.** Remove inline styles; introduce `.card--featured` with its own scale. A small change that pays back every time a designer or dev touches it.
5. **Promote the TTS button on the article page.** Today it is one of five meta affordances. Given the investment in monotonic-Greek reading, it deserves a dedicated inline placement that matches the editorial ambition.
6. **Test the mobile breakpoint densities on a real device.** The clamps are right on paper but card hover padding, sub-nav scroll, and hero control wrap are the three places where paper and device diverge.

---

## Out of scope for this critique

- Real imagery (the prototype uses gradient stand-ins; actual photography will change perceived density and hierarchy).
- Content fidelity of Greek copy (it is sample text modelled on real regional newspaper structure; not editorial-reviewed).
- Final logo application (the wordmark is styled text; the actual logo artwork swap will happen at build time).

---

## Verdict

The prototype is ready to move toward handoff with one more iteration to address the priority-1 and priority-2 items. The underlying system is coherent, the typography is excellent, and the distinctive moments (ΠΛΑΤΕΙΑ, live accent, newsletter, category template) earn their weight. The density of the above-the-fold sequence is the main remaining design decision.
