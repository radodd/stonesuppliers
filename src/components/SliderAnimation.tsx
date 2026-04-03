"use client";

/**
 * REFACTOR: Infinite Slider — Clone-and-Snap Technique
 *
 * PROBLEM WITH THE ORIGINAL CODE:
 * ─────────────────────────────────────────────────────
 * The original implementation used a flat array of 105 entries
 * (3 company names × 35 manual repeats). A setInterval incremented
 * `currentLine` state by 1 every 2 seconds, and a useEffect drove:
 *
 *   sliderRef.current.style.transform = `translateY(-${currentLine * 1.0416}%)`
 *
 * The transform accumulated further negative on every tick and was never
 * reset. `% lines.length` would eventually wrap the index back to 0, but
 * the transform had already scrolled to the bottom of the 105-item column —
 * causing a jarring snap back to the top after ~3.5 minutes.
 *
 * PROBLEM WITH THE FIRST REFACTOR ATTEMPT:
 * ─────────────────────────────────────────────────────
 * The first refactor used a React state index (0–3) with `onTransitionEnd`
 * to trigger the clone-and-snap reset. This introduced a reliability bug:
 * `transitionend` is not guaranteed to fire in all browsers when the tab is
 * throttled, the animation is interrupted, or certain GPU compositing paths
 * are taken. When it didn't fire, the interval kept incrementing `currentIndex`
 * past `items.length - 1`. The resulting `translateY(-100%)`, `-125%`, etc.
 * scrolled all items completely out of view — the ticker appeared blank.
 *
 * THE FIX — Imperative closure + setTimeout:
 * ─────────────────────────────────────────────────────
 * The animation index is now a plain closure variable inside useEffect,
 * not React state. There is no useState at all in this component.
 *
 * Items are [A, B, C, A_clone] (4 total). The sequence is:
 *
 *   index 0 (A)  → advance() → show B (25%) → wait 2s
 *   index 1 (B)  → advance() → show C (50%) → wait 2s
 *   index 2 (C)  → advance() → show A_clone (75%) → wait 2s
 *   index 3 (A_clone) → setTimeout(510ms) fires:
 *     - disable transition (transition: none)
 *     - snap to translateY(0%)  ← invisible, no transition
 *     - double-rAF re-enables transition
 *     - reset index to 0
 *   → next tick: show B (25%), smoothly animated
 *
 * The 510ms timeout (10ms buffer on the 500ms CSS transition) replaces
 * `onTransitionEnd`, making the reset unconditional and browser-independent.
 *
 * The DOM holds 4 nodes instead of 105.
 */

import { useEffect, useRef } from "react";
import styles from "../components/scss/Slider.module.scss";

const COMPANIES = ["Stoneyard", "MRC Rock & Sand", "Santa Paula Materials"];
const ITEMS = [...COMPANIES, COMPANIES[0]]; // [A, B, C, A_clone]

const Slider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let index = 0;

    const advance = () => {
      index++;
      el.style.transition = "transform 0.5s ease-in-out";
      el.style.transform = `translateY(-${(index / ITEMS.length) * 100}%)`;

      if (index === ITEMS.length - 1) {
        // We're now showing A_clone (the last item).
        // After the 500ms transition completes, snap back to real A at position 0.
        setTimeout(() => {
          el.style.transition = "none";
          el.style.transform = "translateY(0%)";
          // Double rAF: ensures the browser paints the snap before re-enabling
          // the transition, so the next advance() animates smoothly.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transition = "transform 0.5s ease-in-out";
            });
          });
          index = 0;
        }, 510);
      }
    };

    const interval = setInterval(advance, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider} ref={sliderRef}>
        {ITEMS.map((item, i) => (
          <div key={i} className={styles.line}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
