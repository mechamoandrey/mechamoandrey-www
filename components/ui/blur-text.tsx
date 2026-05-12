"use client";

/**
 * BlurText
 * - Entrance: blur + fade + y slide (fires when trigger turns true or element enters viewport)
 * - Hover: wave-lift — words rise left→right on enter, settle right→left on leave (no blur replay)
 */

import { motion, TargetAndTransition } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

type EasingFn = (t: number) => number;
type AnimSnapshot = TargetAndTransition & { filter?: string };

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimSnapshot;
  animationTo?: AnimSnapshot[];
  easing?: EasingFn;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  /** When provided, overrides IntersectionObserver (use inside GSAP-pinned panels) */
  trigger?: boolean;
  /** px each word rises on hover wave. Default 5 */
  hoverLift?: number;
  as?: React.ElementType;
}

function buildKeyframes(
  from: AnimSnapshot,
  steps: AnimSnapshot[],
): TargetAndTransition {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kf: Record<string, any[]> = {};
  keys.forEach((k) => {
    kf[k] = [
      (from as Record<string, unknown>)[k],
      ...steps.map((s) => (s as Record<string, unknown>)[k]),
    ];
  });
  return kf as TargetAndTransition;
}

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  trigger,
  hoverLift = 5,
  as: Tag = "p",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  const [inView, setInView]           = useState(false);
  const [replayKey, setReplayKey]     = useState(0);
  const [entranceDone, setEntranceDone] = useState(false);
  const [isHovered, setIsHovered]     = useState(false);
  const ref = useRef<HTMLElement>(null);

  // ── External trigger ───────────────────────────────────────────────────
  useEffect(() => {
    if (trigger === undefined) return;
    if (trigger && !inView) {
      setInView(true);
      setEntranceDone(false);
      setReplayKey((k) => k + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // ── IntersectionObserver fallback ──────────────────────────────────────
  useEffect(() => {
    if (trigger !== undefined) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, trigger]);

  // ── Animation config ───────────────────────────────────────────────────
  const defaultFrom = useMemo(
    (): AnimSnapshot =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    (): AnimSnapshot[] => [
      { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots  = animationTo   ?? defaultTo;
  const stepCount     = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times         = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  const n = elements.length;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      className={className}
      style={{ display: "flex", flexWrap: "wrap" }}
      onMouseEnter={() => { if (entranceDone) setIsHovered(true);  }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {elements.map((segment, index) => {
        /* ── What to animate ── */
        const animate: TargetAndTransition = !inView
          ? fromSnapshot
          : !entranceDone
            ? buildKeyframes(fromSnapshot, toSnapshots)
            : { filter: "blur(0px)", opacity: 1, y: isHovered ? -hoverLift : 0 };

        /* ── How to transition ── */
        const transition = entranceDone
          ? {
              type: "spring" as const,
              stiffness: 320,
              damping: 22,
              // wave left→right on enter, right→left on leave
              delay: isHovered ? index * 0.045 : (n - 1 - index) * 0.035,
            }
          : {
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: easing,
            };

        return (
          <motion.span
            key={`${replayKey}-${index}`}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={fromSnapshot}
            animate={animate}
            transition={transition}
            onAnimationComplete={
              index === n - 1
                ? () => {
                    setEntranceDone(true);
                    onAnimationComplete?.();
                  }
                : undefined
            }
          >
            {segment === " " ? " " : segment}
            {animateBy === "words" && index < n - 1 && " "}
          </motion.span>
        );
      })}
    </Tag>
  );
}
