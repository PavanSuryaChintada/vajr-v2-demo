# Scroll-Synced Caption Overlays — Design Spec
_Date: 2026-05-31_

## Overview

Add four text phrases that fade in and out over the hero frame-sequence as the user scrolls. Each phrase appears at a specific scroll-progress window, holds briefly, then dissolves — making the scroll feel like an interactive narrative rather than a silent animation.

## Decisions Made

| Question | Decision |
|---|---|
| Style | Single statement — one phrase at a time |
| Position | Bottom-left, anchored above the progress bar |
| Entrance animation | Soft fade (opacity only, no movement) |
| Number of captions | 4 |

## Copy

| # | Eyebrow label | Main phrase |
|---|---|---|
| 1 | Heritage | 38 years of crafting legacy |
| 2 | Craftsmanship | Every diamond, set by hand |
| 3 | Collections | Six collections. One lifetime. |
| 4 | Legacy | Worn on the day that changes everything |

## Scroll Windows

Progress values are 0–1 across the full 500vh hero section. Each caption is defined by `from` (fade-in start) and `to` (fully gone). `FADE = 0.04`.

| Caption | from | Fade in ends | Hold until | Fade out ends (to) |
|---|---|---|---|---|
| 1 | 0.22 | 0.26 | 0.32 | 0.36 |
| 2 | 0.40 | 0.44 | 0.50 | 0.54 |
| 3 | 0.58 | 0.62 | 0.68 | 0.72 |
| 4 | 0.76 | 0.80 | 0.83 | 0.87 |

Captions begin only after the original hero content has fully faded (progress > 0.20). Gap between captions is ~4% progress (~20vh). The last caption is fully gone at 0.87 — before the particle transition triggers at 0.88.

Fade duration per caption: 0.04 progress units (~20vh each side). Hold duration: ~0.06 progress units.

## Architecture

### HTML — `index.html`

Add a `#scroll-captions` container inside `#hero-canvas-wrapper`, after the existing `.hero-content` block and before `.frame-counter`:

```html
<div id="scroll-captions" aria-live="polite">
  <div class="scroll-caption" data-caption="0">
    <p class="caption-eyebrow">Heritage</p>
    <p class="caption-phrase">38 years of<br>crafting legacy</p>
  </div>
  <div class="scroll-caption" data-caption="1">
    <p class="caption-eyebrow">Craftsmanship</p>
    <p class="caption-phrase">Every diamond,<br>set by hand</p>
  </div>
  <div class="scroll-caption" data-caption="2">
    <p class="caption-eyebrow">Collections</p>
    <p class="caption-phrase">Six collections.<br>One lifetime.</p>
  </div>
  <div class="scroll-caption" data-caption="3">
    <p class="caption-eyebrow">Legacy</p>
    <p class="caption-phrase">Worn on the day<br>that changes everything</p>
  </div>
</div>
```

### CSS — `style.css`

New rules appended to the hero section block:

- `#scroll-captions` — `position: absolute`, `bottom: 80px` (clears the progress bar), `left: clamp(24px, 6vw, 100px)`, `z-index: 10`, `pointer-events: none`
- `.scroll-caption` — `position: absolute`, `opacity: 0`, `transition: none` (opacity set directly in JS)
- `.caption-eyebrow` — Cinzel, 8px, letter-spacing 0.5em, uppercase, gold (`#C9A84C`)
- `.caption-phrase` — Cormorant Garamond, `clamp(22px, 3vw, 34px)`, weight 300, ivory (`#FAF6EF`), line-height 1.25

### JS — `public/main.js`

In `setupHeroScroll()`, after the frame index and progress bar updates, add caption opacity logic:

```js
const CAPTIONS = [
  { from: 0.22, to: 0.36 },
  { from: 0.40, to: 0.54 },
  { from: 0.58, to: 0.72 },
  { from: 0.76, to: 0.87 },
];
const FADE = 0.04;

// Inside onUpdate:
captionEls.forEach((el, i) => {
  const { from, to } = CAPTIONS[i];
  let opacity = 0;
  if (progress >= from && progress <= to) {
    if (progress < from + FADE) opacity = (progress - from) / FADE;
    else if (progress > to - FADE)  opacity = (to - progress) / FADE;
    else                             opacity = 1;
  }
  el.style.opacity = opacity;
});
```

`captionEls` is queried once before the ScrollTrigger is created: `document.querySelectorAll('.scroll-caption')`.

## What Does NOT Change

- Frame rendering logic
- Original hero content fade (progress 0→0.20)
- Progress bar
- Particle transition (progress > 0.88)
- All existing scroll behaviour

## Out of Scope

- Mobile-specific font size tuning (handled by `clamp`)
- Animating individual words or lines within a phrase (decided against — soft fade chosen)
