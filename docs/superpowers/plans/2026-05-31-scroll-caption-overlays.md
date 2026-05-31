# Scroll Caption Overlays Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four branded phrases that soft-fade in and out over the hero frame-sequence canvas as the user scrolls, anchored bottom-left.

**Architecture:** Pure DOM + inline opacity. HTML adds four `.scroll-caption` elements inside `#hero-canvas-wrapper`. CSS positions them stacked at bottom-left. The existing `onUpdate` callback in `setupHeroScroll()` (public/main.js) maps scroll progress to per-caption opacity using a simple linear fade formula — no GSAP needed, no new scroll listeners.

**Tech Stack:** Vanilla HTML/CSS/JS, GSAP ScrollTrigger (existing, no new dependency)

---

### Task 1: Add caption HTML to index.html

**Files:**
- Modify: `index.html:85` (insert before the `<!-- Frame Progress -->` comment)

- [ ] **Step 1: Insert the `#scroll-captions` block**

Open `index.html`. Find line 85 — the `<!-- Frame Progress -->` comment. Insert the following block immediately before it (keep the blank line between it and `.frame-counter`):

```html
      <!-- Scroll Caption Overlays -->
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

- [ ] **Step 2: Verify structure**

The block order inside `#hero-canvas-wrapper` should now be:
1. `<canvas id="hero-canvas">`
2. `.hero-content` (the original title/eyebrow)
3. `#scroll-captions` ← new
4. `.frame-counter` (the progress bar)

---

### Task 2: Add caption CSS to style.css

**Files:**
- Modify: `style.css` — append after the `.frame-counter` block (ends around line 525)

- [ ] **Step 1: Append the caption rules**

Find the end of the `.frame-counter` block in `style.css` (look for `.frame-count-label`, `.frame-bar-track`, `.frame-bar-fill` — these are the last rules in that group). Append the following after them:

```css
/* ─── Scroll caption overlays ─────────────────────────────── */
#scroll-captions {
  position: absolute;
  bottom: 88px;
  left: clamp(24px, 6vw, 100px);
  z-index: 10;
  pointer-events: none;
}

.scroll-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.caption-eyebrow {
  font-family: var(--font-label);
  font-size: 8px;
  font-weight: 400;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
}

.caption-phrase {
  font-family: var(--font-display);
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 300;
  color: var(--ivory);
  line-height: 1.25;
  margin: 0;
}
```

- [ ] **Step 2: Visual check — captions invisible at page load**

Open `index.html` in the browser (`npm run dev`). Scroll to the hero section before scrolling. The caption area should be invisible (opacity 0). The progress bar should still be visible in the bottom-right corner — the captions sit bottom-left and should not overlap it.

---

### Task 3: Add caption opacity logic to public/main.js

**Files:**
- Modify: `public/main.js:172` — inside `setupHeroScroll()`

- [ ] **Step 1: Query caption elements and define scroll windows**

In `setupHeroScroll()`, find these lines (around line 176–178):

```js
  const frameBarFill = document.getElementById('frame-bar-fill');
  const heroContent = document.getElementById('hero-content');
```

Add three lines immediately after them:

```js
  const captionEls = document.querySelectorAll('.scroll-caption');
  const CAPTIONS = [
    { from: 0.22, to: 0.36 },
    { from: 0.40, to: 0.54 },
    { from: 0.58, to: 0.72 },
    { from: 0.76, to: 0.87 },
  ];
  const FADE = 0.04;
```

- [ ] **Step 2: Add opacity logic inside `onUpdate`**

Inside the `onUpdate` callback, find the last block before the closing `}` of the handler — the particle trigger lines (around line 215–222):

```js
      // Trigger particle transition near end
      if (progress > 0.88 && !state.particlesActive) {
        state.particlesActive = true;
        triggerParticleTransition();
      } else if (progress < 0.85 && state.particlesActive) {
        state.particlesActive = false;
        cancelParticleTransition();
      }
```

Append the following block immediately after those lines, before the closing `}` of `onUpdate`:

```js
      // Scroll caption overlays
      captionEls.forEach((el, i) => {
        const { from, to } = CAPTIONS[i];
        let opacity = 0;
        if (progress >= from && progress <= to) {
          if (progress < from + FADE)     opacity = (progress - from) / FADE;
          else if (progress > to - FADE)  opacity = (to - progress) / FADE;
          else                            opacity = 1;
        }
        el.style.opacity = opacity;
      });
```

- [ ] **Step 3: Verify the scroll behaviour**

Run `npm run dev`. Open the site. Scroll slowly through the hero section and confirm:

- Between 0–22% scroll: no captions visible (original hero title still fading out)
- At ~22–36% scroll: caption 1 ("38 years of crafting legacy") fades in, holds, fades out
- At ~40–54% scroll: caption 2 ("Every diamond, set by hand") fades in, holds, fades out
- At ~58–72% scroll: caption 3 ("Six collections. One lifetime.") fades in, holds, fades out
- At ~76–87% scroll: caption 4 ("Worn on the day that changes everything") fades in, holds, fades out
- After 88% scroll: particle transition fires, no captions visible

Only one caption should be visible at any time. Each should be bottom-left, clear of the progress bar (bottom-right).

---

### Task 4: Commit and push

- [ ] **Step 1: Stage and commit**

```bash
git add index.html style.css public/main.js
git commit -m "feat: add scroll-synced caption overlays to hero section"
```

- [ ] **Step 2: Push**

```bash
git push origin main
```

Vercel will auto-deploy on push.
