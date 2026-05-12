"use client";

import { useEffect, useRef, useMemo } from "react";

export interface PerspectiveMarqueeProps {
  items?: string[];
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  fadeColor?: string;
  background?: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_ITEMS = ["EM BREVE", "·", "EM BREVE", "·", "EM BREVE", "·", "EM BREVE", "·"];

/**
 * PerspectiveMarquee — adapted from the Remotion version.
 * Uses requestAnimationFrame + direct DOM mutation (zero React re-renders per frame).
 */
export function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  fontSize = 84,
  color = "#fafafa",
  fontWeight = 700,
  pixelsPerFrame = 2,
  rotateY = -28,
  rotateX = 8,
  perspective = 1200,
  fadeColor = "#050505",
  background = "transparent",
  speed = 1,
  className,
  style,
}: PerspectiveMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const rafRef   = useRef<number>(0);

  // Pre-calculate total width of one set of items
  const itemPadding      = fontSize * 0.9;
  const approxItemWidth  = useMemo(
    () => items.reduce((acc, item) => acc + item.length * fontSize * 0.6 + itemPadding, 0),
    [items, fontSize, itemPadding],
  );

  useEffect(() => {
    if (approxItemWidth === 0) return;
    let active = true;

    const tick = () => {
      if (!active || !trackRef.current) return;
      frameRef.current += speed;
      const offset = -((frameRef.current * pixelsPerFrame) % approxItemWidth);
      trackRef.current.style.transform = `translateX(${offset}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [speed, pixelsPerFrame, approxItemWidth]);

  // Render 3× items so there's always content to the right during scroll
  const rendered = [...items, ...items, ...items];

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        perspective: `${perspective}px`,
        ...style,
      }}
    >
      {/* 3-D rotation wrapper */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated translation track — updated directly via ref */}
        <div
          ref={trackRef}
          style={{ display: "flex", whiteSpace: "nowrap" }}
        >
          {rendered.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: FONT_FAMILY,
                fontSize,
                fontWeight,
                color,
                letterSpacing: "-0.03em",
                paddingRight: itemPadding,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Left / right edge fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 22%, transparent 78%, ${fadeColor} 100%)`,
        }}
      />
      {/* Top / bottom edge fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 28%, transparent 72%, ${fadeColor} 100%)`,
        }}
      />
    </div>
  );
}
