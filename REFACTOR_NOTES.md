# Refactor Notes

## SliderAnimation — Infinite Loop Fix

**File:** `src/components/SliderAnimation.tsx`
**Related CSS:** `src/components/scss/Slider.module.scss`
**Deleted:** `src/components/scss/HeroAnimation.module.scss`

---

### What Was Wrong

The hero's company-name ticker (Stoneyard / MRC Rock & Sand / Santa Paula Materials) was built on a fake infinite loop. The `lines` array contained **105 entries** — the same 3 names manually repeated 35 times in the source file. A `setInterval` incremented a counter every 2 seconds, and a `useEffect` drove the scroll:

```ts
sliderRef.current.style.transform = `translateY(-${currentLine * 1.0416}%)`;
```

The `1.0416%` magic number was `100 / 96`, not `100 / 105` — so there was also a slight accumulating drift in scroll position with each tick.

**The real problem:** the transform kept accumulating further and further negative on every tick. The counter had `% lines.length` modulo to wrap back to 0 eventually, but that only reset the *index* — not the *transform value*. When the counter wrapped, the slider would snap (no transition) back to the very top of the DOM column. After ~3.5 minutes of page load this snap would be visible to a user.

Additionally, the DOM contained **105 text nodes** for what is effectively 3 items.

---

### The Fix — Clone-and-Snap Technique

The array is now just 4 items: the 3 real entries plus a clone of the first appended at the end.

```ts
const COMPANIES = ["Stoneyard", "MRC Rock & Sand", "Santa Paula Materials"];
const items = [...COMPANIES, COMPANIES[0]]; // [A, B, C, A_clone]
```

The transform is always calculated fresh — never accumulated:

```ts
el.style.transform = `translateY(-${(currentIndex / items.length) * 100}%)`;
// 4 items → steps: 0%, 25%, 50%, 75%
// Each step = exactly one item's height scrolled
```

The loop seam is handled with a `setTimeout(510ms)` after reaching the clone:

```
index 0 (A)  →  advance() → show B (25%)  → wait 2s
index 1 (B)  →  advance() → show C (50%)  → wait 2s
index 2 (C)  →  advance() → show A_clone (75%) → wait 2s
index 3 (A_clone) → setTimeout(510ms) fires:
    disable transition (transition: none)
    snap to translateY(0%)  ← invisible, no transition
    double-rAF re-enables transition
    reset index to 0
  → next tick: show B (25%), smoothly animated
```

The "double requestAnimationFrame" ensures the browser paints the snapped frame before the transition is re-enabled. Without it, Chrome/Safari can batch the snap and the next animated step into a single paint, making the scroll appear instant.

---

### Bug in the First Refactor Attempt

The first version of the clone-and-snap refactor used `onTransitionEnd` to trigger the snap-back. This introduced a reliability bug:

`transitionend` is not guaranteed to fire in all browsers when the tab is throttled, the animation is interrupted, or certain GPU compositing paths are taken. When it didn't fire, the `setInterval` kept incrementing `currentIndex` past `items.length - 1`. The resulting `translateY(-100%)`, `-125%`, etc. scrolled all 4 items completely above the visible window — the ticker appeared blank.

The fix: remove `onTransitionEnd` entirely and replace with `setTimeout(510)` — 10ms buffer over the 500ms CSS transition duration. This is unconditional and browser-independent. The animation index is now a plain closure variable inside `useEffect` instead of React state, eliminating the React render cycle from the hot path entirely.

---

### Dead Code Removed

`src/components/scss/HeroAnimation.module.scss` was deleted. It defined a 3D card-flip animation system (`.perspectiveText`, `.rotate`, `rotateX`) that was never imported anywhere in the codebase — a leftover from a prior design iteration of the hero that was replaced by the current ticker.
