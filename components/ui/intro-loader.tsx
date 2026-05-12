"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Config ──────────────────────────────────────────
   Ported from GridPixelateWipe (Remotion) → time-based.
   Cells start opaque (black) and fade out centre→edges,
   uncovering the app that renders underneath.
──────────────────────────────────────────────────────── */
const COLS          = 24;
const ROWS          = 14;
const LOAD_MS       = 2500;   // fake-load duration (ms)
const DONE_PAUSE_MS = 600;    // pause on "finalizado" before reveal
const REVEAL_SPREAD = 1.4;    // seconds: centre → edge total spread
const CELL_FADE     = 0.4;    // seconds: each cell's own fade duration

// Total ms until the loader unmounts — use as animation delay elsewhere
export const INTRO_DONE_MS =
  LOAD_MS + DONE_PAUSE_MS + (REVEAL_SPREAD + CELL_FADE) * 1000 + 250;

/* ─── Wave delay map ─────────────────────────────────
   Mirrors GridPixelateWipe pattern="wave":
     delay = hypot(x - cx, y - cy), normalised 0→1
   Centre cells = 0 (first to go), edges = 1 (last).
──────────────────────────────────────────────────────── */
function buildWaveDelays(cols: number, rows: number): number[] {
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  let max = 0;
  // Normalise each axis by half the grid dimension so the distance
  // is measured in "screen fractions" — the resulting shape is always
  // an ellipse that fits the viewport proportions (oval on portrait mobile,
  // wider ellipse on landscape desktop) instead of a diamond.
  const raw = Array.from({ length: rows * cols }, (_, i) => {
    const normX = ((i % cols) - cx) / (cols / 2);
    const normY = (Math.floor(i / cols) - cy) / (rows / 2);
    const v = Math.hypot(normX, normY);
    if (v > max) max = v;
    return v;
  });
  return raw.map(v => v / max);
}

type Phase = "loading" | "done" | "revealing" | "gone";

export function IntroLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState<Phase>("loading");
  const rafRef                  = useRef<number>(0);
  const delays                  = useMemo(() => buildWaveDelays(COLS, ROWS), []);

  /* ── Progress ticker ─────────────────────────────── */
  useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / LOAD_MS, 1);
      setProgress(t);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        setTimeout(() => {
          setPhase("revealing");
          // wait for last cell to finish fading, then unmount
          setTimeout(
            () => setPhase("gone"),
            (REVEAL_SPREAD + CELL_FADE) * 1000 + 250,
          );
        }, DONE_PAUSE_MS);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (phase === "gone") return null;

  const isRevealing = phase === "revealing";

  return (
    <div className="fixed inset-0 z-[9999]">

      {/* ── Pixel grid ──────────────────────────────────
          Each cell is a solid #050505 square.
          On reveal, cells CSS-transition to opacity:0
          with staggered delays (centre first, edges last).
          The app renders underneath and shows through.
      ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
        }}
      >
        {delays.map((delay, i) => (
          <div
            key={i}
            style={{
              background: "#050505",
              opacity: isRevealing ? 0 : 1,
              transition: isRevealing
                ? `opacity ${CELL_FADE}s ease-out ${(delay * REVEAL_SPREAD).toFixed(3)}s`
                : "none",
            }}
          />
        ))}
      </div>

      {/* ── Loading UI (sits above pixel grid) ──────── */}
      <AnimatePresence>
        {!isRevealing && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.28 } }}
          >
            {/* Status text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
                initial={{ opacity: 0, y: 7,  filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                exit={{    opacity: 0, y: -7, filter: "blur(5px)" }}
                transition={{ duration: 0.26, ease: "easeOut" }}
              >
                {phase === "done" ? "finalizado" : "carregando"}
              </motion.p>
            </AnimatePresence>

            {/* Progress bar */}
            <div
              style={{
                width: 160,
                height: 1,
                background: "rgba(255,255,255,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "0 auto 0 0",
                  width: `${(progress * 100).toFixed(2)}%`,
                  background: "rgba(255,255,255,0.78)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.5), 0 0 20px rgba(99,102,241,0.4)",
                  transition: "width 0.1s linear",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
